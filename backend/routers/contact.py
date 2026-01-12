from fastapi import APIRouter, status, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional

from .notifications import send_email_one_user

router = APIRouter()

class ContactPayload(BaseModel):
    """
        Public contact form payload
    """
    name: str
    email: EmailStr
    reason: Optional[str] = None
    message: str


@router.post("", status_code=status.HTTP_204_NO_CONTENT)
async def submit_contact(payload: ContactPayload):
    """
        Handle public contact form submissions.

        Sends an email to WonderHood inbox with the data
        from the form (name, email, reason, message).
    """
    subject_reason = payload.reason or "General question"
    subject = f"[Contact Form] {subject_reason} from {payload.name}"

    body = f"""
    New contact form submission

    Name:   {payload.name}
    Email:  {payload.email}
    Reason: {payload.reason or '-'}

    Message:
    {payload.message}
    """.strip()

    try:
        recipient = "info@whproject.org"

        send_email_one_user(
            user_email=recipient,
            subject=subject,
            contents=body,
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send message. Please try again later.",
        )

    return
