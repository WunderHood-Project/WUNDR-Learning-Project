from fastapi import APIRouter, status, HTTPException, Request
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
):
    """
        Create Donation

        Any user should be able to make a donation.

    """

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

    except:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
    
        donation_data = {
            "amount": session["amount_total"]/100,
            "currency": session["currency"] ,
            "email": session.get("customer_email"),
            "session_id": session["id"]
        }

        await db.donations.create(data=donation_data)

        return {"status": "success"}