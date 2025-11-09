from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Annotated, Optional
from datetime import datetime, timezone

from db.prisma_client import db
from models.user_models import User
from .auth.login import get_current_user
from .auth.utils import enforce_authentication, enforce_admin

# Import Pydantic DTOs (your models live in models/interaction_models.py)
from models.interaction_models import (
    PartnerApplicationCreate,
    PartnerApplicationUpdate,
    PartnerApplicationResponse,
    PartnerStatus,
)

router = APIRouter()

# =========================== Public: Create Application ======================

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_partner_application(payload: PartnerApplicationCreate):
    """
    Public endpoint — creates a new partner application.

    No authentication required (external partners can submit the form).
    """
    try:
        created = await db.partnerapplications.create(
            data={
                # Plain text fields
                "orgName":        payload.orgName,
                "contactName":    payload.contactName,
                "email":          payload.email,
                "phone":          payload.phone or None,

                # Enums / URLs: normalize to strings if needed
                "partnerType":    payload.partnerType.value if hasattr(payload.partnerType, "value") else payload.partnerType,
                "website":        str(payload.website) if payload.website else None,

                # Optional metadata
                "city":           payload.city or None,
                "state":          payload.state or None,
                "howCanYouHelp":  payload.howCanYouHelp or None,
                "preferredDates": payload.preferredDates or None,
                "budgetOrInKind": payload.budgetOrInKind or None,
                "notes":          payload.notes or None,

                # Prisma has default(new) for status; createdAt kept explicit
                "createdAt":      datetime.now(timezone.utc),
            }
        )
        return {"application": created}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to create partner application: {e}")

# ===================== Admin: List / Read / Update / Delete ==================

@router.get("", status_code=200)
async def list_partner_applications(
    current_user: Annotated[User, Depends(get_current_user)],
    status_: Optional[PartnerStatus] = Query(default=None, alias="status"),
    q: Optional[str] = Query(default=None, description="search in orgName/contactName/email"),
):
    """
    Admin-only — list partner applications.

    Filters:
      - status (new|reviewing|approved|rejected)
      - q: case-insensitive substring search over orgName/contactName/email
    """
    enforce_authentication(current_user)
    enforce_admin(current_user)

    where: dict = {}
    if status_:
        # Convert Enum to raw string if needed
        where["status"] = status_.value if hasattr(status_, "value") else status_

    try:
        items = await db.partnerapplications.find_many(where=where, order={"createdAt": "desc"})

        # In-memory search filter (simple and OK for small/medium datasets)
        if q:
            q_lower = q.lower()
            items = [
                it for it in items
                if q_lower in (it.orgName or "").lower()
                or q_lower in (it.contactName or "").lower()
                or q_lower in (it.email or "").lower()
            ]

        return {"applications": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to fetch partner applications: {e}")


@router.get("/{application_id}", status_code=200)
async def get_partner_application(
    application_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """Admin-only — fetch a single application by id."""
    enforce_authentication(current_user)
    enforce_admin(current_user)

    app = await db.partnerapplications.find_unique(where={"id": application_id})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"application": app}


@router.patch("/{application_id}", status_code=200)
async def update_partner_application(
    application_id: str,
    payload: PartnerApplicationUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Admin-only — partial update of an application (including status changes).

    Only fields provided in the payload are updated.
    """
    enforce_authentication(current_user)
    enforce_admin(current_user)

    exists = await db.partnerapplications.find_unique(where={"id": application_id})
    if not exists:
        raise HTTPException(status_code=404, detail="Application not found")

    data: dict = {}

    # Copy simple text fields if present
    for k in [
        "orgName", "contactName", "email", "phone",
        "city", "state", "howCanYouHelp", "preferredDates",
        "budgetOrInKind", "notes",
    ]:
        v = getattr(payload, k, None)
        if v is not None:
            data[k] = v

    # Normalize optional URL
    if payload.website is not None:
        data["website"] = str(payload.website) if payload.website else None

    # Normalize enums
    if payload.partnerType is not None:
        data["partnerType"] = payload.partnerType.value if hasattr(payload.partnerType, "value") else payload.partnerType
    if payload.status is not None:
        data["status"] = payload.status.value if hasattr(payload.status, "value") else payload.status

    data["updatedAt"] = datetime.now(timezone.utc)

    try:
        updated = await db.partnerapplications.update(where={"id": application_id}, data=data)
        return {"application": updated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to update partner application: {e}")


@router.delete("/{application_id}", status_code=200)
async def delete_partner_application(
    application_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """Admin-only — delete an application by id."""
    enforce_authentication(current_user)
    enforce_admin(current_user)

    try:
        deleted = await db.partnerapplications.delete(where={"id": application_id})
        return {"deleted": deleted}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to delete partner application: {e}")
