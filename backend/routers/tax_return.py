from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from db.prisma_client import db
from typing import Annotated
from models.user_models import User
from models.interaction_models import TaxReturnCredentialsCreate, TaxReturnCredentialsUpdate
from .auth.login import get_current_user
from .auth.utils import enforce_admin, enforce_authentication
from .notifications import send_email_one_user
from datetime import datetime

router = APIRouter()

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_tax_return_credentials(
    tax_return_data: TaxReturnCredentialsCreate,
    background_tasks: BackgroundTasks
):
    
    """
        Collect information from any user that wants to obtain a tax return acknolwedgment \n
        Send an email to user upon succesful request creation\n
        Return {status: successful}
    """

    # ? Does a user have to fill the waiver everytime they make a donation?

    # Check if request is already on file
    existing_tax_return = await db.taxreturncredentials.find_unique(
        where={"donationId": tax_return_data.donationId}
    )

    if existing_tax_return:
        raise HTTPException(
            status_code=400,
            detail="The tax return info is already on file for the user"
        )

    try:
        data = tax_return_data.model_dump()

        new_tax_return = await db.taxreturncredentials.create(
            data={
                **data,
                "donationId": tax_return_data.donationId
            }
        )

        # Create notification and send email
        subject = f'We Got Your Tax Return Request 📒'
        contents = f'Hello,\n\nWe appreciate your generosity and our team will process your request as soon as possible. In the meantime, please check out all that we do on our About page. \n\nBest,\n\nWonderhood Team'

        background_tasks.add_task(
           send_email_one_user,
           tax_return_data.email,
           subject,
           contents
       )

        await db.notifications.create(
           data={
               "title": subject,
               "description": "Tax return confirmation",
               "isRead": False
           }
       )
        
        return {"status": f"Successfully created tax return instance: {new_tax_return}"}
    
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
    
@router.patch("{tax_return_id}/update-sent")
async def update_sent_status(
    tax_return_id: str,
    tax_return_data: TaxReturnCredentialsUpdate,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
        Only allow admins (authenticate and authorize)\n
        Primarily used to update the tax_return sent status from 'false' to 'true'\n
        May be used to edit tax return request credentials\n
        return {"success": updated_instance}
    """

    # Authenticate and authorize
    enforce_authentication(current_user)
    enforce_admin(current_user)

    # Check if the tax return instance exists
    existing_request = await db.taxreturncredentials.find_unique(
        where={"id": tax_return_id}
    )

    if not existing_request:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to find user's tax request"
        )
    
    # Handle update below:
    payload = tax_return_data.model_dump(exclude_unset=True)
    payload["updatedAt"] = datetime.utcnow()

    try:
        updated_request = await db.taxreturncredentials.update(
            where={"id": tax_return_id},
            data = payload
        )

        return {"success": updated_request}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to update request: {e}"
        )