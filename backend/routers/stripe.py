from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from db.prisma_client import db
from typing import Annotated
from models.user_models import User
from models.interaction_models import DonationCreate
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication
from datetime import datetime, timezone
import stripe
import os
# ? MAYBE ADD EMAIL NOTIFICATION LOGIC
# from .notifications import send_email_one_user, schedule_reminder, send_email_multiple_users

router = APIRouter()
stripe = os.environ.get("STRIPE_SECRET_KEY")

@router.post("", status_code=status.HTTP_202_ACCEPTED)
async def create_payment(
    donation_data: DonationCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    # background_tasks: BackgroundTasks
):
    """
        Create Donation

        Craete donation instance for an authenticated user
    """

    enforce_authentication(current_user, "create an event")
    enforce_admin(current_user, "create an event")

    try:
        session = await stripe.checkout.Session.create(
            mode="payment",
            invoice_creation={"enabled": True},
             line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": "One-Time Donation",
                        },
                        "unit_amount": int(donation_data.amount * 100),  # Stripe uses cents
                    },
                    "quantity": 1,
                }
            ],
            ui_mode="embedded",
            return_url="whproject.org",
        )

        data = donation_data.model_dump(exclude_unset=True)

        new_donation = await db.donations.create(
            data = {
                **data,
                "user": {"connect": {"id": current_user.id}}
                }
        )

        return {
            "stripe-payment": session,
            "donation": new_donation,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to make donation: {e}")
    


