from typing import Annotated, Optional
from fastapi import APIRouter, status, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from models.interaction_models import DonationCreate, DinnerPaymentCreate
from models.user_models import User
from routers.auth.login import get_current_user_optional
from db.prisma_client import db
import stripe
import os

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

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

    metadata = {"kind": "donation", "donationType": donation_data.donationType}

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
            return_url=f"{BACKEND_URL}/payments/verify?session_id={{CHECKOUT_SESSION_ID}}",
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

    kind = (session.metadata or {}).get("kind")

    if kind == "dinner":
        return RedirectResponse(url=f"{FRONTEND_URL}/fundraiser-dinner?success=dinner")

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

    except (stripe.error.SignatureVerificationError, ValueError) as e:
        print("❌ Invalid signature:", e)
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Check for existing event -> idempotent
    existing_event = await db.stripeevents.find_unique(
        where={"eventId": event["id"]}
    )

    if existing_event:
        return {"status": "duplicate_ignored"}

    try: 
        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]

            # Check if payment status is paid
            if session.get("payment_status") != "paid":
                return {"status": "ignored_unpaid"}

            kind = session["metadata"].get("kind")

            if kind == "dinner":
                await _handle_dinner_payment(session)
            else:
                await _handle_donation(session)

            # Create event
            await db.stripeevents.create(data={"eventId": event["id"]})
    except Exception as e:
        print("❌ Stripe webhook handling failed:", e)
        raise HTTPException(status_code=500, detail="Webhook handling failed")
    
    return {"status": "success"}


async def _handle_donation(session):
    # Check for existing donation -> idempotent
    existing_donation = await db.donations.find_unique(where={"sessionId": session["id"]})
    if existing_donation:
        return

    # Get userId from Stripe to create relation between Users and Donations
    user_id = session["metadata"].get("userId")
    donation_data = {
        "donationType": session["metadata"].get("donationType", "Donation"),
        "amount": int(session["amount_total"] / 100),
        "sessionId": session["id"],
    }
    if user_id:
        donation_data["user"] = {"connect": {"id": user_id}}

    await db.donations.create(data=donation_data)


async def _handle_dinner_payment(session):
    # Check for existing dinner payment -> idempotent
    existing_dinner_payment = await db.dinnerpayment.find_unique(
        where={"sessionId": session["id"]}
    )
    if existing_dinner_payment:
        return

    user_id = session["metadata"].get("userId")
    email = session["metadata"].get("email")

    dinner_payment_data = {
        "amount": int(session["amount_total"] / 100),
        "sessionId": session["id"],
    }

    if user_id:
        dinner_payment_data["user"] = {"connect": {"id": user_id}}
    elif email:
        dinner_payment_data["email"] = email

    await db.dinnerpayment.create(data=dinner_payment_data)

# ! DinnerPayment          =============================================================================
@router.post("/dinner", status_code=status.HTTP_202_ACCEPTED)
async def dinner_payment(
    dinner_data: DinnerPaymentCreate,
    current_user: Annotated[Optional[User], Depends(get_current_user_optional)]
):
    """
    Create a dinner payment

    Any user should be able to make a dinner payment    
    """

    metadata = {"kind": "dinner"}
    if current_user:
        metadata["userId"] = current_user.id
    elif dinner_data.email:
        metadata["email"] = dinner_data.email

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            invoice_creation={"enabled": True},
            line_items=[
                {  
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": "Fundraiser Dinner Payment"},
                        "unit_amount": 2500,
                    },
                    "quantity": 1,
                }
            ],
            ui_mode="embedded",
            return_url=f"{BACKEND_URL}/payments/verify?session_id={{CHECKOUT_SESSION_ID}}",
            metadata=metadata
        )
        return {
            "client-secret": session.client_secret,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to make dinner payment: {e}")