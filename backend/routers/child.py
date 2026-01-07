from fastapi import APIRouter, status, Depends, HTTPException
from db.prisma_client import db
from typing import Annotated
from models.user_models import User, ChildCreate, ChildUpdate, EmergencyContactCreate, EmergencyContactUpdate
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from .auth.login import get_current_user
from .auth.utils import enforce_authentication, enforce_admin
from datetime import datetime, time, timezone
from prisma import Json
from services.waiver_pdf import build_waiver_pdf_bytes
from services.gcs import upload_bytes
from policies.waiver_registry import get_waiver_snapshot
import hashlib, json
from fastapi import Request


router = APIRouter()
WAIVER_VER = "1.0"
CONSENT_VER = "1.0"

def get_request_ip(request: Request) -> str | None:
    # If the app is behind a reverse proxy (Render / Nginx / Cloudflare),
    # the real client IP is commonly passed via the X-Forwarded-For header.
    xff = request.headers.get("x-forwarded-for")
    if xff:
        # X-Forwarded-For may contain multiple IPs:
        # "client_ip, proxy_ip1, proxy_ip2" — we want the first one.
        return xff.split(",")[0].strip()

    # Fallback for direct connections (local/dev, or when proxy headers are not present)
    if request.client:
        return request.client.host

    return None


# ! Create Child
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_child(
    request: Request,
    # apply Pydantic model for data validation
    child_data: ChildCreate,
    current_user: Annotated[User, Depends(get_current_user)]

):
    # Make sure the user is authenticated
    enforce_authentication(current_user, "add a child")

    # now = datetime.now(timezone.utc)
    bday_dateTime = datetime.combine(child_data.birthday, time.min).replace(tzinfo=timezone.utc)
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
                    "birthday": bday_dateTime,
                    "allergiesMedical": child_data.allergiesMedical,
                    "notes": child_data.notes,
                    "waiver": child_data.waiver,
                    "photoConsent": child_data.photoConsent,
                    "photoConsentVer": CONSENT_VER if child_data.photoConsent else None,
                    "photoConsentAt": datetime.now(timezone.utc) if child_data.photoConsent else None,
                    "parentIds": [current_user.id], # Add the current user's ID to parentIDs
                    "eventIds": [], # Create activityIDs array so we can easily add to it later
                },
            )

            # We create a waiver signature ONLY if the waiver was actually signed (waiver == True).
            # This prevents writing empty/invalid waiver records when the user did not sign anything.

            waiver_sig = None

            if child_data.waiver:
                # Capture an immutable snapshot of the waiver content shown in the UI at signing time.
                snapshot = get_waiver_snapshot(WAIVER_VER, "en")
                snapshot_hash = hashlib.sha256(
                    json.dumps(snapshot, sort_keys=True).encode("utf-8")
                ).hexdigest()

                # Capture audit metadata (IP + User-Agent) at signing time.
                ip = get_request_ip(request)
                user_agent = request.headers.get("user-agent")

                waiver_sig = await tx.waiversignatures.create(
                    data={
                        "child": {"connect": {"id": created_child.id}},
                        "parent": {"connect": {"id": current_user.id}},
                        "type": "liability",
                        "version": WAIVER_VER,
                        "signedAt": datetime.now(timezone.utc),
                        "signedByName": (child_data.waiverSignedByName or "").strip(),
                        "sectionsAck": Json(child_data.waiverSectionsAck or []),
                        # Audit metadata
                        "ip": ip,
                        "userAgent": user_agent,
                        # Immutable waiver content + integrity hash
                        "waiverSnapshot": Json(snapshot),
                        "waiverTextHash": snapshot_hash,
                    }
                )

                # Create the waiver signature record (includes snapshot + hash for audit integrity).
                pdf_bytes = build_waiver_pdf_bytes(
                    waiver_signature=waiver_sig,
                    waiver_snapshot=snapshot,
                    child=created_child,
                    parent=current_user,
                )

                pdf_sha256 = hashlib.sha256(pdf_bytes).hexdigest()
                pdf_size = len(pdf_bytes)

                # Upload the PDF to cloud storage (GCS).
                object_name = f"waivers/{created_child.id}/{waiver_sig.id}.pdf"
                gs_uri = upload_bytes(pdf_bytes, object_name, content_type="application/pdf")

                # Persist PDF metadata for audit and integrity verification.
                waiver_sig = await tx.waiversignatures.update(
                    where={"id": waiver_sig.id},
                    data={
                        "pdfObjectName": object_name,
                        "pdfGsUri": gs_uri,
                        "pdfSha256": pdf_sha256,
                        "pdfSizeBytes": pdf_size,
                        "pdfCreatedAt": datetime.now(timezone.utc),
                    },
                )


            # if child_data.waiver:
            #     waiver_sig = await tx.waiversignatures.create(
            #         data={
            #             "child": {"connect": {"id": created_child.id}},
            #             "parent": {"connect": {"id": current_user.id}},
            #             "type": "liability",
            #             "version": WAIVER_VER,
            #             "signedAt": datetime.now(timezone.utc),
            #             "signedByName": (child_data.waiverSignedByName or "").strip(),
            #             "sectionsAck": Json(child_data.waiverSectionsAck or []),
            #         }
            #     )

            #     pdf_bytes = build_waiver_pdf_bytes(
            #         waiver=waiver_sig,
            #         child=created_child,
            #         parent=current_user,
            #     )

            #     object_name = f"waivers/{waiver_sig.id}.pdf"
            #     gs_uri = upload_bytes(pdf_bytes, object_name, content_type="application/pdf")

            #     waiver_sig = await tx.waiversignatures.update(
            #         where={"id": waiver_sig.id},
            #         data={"pdfObjectName": object_name, "pdfGsUri": gs_uri},
            #     )





            # create/link emergency contacts
            contacts: list = []
            contact_ids: list[str] = []
            for ec in getattr(child_data, "emergencyContacts", []) or []:
                existing_contact = await tx.emergencycontact.find_first(
                    where={
                        "firstName": ec.firstName,
                        "lastName": ec.lastName,
                        "phoneNumber": ec.phoneNumber
                    }
                )

                if existing_contact:
                    current_ids = existing_contact.childIds or []
                    next_ids = list(dict.fromkeys([*current_ids, created_child.id]))
                    if next_ids != current_ids:
                        await tx.emergencycontact.update(
                            where={"id": existing_contact.id},
                            data={"childIds": {"set": next_ids}}
                        )
                    contacts.append(existing_contact)
                    contact_ids.append(existing_contact.id)
                else:
                    new_contact = await tx.emergencycontact.create(
                        data={
                            "firstName": ec.firstName,
                            "lastName": ec.lastName,
                            "phoneNumber": ec.phoneNumber,
                            "relationship": ec.relationship,
                            "childIds": [created_child.id]
                        }
                    )
                    contacts.append(new_contact)
                    contact_ids.append(new_contact.id)

            # attach contacts to child and fetch with include
            if contact_ids:
                contact_ids = list(dict.fromkeys(contact_ids))
                created_child = await tx.children.update(
                    where={ "id": created_child.id },
                    data={ "emergencyContactIds": { "set": contact_ids } },
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
                data={ "childIds": { "push": created_child.id } },
                include={ "children": True }
            )

        return {
            "child": created_child,
            "parent": updated_user,
            "emergencyContacts": contacts,
            "message": "Child added successfully",
            "waiverSignatureId": waiver_sig.id if waiver_sig else None,
            "waiverSignedAt": waiver_sig.signedAt.isoformat() if waiver_sig else None,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create child and emergency contacts: {str(e)}"
        )
    
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
                "eventIds": {"has": eventId}
            }
        )

    except:
        raise HTTPException(
            status_code=400,
            detail="Children not found"
        )

    return children



# ! Get Children of the Current User
@router.get("/current", status_code=status.HTTP_200_OK)
async def get_children(
    current_user: Annotated[User, Depends(get_current_user)]
):
    # print("current_user:", getattr(current_user, "id", None))

    enforce_authentication(current_user, "view your children.")

    children = await db.children.find_many(
        where={
            "parentIds":{
                "has": current_user.id
            }
        },
        include={"emergencyContacts": True, "parents": True}

    )
    return children

# =========================
# Admin: Children
# =========================

@router.get("/admin", status_code=status.HTTP_200_OK)
async def admin_get_all_children(
    current_user: Annotated[User, Depends(get_current_user)]
):
    enforce_authentication(current_user)
    enforce_admin(current_user)

    children = await db.children.find_many(
        include={
            "parents": True,              # 
            "emergencyContacts": True,
            "events": True,
        }
    )

    # ✅ sanitize parents
    payload = jsonable_encoder(children)
    for c in payload:
        c["parents"] = [
            {
                "id": p.get("id"),
                "firstName": p.get("firstName"),
                "lastName": p.get("lastName"),
                "email": p.get("email"),
                "phoneNumber": p.get("phoneNumber"),
                "address": p.get("address"),
                "city": p.get("city"),
                "state": p.get("state"),
                "zipCode": p.get("zipCode"),
                "role": p.get("role"),
            }
            for p in (c.get("parents") or [])
        ]

    return {"children": payload}


@router.get("/admin/{child_id}", status_code=status.HTTP_200_OK)
async def admin_get_child_detail(
    child_id: str,
    current_user: Annotated[User, Depends(get_current_user)]
):
    enforce_authentication(current_user)
    enforce_admin(current_user)

    child = await db.children.find_unique(
        where={"id": child_id},
        include={
            "parents": True,
            "events": True,
            "emergencyContacts": True,
        }
    )

    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    payload = jsonable_encoder(child)
    payload["parents"] = [
        {
            "id": p.get("id"),
            "firstName": p.get("firstName"),
            "lastName": p.get("lastName"),
            "email": p.get("email"),
            "phoneNumber": p.get("phoneNumber"),
            "address": p.get("address"),
            "city": p.get("city"),
            "state": p.get("state"),
            "zipCode": p.get("zipCode"),
            "role": p.get("role"),
        }
        for p in (payload.get("parents") or [])
    ]

    return {"child": payload}




@router.get("/admin/{child_id}/waiver", status_code=status.HTTP_200_OK)
async def admin_get_child_waiver(
    child_id: str,
    current_user: Annotated[User, Depends(get_current_user)]
):
    enforce_authentication(current_user)
    enforce_admin(current_user)

    waiver = await db.waiversignatures.find_first(
        where={"childId": child_id, "type": "liability"}
    )

    return {"waiver": waiver}


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
    if current_user.id not in child.parentIds:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You are not a parent of this child."
        )

    return child


# ! Update Child
@router.patch("/{child_id}", status_code=status.HTTP_200_OK)
async def update_child(
    child_id: str,
    update_data: ChildUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
):
    # Auth
    enforce_authentication(current_user, "update your child's information")

    # Child exists?
    child = await db.children.find_unique(where={"id": child_id})
    if not child:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Child not found.")

    # Is parent?
    if current_user.id not in child.parentIds:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied: You are not a parent of this child.")

    # Build update payload for non-contact fields.
    # We explicitly EXCLUDE waiver-related fields because waiver should NOT change here.
    # Waiver signing/updating is handled separately (e.g., when a new waiver version is introduced).
    non_contact_data = update_data.model_dump(
        exclude_unset=True,
        exclude={
            "emergencyContacts",
            "waiver",
            "waiverSignedByName",
            "waiverSectionsAck",
            "waiverVersion",
            "waiverSignedAt",
            "photoConsent",
        }
    )

    # Emergency contacts are handled separately to avoid mixing relational updates
    # with simple scalar field updates.
    new_contacts = update_data.emergencyContacts


    # Photo consent can be toggled on/off.
    # When turned ON, we record the current consent version and timestamp.
    # When turned OFF, we clear the version and timestamp.
    extra_updates: dict = {}
    if update_data.photoConsent is not None:
        if update_data.photoConsent:
            extra_updates.update({
                "photoConsent": True,
                "photoConsentVer": CONSENT_VER,
                "photoConsentAt": datetime.now(timezone.utc),
            })
        else:
            extra_updates.update({
                "photoConsent": False,
                "photoConsentVer": None,
                "photoConsentAt": None,
            })

    try:
        async with db.tx() as tx:
            # Update the child record with scalar fields and consent metadata (if provided).
            # If nothing was provided, we simply fetch the current child with relations.
            if non_contact_data or extra_updates:
                updated_child = await tx.children.update(
                    where={"id": child.id},
                    data={**non_contact_data, **extra_updates},
                    include={"parents": True, "emergencyContacts": True},
                )
            else:
                updated_child = await tx.children.find_unique(
                    where={"id": child.id},
                    include={"parents": True, "emergencyContacts": True},
                )


            # Reconcile emergency contacts:
        # - Reuse existing contacts when possible (to avoid duplicates)
        # - Ensure each contact is linked to this child
        # - Update the child's emergencyContactIds to match the final set
            if new_contacts is not None:
                contact_ids: list[str] = []

                for ec in new_contacts or []:
                    existing_contact = await tx.emergencycontact.find_first(
                        where={
                            "firstName": ec.firstName,
                            "lastName": ec.lastName,
                            "phoneNumber": ec.phoneNumber,
                            "relationship": ec.relationship,
                        }
                    )

                    if existing_contact:
                        current_ids = existing_contact.childIds or []
                        next_ids = list(dict.fromkeys([*current_ids, updated_child.id]))
                        if next_ids != current_ids:
                            await tx.emergencycontact.update(
                                where={"id": existing_contact.id},
                                data={"childIds": {"set": next_ids}},
                            )
                        contact_ids.append(str(existing_contact.id))
                    else:
                        new_contact = await tx.emergencycontact.create(
                            data={
                                "firstName": ec.firstName,
                                "lastName": ec.lastName,
                                "phoneNumber": ec.phoneNumber,
                                "relationship": ec.relationship,
                                "childIds": [updated_child.id],
                            }
                        )
                        contact_ids.append(str(new_contact.id))

                # De-duplicate IDs and update the child's emergencyContactIds list
                unique_ids = list(dict.fromkeys(contact_ids))

                updated_child = await tx.children.update(
                    where={"id": updated_child.id},
                    data={"emergencyContactIds": {"set": unique_ids}},
                    include={"emergencyContacts": True, "parents": True},
                )

        return {"child": updated_child, "message": "Child updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update child and emergency contacts: {str(e)}",
        )


# ! Delete Child
@router.delete("/{child_id}", status_code=status.HTTP_200_OK)
async def delete_child(child_id: str, current_user: Annotated[User, Depends(get_current_user)]):

    enforce_authentication(current_user, "remove your child")

    child = await db.children.find_unique(where={"id": child_id})
    if not child:
        raise HTTPException(status_code=404, detail="Child not found.")

    if current_user.id not in child.parentIds:
        raise HTTPException(status_code=403, detail="Access denied: You are not a parent of this child.")

    try:
        async with db.tx() as tx:
            # 1) delete waiver signatures tied to this child
            await tx.waiversignatures.delete_many(where={"childId": child_id})

            # (If there are any other dependent tables, include them here as well)

            # 2) delete child
            await tx.children.delete(where={"id": child_id})

            # 3) remove child from user.childIds
            parent = await tx.users.find_unique(where={"id": current_user.id})
            updated_childIds = [cid for cid in (parent.childIds or []) if cid != child_id]

            updated_user = await tx.users.update(
                where={"id": current_user.id},
                data={"childIds": updated_childIds},
                include={"children": True}
            )

        return {"message": "Child deleted successfully.", "parent": updated_user}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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

    try:
        existing_contact = await db.emergencycontact.find_first(
            where={
                "firstName": emergency_contact_data.firstName,
                "lastName": emergency_contact_data.lastName,
                "phoneNumber": emergency_contact_data.phoneNumber,
            }
        )
        if existing_contact:
            if child_id in existing_contact.childIds:
                raise HTTPException(
                    status_code=409,
                    detail="This emergency contact already exists for this child"
                )

            # Update existing contact to add this child
            # updated_contact = await db.emergencycontact.update(
            #     where={"id": existing_contact.id},
            #     data={
            #         "childIds": existing_contact.childIds + [child_id],
            #         "relationship": emergency_contact_data.relationship
            #         # "priority": emergency_contact_data.priority  # Update priority for this relationship
            #     }
            # )
            next_ids = list(dict.fromkeys([*(existing_contact.childIds or []), child_id]))
            updated_contact = await db.emergencycontact.update(
                where={"id": existing_contact.id},
                data={
                    "childIds": { "set": next_ids },
                    "relationship": emergency_contact_data.relationship
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
                    "childIds": [child_id]
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
            "childIds": {
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

    if current_user.id not in child.parentIds:
        raise HTTPException(
            status_code=500,
            detail="User is not approved to make update"
        )

    # Ensure the emergecy contact exists
    contact = await db.emergencycontact.find_first(
        where={
            "id": contact_id,
            "childIds": { "has": child_id }
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
            update_payload["relationship"] = emergency_contact_data.relationship

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

    if current_user.id not in child.parentIds:
        raise HTTPException(
            status_code=500,
            detail="User is not authorized to delete an emergency contact"
        )

    # Delete the emergency contact
    contact = await db.emergencycontact.find_unique(
        where={"id": emergency_contact_id}
    )

    if child_id not in contact.childIds:
        raise HTTPException(
            status_code=404,
            detail="Child does not have the selected emergency contact"
        )

    # * Remove the child from the emergency contacts child IDs list
    try:
        if len(contact.childIds) <= 1:
            deleted_contact = await db.emergencycontact.delete(
                where={"id": emergency_contact_id}
            )

            return {"Deleted Contact": deleted_contact}

        else:
            updated_child_ids = [id for id in contact.childIds if id != child_id]

            deleted_child = await db.emergencycontact.update(
                where={"id": emergency_contact_id},
                data={
                    "childIds": updated_child_ids
                }
            )

            return {"Deleted Emergency Contact": deleted_child}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to delete emergency contact {e}"
        )


