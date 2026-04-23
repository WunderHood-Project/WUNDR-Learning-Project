from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from db.prisma_client import db
from typing import Annotated
from datetime import datetime
from models.user_models import User
from models.interaction_models import (
    EnrichmentProgramCreate,
    EnrichmentProgramUpdate,
    EnrichmentProgramSubmit,
    ProgramStatusUpdate,
    EnrollChildren,
    NotificationCreate,
)
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication
from .notifications import send_email_one_user


router = APIRouter()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _age_on_date(birthday: datetime, reference_date: datetime) -> int:
    """Return how old a person will be on reference_date given their birthday."""
    b = birthday.date()
    r = reference_date.date()
    age = r.year - b.year
    if (r.month, r.day) < (b.month, b.day):
        age -= 1
    return age


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
    background_tasks: BackgroundTasks,
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

        await db.notifications.create(
            data={
                "title": "New Enrichment Program Submission",
                "description": f"Thank you for submitting '{program.name}.' The program will be reviewed by one of our team members. Please check the notifications page or email notifications (if enabled) for updates on the review status.",
                "userId": current_user.id,  # Global notification for all admins
                "isRead": False,
            }
        )

        if current_user.emailNotificationsEnabled:
            subject = f"Your Program Submission Is Under Review"
            contents = (
                f"Hello {current_user.firstName},\n\n"
                f'Your program "{program.name}" has been submitted and will be reviewed.'
                + f" You will receive another notification by email once the review is complete and the program is either approved or rejected."
                + "\n\nBest,\nWonderHood Team\ninfo@whproject.org\nwhproject.org"
            )

            background_tasks.add_task(
                send_email_one_user,
                current_user.email,
                subject,
                contents,
            )

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
# GET /program/{program_id}/attendees  (admin — enrolled children details)
# ---------------------------------------------------------------------------

@router.get("/{program_id}/attendees", status_code=status.HTTP_200_OK)
async def get_program_attendees(
    program_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Return enrolled children with parent and emergency contact details (admin only).
    """
    enforce_authentication(current_user, "view program attendees")
    enforce_admin(current_user, "view program attendees")

    program = await db.enrichmentprograms.find_unique(
        where={"id": program_id},
        include={
            "children": {
                "include": {
                    "parents": True,
                    "emergencyContacts": True,
                }
            }
        },
    )

    if not program:
        raise HTTPException(status_code=404, detail="Enrichment program not found.")

    children_out = []
    for ch in program.children:
        parents_out = [
            {
                "id": p.id,
                "firstName": p.firstName,
                "lastName": p.lastName,
                "email": p.email,
                "phoneNumber": p.phoneNumber,
            }
            for p in (ch.parents or [])
        ]

        emergency_out = [
            {
                "id": ec.id,
                "firstName": ec.firstName,
                "lastName": ec.lastName,
                "phoneNumber": ec.phoneNumber,
                "relationship": ec.relationship,
            }
            for ec in (ch.emergencyContacts or [])
        ]

        children_out.append({
            "id": ch.id,
            "firstName": ch.firstName,
            "lastName": ch.lastName,
            "preferredName": ch.preferredName,
            "schoolType": ch.schoolType,
            "grade": ch.grade,
            "birthday": ch.birthday,
            "allergiesMedical": ch.allergiesMedical,
            "notes": ch.notes,
            "photoConsent": ch.photoConsent,
            "waiver": ch.waiver,
            "parents": parents_out,
            "emergencyContacts": emergency_out,
        })

    return {
        "programId": program.id,
        "participants": program.participants,
        "limit": program.limit,
        "children": children_out,
    }


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
    background_tasks: BackgroundTasks,
):
    """
    Approve or reject a pending enrichment program (admin only).
    """
    enforce_authentication(current_user, "update program status")
    enforce_admin(current_user, "update program status")

    existing = await db.enrichmentprograms.find_unique(
        where={"id": program_id},
        include={"submittedBy": True},
    )
    if not existing:
        raise HTTPException(status_code=404, detail="Enrichment program not found.")

    try:
        updated = await db.enrichmentprograms.update(
            where={"id": program_id},
            data={"status": status_data.status},
        )

        if existing.submittedById:
            await db.notifications.create(
                data={
                    "title": "Enrichment Program Submission Update",
                    "description": f"Thank you for submitting '{existing.name}.' The program has been {status_data.status}. Please contact our team at info@whproject.org with any questions.",
                    "userId": existing.submittedById,
                    "isRead": False,
                }
            )

        submitter = existing.submittedBy
        if submitter and submitter.emailNotificationsEnabled:
            subject = f"Your Program Submission Has Been {status_data.status.capitalize()}"
            contents = (
                f"Hello {submitter.firstName},\n\n"
                f'Your program "{existing.name}" has been {status_data.status}. Please contact our team at info@whproject.org with any questions.'
                + "\n\nBest,\n\nWonderHood Team\ninfo@whproject.org\nwhproject.org"
            )

            background_tasks.add_task(
                send_email_one_user,
                submitter.email,
                subject,
                contents,
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

    # Age validation: child must be within [ageMin, ageMax] on the program start date.
    # A child who will turn ageMin before or on startDate is eligible.
    children_to_enroll = await db.children.find_many(where={"id": {"in": enroll_data.childIds}})
    start = f"{program.startDate.strftime('%B')} {program.startDate.day}, {program.startDate.year}"
    for child in children_to_enroll:
        if child.birthday is not None:
            age_at_start = _age_on_date(child.birthday, program.startDate)
            if age_at_start < program.ageMin:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"{child.firstName} {child.lastName} does not meet the minimum age requirement. "
                        f"They must be at least {program.ageMin} years old by {start}."
                    ),
                )
            if age_at_start > program.ageMax:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"{child.firstName} {child.lastName} exceeds the maximum age for this program. "
                        f"This program is for children up to {program.ageMax} years old."
                    ),
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


# ---------------------------------------------------------------------------
# POST /program/{program_id}/notification/enrolled_users_child  (admin)
# ---------------------------------------------------------------------------

@router.post("/{program_id}/notification/enrolled_users_child", status_code=status.HTTP_200_OK)
async def send_message_to_users_of_enrolled_child_program(
    program_id: str,
    notification: NotificationCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks,
):
    """
    Send a notification to all parents/guardians of children enrolled in a program.
    Admin only.
    """
    enforce_authentication(current_user, "send notification")
    enforce_admin(current_user, "send notification")

    # Fetch program with enrolled children and their parents
    program = await db.enrichmentprograms.find_unique(
        where={"id": program_id},
        include={
            "children": {
                "include": {
                    "parents": True,
                }
            }
        },
    )

    if not program:
        raise HTTPException(status_code=404, detail="Enrichment program not found.")

    # Collect unique parent IDs
    parent_ids = set()
    for child in program.children:
        parent_ids.update(child.parentIds)

    if not parent_ids:
        raise HTTPException(status_code=404, detail="No enrolled children or parents found.")

    # Collect parent emails
    parent_emails = []
    for parent_id in parent_ids:
        user = await db.users.find_unique(where={"id": parent_id})
        if user:
            parent_emails.append(user.email)

    # Create in-app notifications for each parent
    notification_data = [
        {
            "title": notification.title,
            "description": notification.description,
            "userId": parent_id,
            "isRead": False,
        }
        for parent_id in parent_ids
    ]

    new_notifications = await db.notifications.create_many(data=notification_data)

    # Send emails to parents who have email notifications enabled
    for email in parent_emails:
        user_with_notifications = await db.users.find_unique(
            where={
                "email": email,
                "emailNotificationsEnabled": True,
            }
        )
        if user_with_notifications:
            background_tasks.add_task(
                send_email_one_user,
                user_with_notifications.email,
                notification.title,
                notification.description,
            )

    return {
        "message": "Notification successfully sent to all parents.",
        "notification": new_notifications,
    }
