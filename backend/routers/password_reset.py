from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from db.prisma_client import db
from models.user_models import PasswordResetRequest, PasswordResetPayload
from routers.auth.utils import hash_password
from datetime import datetime, timedelta, timezone
from jose import jwt
from dotenv import load_dotenv
import os
from .notifications import send_email_one_user
import yagmail


router = APIRouter()
load_dotenv()


ALGORITHM = "HS256"
SECRET_KEY = os.getenv("SECRET_KEY")

yagmail_app_password = os.getenv("YAGMAIL_APP_PASSWORD")
yagmail_email = os.getenv("YAGMAIL_EMAIL")


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(
    request: PasswordResetRequest,
    background_tasks: BackgroundTasks
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

    print("THIS IS THE EMAIL:", user.email)
    print("THIS IS THE TOKEN:", reset_token)
    link = f"https://whproject.org/reset-password/{reset_token}"

    subject = f'WonderHood Password Reset'
    contents = f"""
            Hello,


            To reset your password, please click the <a href="{link}">link</a>.

            Best Regards,


            WonderHood Project Team
            info@whproject.org | whproject.org
        """

    # Send the email
    try:
        background_tasks.add_task(
            send_email_one_user,
            user.email,
            subject,
            contents
        )

        return {
            "message": "Password reset email sent successfully"
        }


        # yag = yagmail.SMTP(yagmail_email, yagmail_app_password)
        # link = f"https://whproject.org/reset-password/{reset_token}"
        # contents = (
        #     "To reset your password, please click the link below:\n\n"
        #     f"{link}"
        # )

        # yag.send(
        #     to=user.email,
        #     subject="Password reset",
        #     contents=contents,
        # )

    except Exception as e:
        print("Error sending email:", e)
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(payload: PasswordResetPayload):

    """
    Completes Password Reset

    Decodes JWT token and validates expiration
    Hashes the new password
    Updates user password in the DB
    """

    # Decode the token
    try:
        decoded = jwt.decode(payload.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = decoded.get("sub")

        if not email:
            raise HTTPException(
                status_code=400,
                detail="Invalid token payload"
            )

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Reset token has expired")

    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid reset token")

    # Get the user
    user = await db.users.find_unique(where={"email": email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Hash the new password
    hashed_pw = hash_password(payload.new_password)

    # Update the password
    await db.users.update(
        where={"email": email},
        data={"password": hashed_pw}
    )

    return {"message": "Your password has been successfully reset"}
