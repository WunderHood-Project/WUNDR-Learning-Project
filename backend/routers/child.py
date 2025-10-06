from fastapi import APIRouter, status, Depends, HTTPException
from db.prisma_client import db
from typing import Annotated
from models.user_models import User, ChildCreate, ChildUpdate, EmergencyContactCreate, EmergencyContactUpdate
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from .auth.login import get_current_user
from .auth.utils import enforce_authentication, enforce_admin


router = APIRouter()


# ! Create Child
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_child(
    # apply Pydantic model for data validation
    child_data: ChildCreate,
    current_user: Annotated[User, Depends(get_current_user)]

):
    # Make sure the user is authenticated
    enforce_authentication(current_user, "add a child")

    # Add the child
    try:
        async with db.tx() as tx:
            # create child
            created_child = await tx.children.create(
                data={
                    "firstName": child_data.firstName,
                    "lastName": child_data.lastName,
                    "preferredName": child_data.preferredName,
                    "homeschool": child_data.homeschool,
                    "grade": child_data.grade,
                    "birthday": child_data.birthday,
                    "allergiesMedical": child_data.allergiesMedical,
                    "notes": child_data.notes,
                    "waiver": child_data.waiver,
                    "photoConsent": child_data.photoConsent,
                    "parentIDs": [current_user.id], # Add the current user's ID to parentIDs
                    "eventIDs": [], # Create activityIDs array so we can easily add to it later
                    "createdAt": child_data.createdAt,
                    "updatedAt": child_data.updatedAt
                },
            )

            # create/link emergency contacts
            contacts: list = []
            contact_ids: list[str] = []
            for ec in getattr(child_data, "emergencyContacts", []):
                existing_contact = await tx.emergencycontact.find_first(
                    where={
                        "firstName": ec.firstName,
                        "lastName": ec.lastName,
                        "phoneNumber": ec.phoneNumber
                    }
                )

                if existing_contact:
                    if created_child.id in existing_contact.childIDs:
                        contacts.append(existing_contact)
                        contact_ids.append(existing_contact.id)
                    else:
                        updated_contact = await tx.emergencycontact.update(
                            where={"id": existing_contact.id},
                            data={
                                "childIDs": existing_contact.childIDs + [created_child.id],
                                "relationship": ec.relationship
                            }
                        )
                        contacts.append(updated_contact)
                        contact_ids.append(updated_contact.id)
                else:
                    new_contact = await tx.emergencycontact.create(
                        data={
                            "firstName": ec.firstName,
                            "lastName": ec.lastName,
                            "phoneNumber": ec.phoneNumber,
                            "relationship": ec.relationship,
                            "childIDs": [created_child.id]
                        }
                    )
                    contacts.append(new_contact)
                    contact_ids.append(new_contact.id)

            # attach contacts to child and fetch with include
            if contact_ids:
                created_child = await tx.children.update(
                    where={ "id": created_child.id },
                    data={ "emergencyContactIDs": { "set": contact_ids } },
                    include={ "emergencyContacts": True, "parents": True }
                )
            else:
                created_child = await tx.children.find_unique(
                    where={ "id": created_child.id},
                    include={ "emergencyContacts": True, "parents": True }
                )

            # Once we create the child, update the current user to include the new child
            updated_user = await tx.users.update(
                where={"id": current_user.id},
                data={ "childIDs": { "push": created_child.id } },
                include={ "children": True }
            )

        return {
            "child": created_child,
            "parent": updated_user,
            "emergencyContacts": contacts,
            "message": "Child added successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create child and emergency contacts: {str(e)}"
        )


# ! Get Children of the Current User
@router.get("/current", status_code=status.HTTP_200_OK)
async def get_children(
    current_user: Annotated[User, Depends(get_current_user)]
):
    # print("current_user:", getattr(current_user, "id", None))

    enforce_authentication(current_user, "view your children.")

    children = await db.children.find_many(
        where={
            "parentIDs":{
                "has": current_user.id
            }
        },
        include={"emergencyContacts": True, "parents": True}

    )
    return children


# ! Get Child by ID
@router.get("/{child_id}", status_code=status.HTTP_200_OK)
async def get_child_by_id(
    child_id: str,
    # Get the current user for security
    current_user: Annotated[User, Depends(get_current_user)]
):

    enforce_authentication(current_user, "access your child's information")

    child = await db.children.find_unique(
        where={"id": child_id},
        include={
            # Include the child's parents and their events
            "parents": True,
            "events": True,
            "emergencyContacts": True
        }
    )

    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Child not found."
        )

    # If the current user is not a parent of the child, throw a 403
    if current_user.id not in child.parentIDs:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You are not a parent of this child."
        )

    return child

# ! Get children of an event
@router.get("/event", status_code=status.HTTP_200_OK)
async def get_children_of_event(
    eventId: str,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
        Get the children for an event
        Is only for admin
    """

    # Authenticate
    enforce_authentication(current_user)

    # Check if admin
    enforce_admin(current_user)

    try:
        # Query for all children of event
        children = await db.children.find_many(
            where= {
                "eventIDs": {eventId}
            }
        )

    except:
        raise HTTPException(
            status_code=400,
            detail="Children not found"
        )

    return children


# ! Update Child
@router.patch("/{child_id}", status_code=status.HTTP_200_OK)
async def update_child(
    child_id: str,
    # use ChildUpdate pydantic model for data validation
    update_data: ChildUpdate,
    current_user: Annotated[User, Depends(get_current_user)]
):
    # Make sure the user is authenticated
    enforce_authentication(current_user, "update your child's information")

    # Fetch the child
    child = await db.children.find_unique(where={"id": child_id})
    if not child:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Child not found.")

    # Make sure the current user is a parent of the child
    if current_user.id not in child.parentIDs:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied: You are not a parent of this child.")

    non_contact_data = update_data.model_dump(exclude_unset=True, exclude={"emergencyContacts"})
    contacts = update_data.emergencyContacts

    try:
        async with db.tx() as tx:
            # Make the non-emergency contact update
            if non_contact_data:
                updated_child = await tx.children.update(
                    where={"id": child.id},
                    data=non_contact_data,
                    include={
                        "parents": True,
                        "emergencyContacts": True,
                    }
                )
            else:
                updated_child = await tx.children.find_unique(
                    where={"id": child.id},
                    include={
                        "parents": True,
                        "emergencyContacts": True
                    }
                )

            # if contacts were to be updated, they are reconciled and use same IDs
            if contacts is not None:
                contact_ids: list[str] = []

                for ec in contacts:
                    existing_contact = await tx.emergencycontact.find_first(
                        where={
                            "firstName": ec.firstName,
                            "lastName": ec.lastName,
                            "phoneNumber": ec.phoneNumber,
                            "relationship": ec.relationship
                        }
                    )

                    # if we find the contact, we are making sure it is linked with child
                    if existing_contact:
                        if updated_child.id not in (existing_contact.childIDs or []):
                            new_childIDs = [*existing_contact, updated_child.id]
                            await tx.emergencycontact.update(
                                where={"id": existing_contact.id},
                                data={"childIDs": {"set": new_childIDs}}
                            )
                        # collect the existing contact id
                        contact_ids.append(existing_contact.id)
                    else:
                        # create contact and link to child
                        new_contact = await tx.emergencycontact.create(
                            data={
                                "firstName": ec.firstName,
                                "lastName": ec.lastName,
                                "phoneNumber": ec.phoneNumber,
                                "relationship": ec.relationship,
                                "childIDs": {"set": [updated_child.id]}
                            }
                        )
                        contact_ids.append(new_contact.id)

                # deduplicate collected ids and replace chlid's linked contacts
                contact_ids = list(dict.fromkeys(contact_ids))
                updated_child = await tx.children.update(
                    where={"id": updated_child.id},
                    data={"emergencyContactIDs": {"set": contact_ids}},
                    include={"emergencyContacts": True, "parents": True}
                )

        return {
            "child": updated_child,
            "message": "Child updated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update child and emergency contacts: {str(e)}"
        )


# ! Delete Child
@router.delete("/{child_id}", status_code=status.HTTP_200_OK)
async def delete_child(
    child_id: str,
    current_user: Annotated[User, Depends(get_current_user)]
):

    # Make sure the user is authenticated
    enforce_authentication(current_user, "remove your child")

    # Fetch the child
    child = await db.children.find_unique(
        where={"id": child_id}
    )

    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Child not found."
        )

    # Make sure the current usr is a parent of the child
    if current_user.id not in child.parentIDs:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You are not a parent of this child."
        )

    # Delete the child
    await db.children.delete(
        where={"id": child_id}
    )

    # Remove the child ID from the parent document
    parent = await db.users.find_unique(where={"id": current_user.id})
    # Remove the current child's ID from the parent's 'childIDs' array
    updated_childIDs = [cid for cid in parent.childIDs if cid != child_id]

    updated_user = await db.users.update(
        where={"id": current_user.id},
        data={"childIDs": updated_childIDs},
        include={"children": True}
    )

    return {
        "message": "Child deleted successfully.",
        "parent": updated_user
    }

@router.get("/ping")
async def ping():
    print("PING /child/__ping")
    return {"ok": True}

# Emergency Contact Routes =================================================

@router.post("/{child_id}/emergency_contact", status_code=status.HTTP_201_CREATED)
async def create_emergency_contact(
    child_id: str,
    emergency_contact_data: EmergencyContactCreate,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
        Authenticate the user
        Create Emergency Contact for Child
    """


    # User validations
    enforce_authentication(current_user, "Create emergency contact")

    # Verify that the child exists
    child = await db.children.find_unique(
        where={"id": child_id},
        include={"parents": True}
    )

    if not child:
        raise HTTPException(
            status_code=404,
            detail="Child not found"
        )

    # Check if current user is a guardian/parent of this child
    user_is_guardian = any(parent.id == current_user.id for parent in child.parents)
    if not user_is_guardian:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to create emergency contacts for this child"
        )


    # Validate priority range (assuming 1-3 is acceptable range)
    # if not (1 <= emergency_contact_data.priority <= 3):
    #     raise HTTPException(
    #         status_code=400,
    #         detail="Priority must be between 1 and 3"
    #     )

    # Check for priority conflicts (if you want unique priorities per child)
    # existing_priority = await db.emergencycontact.find_first(
    #     where={
    #         "childIDs": {
    #             "has": child_id
    #         },
    #         "priority": emergency_contact_data.priority
    #     }
    # )
    # if existing_priority:
    #     raise HTTPException(
    #         status_code=409,
    #         detail=f"Priority {emergency_contact_data.priority} is already assigned to another emergency contact for this child"
    #     )

    try:
        existing_contact = await db.emergencycontact.find_first(
            where={
                "firstName": emergency_contact_data.firstName,
                "lastName": emergency_contact_data.lastName,
                "phoneNumber": emergency_contact_data.phoneNumber,
            }
        )
        if existing_contact:
            if child_id in existing_contact.childIDs:
                raise HTTPException(
                    status_code=409,
                    detail="This emergency contact already exists for this child"
                )

            # Update existing contact to add this child
            updated_contact = await db.emergencycontact.update(
                where={"id": existing_contact.id},
                data={
                    "childIDs": existing_contact.childIDs + [child_id],
                    "relationship": emergency_contact_data.relationship
                    # "priority": emergency_contact_data.priority  # Update priority for this relationship
                }
            )

            return {
                "emergencyContact": updated_contact,
                "message": "Linked existing emergency contact to child"
            }

        else:
            new_contact = await db.emergencycontact.create(
                data={
                    "firstName": emergency_contact_data.firstName,
                    "lastName": emergency_contact_data.lastName,
                    "phoneNumber": emergency_contact_data.phoneNumber,
                    "relationship": emergency_contact_data.relationship,
                    # "priority": emergency_contact_data.priority,
                    "childIDs": [child_id]
                    }
            )
            return {
                    "emergencyContact": new_contact,
                    "message": "Created new emergency contact for child"
                    }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Failed to create emergency contact'
        )

# * =================================================

@router.get("/{child_id}/emergency_contact")
async def get_child_emergency_contacts(
    child_id: str,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
        Authenticate the user
        Enforce admin

        Get a child's emergency contacts
    """

    # User validations
    enforce_authentication(current_user)

    enforce_admin(current_user)

    # Query for the child's emergency contacts
    contact = await db.emergencycontact.find_many(
        where={
            "childIDs": {
                "has": child_id
            }
        }
    )

    if not contact:
        raise HTTPException(
            status_code=404,
            detail="Unable to locate emergency contact"
        )

    return {"Contact": contact}

@router.patch("/{child_id}/emergency_contact/{contact_id}", status_code=status.HTTP_200_OK)
async def update_emergency_contact(
    child_id: str,
    contact_id: str,
    emergency_contact_data: EmergencyContactUpdate,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
        Authenticate user and validate user can make an update

        Update child's emergency contact
    """

    # Authenticate user
    enforce_authentication(current_user)

    # Verify that user is a parent of child to make update
    child = await db.children.find_unique(
        where={"id": child_id}

    )

    if current_user.id not in child.parentIDs:
        raise HTTPException(
            status_code=500,
            detail="User is not approved to make update"
        )

    # Ensure the emergecy contact exists
    contact = await db.emergencycontact.find_unique(
        where={
            "id": contact_id,
            "childIDs": {
                    "has": child_id
                        }
        }
    )

    if not contact:
        raise HTTPException(
            status_code=404,
            detail="Emergency contact not found"
        )

    # Make the update
    try:

        update_payload = {}

        if emergency_contact_data.firstName is not None:
            update_payload["firstName"] = emergency_contact_data.firstName

        if emergency_contact_data.lastName is not None:
            update_payload["lastName"] = emergency_contact_data.lastName

        if emergency_contact_data.relationship is not None:
            update_payload["relaltionship"] = emergency_contact_data.relationship

        if emergency_contact_data.phoneNumber is not None:
            update_payload["phoneNumber"] = emergency_contact_data.phoneNumber

        # if emergency_contact_data.priority is not None:
        #     update_payload["priority"] = emergency_contact_data.priority

        updated_contact = await db.emergencycontact.update(
            where={"id": contact_id},
            data= update_payload
        )

        return {"Updated Emergency Contact": updated_contact}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update emergency contact"
        )

@router.delete("/{child_id}/emergency_contact/{emergency_contact_id}", status_code=status.HTTP_200_OK)
async def delete_emergency_contact(
    emergency_contact_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    child_id: str,
):

    """
        Authenticate and validate user
        Delete an emergency contact for a child with an emergency contact
    """


    # Verify user
    enforce_authentication(current_user)

    child = await db.children.find_unique(
        where={"id": child_id}
    )

    if current_user.id not in child.parentIDs:
        raise HTTPException(
            status_code=500,
            detail="User is not authorized to delete an emergency contact"
        )

    # Delete the emergency contact
    contact = await db.emergencycontact.find_unique(
        where={"id": emergency_contact_id}
    )

    if child_id not in contact.childIDs:
        raise HTTPException(
            status_code=404,
            detail="Child does not have the selected emergency contact"
        )

    # * Remove the child from the emergency contacts child IDs list
    try:
        if len(contact.childIDs) <= 1:
            deleted_contact = await db.emergencycontact.delete(
                where={"id": emergency_contact_id}
            )

            return {"Deleted Contact": deleted_contact}

        else:
            updated_child_ids = [id for id in contact.childIDs if id != child_id]

            deleted_child = await db.emergencycontact.update(
                where={"id": emergency_contact_id},
                data={
                    "childIDs": updated_child_ids
                }
            )

            return {"Deleted Emergency Contact": deleted_child}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to delete emergency contact {e}"
        )
