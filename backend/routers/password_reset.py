from fastapi import APIRouter, HTTPException, status, BackgroundTasks, Request
from db.prisma_client import db
from models.user_models import PasswordResetRequest, PasswordResetPayload
from routers.auth.utils import hash_password
from datetime import datetime, timedelta, timezone
from jose import jwt
from dotenv import load_dotenv
import os
import hashlib
import logging
from .notifications import send_email_one_user
import yagmail


router = APIRouter()
logger = logging.getLogger(__name__)
load_dotenv()


ALGORITHM = "HS256"
SECRET_KEY = os.getenv("SECRET_KEY")

yagmail_app_password = os.getenv("YAGMAIL_APP_PASSWORD")
yagmail_email = os.getenv("YAGMAIL_EMAIL")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def token_fingerprint(token: str) -> str:
    """Return a non-reversible identifier for correlating reset-token events."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()[:12]


def render_request_id(request: Request) -> str:
    """Return Render's request ID without logging other request or user data."""
    return request.headers.get("Rndr-Id", "-")


def jwt_error_reason(exc: jwt.JWTError) -> str:
    """Classify known JWT failures without logging exception or token contents."""
    message = str(exc).lower()

    if "signature verification failed" in message:
        return "signature_mismatch"
    if "not enough segments" in message:
        return "malformed_segments"
    if any(
        marker in message
        for marker in (
            "invalid header string",
            "invalid payload string",
            "invalid crypto padding",
        )
    ):
        return "invalid_encoding"
    if isinstance(exc, jwt.JWTClaimsError):
        return "invalid_claims"
    return "jwt_error"


def send_password_reset_email(
    user_email: str,
    subject: str,
    contents: str,
    fingerprint: str,
    request_id: str,
) -> None:
    """Send a reset email and record its outcome without logging user data."""
    try:
        send_email_one_user(user_email, subject, contents)
    except Exception as exc:
        logger.error(
            "password_reset_email_failed error_type=%s fingerprint=%s request_id=%s",
            type(exc).__name__,
            fingerprint,
            request_id,
        )
        raise

    logger.info(
        "password_reset_email_sent fingerprint=%s request_id=%s",
        fingerprint,
        request_id,
    )


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(
    request: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    http_request: Request,
):

    """
    Initiates password reset process

    Generates JWT reset token
    Sends token to user email via SendGrid
    """

    # Get the user
    user = await db.users.find_unique(
        where={"email": request.email}
    )

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate the JWT with timezone-aware UTC datetime
    expiration = datetime.now(timezone.utc) + timedelta(minutes=30)

    reset_token = jwt.encode(
        {
            "sub": user.email,
            "exp": expiration
        },
        SECRET_KEY,
        ALGORITHM
    )

    fingerprint = token_fingerprint(reset_token)
    request_id = render_request_id(http_request)
    logger.info(
        "password_reset_token_issued fingerprint=%s token_length=%d "
        "expires_at=%s request_id=%s",
        fingerprint,
        len(reset_token),
        expiration.isoformat(),
        request_id,
    )
    link = f"{FRONTEND_URL}/reset-password/{reset_token}"

    subject = f'WonderHood Password Reset'
    contents = f"""
            Hello,


            To reset your password, please click the <a href="{link}">link</a>.

        """

    # Send the email
    try:
        background_tasks.add_task(
            send_password_reset_email,
            user.email,
            subject,
            contents,
            fingerprint,
            request_id,
        )

        return {
            "message": "Password reset email sent successfully"
        }

    except Exception as e:
        print("Error sending email:", e)
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(payload: PasswordResetPayload):
    print("Resetting password for token:", payload.token)
    """
    Completes Password Reset

    Decodes JWT token and validates expiration
    Hashes the new password
    Updates user password in the DB
    """

    fingerprint = token_fingerprint(payload.token)
    request_id = render_request_id(request)

    logger.info(
        "password_reset_token_received fingerprint=%s token_length=%d request_id=%s",
        fingerprint,
        len(payload.token),
        request_id,
    )

    # Decode the token
    try:
        decoded = jwt.decode(payload.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = decoded.get("sub")

        if not email:
            logger.warning(
                "password_reset_token_rejected reason=missing_subject "
                "fingerprint=%s request_id=%s",
                fingerprint,
                request_id,
            )
            raise HTTPException(
                status_code=400,
                detail="Invalid token payload"
            )

    except jwt.ExpiredSignatureError:
        logger.warning(
            "password_reset_token_rejected reason=expired fingerprint=%s request_id=%s",
            fingerprint,
            request_id,
        )
        raise HTTPException(status_code=401, detail="Reset token has expired")

    except jwt.JWTError as exc:
        logger.warning(
            "password_reset_token_rejected reason=%s error_type=%s "
            "fingerprint=%s request_id=%s",
            jwt_error_reason(exc),
            type(exc).__name__,
            fingerprint,
            request_id,
        )
        raise HTTPException(status_code=401, detail="Invalid reset token")

    # Get the user
    user = await db.users.find_unique(where={"email": email})

    if not user:
        logger.warning(
            "password_reset_token_rejected reason=user_not_found "
            "fingerprint=%s request_id=%s",
            fingerprint,
            request_id,
        )
        raise HTTPException(status_code=404, detail="User not found")

    # Hash the new password
    hashed_pw = hash_password(payload.new_password)

    # Update the password
    await db.users.update(
        where={"email": email},
        data={"password": hashed_pw}
    )

    logger.info(
        "password_reset_completed fingerprint=%s request_id=%s",
        fingerprint,
        request_id,
    )

    return {"message": "Your password has been successfully reset"}
