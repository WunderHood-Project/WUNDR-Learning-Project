from fastapi import APIRouter, status, HTTPException, Depends
from pydantic import BaseModel, field_validator, ConfigDict
from db.prisma_client import db
from typing import Annotated, Optional, List
from models.user_models import User, Child, Role, UserUpdateRequest, UserResponse, UserUpdateResponse
from models.interaction_models import Event, Review, Notification
from datetime import datetime
from .auth.login import get_current_active_user, get_current_active_user_by_email
from .auth.utils import hash_password, enforce_authentication


router = APIRouter()

# Rebuild models to ensure all references are resolved
UserResponse.model_rebuild()
User.model_rebuild()
UserUpdateResponse.model_rebuild()

@router.get("/", response_model=List[UserResponse])
async def get_all_users():
    # MAY NEED TO ADD PAGINATION
    """
    Get all users from the database.

    Returns:
        List[UserResponse]: List of all users
    """
    try:
        all_users = await db.users.find_many(
            include={
                "children": True
            }
        )
        return all_users
    except HTTPException as e:
        print(f"Error fetching users: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to obtain user profiles"
        )

# get select user
@router.get("/me", response_model=UserResponse)
async def get_current_user(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """
    Get the current authenticated user's information.

    Returns:
        UserResponse: Current user's profile information
    """

    enforce_authentication(current_user, "view your information")

    try:
        user = await db.users.find_unique(
            where={
                "id": current_user.id
            },
            include={
                "children": True  # Fixed: removed = in dictionary syntax
            }
        )

        # Handle case where user is not found (shouldn't happen with valid auth)
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return user

    except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
    except Exception as e:
            print(f'Error fetching user: {e}')
            raise HTTPException(
                status_code=500,
                detail="Failed to obtain user profile"
            )


@router.patch("/", response_model=UserUpdateResponse)
async def update_user(
    update_data: UserUpdateRequest,
    current_user = Depends(get_current_active_user_by_email)
):
    """
    Update the current user's profile information.

    - **firstName**: Update first name (1-50 characters)
    - **lastName**: Update last name (1-50 characters)
    - **email**: Update email address (must be valid email format)
    - **role**: Update user role
    - **avatar**: Update avatar URL
    - **password**: Update password (will be hashed)
    - **city**: Update city (2-50 characters)
    - **state**: Update state (2-50 characters)
    - **zipCode**: Update zip code
    """

    enforce_authentication(current_user, "update your information")

    try:
        # Create a dictionary of fields to update (exclude None values)
        update_fields = {
            field: value
            for field, value in update_data.model_dump(exclude_unset=True).items() if value is not None
        }

        # If no fields to update, return early
        if not update_fields:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields provided for update"
            )

        # Special handling for password - should be hashed
        if 'password' in update_fields:
            update_fields['password'] = hash_password(update_fields['password'])

        # Add updated timestamp to database update
        update_fields['updatedAt'] = datetime.utcnow()

        # Check if email is being updated and if it's already taken
        if 'email' in update_fields and update_fields['email'] != current_user.email:
            existing_user = await db.users.find_unique(
                where={"email": update_fields['email']}
            )
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email address is already registered"
                )

        # Update user in database using Prisma syntax
        updated_user = await db.users.update(
            where={"id": current_user.id},
            data=update_fields
        )

        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # **Convert ORM → Pydantic here:**
        user_resp = UserResponse.from_orm(updated_user)

        return UserUpdateResponse(
            message="User profile updated successfully",
            # user=user_instance
            user = user_resp
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating user: {str(e)}"
        )

# Rebuild models to ensure all references are resolved
UserUpdateResponse.model_rebuild()


#  Delete a user endpoint
@router.delete("/")
async def delete_user(
    current_user: Annotated[User, Depends(get_current_active_user)]
):

    enforce_authentication(current_user, "delete your profile")

    try:
        deleted_user = await db.users.delete(
                where={"id": current_user.id}
            )
        if deleted_user:
            return "User profile deleted successfully"

        else:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
    except HTTPException:
        raise
    except HTTPException as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to delete user profile"
        )
