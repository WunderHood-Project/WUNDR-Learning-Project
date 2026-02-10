from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from db.prisma_client import db
from typing import Annotated
from models.user_models import User
from models.interaction_models import EventCreate, EventUpdate, ReviewCreate, EnrollChildren, NotificationCreate
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication, convert_iso_date_to_string, get_event_link, get_home_link
from datetime import datetime, timezone, time
from .notifications import send_email_one_user, schedule_reminder, send_email_multiple_users
router = APIRouter()

def format_us_date(dt):
    # dt -> datetime or string ISO
    if isinstance(dt, str):
        try:
            dt = datetime.fromisoformat(dt)
        except Exception:
            return dt  
    return dt.strftime("%m/%d/%Y")

def format_us_time(value):
    """
    Return '14:20' or time(14, 20) в '2:20 PM'
    """
    if value is None:
        return ""

    # string "14:20"
    if isinstance(value, str):
        try:
            t = datetime.strptime(value, "%H:%M").time()
        except ValueError:
            return value
    elif isinstance(value, time):
        t = value
    else:
        return str(value)

    # "02:20 PM" -> "2:20 PM"
    return t.strftime("%I:%M %p").lstrip("0")


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_event(
   event_data: EventCreate,
   current_user: Annotated[User, Depends(get_current_user)],
   background_tasks: BackgroundTasks
):
   """
   Create Event

   Verify authentication
   Link the event to an existing activity
   Attach users / children by their IDs
   Return the created event
   """

   enforce_authentication(current_user, "create an event")
   enforce_admin(current_user, "create an event")

   # Verify that the activity ID is valid
   activity = await db.activities.find_unique(where={
       "id": event_data.activityId
   })

   if not activity:
       raise HTTPException(
           status_code=404,
           detail="Activity not found."
       )

   # Verify that the userIDs and childIDs are valid
   valid_users = await db.users.find_many(
       where={"id": {"in": event_data.userIds}}
   )

   if len(valid_users) != len(event_data.userIds):
       raise HTTPException(
           status_code=400,
           detail="One or more user ids are invalid."
       )

   valid_children = await db.children.find_many(
       where={"id": {"in": event_data.childIds}}
   )

   if len(valid_children) != len(event_data.childIds):
       raise HTTPException(
           status_code=400,
           detail="One or more child ids are invalid."
       )


   # Create the event
   try:
       new_event = await db.events.create(
           data={
               "name": event_data.name,
               "description": event_data.description,
               "notes": event_data.notes,
               "date": event_data.date,
               "image": event_data.image,
               "participants": event_data.participants,
               "limit": event_data.limit,
               "city": event_data.city,
               "state": event_data.state,
               "address": event_data.address,
               "zipCode": event_data.zipCode,
               "latitude": event_data.latitude,
               "longitude": event_data.longitude,
               "startTime": event_data.startTime,
               "endTime": event_data.endTime,
               "volunteerLimit": event_data.volunteerLimit,
               "activityId": event_data.activityId,
               "userIds": event_data.userIds,
               "childIds": event_data.childIds,
               "createdAt": event_data.createdAt,
               "updatedAt": event_data.updatedAt
           }
       )


       # Send the email notification to all users where emailNotificationsEnabled = True upon event creation
       users = await db.users.find_many(
           where={"emailNotificationsEnabled": True}
       )
       user_emails = [user.email for user in users]

       notif_batch = [
        {
            "title": f"New Event: {new_event.name}",
            "description": f"Check out our new event: {new_event.name}",
            "userId": u.id,
            "isRead": False,
            "time": new_event.date, 
        }
        for u in users
    ] 
       if notif_batch:
            await db.notifications.create_many(data=notif_batch)

       subject = f'Check Out Our New Event at Wonderhood: {new_event.name}'
       contents = f'Hello,\n\n Check out our new event at Wonderhood. We hope to see you there.\n\nBest,\n\nWonderHood Team'

       background_tasks.add_task(
           send_email_multiple_users,
           user_emails,
           subject,
           contents
       )

   except Exception as e:
       raise HTTPException(
           status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
           detail=f"Failed to create event: {str(e)}"
       )

   return {"event": new_event, "message": "Event created successfully"}




@router.get("", status_code=status.HTTP_200_OK)
async def get_all_events(
   # skip: int = 0,
   # limit: int = 10,
):
   """
   Get All Events


   Returns every event in the system
   Applies pagination
   """

   try:
       events = await db.events.find_many(
           # skip=skip,
           # take=limit,
           order={"createdAt": "desc"}
       )
       return {"events": events}

   except Exception as e:
       raise HTTPException(
           status_code=500,
           detail=f"Failed to fetch events: {str(e)}"
       )


@router.get("/{event_id}", status_code=status.HTTP_200_OK)
async def get_event_by_id(event_id: str):
   """
   Get Event by ID


   Fetches an event by its ID
   Hydrates the event with its user/children/activity data
   """

   try:
       # Fetch the event
       event = await db.events.find_unique(
           where={"id": event_id},
           include={
               "reviews": True,
               "users": True,
               "activity": True,
               "children": True
           }
       )

       if not event:
           raise HTTPException(
               status_code=status.HTTP_404_NOT_FOUND,
               detail="Event not found"
           )


       return event


   except Exception as e:
       raise HTTPException(
           status_code=500,
           detail=f"Failed to fetch event: {str(e)}"
       )


@router.patch("/{event_id}", status_code=status.HTTP_200_OK)
async def update_event(
    event_id: str,
    event_data: EventUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks,
):
    """
    Update Event and notify enrolled users/parents if date/time changed.
    """

    # --- auth / admin ---
    enforce_authentication(current_user, "update an event")
    enforce_admin(current_user, "update an event")

    # --- load existing ---
    event = await db.events.find_unique(where={"id": event_id})
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    # --- validate refs ---
    if event_data.userIds:
        users = await db.users.find_many(where={"id": {"in": event_data.userIds}})
        if len(users) != len(event_data.userIds):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="One or more user ids are invalid")

    if event_data.childIds:
        children = await db.children.find_many(where={"id": {"in": event_data.childIds}})
        if len(children) != len(event_data.childIds):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="One or more child ids is invalid")

    if event_data.activityId:
        activity = await db.activities.find_unique(where={"id": event_data.activityId})
        if not activity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Activity Id is invalid")

    # --- build payload ---
    update_payload: dict = {}
    if event_data.name is not None:          update_payload["name"] = event_data.name
    if event_data.description is not None:   update_payload["description"] = event_data.description
    if event_data.notes is not None:         update_payload["notes"] = event_data.notes
    if event_data.date is not None:          update_payload["date"] = event_data.date
    if event_data.image is not None:         update_payload["image"] = event_data.image
    if event_data.participants is not None:  update_payload["participants"] = event_data.participants
    if event_data.limit is not None:         update_payload["limit"] = event_data.limit
    if event_data.city is not None:          update_payload["city"] = event_data.city
    if event_data.state is not None:         update_payload["state"] = event_data.state
    if event_data.address is not None:       update_payload["address"] = event_data.address
    if event_data.zipCode is not None:       update_payload["zipCode"] = event_data.zipCode
    if event_data.latitude is not None:      update_payload["latitude"] = event_data.latitude
    if event_data.longitude is not None:     update_payload["longitude"] = event_data.longitude
    if event_data.startTime is not None:     update_payload["startTime"] = event_data.startTime
    if event_data.endTime is not None:       update_payload["endTime"] = event_data.endTime
    if event_data.volunteerLimit is not None:update_payload["volunteerLimit"] = event_data.volunteerLimit
    if event_data.activityId is not None:    update_payload["activityId"] = event_data.activityId
    if event_data.userIds is not None:       update_payload["userIds"] = event_data.userIds
    if event_data.childIds is not None:      update_payload["childIds"] = event_data.childIds
    update_payload["updatedAt"] = datetime.now(timezone.utc)

    # --- apply update ---
    updated_event = await db.events.update(
        where={"id": event_id},
        data=update_payload
    )

    # --- recipients: participants of the event + parents of the children ---
    user_ids: set[str] = set(event.userIds or [])
    if updated_event.childIds:
        kids = await db.children.find_many(where={"id": {"in": updated_event.childIds}})
        for ch in kids:
            # Will support different fields for communication with the parent.
            pid = getattr(ch, "userId", None) or getattr(ch, "parentId", None)
            # or list parentIds
            if not pid and getattr(ch, "parentIds", None):
                for p in ch.parentIds:
                    user_ids.add(p)
            if pid:
                user_ids.add(pid)
    user_ids = list(user_ids)

    # --- determine actual time/date changes ---
    date_changed  = ("date"      in update_payload) and (event.date      != updated_event.date)
    start_changed = ("startTime" in update_payload) and (event.startTime != updated_event.startTime)
    end_changed   = ("endTime"   in update_payload) and (event.endTime   != updated_event.endTime)


    # --- text for UI notifications ---
    changed_parts = []
    desc_lines = dict()

    if date_changed and (start_changed or end_changed):
        changed_parts.append("date")
        desc_lines["Date"] = format_us_date(updated_event.date)
        if start_changed:
            changed_parts.append("start time")
            desc_lines["start_time"] = format_us_time(updated_event.startTime)
        if end_changed:
            changed_parts.append("end time")
            desc_lines["end_time"] = format_us_time(updated_event.endTime)

    title = f"Event updated: {updated_event.name}"
    event_link = get_event_link(event.id)

    if start_changed and not end_changed:
        description = f'The time of the event has been updated {format_us_time(event.startTime)} → {desc_lines["start_time"]}.  You can see all updates here {event_link}. If you have any questions, please reply to info@whproject.org.'
    elif end_changed and not start_changed:
        description = f'The time of this event has been updated {format_us_time(event.endTime)} → {desc_lines["end_time"]}.  You can see all updates here {event_link}. If you have any questions, please reply to info@whproject.org.'
    elif date_changed and start_changed:
        description = f'The time and date of this event has been updated {format_us_time(event.startTime)} → {desc_lines["start_time"]} and the date of this event has been updated {format_us_date(event.date)} → {desc_lines["Date"]}. You can see all updates here {event_link}. If you have any questions, please reply to info@whproject.org.'
    elif date_changed and end_changed:
        description = f'The time and date of this event has been updated {format_us_time(event.endTime)} → {desc_lines["end_time"]} and the date of this event has been updated {format_us_date(event.date)} → {desc_lines["Date"]}. You can see all updates here {event_link}. If you have any questions, please reply to info@whproject.org.'
    elif date_changed and start_changed and end_changed:
        description = f'The time and date of this event has been updated. The start time has changed to {desc_lines["start_time"]}. The end time has changed to {desc_lines["end_time"]}. The date has changed to {desc_lines["Date"]}. You can see all updates here {event_link}. If you have any questions, please reply to info@whproject.org.'
    else:
        description = f'The event details have been updated. Please review the updated information in your WonderHood account. If you have any questions, please reply to info@whproject.org.'

    # --- create notifications in DB---
    now_utc = datetime.now(timezone.utc)
    try:
        await db.notifications.create_many(
            data=[
                {
                    "title": title,
                    "description": description,
                    "userId": uid,
                    "isRead": False,
                    "time": now_utc,  
                }
                for uid in user_ids
            ]
        )
    except Exception:
        # fallback — one by one, so as not to drop the entire request
        for uid in user_ids:
            try:
                await db.notifications.create(
                    data={
                        "title": title,
                        "description": description,
                        "userId": uid,
                        "isRead": False,
                        "time": now_utc,
                    }
                )
            except Exception:
                pass

    # # # --- mailing to the same users ---
    users_for_email = await db.users.find_many(where={
        "id": {"in": user_ids},
        "emailNotificationsEnabled": True
        })

    user_emails = [u.email for u in users_for_email]

    background_tasks.add_task(
        send_email_multiple_users,
        user_emails,
        title,
        description
    )

    return {"event": updated_event, "message": "Event updated successfully"}


@router.delete("/{event_id}", status_code=status.HTTP_200_OK)
async def delete_event_by_id(
   event_id: str,
   current_user: Annotated[User, Depends(get_current_user)],
   background_tasks: BackgroundTasks
):


   """
   Delete Event


   Verify authentication
   Verify admin status
   Verify that the event exists
   Delete the event
   """


   # Make sure the user is authenticated
   enforce_authentication(current_user, "delete an event")


   # Verify admin status
   enforce_admin(current_user, "delete an event")


   # Verify that the event exists
   event = await db.events.find_unique(
       where={"id": event_id},
       include={"users": True}
       )
   if not event:
       raise HTTPException(
           status_code=status.HTTP_404_NOT_FOUND,
           detail="Event not found"
       )


   # Get all the emails associated with an event as list
   users =  event.users
   user_emails = [user.email for user in users if user.emailNotificationsEnabled == True]


   # Send the email notification to users
   subject = f'Wonderhood: {event.name} Cancellation'
   contents = f'Hello,\n\nWe regret to inform you that the {event.name} event on {convert_iso_date_to_string(event.date)} has been cancelled. Please take a look at our website for upcoming events.\n\n Best,\n\n WonderHood Team'


   background_tasks.add_task(
       send_email_multiple_users,
       user_emails,
       subject,
       contents
   )


   # Delete the event
   await db.events.delete(where={"id": event_id})


   return {"message": "Event deleted successfully"}


@router.patch("/{event_id}/join", status_code=status.HTTP_200_OK)
async def add_user_to_event(
   event_id: str,
   current_user: Annotated[User, Depends(get_current_user)],
   background_tasks: BackgroundTasks
):


   """
   Add the current user to an existing event
   like a volunteer


   Verify authentication
   Fetch the event
   Check if user is already enrolled
   If not, add user to event
   Return success message
   """


   # Make sure the current user is authenticated
   enforce_authentication(current_user, "join an event")


   # Fetch the event
   event = await db.events.find_unique(where={"id": event_id})


   if not event:
       raise HTTPException(
           status_code=404,
           detail="Event not found")


   # Check if user is already enrolled
   if current_user.id in (event.userIds or []):
    raise HTTPException(
        status_code=400,
        detail="User is already enrolled"
    )


   # Add the user to the event
   updated_event = await db.events.update(
       where={"id": event_id},
       data={
           "users": {"connect": {"id": current_user.id}},
           "participants": {"increment": 1}
           }
       )


   # Create notification
   home_link = get_home_link()
   subject = f"Enrollment Confirmation: {event.name}"
   contents = f'This email confirms that you are enrolled for the {event.name} event on {convert_iso_date_to_string(event.date)}. If you are no longer available to join the event, please make changes by logging in to your account here, {home_link}, and navigating to the "Your Events" tab.\n\nBest,\n\nWondherhood Team'

   await db.notifications.create(
            data={
                "title": subject,
                "description": f"Confirmation for event {event.name}",
                "userId": current_user.id,
                "isRead": False,
                "time": event.date,
            }
        )
   if current_user.emailNotificationsEnabled == True:
            background_tasks.add_task(
                send_email_one_user,
                current_user.email,
                subject,
                contents
            )

            # Schedule the one-day reminder
            background_tasks.add_task(
                schedule_reminder,
                current_user.id,
                event_id,
                event.date
            )


   return {"event": updated_event, "message": "User added to event and notified"}


@router.patch("/{event_id}/enroll", status_code=status.HTTP_200_OK)
async def add_children_to_event(
   event_id: str,
   payload: EnrollChildren,
   current_user: Annotated[User, Depends(get_current_user)],
   background_tasks: BackgroundTasks
):


   """
   Add a child to an event


   Validate authentication
   Fetch the event
   Verify that current user is a parent of the child
   Check to see if child is already enrolled
   Add child to event
   Return success message
   """


   # Make sure the current user is authenticated
   enforce_authentication(current_user, "enroll a child in an event")


   # Fetch the event
   event = await db.events.find_unique(where={"id": event_id})
   if not event:
       raise HTTPException(
           status_code=404,
           detail="Event not found")


   incoming_ids = set(payload.childIds or [])
   existing_ids = set(event.childIds or [])


   to_add = list(incoming_ids - existing_ids)
   if not to_add:
       return {
           "event": event,
           "message": "No new children to enroll"
       }


   # validate existing children
   children = await db.children.find_many(
       where={"id": {"in": to_add}}
   )

   found_ids = {c.id for c in children}
   missing = set(to_add) - found_ids
   if missing:
       raise HTTPException(status_code=404, detail=f"Child not found: {', '.join(missing)}")


   # validate parenthood
   for c in children:
       if current_user.id not in (c.parentIds or []):
           raise HTTPException(
               status_code=403,
               detail="You are not the parent of this child."
           )
       
   # validate that the limit is not exceeded
   if (len(existing_ids) + len(incoming_ids)) > event.limit:
        raise HTTPException(
            status_code=400,
            detail="Number of participants exceeds limitation"
        )

   # Add children to event
   updated_event = await db.events.update(
       where={"id": event_id},
          data={
           "children": {"connect": [{"id": cid} for cid in to_add]},
           "participants": {"increment": len(to_add)}
           }
   )


   # Create notification
   home_link = get_home_link()
   subject = f'Enrollment Confirmation: {event.name}'
   content = f'Hello,\n\nThis email confirms that your child has been enrolled for the {event.name} event at Wonderhood for {convert_iso_date_to_string(event.date)}. If your child is no longer available to join the event, please make changes by logging in to your account here, {home_link}, and navigating to the "Your Events" tab.\n\nWe look forward to see you there!\n\nBest,\n\nWonderhood Team'

   await db.notifications.create(
            data= {
                "title": subject,
                "description": f"Confirmation for event {event.name}",
                "userId": current_user.id,
                "isRead": False,
                "time": event.date
            }
        )


   if current_user.emailNotificationsEnabled == True:
        background_tasks.add_task(
            send_email_one_user,
            current_user.email,
            subject,
            content
        )
        # Schedule the one-day reminder
        background_tasks.add_task(
            schedule_reminder,
            current_user.id,
            event_id,
            event.date
        )


   return {"event": updated_event, "message": "Children added to event and user notified"}


@router.patch("/{event_id}/leave", status_code=status.HTTP_200_OK)
async def remove_user_from_event(
   event_id: str,
   current_user: Annotated[User, Depends(get_current_user)],
   background_tasks: BackgroundTasks
):


   """
   Remove the current user from an event


   Verify authentication
   Fetch the event
   Check that user is enrolled
   Remove the user from the event
   Return success message
   """


   # Make sure the current user is authenticated
   if not current_user:
       raise HTTPException(
           status_code=status.HTTP_401_UNAUTHORIZED,
           detail=f"Unauthorized. You must be authenticated to delete an event."
       )


   # Fetch the event
   event = await db.events.find_unique(where={"id": event_id})


   if not event:
       raise HTTPException(
           status_code=404,
           detail="Event not found")


   # Check if user is enrolled
   if current_user.id not in event.userIds:
       raise HTTPException(
           status_code=400,
           detail="User is not enrolled"
       )


   # ! Create logic for deleting the previous notification?


   # Send notification to User that they have been removed from event
   if current_user.emailNotificationsEnabled == True:
        subject = f'Unenrollment Confirmation: {event.name}'
        content = f'Hello,\n\nThis email confirms that you have been unenrolled from the {event.name} event at Wonderhood on {convert_iso_date_to_string(event.date)}.\n\nBest,\n\nWonderHood Team'


        background_tasks.add_task(
            send_email_one_user,
            current_user.email,
            subject,
            content
            )
        await db.notifications.create(
                data={
                    "title": subject,
                    "description": f"You have been unenrolled from {event.name} on {convert_iso_date_to_string(event.date)}.",
                    "userId": current_user.id,
                    "isRead": False,
                    "time": event.date, 
                }
            )


   # Remove the user from the event
   updated_user_list = [uid for uid in event.userIds if uid != current_user.id]


   updated_event = await db.events.update(
       where={"id": event_id},
         data={
           "userIds": updated_user_list,
           "participants": {"decrement":1}
           }
   )


   return {"event": updated_event, "message": "User removed from event"}



@router.patch("/{event_id}/unenroll", status_code=status.HTTP_200_OK)
async def remove_child_from_event(
   event_id: str,
   # child_id: str,
   payload: EnrollChildren,
   current_user: Annotated[User, Depends(get_current_user)],
   background_tasks: BackgroundTasks
):


   """
   Remove a child from an event


   Validate authentication
   Fetch the event
   Verify that current user is a parent of the child
   Confirm that the child is enrolled
   Remove child from event
   Return success message
   """


   # Make sure the current user is authenticated
   enforce_authentication(current_user, "unenroll a child from an event")


   # Fetch the event
   event = await db.events.find_unique(where={"id": event_id})
   if not event:
       raise HTTPException(
           status_code=404,
           detail="Event not found")


   selected_ids = set(payload.childIds or [])
   if not selected_ids:
       return {
           "event": event,
           "message": "No children selected to unenroll"
       }


   existing_ids = set(event.childIds or [])


   to_remove = list(selected_ids & existing_ids)
   if not to_remove:
       return {
           "event": event,
           "message": "Selected children are not enrolled"
       }


   # validate existing children
   children = await db.children.find_many(
       where={"id": {"in": to_remove}}
   )
   found_ids = {c.id for c in children}
   missing = set(to_remove) - found_ids
   if missing:
       raise HTTPException(status_code=404, detail=f"Child not found: {', '.join(missing)}")


   # validate parenthood
   for c in children:
       if current_user.id not in (c.parentIds or []):
           raise HTTPException(
               status_code=403,
               detail="You are not the parent of this child."
           )


   # Remove child from event
   updated_child_list = [cid for cid in (event.childIds or []) if cid not in to_remove]


   updated_event = await db.events.update(
       where={"id": event_id},
        data={
           "children": {"disconnect": [{"id": cid} for cid in to_remove]},
           "childIds": updated_child_list,
           "participants": {"decrement": len(to_remove)}
           }
   )


   # Notification to user for unenrolling child
   subject = f'Unenrollment Confirmation: {event.name}'
   content = f'Hello,\n\nThis email confirms that your child has been unenrolled from the {event.name} on {convert_iso_date_to_string(event.date)}. Please find more events on our website.\n\nBest,\n\nWonderHood Team'
        
   await db.notifications.create(
        data={
            "title": subject,
            "description": f"Your child has been unenrolled from {event.name} on {convert_iso_date_to_string(event.date)}.",
            "userId": current_user.id,
            "isRead": False,
            "time": event.date, 
            }
        )
        # Send notification e-mail
   if current_user.emailNotificationsEnabled == True:
        background_tasks.add_task(
                send_email_one_user,
                current_user.email,
                subject,
                content
            )

   # ! Add logic to delete notification?

   return {"event": updated_event, "message": f"Removed {len(to_remove)} child(ren) from event"}


@router.get("/{event_id}/surveys", status_code=status.HTTP_200_OK)
async def send_event_email_survey(
    event_id:str,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks
):
    """
        check for enrolled participants of an event -> get the parents of the children -> check if event date passed -> send survey email
    """
    # Enforce admin
    enforce_admin(current_user, "Send survey to enrolled users of an event")
    
    #! Query children from users DOES NOT WORK
    # users = await db.users.find_many(
    #     include={
    #         "children":
    #             "include"= {
    #                 "events": True
    #         }
    #     }
    # )

    try:
        event = await db.events.find_unique(
        where={"id": event_id},
        include={"children": {
                        "include":{
                        "parents": True
                        }
                        }
                    }
        )


        if not event:
            raise HTTPException(status_code=404, detail="Unable to obtain event")


        # Add the parent IDs to a set
        parent_ids = set()
        for child in event.children:
            parent_ids.update(child.parentIds)


        # Query for the parents' email(s)
        parent_emails = list()
        for id in parent_ids:
            users = await db.users.find_unique(
                where={
                    "id": id
                    }
            )
            if users:
                parent_emails.append(users.email)

        
        # Create the notifications for the UI
        title= ""
        description=f''

        notification_data = [
            {
            "title": title,
            "description": description,
            "userId": id,
            "isRead": False,
            "time": event.date,
            }
            for id in parent_ids
        ]

        new_notification = await db.notifications.create_many(
        data=notification_data
        )

        # Send the email -> not optimized because we are iterating/querying over parent_emails
        for email in parent_emails:
            user_enabled_notifications = await db.users.find_unique(
                where={
                    "email": email,
                    "emailNotificationsEnabled": True
                }
            )

            if user_enabled_notifications:
                background_tasks.add_task(
                    send_email_one_user,
                    user_enabled_notifications.email,
                    title,
                    description
                )

        return {
            "message": "Notification successfully sent to all parents",
            "notification": new_notification
            }

    except Exception as e:


########### * Review endpoint(s) ###############


@router.get("/{event_id}/reviews", status_code=status.HTTP_200_OK)
async def get_all_reviews_by_event(
   event_id: str,
   skip: int = 0,
   limit: int = 10
):


   """
   GET all paginated reviews for an event
   """


   try:
       reviews = await db.reviews.find_many(
           where={ "eventId": event_id},
            # TODO Ensure pagination is working
               skip=skip,
               take=limit
       )


       if not reviews:
           raise HTTPException(
               status_code=status.HTTP_404_NOT_FOUND,
               detail="Reviews not found"
           )


       return {"reviews": reviews}


   except Exception as e:
       raise HTTPException(
           status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
           detail="Failed to obtain reviews"
       )


@router.get('/{event_id}/review/{review_id}', status_code=status.HTTP_200_OK)
async def get_review_by_id(
    event_id: str,
    review_id: str,
   #  current_user: Annotated[User, Depends(get_current_user)]
   ):


   """
    Get review by id
   """


   try:
       # Get a review
       review = await db.reviews.find_unique(
           where={
               "id": review_id,
           }
       )


       if not review or review.eventId != event_id:
           raise HTTPException(
               status_code=status.HTTP_404_NOT_FOUND,
               detail="Review not found for this event"
           )


       return {"review": review}


   except Exception:
       raise HTTPException(
           status_code=500,
           detail="Failed to obtain review"
       )


@router.post("/{event_id}/reviews", status_code=status.HTTP_201_CREATED)
async def create_review(
    event_id: str,
    review_data: ReviewCreate,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
       Create Review


       Get the current user for authentication and create review
    """


    enforce_authentication(current_user, "leave a review")


    event = await db.events.find_unique(
           where={"id": event_id}
       )


    if not event:
       raise HTTPException(
           status_code=status.HTTP_404_NOT_FOUND,
           detail="Event not found"
       )




   # ! Do we need to add logic for preventing one user making many reviews?
    existing_review = await db.reviews.find_first(
        where={
            "eventId": event_id,
            "parentId": current_user.id
           }
    )


    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User cannot make more than one review for an event."
        )


    try:
         review = await db.reviews.create(
              data={
                   "eventId": review_data.eventId,
                   "parentId": current_user.id,
                   "rating": review_data.rating,
                   "description": review_data.description,
                   "createdAt": datetime.utcnow()
              }
         )
         return {
           "review": review,
           "message": "Review successfully made"
           }


    except Exception as e:
         raise HTTPException(
              status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
              detail=f'Failed to create review: {e}'
         )


########### * Notification endpoint(s) ###############
# Have admin send a message to the users of enrolled children
@router.post("/{event_id}/notification/enrolled_users_child", status_code=status.HTTP_200_OK)
async def send_message_to_users_of_enrolled_child(
   current_user: Annotated[User, Depends(get_current_user)],
   event_id:str,
   notification: NotificationCreate,
   background_tasks: BackgroundTasks
):
   """
       Send a message to users of enrolled children
       Authentication and Admin Role Required
   """


   # Check for admin
   enforce_authentication(current_user, "send notification")


   enforce_admin(current_user, "send notification")


   # Query for the parents of children
   event = await db.events.find_unique(
       where={"id": event_id},
       include={"children": {
                    "include":{
                       "parents": True
                       }
                    }
                }
   )


   if not event:
       raise HTTPException(status_code=404, detail="Unable to obtain event")


   # Add the parent IDs to a set
   parent_ids = set()
   for child in event.children:
       parent_ids.update(child.parentIds)


   if not parent_ids:
       raise HTTPException(status_code=404, detail="Unable to obtain parent ids")


   # Query for the parents' email(s)
   parent_emails = list()
   for id in parent_ids:
       users = await db.users.find_unique(
           where={
               "id": id
               }
       )
       if users:
        parent_emails.append(users.email)

   # Create the notifications for the UI
   notification_data = [
       {
       "title": notification.title,
       "description": notification.description,
       "userId": id,
       "isRead": False,
       "time": event.date,
       }
       for id in parent_ids
   ]


   new_notification = await db.notifications.create_many(
       data=notification_data
   )

   # Send the email -> not optimized because we are iterating/querying over parent_emails
   for email in parent_emails:
    user_enabled_notifications = await db.users.find_unique(
        where={
            "email": email,
            "emailNotificationsEnabled": True
        }
    )

    if user_enabled_notifications:
        background_tasks.add_task(
               send_email_one_user,
               user_enabled_notifications.email,
               notification.title,
               notification.description
        )



   return {
       "message": "Notification successfully sent to all parents",
       "notification": new_notification
           }


# Have admin send a message to the users enrolled in  an event
@router.post("/{eventId}/notification/enrolled_user", status_code=status.HTTP_200_OK)
async def send_enrolled_user_notification(
   eventId: str,
   subject: str,
   content: str,
   # icon: str,
   current_user: Annotated[User, Depends(get_current_user)],
   background_tasks: BackgroundTasks
):
   """
       Send notifications to all users enrolled in an event
   """


   enforce_authentication(current_user, "create notification")
   enforce_admin(current_user, "create notification")


   # Find event
   event = await db.events.find_unique(
       where={"id": eventId}
   )

   if not event:
       raise HTTPException(status_code=404, detail="Unable to locate event")


   # Create notification instance
   notification_data = [
       {
       "title": subject,
       "description": content,
       "userId": id,
       "isRead": False,
       "time": event.date,
       # "icon": icon
       }
       for id in event.userIds
   ]


   notification = await db.notifications.create_many(
       data=notification_data
   )


   # create email notification
   users_emails = list()
   for id in event.userIds:
       users = await db.users.find_unique(
           where={
               "id":id,
               "emailNotificationsEnabled": True
               }
       )
       if users:
        users_emails.append(users.email)


   background_tasks.add_task(
       send_email_multiple_users,
       users_emails,
       subject,
       content
   )


   return {
       "Message": "Notification successfully made",
       "Notification": notification
       }


########### * Volunteer endpoint(s) ###############
# for specific event, when volunteer enrolls --> volunteer is added to event and volunteerLimit counter decrements
@router.patch("/{event_id}/volunteer_signup", status_code=status.HTTP_200_OK)
async def volunteer_signup_for_event(
   current_user: Annotated[User, Depends(get_current_user)],
   event_id: str,
   background_tasks: BackgroundTasks
):
   """
   For specific event, volunteer is added to event when enrolled and volunteerLimit counter decrements
       return event
   """


   # validate current user
   enforce_authentication(current_user)


   # validate existing event
   event = await db.events.find_unique(where={"id": event_id })
   if not event:
       raise HTTPException(status_code=401, detail="Unable to locate event")


   # Validate volunteer exists and is approved
   volunteer = await db.volunteers.find_unique(where={"userId": current_user.id})
   if not volunteer:
       raise HTTPException(status_code=401, detail="Unable to locate volunteer")


   if volunteer.status != "Approved":
       raise HTTPException(status_code=400, detail="Volunteer is not approved to sign up for an event")

   # Validate whether volunteer is already enrolled
   if volunteer.id in event.volunteerIds:
       raise HTTPException(status_code=400, detail="Volunteer is already enrolled to the event")


   try:
       volunteer_signup_event = await db.events.update(
               where={"id": event_id },
               data={
                   "volunteers": {"connect": {"id": volunteer.id}},
                   "volunteerLimit": {"decrement": 1}
               }
           )

       title = f"Volunteer Enrollment Confirmation: {event.name}"
       # ? ADD link to make changes still
       description = f'This email confirms that you are enrolled as a volunteer for the {event.name} event on {convert_iso_date_to_string(event.date)}. If you are no longer available to volunteer at the event, please contact us at info@whproject.org.\n\nBest,\n\nWondherhood Team'

       notification_data =  {
               "title": title,
               "description": description,
               "userId": current_user.id,
               "isRead": False,
               "time": datetime.now(timezone.utc)
           }

       new_notification = await db.notifications.create(
               data=notification_data
           )

       if current_user.emailNotificationsEnabled == True:
            background_tasks.add_task(
                    send_email_one_user,
                    volunteer.email,
                    title,
                    description
                )




       return {
               "Event": volunteer_signup_event,
               "Notification": new_notification,
               "Message": "Volunteer added to event"
               }
   except Exception as e:
       raise HTTPException(status_code=500, detail=f"Unable to enroll volunteer:{e}")




@router.patch("/{event_id}/unenroll_volunteer", status_code=status.HTTP_200_OK)
async def unenroll_volunteer_from_event(
   current_user: Annotated[User, Depends(get_current_user)],
   event_id: str,
   background_tasks: BackgroundTasks
):
   """
       Authenticate the user
       Validate the event and the volunteer
       Unenroll the volunteer from the event and increment Event volunteerLimit attribute
       Notify the volunteer they have been unenrolled
       return updated event
   """


   # Authenticate the user
   enforce_authentication(current_user)


   # Validate the event:
   event = await db.events.find_unique(where={"id": event_id })
   if not event:
       raise HTTPException(status_code=401, detail="Unable to locate event")


   # Validate the Volunteer
   volunteer = await db.volunteers.find_unique(where={"userId": current_user.id})
   if not volunteer:
       raise HTTPException(status_code=401, detail="Unable to locate volunteer")


   if volunteer.status != "Approved":
       raise HTTPException(status_code=400, detail="Volunteer is not approved to sign up for an event")


   # Validate that the volunteer is signed up to the event
   if volunteer.id not in event.volunteerIds:
       raise HTTPException(status_code=400, detail="Volunteer is not enrolled to the event")

   try:
       volunteer_unenroll_event = await db.events.update(
               where={"id": event_id },
               data={
                   "volunteers": {"disconnect": {"id": volunteer.id}},
                   "volunteerLimit": {"increment": 1}
               }
           )

       title = f"Volunteer Unenrollment Confirmation: {event.name}"
       # ? ADD link to make changes still
       description = f'This email confirms that you are unenrolled as a volunteer for the {event.name} event on {convert_iso_date_to_string(event.date)}.\n\nBest,\n\nWondherhood Team'

       notification_data =  {
               "title": title,
               "description": description,
               "userId": current_user.id,
               "isRead": False,
               "time": datetime.now(timezone.utc)
           }

       new_notification = await db.notifications.create(
               data=notification_data
           )

       if current_user.emailNotificationsEnabled == True:
            background_tasks.add_task(
                    send_email_one_user,
                    volunteer.email,
                    title,
                    description
                )

       return {
           "Event": volunteer_unenroll_event,
           "Notification": new_notification
       }

   except Exception as e:
       raise HTTPException(
           status_code=500,
           detail=f"Unable to remove volunteer from event: {e}"
       )
