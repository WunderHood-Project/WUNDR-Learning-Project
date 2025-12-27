from fastapi import APIRouter, status, HTTPException, Depends, Request, Cookie
from fastapi.responses import RedirectResponse
from models.interaction_models import DonationCreate

from db.prisma_client import db
import stripe
import os

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

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

    metadata = {"donationType": donation_data.donationType}

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
            return_url="http://wonderhood-backend.onrender.com/payments/verify?session_id={CHECKOUT_SESSION_ID}", # Change localhost:8000 to backend production route for live  
            metadata=metadata
        )
        return {
            "client-secret": session.client_secret,
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to make donation: {e}")
    
@router.get("/verify")
async def verify_payment(session_id):
    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except Exception:
        return RedirectResponse(url=f"{FRONTEND_URL}/")
    
    if session.payment_status != "paid":
        return RedirectResponse(url=f"{FRONTEND_URL}/")
    
    donation = await db.donations.find_unique(
        where={"sessionId": session_id}
    )

    if not donation:
        pass

    response = RedirectResponse(url=f"{FRONTEND_URL}/tax-return")

    response.set_cookie(
        key="tax_return_allowed",
        value=session_id,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=1800
    )

    return response
    
@router.get("/latest")
async def get_latest_donation():
    """
        Return the latest donation made
    """
    latest_donation = await db.stripeevents.find_first(
        order={"createdAt": "desc"}
    )
    if not latest_donation:
        raise HTTPException(status_code=404, detail="No donations found")
    return latest_donation

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