from fastapi import APIRouter, status, Depends, HTTPException
from db.prisma_client import db
from typing import Annotated
from models.user_models import User
from models.interaction_models import (
    EnrichmentProgramCreate,
    EnrichmentProgramUpdate,
    EnrichmentProgramSubmit,
    ProgramStatusUpdate,
    EnrollChildren,
)
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication


router = APIRouter()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _phases_to_json(phases):
    """Convert a list of ProgramPhase models to a plain list of dicts for Prisma."""
    if phases is None:
        return None
    return [p.model_dump() for p in phases]

# Fields that cannot be passed directly to Prisma and need separate handling
_RELATION_FIELDS = {"childIds", "userIds", "activityId", "phases"}

def _build_scalar_data(program_data, overrides: dict) -> dict:
    """
    Dump scalar fields from a program DTO, strip relation/special fields,
    apply server-side overrides (status, label, etc.), and serialise phases.
    """
    data = program_data.model_dump(exclude_unset=True, exclude=_RELATION_FIELDS)
    # Only include phases if the list is non-empty; passing [] to a Json? field
    # causes Prisma to reject the input as neither Json nor Null.
    if program_data.phases:
        data["phases"] = _phases_to_json(program_data.phases)
    data.update(overrides)
    return data


# ---------------------------------------------------------------------------
# POST /program  (admin — create directly as approved)
# ---------------------------------------------------------------------------

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_program(
    program_data: EnrichmentProgramCreate,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Create Enrichment Program (admin only).

    Creates a program with status=approved immediately.
    For partner submissions use POST /program/submit.
    """
    enforce_authentication(current_user, "create an enrichment program")
    enforce_admin(current_user, "create an enrichment program")

    existing = await db.enrichmentprograms.find_unique(where={"name": program_data.name})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An enrichment program with this name already exists.",
        )

    valid_children = await db.children.find_many(
        where={"id": {"in": program_data.childIds}}
    )
    if len(valid_children) != len(program_data.childIds):
        raise HTTPException(status_code=400, detail="One or more child IDs are invalid.")

    valid_users = await db.users.find_many(
        where={"id": {"in": program_data.userIds}}
    )
    if len(valid_users) != len(program_data.userIds):
        raise HTTPException(status_code=400, detail="One or more user IDs are invalid.")

    data = _build_scalar_data(program_data, overrides={"status": "approved"})
    if program_data.activityId:
        data["activityId"] = program_data.activityId
    if program_data.childIds:
        data["childIds"] = program_data.childIds
    if program_data.userIds:
        data["userIds"] = program_data.userIds

    try:
        program = await db.enrichmentprograms.create(data=data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create enrichment program: {str(e)}",
        )

    return {"program": program, "message": "Enrichment program created successfully."}


# ---------------------------------------------------------------------------
# POST /program/submit  (partner — creates as pending, awaiting admin approval)
# ---------------------------------------------------------------------------

@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_program(
    program_data: EnrichmentProgramSubmit,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Submit Enrichment Program for approval (partner only).

    Creates the program with status=pending and label=partner.
    An admin must approve it via PATCH /program/{id}/status.
    """
    enforce_authentication(current_user, "submit an enrichment program")

    if current_user.role not in ("partner", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only partners or admins can submit enrichment programs.",
        )

    existing = await db.enrichmentprograms.find_unique(where={"name": program_data.name})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An enrichment program with this name already exists.",
        )

    data = _build_scalar_data(
        program_data,
        overrides={"status": "pending", "label": "partner"},
    )
    if program_data.activityId:
        data["activityId"] = program_data.activityId
    data["submittedById"] = current_user.id

    try:
        program = await db.enrichmentprograms.create(data=data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit enrichment program: {str(e)}",
        )

    return {"program": program, "message": "Enrichment program submitted for review."}


# ---------------------------------------------------------------------------
# GET /program  (public — approved programs only)
# ---------------------------------------------------------------------------

@router.get("", status_code=status.HTTP_200_OK)
async def get_all_programs():
    """
    Get all approved enrichment programs.
    """
    try:
        programs = await db.enrichmentprograms.find_many(
            where={"status": "approved"},
            order={"startDate": "asc"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch enrichment programs: {str(e)}",
        )

    return {"programs": programs}


# ---------------------------------------------------------------------------
# GET /program/pending  (admin — pending submissions queue)
# ---------------------------------------------------------------------------

@router.get("/pending", status_code=status.HTTP_200_OK)
async def get_pending_programs(
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Get all pending enrichment program submissions (admin only).
    """
    enforce_authentication(current_user, "view pending programs")
    enforce_admin(current_user, "view pending programs")

    try:
        programs = await db.enrichmentprograms.find_many(
            where={"status": "pending"},
            order={"createdAt": "asc"},
            include={"submittedBy": True},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch pending programs: {str(e)}",
        )

    return {"programs": programs}


# ---------------------------------------------------------------------------
# GET /program/{program_id}  (public)
# ---------------------------------------------------------------------------

@router.get("/{program_id}", status_code=status.HTTP_200_OK)
async def get_program(program_id: str):
    """
    Get a single enrichment program by ID.
    """
    program = await db.enrichmentprograms.find_unique(
        where={"id": program_id},
        include={"submittedBy": True},
    )

    if not program:
        raise HTTPException(status_code=404, detail="Enrichment program not found.")

    return {"program": program}


# ---------------------------------------------------------------------------
# PATCH /program/{program_id}  (admin — update fields)
# ---------------------------------------------------------------------------

@router.patch("/{program_id}", status_code=status.HTTP_200_OK)
async def update_program(
    program_id: str,
    program_data: EnrichmentProgramUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Update an enrichment program (admin only).
    """
    enforce_authentication(current_user, "update an enrichment program")
    enforce_admin(current_user, "update an enrichment program")

    existing = await db.enrichmentprograms.find_unique(where={"id": program_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Enrichment program not found.")

    # Check name uniqueness if name is being changed
    if program_data.name and program_data.name != existing.name:
        name_conflict = await db.enrichmentprograms.find_unique(where={"name": program_data.name})
        if name_conflict:
            raise HTTPException(
                status_code=400,
                detail="Another enrichment program with this name already exists.",
            )

    update_data = program_data.dict(exclude_unset=True)

    # Phases need JSON serialisation
    if "phases" in update_data and update_data["phases"] is not None:
        update_data["phases"] = _phases_to_json(program_data.phases)

    try:
        updated = await db.enrichmentprograms.update(
            where={"id": program_id},
            data=update_data,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update enrichment program: {str(e)}",
        )

    return {"program": updated, "message": "Enrichment program updated successfully."}


# ---------------------------------------------------------------------------
# PATCH /program/{program_id}/status  (admin — approve or reject)
# ---------------------------------------------------------------------------

@router.patch("/{program_id}/status", status_code=status.HTTP_200_OK)
async def update_program_status(
    program_id: str,
    status_data: ProgramStatusUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Approve or reject a pending enrichment program (admin only).
    """
    enforce_authentication(current_user, "update program status")
    enforce_admin(current_user, "update program status")

    existing = await db.enrichmentprograms.find_unique(where={"id": program_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Enrichment program not found.")

    try:
        updated = await db.enrichmentprograms.update(
            where={"id": program_id},
            data={"status": status_data.status},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update program status: {str(e)}",
        )

    return {"program": updated, "message": f"Program status updated to '{status_data.status}'."}


# ---------------------------------------------------------------------------
# PATCH /program/{program_id}/enroll  (authenticated — enroll children)
# ---------------------------------------------------------------------------

@router.patch("/{program_id}/enroll", status_code=status.HTTP_200_OK)
async def enroll_in_program(
    program_id: str,
    enroll_data: EnrollChildren,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Enroll children in an enrichment program.

    Validates the program exists and is approved.
    Validates capacity if a limit is set.
    Connects the children and their parent user to the program.
    """
    enforce_authentication(current_user, "enroll in an enrichment program")

    program = await db.enrichmentprograms.find_unique(where={"id": program_id})
    if not program:
        raise HTTPException(status_code=404, detail="Enrichment program not found.")

    if program.status != "approved":
        raise HTTPException(status_code=400, detail="This program is not open for enrollment.")

    if program.limit is not None:
        spots_remaining = program.limit - program.participants
        if len(enroll_data.childIds) > spots_remaining:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough spots. Only {spots_remaining} spot(s) remaining.",
            )

    try:
        updated = await db.enrichmentprograms.update(
            where={"id": program_id},
            data={
                "participants": {"increment": len(enroll_data.childIds)},
                "children": {"connect": [{"id": cid} for cid in enroll_data.childIds]},
                "users": {"connect": [{"id": current_user.id}]},
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to enroll in program: {str(e)}",
        )

    return {"program": updated, "message": "Enrolled successfully."}


# ---------------------------------------------------------------------------
# PATCH /program/{program_id}/unenroll  (authenticated — unenroll children)
# ---------------------------------------------------------------------------

@router.patch("/{program_id}/unenroll", status_code=status.HTTP_200_OK)
async def unenroll_from_program(
    program_id: str,
    enroll_data: EnrollChildren,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Unenroll children from an enrichment program.
    """
    enforce_authentication(current_user, "unenroll from an enrichment program")

    program = await db.enrichmentprograms.find_unique(where={"id": program_id})
    if not program:
        raise HTTPException(status_code=404, detail="Enrichment program not found.")

    try:
        updated = await db.enrichmentprograms.update(
            where={"id": program_id},
            data={
                "participants": {"decrement": len(enroll_data.childIds)},
                "children": {"disconnect": [{"id": cid} for cid in enroll_data.childIds]},
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to unenroll from program: {str(e)}",
        )

    return {"program": updated, "message": "Unenrolled successfully."}


# ---------------------------------------------------------------------------
# DELETE /program/{program_id}  (admin)
# ---------------------------------------------------------------------------

@router.delete("/{program_id}", status_code=status.HTTP_200_OK)
async def delete_program(
    program_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Delete an enrichment program (admin only).
    """
    enforce_authentication(current_user, "delete an enrichment program")
    enforce_admin(current_user, "delete an enrichment program")

    existing = await db.enrichmentprograms.find_unique(where={"id": program_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Enrichment program not found.")

    try:
        await db.enrichmentprograms.delete(where={"id": program_id})
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete enrichment program: {str(e)}",
        )

    return {"message": "Enrichment program deleted successfully."}
