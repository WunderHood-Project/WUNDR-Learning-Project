from fastapi import APIRouter, status, HTTPException, Depends, Request
from typing import Annotated, Optional
from .auth.login import get_current_user
from models.user_models import User
from models.interaction_models import DonationCreate
from db.prisma_client import db
import stripe
import os

router = APIRouter()
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

@router.post("", status_code=status.HTTP_202_ACCEPTED)
async def create_payment(
    donation_data: DonationCreate,
    # current_user: Annotated[Optional[User], Depends(get_current_user)] = None,
):
    """
        Create Donation

        Any user should be able to make a donation.

    """

    metadata = {"donationType": donation_data.donationType}

    # Custom data to add to Stripe Event
    # if current_user:
    #     metadata["userId"] = str(current_user.id)
        # metadata['email'] = donation_data.email

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            invoice_creation={"enabled": True},
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": donation_data.donationType,
                        },
                        "unit_amount": int(donation_data.amount * 100),  # Stripe uses cents
                    },
                    "quantity": 1,
                }
            ],
            ui_mode="embedded",
            return_url="https://whproject.org",
            metadata=metadata
        )
        return {
            "client-secret": session.client_secret,
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to make donation: {e}")
    

@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        print(event["type"])

    except:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Check for existing event -> idempotent
    existing_event = await db.stripeevents.find_unique(
        where={"eventId": event["id"]}
    )

    if existing_event:
        return {"status": "duplicate_ignored"}

    # Create event
    await db.stripeevents.create(data={"eventId": event["id"]})

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        # print(session["id"])
        
        # Check for existing donation -> idempotent       
        existing_donation = await db.donations.find_unique(
            where={"sessionId": session["id"]}
        )

        user_id = session["metadata"].get("userId")

    #     # Create donation
        if existing_donation:
            return {"status": "duplicate_ignored"}
        
        try:
            donation_data = {
                "donationType": session["metadata"].get("donationType", "Donation"),
                "amount": int(session["amount_total"] / 100),
                # "email": session.get("customer_email"),
                "sessionId": session["id"]
                }
            
            if user_id:
                donation_data["user"] = {"connect": {"id": user_id}}
            
            await db.donations.create(data=donation_data)

        except Exception as e:
             print("❌ Donation creation failed:", e)

    return {"status": "success"}