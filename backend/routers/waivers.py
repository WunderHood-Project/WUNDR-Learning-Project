from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated

from db.prisma_client import db
from models.user_models import User
from .auth.login import get_current_user
from .auth.utils import enforce_authentication

from services.gcs import generate_signed_download_url

router = APIRouter()

@router.get("/{waiver_id}/download", status_code=status.HTTP_200_OK)
async def download_waiver_pdf(
    waiver_id: str,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Returns a signed download URL for a waiver PDF (private object in GCS).
    The client uses this URL to download/print the waiver.
    """

    # Ensure the user is authenticated
    enforce_authentication(current_user, "download a waiver")

    # Load waiver signature record
    waiver = await db.waiversignatures.find_unique(where={"id": waiver_id})
    if not waiver:
        raise HTTPException(status_code=404, detail="Waiver not found")

    # Authorization: owner (parent who signed) OR admin
    is_owner = (waiver.parentId == current_user.id)
    is_admin = (current_user.role == "admin")

    if not (is_owner or is_admin):
        raise HTTPException(status_code=403, detail="Access denied")

    # The PDF must already be generated and stored in GCS
    if not waiver.pdfObjectName:
        raise HTTPException(status_code=400, detail="PDF is not generated yet")

    # Generate a temporary signed URL (do NOT make the bucket public)
    url = generate_signed_download_url(waiver.pdfObjectName)

    return {"url": url}
