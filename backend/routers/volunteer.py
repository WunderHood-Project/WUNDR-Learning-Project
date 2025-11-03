from fastapi import APIRouter, status, Depends, HTTPException
from db.prisma_client import db
from typing import Annotated
from models.user_models import User, VolunteerCreate, VolunteerUpdate
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication
from datetime import datetime, timezone

router = APIRouter()

@router.get("/my-opportunities", status_code=200)
async def my_opportunities(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Return the list of opportunity IDs the current user has applied to,
    and a boolean flag indicating whether they submitted the *general* application.
    """
    enforce_authentication(current_user)

    vol = await db.volunteers.find_unique(where={"userId": current_user.id})
    ids = vol.volunteerOpportunityIds if vol and vol.volunteerOpportunityIds else []
    # `hasGeneral` is true only if a volunteer record exists AND it has the general timestamp
    has_general = bool(vol and getattr(vol, "generalAppliedAt", None))

    return {"opportunityIds": ids, "hasGeneral": has_general}


@router.get("/applications", status_code=200)
async def list_all_applications(
    current_user: Annotated[User, Depends(get_current_user)],
    kind: str = "all",  # "all" | "general"
):
    """
    Admin-only listing of volunteer applications.
    - kind="all": return every volunteer record
    - kind="general": return only *general* apps (those with `generalAppliedAt`
      and without any connected opportunity IDs)
    Results are sorted newest-first by createdAt (tz-aware fallback applied).
    """
    enforce_authentication(current_user)
    enforce_admin(current_user)

    vols = await db.volunteers.find_many()

    if kind.lower() == "general":
        vols = [v for v in vols if getattr(v, "generalAppliedAt", None) is not None]

    # Sort newest-first; use a tz-aware epoch as a safe fallback
    epoch = datetime(1970, 1, 1, tzinfo=timezone.utc)
    vols.sort(key=lambda v: getattr(v, "createdAt", None) or epoch, reverse=True)

    return {"volunteers": vols}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def volunteer_sign_up_general(
    current_user: Annotated[User, Depends(get_current_user)],
    volunteer_data: VolunteerCreate
):
    """
    Create a *general* volunteer application for the current user.
    - Allowed only once per user (returns 400 if already registered as volunteer)
    - Stamps `generalAppliedAt` with a timezone-aware datetime
    """
    enforce_authentication(current_user)

    existing = await db.volunteers.find_unique(where={"userId": current_user.id})
    if existing:
        raise HTTPException(status_code=400, detail="User is already registered as a volunteer")

    try:
        data = volunteer_data.model_dump()

        volunteer = await db.volunteers.create(
            data={
                **data,
                "status": "New",
                "generalAppliedAt": datetime.now(timezone.utc),
                # Link to the user via relation (don’t set userId directly)
                "user": {"connect": {"id": current_user.id}},
            }
        )
        return {"volunteer": volunteer}

    except Exception as e:
        # Surface as 500 to the client; also logs to server stdout
        print("VOL_CREATE_ERR:", e)
        raise HTTPException(status_code=500, detail=str(e))




# @router.post("/{opportunity_id}", status_code=status.HTTP_201_CREATED)
# async def volunteer_sign_up(
#     opportunity_id: str,
#     current_user: Annotated[User, Depends(get_current_user)],
#     volunteer_data: VolunteerCreate
# ):
#     """
#         Authenticated user
#         Sign up as a volunteer
#         Information for volunteer application
#         return Json of user's application
#     """

#     # Validate User
#     enforce_authentication(current_user)

#     existing_volunteer = await db.volunteers.find_unique(
#             where={"userId": current_user.id}
#         )

#     if existing_volunteer:
#         raise HTTPException(
#             status_code=400,
#             detail="User is already registered as a volunteer"
#         )

#     # Validate the opportunity exists
#     opportunity = await db.volunteeropportunities.find_unique(
#         where={"id": opportunity_id}
#     )

#     if not opportunity:
#         raise HTTPException(
#             status_code=404,
#             detail="Volunteer opportunity not found"
#         )

#     try:
#         data = volunteer_data.model_dump()
#         data["userId"] = current_user.id

#         volunteer = await db.volunteers.create(
#             data={
#                 **data,
#                 "volunteerOpportunities": {
#                     "connect": [{"id": opportunity_id}]
#                 }
#             }
#         )

#         return {"volunteer": volunteer}

#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"Unable to enroll volunteer: {e}"
#         )

@router.post("/{opportunity_id}", status_code=status.HTTP_201_CREATED)
async def volunteer_sign_up(
    opportunity_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    volunteer_data: VolunteerCreate
):
    """
    Sign up to a specific opportunity.
    - If volunteer already exists -> update it and connect the opportunity.
    - If not -> create volunteer and connect the opportunity.
    - Prevent duplicate connection to the same opportunity.
    """

    enforce_authentication(current_user)

    # 1) Validate the opportunity exists
    opportunity = await db.volunteeropportunities.find_unique(where={"id": opportunity_id})
    if not opportunity:
        raise HTTPException(status_code=404, detail="Volunteer opportunity not found")

    # 2) Find existing volunteer (with current connections)
    volunteer = await db.volunteers.find_unique(
        where={"userId": current_user.id},
        include={"volunteerOpportunities": True}
    )

    try:
        if volunteer:
            # 2a) Already applied to this specific opportunity?
            already = any(o.id == opportunity_id for o in (volunteer.volunteerOpportunities or []))
            if already:
                raise HTTPException(status_code=409, detail="Already applied to this opportunity")

            # 2b) Update volunteer fields (if provided) and connect new opportunity
            data = volunteer_data.model_dump(exclude_unset=True)
            updated = await db.volunteers.update(
                where={"userId": current_user.id},
                data={
                    **data,
                    "volunteerOpportunities": {"connect": [{"id": opportunity_id}]}
                }
            )
            return {"volunteer": updated}

        # 3) No volunteer yet -> create new with user relation + connect opportunity
        data = volunteer_data.model_dump()
        created = await db.volunteers.create(
            data={
                **data,
                "status": "New",
                "user": {"connect": {"id": current_user.id}},
                "volunteerOpportunities": {"connect": [{"id": opportunity_id}]}
            }
        )
        return {"volunteer": created}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to enroll volunteer: {e}")



@router.patch("/", status_code=status.HTTP_200_OK)
async def update_volunteer(
    current_user: Annotated[User, Depends(get_current_user)],
    volunteer_data: VolunteerUpdate
):
    """
        Authenticate user
        Validate user is the volunteer
        Update volunteer's credentials
        Return updated volunteer
    """

    # Validate user
    enforce_authentication(current_user)

    # Verify the volunteer exists
    volunteer = await db.volunteers.find_unique(
        where={"userId": current_user.id}
    )

    if not volunteer:
        raise HTTPException(
            status_code=400,
            detail="Unable to located volunteer"
        )

    # Handle update
    try:
        data = volunteer_data.model_dump(exclude_unset=True)

        if not data:
            return {"Original Volunteer": volunteer}

        updated_volunteer = await db.volunteers.update(
            where={"userId": current_user.id},
            data = data
        )

        return {"Updated Volunteer": updated_volunteer}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to update volunteer: {e}"
        )

@router.delete("/{volunteer_id}", status_code=status.HTTP_200_OK)
async def delete_volunteer(
    volunteer_id: str,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
        Authenticate user and enforce admin role
        Query and delete volunteer
        return deleted volunteer
    """

    # Validate user
    enforce_authentication(current_user)
    enforce_admin(current_user)

    # Query for the volunteer

    volunteer = await db.volunteers.find_unique(
        where={"id": volunteer_id}
    )

    if not volunteer:
        raise HTTPException(
            status_code=404,
            detail="Volunteer not found"
        )

    # Delete the volunteer
    try:
        deleted_volunteer = await db.volunteers.delete(
            where={"id": volunteer_id}
        )

        return {"Deleted Volunteer": deleted_volunteer}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to delete the volunteer: {e}"
        )
