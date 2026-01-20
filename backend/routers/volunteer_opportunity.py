from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from db.prisma_client import db
from typing import Annotated
from models.user_models import User
from models.interaction_models import VolunteerOpportunityCreate, VolunteerOpportunityUpdate
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication, get_home_link
from datetime import datetime, timezone
from .notifications import send_email_multiple_users

router = APIRouter()

# -------- Public ----------
@router.get("/public", status_code=200)
async def list_public_opportunities():
    opps = await db.volunteeropportunities.find_many()
    return {"opportunities": opps}


# -------- LIST (admin only) ----------
@router.get("/", status_code=200)
async def list_opportunities(current_user: Annotated[User, Depends(get_current_user)]):
    enforce_authentication(current_user); enforce_admin(current_user)
    items = await db.volunteeropportunities.find_many()
    return {"opportunities": items}

# -------- GET ONE (admin only) ----------
@router.get("/{opportunity_id}", status_code=200)
async def get_opportunity(opportunity_id: str, current_user: Annotated[User, Depends(get_current_user)]):
    enforce_authentication(current_user); enforce_admin(current_user)
    opp = await db.volunteeropportunities.find_unique(where={"id": opportunity_id})
    if not opp:
        raise HTTPException(404, "Volunteer opportunity not found")
    return {"opportunity": opp}

# -------- GET applications by opportunity (admin) ----------
@router.get("/{opportunity_id}/applications", status_code=200)
async def applications_by_opportunity(opportunity_id: str, current_user: Annotated[User, Depends(get_current_user)]):
    enforce_authentication(current_user); enforce_admin(current_user)
    vols = await db.volunteers.find_many(where={"volunteerOpportunityIds": {"has": opportunity_id}})
    return {"volunteers": vols}

# -------- CREATE (admin only) ----------
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_volunteer_opportunity(
    current_user: Annotated[User, Depends(get_current_user)],
    opportunity_data: VolunteerOpportunityCreate,
    background_tasks: BackgroundTasks
):
    enforce_authentication(current_user); enforce_admin(current_user)
    data = opportunity_data.model_dump()
    opp = await db.volunteeropportunities.create(data=data)

    home_link = get_home_link()
    users = await db.users.find_many(where={"emailNotificationsEnabled": True})

    # Send notification to users with opted in email
    if users:
        title = f"New Volunteer Opportunity at WonderHood Project!"
        description = f"Hello!\n\nWe wanted to let you know that we need volunteers for {opp.title}. Please register as soon as possible here {home_link}. We appreciate your help!\n\nBest,\nWonderHood Team"
    
        # Create notifications to store in db
        now_utc = datetime.now(timezone.utc)
        try:
            await db.notifications.create_many(
                data = [
                    {
                        "title": title,
                        "description": description,
                        "userId":u.id,
                        "isRead": False,
                        "time": now_utc
                    }
                    for u in users
                ]
            )
        except Exception:
            # send one-by-one to avoid losing the notification
            for u in users:
                try:
                    await db.notifications.create(
                        data={
                            "title": title,
                            "description": description,
                            "userId":u.id,
                            "isRead": False,
                            "time": now_utc
                        }
                    )
                except:
                    pass

        # Send email notification directly to users
        user_emails = [u.email for u in users]

        background_tasks.add_task(
            send_email_multiple_users,
            user_emails,
            title,
            description
        )

    return {"opportunity": opp}


# -------- UPDATE (admin only) ----------
@router.patch("/{opportunity_id}", status_code=200)
async def update_opportunity(
    opportunity_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    opportunity_data: VolunteerOpportunityUpdate
):
    enforce_authentication(current_user); enforce_admin(current_user)
    exists = await db.volunteeropportunities.find_unique(where={"id": opportunity_id})
    if not exists:
        raise HTTPException(404, "Volunteer opportunity not found")

    data = opportunity_data.model_dump(exclude_unset=True)
    opp = await db.volunteeropportunities.update(where={"id": opportunity_id}, data=data)
    return {"opportunity": opp}

# -------- DELETE (admin only) ----------
@router.delete("/{opportunity_id}", status_code=200)
async def delete_opportunity(opportunity_id: str, current_user: Annotated[User, Depends(get_current_user)]):
    enforce_authentication(current_user); enforce_admin(current_user)
    exists = await db.volunteeropportunities.find_unique(where={"id": opportunity_id})
    if not exists:
        raise HTTPException(404, "Unable to locate opportunity")

    opp = await db.volunteeropportunities.delete(where={"id": opportunity_id})
    return {"opportunity": opp}

# -------- ADD volunteer to opportunity (admin) ----------
@router.post("/{opportunity_id}/volunteers/{volunteer_id}", status_code=200)
async def enroll_volunteer(opportunity_id: str, volunteer_id: str, current_user: Annotated[User, Depends(get_current_user)]):
    enforce_authentication(current_user); enforce_admin(current_user)

    opp = await db.volunteeropportunities.find_unique(where={"id": opportunity_id})
    if not opp:
        raise HTTPException(404, "Volunteer opportunity not found")

    if volunteer_id in (opp.volunteerIds or []):
        raise HTTPException(409, "Volunteer already exists")

    updated = await db.volunteeropportunities.update(
        where={"id": opportunity_id},
        data={"volunteerIds": {"push": volunteer_id}}  
    )
    return {"opportunity": updated}

# -------- REMOVE volunteer from opportunity (admin) ----------
@router.patch("/{opportunity_id}/volunteers/{volunteer_id}", status_code=200)
async def remove_volunteer_from_opportunity(opportunity_id: str, volunteer_id: str, current_user: Annotated[User, Depends(get_current_user)]):
    enforce_authentication(current_user); enforce_admin(current_user)

    opp = await db.volunteeropportunities.find_unique(where={"id": opportunity_id})
    if not opp:
        raise HTTPException(404, "Unable to locate opportunity")

    new_ids = [vid for vid in (opp.volunteerIds or []) if vid != volunteer_id]
    updated = await db.volunteeropportunities.update(
        where={"id": opportunity_id},
        data={"volunteerIds": {"set": new_ids}} 
    )
    return {"opportunity": updated}
