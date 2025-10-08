from fastapi import APIRouter, status, Depends, HTTPException, Security
from db.prisma_client import db
from typing import Annotated
from models.interaction_models import ActivityCreate, ActivityUpdate
from models.user_models import User
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication


router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_activity(
    activity_data: ActivityCreate,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Create Activity

    Get the current user to verify authentication
    Verify admin status
    Check to see if an activity already exists with this name
    Create the activity:
    - **name**: The name of the activity
    - **description**: A brief description of the activity
    Return the activity
    """

    # Make sure the user is authenticated
    enforce_authentication(current_user, "create an activity")

    # Verify admin status
    enforce_admin(current_user, "create an activity")

    # Check to see if an activity with this name already exists
    existing_activity = await db.activities.find_unique(
        where={"name": activity_data.name}
    )

    if existing_activity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An activity with this name already exists"
        )

    # Create and return the activity
    try:
        created_activity = await db.activities.create(
            data={
                "name": activity_data.name,
                "description": activity_data.description
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"failed to create activity: {str(e)}"
        )

    return {"activity": created_activity, "message": "Activity created successfully"}


@router.get("", status_code=status.HTTP_200_OK)
async def get_all_activities():

    """
    Get All Activities

    Fetches all activities from the database
    Returns: "activities": {activities}
    """

    try:
        activities = await db.activities.find_many(
            include={"events": True}
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch activities: {str(e)}"
        )

    return {"activities": activities}


@router.get("/with-events", status_code=200)
async def get_all_activities_with_events():
    """
    Get all Activities with their associated Events
    
    Returns a list of activites, each bundled with its events
    """
    
    try:
        activities = await db.activities.find_many(
            include={"events": True},
            order={"name": "asc"} # order alphabetically??
        )
        
        return {"activities": activities}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch activities with events: {str(e)}"
        )


@router.get("/{activity_id}", status_code=status.HTTP_200_OK)
async def get_activity(activity_id: str):

    """
    Get Activity by ID

    Fetches an activity using its ID
    Returns: the activity
    """

    activity = await db.activities.find_unique(
        where={"id": activity_id},
        include={"events": True}
    )

    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    return activity


@router.put("/{activity_id}", status_code=status.HTTP_200_OK)
async def update_activity(
    activity_id: str,
    activity_data: ActivityUpdate,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Update Activity

    Get the current user to verify authentication
    Verify admin status
    Check if an activity with the provided name already exists
    Update fields if provided:
    - **name**: The new name of the activity
    - **description**: The new description of the activity
    Returns: the updated activity
    """

    # Get the current user to verify authentication
    enforce_authentication(current_user, "update an activity")

    # Verify admin status
    enforce_admin(current_user, "update an activity")

    # Check to make sure an activity with this name does not already exist
    if activity_data.name:
        existing_activity = await db.activities.find_unique(where={"name": activity_data.name})
        if existing_activity and existing_activity.id != activity_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Another activity with this name already exists"
            )

    # Update and return the activity
    try:
        updated_activity = await db.activities.update(
            where={"id": activity_id},
            data=activity_data.dict(exclude_unset=True)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update activity: {str(e)}"
        )

    return {"activity": updated_activity, "message": "Activity updated successfully"}


@router.delete("/{activity_id}", status_code=status.HTTP_200_OK)
async def delete_activity(
    activity_id: str,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Delete Activity

    Get the current user to verify authentication
    Delete the activity from the database
    returns: success message
    """

    print("DELETE ROUTE CURRENT USER", current_user)

    # Verify authentication
    enforce_authentication(current_user, "delete an activity")

    # Verify admin status
    enforce_admin(current_user, "delete an activity")

    # Delete the activity
    try:
        await db.activities.delete(
            where={"id": activity_id}
        )

    except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete activity: {str(e)}"
            )

    return {"message": "Activity  deleted successfully"}


# ! Add Event to Activity (??)
