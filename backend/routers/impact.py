from fastapi import APIRouter, Depends, Query
from typing import Annotated, Optional
from datetime import datetime, timezone

from db.prisma_client import db
from models.user_models import User
from .auth.login import get_current_user
from .auth.utils import enforce_authentication, enforce_admin


router = APIRouter()


@router.get("/admin", status_code=200)
async def get_admin_impact(
    current_user: Annotated[User, Depends(get_current_user)],
    year: Optional[int] = Query(default=None),
):
    enforce_authentication(current_user, "view impact report")
    enforce_admin(current_user, "view impact report")

    if year:
        start = datetime(year, 1, 1, tzinfo=timezone.utc)
        end = datetime(year + 1, 1, 1, tzinfo=timezone.utc)
        event_date_filter = {"gte": start, "lt": end}
        program_date_filter = {"gte": start, "lt": end}
    else:
        event_date_filter = None
        program_date_filter = None

    event_where_base = {"status": "approved"}
    program_where_base = {"status": "approved"}

    partner_events_where = {
        **event_where_base,
        "label": "partner",
    }

    wonderhood_events_where = {
        **event_where_base,
        "label": "wonderhood",
    }

    partner_programs_where = {
        **program_where_base,
        "label": "partner",
    }

    wonderhood_programs_where = {
        **program_where_base,
        "label": "wonderhood",
    }

    if event_date_filter:
        partner_events_where["date"] = event_date_filter
        wonderhood_events_where["date"] = event_date_filter

    if program_date_filter:
        partner_programs_where["startDate"] = program_date_filter
        wonderhood_programs_where["startDate"] = program_date_filter

    partner_events = await db.events.find_many(where=partner_events_where)
    wonderhood_events = await db.events.find_many(where=wonderhood_events_where)

    partner_programs = await db.enrichmentprograms.find_many(where=partner_programs_where)
    wonderhood_programs = await db.enrichmentprograms.find_many(where=wonderhood_programs_where)

    children = await db.children.find_many()
    partner_users = await db.users.find_many(where={"role": "partner"})

    return {
        "year": year or "all",
        "events": {
            "partnerPublished": len(partner_events),
            "wonderhoodPublished": len(wonderhood_events),
            "totalPublished": len(partner_events) + len(wonderhood_events),
        },
        "programs": {
            "partnerPublished": len(partner_programs),
            "wonderhoodPublished": len(wonderhood_programs),
            "totalPublished": len(partner_programs) + len(wonderhood_programs),
        },
        "community": {
            "childrenServed": len(children),
            "communityPartners": len(partner_users),
        },
    }

@router.get("/events-programs", status_code=200)
async def events_programs():
    stat = await db.impactstat.find_first()
    return {
        "totalEventsCreated": stat.totalEventsCreated if stat else 0,
        "totalProgramsCreated": stat.totalProgramsCreated if stat else 0,
    }