from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from db.prisma_client import db
from typing import Annotated
from models.user_models import User
from models.interaction_models import TaxReturnCredentialsCreate
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication

router = APIRouter()

# * May want to add emaill notifications about filling out waiver

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_tax_return_credentials(
    waiver_data: TaxReturnCredentialsCreate
):
    
    """
        Collect information from any user that wants to fill out a 1024-waiver \n
        Return {status: successful}
    """

    # ? Does a user have to fill the waiver everytime they make a donation?

    # Check if waiver already on file
    existing_waiver = await db.waivercredentials.find_unique(
        where={"email": waiver_data.email}
    )

    if existing_waiver:
        raise HTTPException(
            status_code=400,
            detail="The waiver is already on file for the user"
        )

    try:
        data = waiver_data.model_dump()

        new_waiver = await db.waivercredentials.create(
            data={
                **data
            }
        )
        
        return {"status": f"Successfully created waiver instance: {new_waiver}"}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail= f"Failed to create waiver instance: {str(e)}"
        )

@router.get("/user-waiver", status_code=200)
async def get_unique_user_waiver_credentials(
    current_user: Annotated[User, Depends(get_current_user)],
    waiver_id: str
    ):
    
    """
        Retrieve 1024-waiver information on a specific user \n
        Only admin should be able to get this information (enforce auth and admin)
        return the selected user's info

    """

    enforce_authentication(current_user)
    enforce_admin(current_user)


    try:
        user_waiver_info = await db.waivercredentials.find_unique(
            where={"id": waiver_id}
        )

        return {"Waiver Info": user_waiver_info}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to find the user's waiver credentials"
        )
    
@router.get("/all-users", status_code=200)
async def get_all_users_waivers_credentials(
    current_user: Annotated[User, Depends(get_current_user)]
    ):
    
    """
        Retrieve 1024-waiver information on a specific user \n
        Only admin should be able to get this information (enforce auth and admin)
        return the selected user's info

    """

    enforce_authentication(current_user)
    enforce_admin(current_user)


    try:
        users_waiver_info = await db.waivercredentials.find_many()

        return {"Waiver Info": users_waiver_info}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to find users' waiver credentials"
        )