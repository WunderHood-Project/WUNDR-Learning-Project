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
    tax_return_data: TaxReturnCredentialsCreate
):
    
    """
        Collect information from any user that wants to obtain a tax return acknolwedgment \n
        Return {status: successful}
    """

    # ? Does a user have to fill the waiver everytime they make a donation?

    # Check if waiver already on file
    existing_tax_return = await db.taxreturncredentials.find_unique(
        where={"email": tax_return_data.email}
    )

    if existing_tax_return:
        raise HTTPException(
            status_code=400,
            detail="The tax return info is already on file for the user"
        )

    try:
        data = tax_return_data.model_dump()

        new_waiver = await db.taxreturncredentials.create(
            data={
                **data
            }
        )
        
        return {"status": f"Successfully created tax return instance: {new_waiver}"}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail= f"Failed to create tax return instance: {str(e)}"
        )

@router.get("/user-tax-return", status_code=200)
async def get_unique_user_waiver_credentials(
    current_user: Annotated[User, Depends(get_current_user)],
    tax_return_id: str
    ):
    
    """
        Retrieve tax return acknowledgement information on a specific user \n
        Only admin should be able to get this information (enforce auth and admin)
        return the selected user's info

    """

    enforce_authentication(current_user)
    enforce_admin(current_user)


    try:
        user_tax_return_info = await db.taxreturncredentials.find_unique(
            where={"id": tax_return_id}
        )

        return {"Tax Return Info": user_tax_return_info}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to find the user's tax return credentials"
        )
    
@router.get("/all-users", status_code=200)
async def get_all_users_tax_return_credentials(
    current_user: Annotated[User, Depends(get_current_user)]
    ):
    
    """
        Retrieve tax return information on all users \n
        Only admin should be able to get this information (enforce auth and admin)
        return the selected user's info

    """

    enforce_authentication(current_user)
    enforce_admin(current_user)


    try:
        users_tax_return_info = await db.taxreturncredentials.find_many()

        return {"Tax Return Info": users_tax_return_info}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to find users' tax return credentials"
        )