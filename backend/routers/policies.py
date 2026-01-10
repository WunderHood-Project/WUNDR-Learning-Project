from fastapi import APIRouter, Query
from typing import Literal

from policies.waiver_registry import get_waiver_snapshot

router = APIRouter()

@router.get("/waiver")
def get_waiver_policy(
    version: str = Query("1.0"),
    lang: Literal["en"] = Query("en"),
):
    """
    Returns the canonical waiver snapshot used by UI + saved to DB + used for PDF.
    """
    return get_waiver_snapshot(version=version, lang=lang)
