from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from db.prisma_client import db
from typing import Annotated
from .notifications import send_email_multiple_users
from models.user_models import User
from models.interaction_models import (
    ProgramThreadCreate,
    ProgramThreadStatusUpdate,
    ProgramMessageCreate,
)
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication

router = APIRouter()


# ---------------------------------------------------------------------------
# POST /program/{program_id}/threads
# User or admin opens a new thread and sends the first message.
# ---------------------------------------------------------------------------
@router.post(
    "/program/{program_id}/threads",
    status_code=status.HTTP_201_CREATED,
)
async def create_thread(
    program_id: str,
    body: ProgramThreadCreate,
    current_user: Annotated[User, Depends(get_current_user)],
):
    enforce_authentication(current_user)

    program = await db.enrichmentprograms.find_unique(where={"id": program_id})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    thread = await db.programthread.create(
        data={
            "subject": body.subject,
            "program": {"connect": {"id": program_id}},
            "user": {"connect": {"id": current_user.id}},
        },
    )

    message = await db.programmessage.create(
        data={
            "content": body.content,
            "thread": {"connect": {"id": thread.id}},
            "sender": {"connect": {"id": current_user.id}},
        }
    )

    return {"data": {"thread": thread, "message": message}, "message": "Thread created"}

# ---------------------------------------------------------------------------
# GET /program/{program_id}/threads/me
# User: their own threads for a program.
# ---------------------------------------------------------------------------
@router.get("/program/{program_id}/threads/me")
async def get_my_threads(
    program_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    enforce_authentication(current_user)

    program = await db.enrichmentprograms.find_unique(where={"id": program_id})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    threads = await db.programthread.find_many(
        where={"programId": program_id, "userId": current_user.id},
        include={"messages": True},
        order={"createdAt": "desc"},
    )

    return {"data": threads, "count": len(threads), "message": "Threads retrieved"}


# ---------------------------------------------------------------------------
# GET /program/{program_id}/threads/all
# Authenticated: all public threads for a program.
# ---------------------------------------------------------------------------
@router.get("/program/{program_id}/threads/all")
async def get_threads(
    program_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    enforce_authentication(current_user)

    program = await db.enrichmentprograms.find_unique(where={"id": program_id})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    threads = await db.programthread.find_many(
        where={"programId": program_id, "isPrivate": False},
        include={"messages": True},
        order={"createdAt": "desc"},
    )

    return {"data": threads, "count": len(threads), "message": "Threads retrieved"}


# ---------------------------------------------------------------------------
# GET /program/{program_id}/threads/admin
# Admin: all threads for a program, including private direct messages.
# ---------------------------------------------------------------------------
@router.get("/program/{program_id}/threads/admin")
async def get_all_threads_admin(
    program_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    enforce_admin(current_user)

    program = await db.enrichmentprograms.find_unique(where={"id": program_id})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    threads = await db.programthread.find_many(
        where={"programId": program_id},
        include={"messages": True},
        order={"createdAt": "desc"},
    )

    return {"data": threads, "count": len(threads), "message": "Threads retrieved"}


# ---------------------------------------------------------------------------
# POST /program/{program_id}/threads/directly-admin
# User sends a private thread directly to admins (isPrivate=True).
# ---------------------------------------------------------------------------
@router.post(
    "/program/{program_id}/threads/directly-admin",
    status_code=status.HTTP_201_CREATED,
)
async def create_direct_thread(
    program_id: str,
    body: ProgramThreadCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
):
    enforce_authentication(current_user)

    program = await db.enrichmentprograms.find_unique(where={"id": program_id})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    thread = await db.programthread.create(
        data={
            "subject": body.subject,
            "isPrivate": True,
            "program": {"connect": {"id": program_id}},
            "user": {"connect": {"id": current_user.id}},
        },
    )

    message = await db.programmessage.create(
        data={
            "content": body.content,
            "thread": {"connect": {"id": thread.id}},
            "sender": {"connect": {"id": current_user.id}},
        }
    )

    admins = await db.users.find_many(where={"role": "admin"})

    await db.notifications.create_many(
        data=[{
            "title": thread.subject,
            "description": message.content,
            "isRead": False,
            "userId": admin.id
        }
        for admin in admins
        ]
    )

    background_tasks.add_task(
        send_email_multiple_users,
        [admin.email for admin in admins],
        f"New Direct Message Thread: {thread.subject}",
        f"You have a new direct message thread regarding program '{program.name}'.\n\nSubject: {thread.subject}\n\nMessage: {message.content}\n\nPlease log in to the admin dashboard to reply."
    )

    return {"data": {"thread": thread, "message": message}, "message": "Direct message sent"}


# ---------------------------------------------------------------------------
# POST /program/{program_id}/threads/{thread_id}/messages
# Reply to an existing thread.
# ---------------------------------------------------------------------------
@router.post(
    "/program/{program_id}/threads/{thread_id}/messages",
    status_code=status.HTTP_201_CREATED,
)
async def reply_to_thread(
    program_id: str,
    thread_id: str,
    body: ProgramMessageCreate,
    current_user: Annotated[User, Depends(get_current_user)],
):
    enforce_authentication(current_user)

    thread = await db.programthread.find_unique(where={"id": thread_id})
    if not thread or thread.programId != program_id:
        raise HTTPException(status_code=404, detail="Thread not found")

    if thread.status == "closed":
        raise HTTPException(status_code=400, detail="Thread is closed")

    is_admin = current_user.role == "admin"
    if not is_admin and thread.userId != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    message = await db.programmessage.create(
        data={
            "content": body.content,
            "thread": {"connect": {"id": thread_id}},
            "sender": {"connect": {"id": current_user.id}},
        }
    )

    return {"data": message, "message": "Message sent"}


# ---------------------------------------------------------------------------
# PATCH /program/{program_id}/threads/{thread_id}/read
# Mark all unread messages in a thread as read for the current user.
# ---------------------------------------------------------------------------
@router.patch("/program/{program_id}/threads/{thread_id}/read")
async def mark_thread_read(
    program_id: str,
    thread_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    enforce_authentication(current_user)

    thread = await db.programthread.find_unique(
        where={"id": thread_id},
        include={"messages": True},
    )

    if not thread or thread.programId != program_id:
        raise HTTPException(status_code=404, detail="Thread not found")

    is_admin = current_user.role == "admin"
    if not is_admin and thread.userId != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    unread = [m for m in thread.messages if current_user.id not in m.readByIds]
    for message in unread:
        await db.programmessage.update(
            where={"id": message.id},
            data={"readByIds": {"push": current_user.id}},
        )

    return {"message": f"{len(unread)} message(s) marked as read"}


# ---------------------------------------------------------------------------
# PATCH /program/{program_id}/threads/{thread_id}/status
# Admin: open or close a thread.
# ---------------------------------------------------------------------------
@router.patch("/program/{program_id}/threads/{thread_id}/status")
async def update_thread_status(
    program_id: str,
    thread_id: str,
    body: ProgramThreadStatusUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
):
    enforce_admin(current_user)

    thread = await db.programthread.find_unique(where={"id": thread_id})
    if not thread or thread.programId != program_id:
        raise HTTPException(status_code=404, detail="Thread not found")

    updated = await db.programthread.update(
        where={"id": thread_id},
        data={"status": body.status.value},
        include={"messages": True},
    )

    return {"data": updated, "message": f"Thread marked as {body.status.value}"}


# ---------------------------------------------------------------------------
# DELETE /program/{program_id}/threads/{thread_id}
# Admin: delete a thread and all its messages.
# ---------------------------------------------------------------------------
@router.delete("/program/{program_id}/threads/{thread_id}", status_code=status.HTTP_200_OK)
async def delete_thread(
    program_id: str,
    thread_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    enforce_admin(current_user)

    thread = await db.programthread.find_unique(where={"id": thread_id})
    if not thread or thread.programId != program_id:
        raise HTTPException(status_code=404, detail="Thread not found")

    await db.programmessage.delete_many(where={"threadId": thread_id})
    await db.programthread.delete(where={"id": thread_id})

    return {"message": "Thread deleted"}
