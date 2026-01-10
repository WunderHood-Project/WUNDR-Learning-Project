from __future__ import annotations
from io import BytesIO
from typing import Any, Dict, List
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

def _to_dt(v: Any) -> datetime | None:
    """
    Convert value to timezone-aware datetime if possible.
    Supports:
    - datetime objects
    - ISO strings like "2026-01-07 03:10:57.989000+00:00" or "...Z"
    """
    if v is None:
        return None

    if isinstance(v, datetime):
        dt = v
    elif isinstance(v, str):
        s = v.strip()
        # support "Z" suffix
        if s.endswith("Z"):
            s = s[:-1] + "+00:00"
        try:
            dt = datetime.fromisoformat(s)  # works with " " or "T"
        except Exception:
            return None
    else:
        return None

    # If no tzinfo, assume UTC (safer for audit timestamps)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    return dt



# -------- Fonts (Unicode-safe) --------
# Use DejaVu fonts if present so the PDF supports Unicode characters (e.g., smart quotes, ®, em dashes).
# If fonts are missing, we fall back to core PDF fonts and sanitize special characters to prevent ReportLab errors.

# Absolute path to bundled fonts (expected in backend/assets/fonts/)
# DejaVuSans is used for normal text; DejaVuSansMono is used for technical metadata (e.g., User Agent).

# Whether Unicode-safe fonts were successfully registered.
# When False, we normalize special characters to avoid PDF rendering failures.

FONT_DIR = Path(__file__).resolve().parent.parent / "assets" / "fonts"

_HAS_UNICODE_FONTS = False
try:
    pdfmetrics.registerFont(TTFont("DejaVuSans", str(FONT_DIR / "DejaVuSans.ttf")))
    pdfmetrics.registerFont(TTFont("DejaVuSansMono", str(FONT_DIR / "DejaVuSansMono.ttf")))
    _HAS_UNICODE_FONTS = True
except Exception:
    # Fonts are optional. If missing, we fall back to core fonts and sanitize special characters.
    _HAS_UNICODE_FONTS = False


def _safe_dt(v: Any) -> str:
    # Converts datetime-like / nullable values to a safe string for PDF output.
    # Keeps empty string when value is None.
    if v is None:
        return ""
    return str(v)


def _normalize_text(s: str) -> str:
    """
    Fallback sanitizer (only used when Unicode fonts are not available).
    Keeps PDF from crashing on symbols like ®, smart quotes, em-dash.
    """
    if not s:
        return ""
    return (
        s.replace("®", "(R)")
         .replace("—", "-")
         .replace("–", "-")
         .replace("’", "'")
         .replace("“", '"')
         .replace("”", '"')
    )


def _p(text: str) -> str:
    """
    Safe text for ReportLab Paragraph:
    - escapes &, <, >
    - keeps line breaks
    - if Unicode fonts are missing, normalizes special chars to avoid crashes
    """
    raw = text or ""
    if not _HAS_UNICODE_FONTS:
        raw = _normalize_text(raw)
    return escape(raw).replace("\n", "<br/>")


def build_waiver_pdf_bytes(
    # Builds and returns PDF bytes for a signed waiver record.
    # The PDF is derived from the waiver_snapshot stored at signing time (versioned + immutable).

    # PDF layout:
    # - Header: waiver version, signature record IDs, timestamps, signer name
    # - Participant info: child + parent/guardian identifiers
    # - Technical audit fields: IP and User-Agent (if present)
    # - Acknowledged sections: checkbox list based on sectionsAck captured at signing
    # - Waiver sections: full text of each section exactly as presented in the UI
    *,
    waiver_signature: Any,
    waiver_snapshot: Dict[str, Any],
    child: Any,
    parent: Any,
) -> bytes:
    buf = BytesIO()

    doc = SimpleDocTemplate(
        buf,
        pagesize=LETTER,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
        title="WonderHood Liability Waiver",
        author="WonderHood",
    )

    styles = getSampleStyleSheet()

    font_body = "DejaVuSans" if _HAS_UNICODE_FONTS else "Helvetica"
    font_mono = "DejaVuSansMono" if _HAS_UNICODE_FONTS else "Courier"

    title_style = ParagraphStyle(
        "Title",
        parent=styles["Title"],
        fontName=font_body,
        fontSize=16,
        leading=20,
        alignment=TA_LEFT,
        spaceAfter=10,
    )

    h_style = ParagraphStyle(
        "H",
        parent=styles["Heading2"],
        fontName=font_body,
        fontSize=12,
        leading=14,
        spaceBefore=12,
        spaceAfter=6,
    )

    body_style = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontName=font_body,
        fontSize=10.5,
        leading=14,
        spaceAfter=6,
    )

    mono_style = ParagraphStyle(
        "Mono",
        parent=styles["BodyText"],
        fontName=font_mono,
        fontSize=9.5,
        leading=12,
        spaceAfter=6,
    )

    story: List[Any] = []

    version = waiver_snapshot.get("version", "")
    language = waiver_snapshot.get("language", "")

    story.append(Paragraph(f"WonderHood Liability Waiver (Version {_p(str(version))})", title_style))
    # story.append(Paragraph(f"<b>Waiver Signature ID:</b> {_p(str(getattr(waiver_signature, 'id', '')))}", body_style))
    # story.append(Paragraph(f"<b>Language:</b> {_p(str(language))}", body_style))

    signed_at_raw = getattr(waiver_signature, "signedAt", None)
    signed_at_dt = _to_dt(signed_at_raw)

    if signed_at_dt:
        mt_dt = signed_at_dt.astimezone(ZoneInfo("America/Denver"))
        utc_dt = signed_at_dt.astimezone(timezone.utc)

        mt_str = mt_dt.strftime("%b %d, %Y %I:%M %p (MT)")
        utc_str = utc_dt.isoformat(sep=" ", timespec="seconds")

        story.append(Paragraph(f"<b>Signed At (Mountain Time):</b> {_p(mt_str)}", body_style))
        story.append(Paragraph(f"<b>Signed At (UTC):</b> {_p(utc_str)}", body_style))
    else:
        story.append(Paragraph(f"<b>Signed At (UTC):</b> {_p(_safe_dt(signed_at_raw))}", body_style))

    story.append(
        Paragraph(
            f"<b>Electronic Signature (Typed Name):</b> {_p(str(getattr(waiver_signature, 'signedByName', '')))}",
            body_style,
        )
    )

    story.append(Spacer(1, 6))

    child_name = f"{getattr(child, 'firstName', '')} {getattr(child, 'lastName', '')}".strip()
    parent_name = f"{getattr(parent, 'firstName', '')} {getattr(parent, 'lastName', '')}".strip()

    # story.append(Paragraph(f"<b>Child:</b> {_p(child_name)} &nbsp;&nbsp; (Child ID: {_p(str(getattr(child, 'id', '')))} )", body_style))
    story.append(Paragraph(f"<b>Child:</b> {_p(child_name)}", body_style))
    # story.append(Paragraph(f"<b>Parent/Guardian:</b> {_p(parent_name)} &nbsp;&nbsp; (Parent ID: {_p(str(getattr(parent, 'id', '')))} )", body_style))
    story.append(Paragraph(f"<b>Parent/Guardian:</b> {_p(parent_name)}", body_style))

    # ip = getattr(waiver_signature, "ip", None) or ""
    # ua = getattr(waiver_signature, "userAgent", None) or ""
    # if ip:
    #     story.append(Paragraph(f"<b>IP:</b> {_p(str(ip))}", body_style))
    # if ua:
    #     story.append(Paragraph(f"<b>User Agent:</b> {_p(str(ua))}", mono_style))

    story.append(Spacer(1, 12))


    # ---- Acknowledged sections (matches UI checkboxes) ----
    # sectionsAck can be stored as:
    # - list[str] of acknowledged section keys, OR
    # - dict[str, bool] mapping keys to checked flags
    # We normalize both into a set of acknowledged keys for rendering.
    story.append(Paragraph("Acknowledged Sections (as checked at signing)", h_style))

    ack = getattr(waiver_signature, "sectionsAck", None) or []
    if isinstance(ack, dict):
        ack_keys = {k for k, v in ack.items() if v}
    else:
        ack_keys = set(ack)

    sections = waiver_snapshot.get("sections") or []
    for s in sections:
        key = s.get("key", "")
        title = s.get("title", "")
        checked = "[X]" if key in ack_keys else "[ ]"

        story.append(
            Paragraph(
                f"{checked} <b>{_p(str(title))}</b> "
                f"<font size=9 color='grey'>({_p(str(key))})</font>",
                body_style,
            )
        )

    story.append(Spacer(1, 12))

    story.append(Paragraph("Waiver Sections (as presented at signing)", h_style))

    sections = waiver_snapshot.get("sections") or []

    for i, s in enumerate(sections, start=1):
        title = str(s.get("title", "") or "")
        body = str(s.get("body", "") or "").strip()

        story.append(Paragraph(f"<b>{i}. {_p(title)}</b>", body_style))
        story.append(Paragraph(_p(body), body_style))
        story.append(Spacer(1, 6))


    doc.build(story)
    return buf.getvalue()
