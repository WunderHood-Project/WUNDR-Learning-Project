import copy
import textwrap

from typing import Dict, Any, Literal

Language = Literal["en"]

# Current versions used by the app when creating new records.
WAIVER_VERSION_CURRENT = "1.0"
PHOTO_CONSENT_VERSION_CURRENT = "1.0"
# Canonical waiver content for English.
# This is the source-of-truth used to build a "snapshot" that gets stored at signing time.
# Each section has a stable "key" that the frontend uses for checkbox acknowledgements.
CONDUCT_POLICY_SHORT_EN = ""

# Canonical waiver content for English.
# This is the source-of-truth used to build a "snapshot" that gets stored at signing time.
# Each section has a stable "key" that the frontend uses for checkbox acknowledgements.
WAIVER_SECTIONS_EN = [
    {
        "key": "assumption_of_risk",
        "title": "Assumption of Risk",
        "body": """I understand that participation in WonderHood programs/events (including outdoor activities, movement between locations, team games, and workshops) involves inherent risks, including risks of injury, illness, property damage, weather exposure, uneven terrain, physical exertion, and other unforeseen or unknown circumstances.
        I voluntarily assume all such risks for myself and for the child named in the registration.""".strip()
    },
    {
        "key": "release_hold_harmless",
        "title": "Release & Hold Harmless",
        "body": """To the maximum extent permitted by law, I release and hold harmless WonderHood, its directors, officers, staff, and volunteers from any and all claims, liabilities, damages, losses, or expenses arising out of or related to participation, except to the extent caused by WonderHood's gross negligence or willful misconduct.""".strip()
    },
    {
        "key": "code_of_conduct",
        "title": "Code of Conduct",
        "body": """The child will follow safety rules and staff directions. Violations (bullying, threats, dangerous behavior, property damage) may result in disciplinary action up to removal from an activity.

        Conduct Policy - "Three-Step Rule":
        1) Verbal reminder and review of rules.
        2) Temporary time-out / discussion with parent.
        3) Removal from the class/event. Repeat or serious violations (bullying, aggression, threats, intentional damage, refusal to follow safety instructions) may result in immediate removal.

        Prohibited: bullying/harassment, abusive language or insults, dangerous behavior, property damage, drugs/alcohol/nicotine, weapons of any kind, failure to follow staff instructions.""".strip()
    },

    {
        "key": "medical_first_aid",
        "title": "Medical & First Aid Consent",
        "body": """I authorize basic first aid (cleaning minor scrapes/cuts, bandages, cold compresses, rest/observation). In an emergency, I authorize WonderHood to call 911 and seek emergency medical care and transport as needed. WonderHood does not dispense prescription medications; OTC items are used topically only as part of basic first aid. If an epinephrine auto-injector/inhaler is required, I will supply a labeled device.""".strip()
    },
    {
        "key": "health_disclosure",
        "title": "Health Disclosure",
        "body": """I agree to disclose allergies, medical considerations, and any accommodations needed, and to provide up-to-date emergency contacts. 
        I confirm the child is physically able to participate, or that I have disclosed relevant limitations.
        """.strip()
    },
    {
        "key": "transport_property",
        "title": "Transportation & Property",
        "body": """Personal belongings are brought at the participant's own risk; WonderHood is not responsible for loss, theft, or damage.
        Travel to/from events is the family's responsibility unless otherwise stated.
        """.strip()
    },
    {
        "key": "photo_consent_separate",
        "title": "Photo Consent (separate)",
        "body": """Photo/video consent is provided separately on the "Photo Consent" step and can be withdrawn by email.
        WonderHood will stop future use and make reasonable efforts to remove prior posts within its control.""".strip()
    },
    {
        "key": "fees_refunds",
        "title": "Fees & Refunds (current & future)",
        "body": """Currently, WonderHood events are free. In the future, membership dues or paid club programs may be introduced. 
        When fees apply, refunds/reschedules are governed by the specific program or event rules presented at registration.""".strip()
    },
    {
        "key": "governing_law",
        "title": "Governing Law",
        "body": """This waiver is governed by Colorado law. If any portion is found invalid, the remaining provisions continue in full force and effect (severability).""".strip()
    },
]

# Versioned waiver documents.
# Key idea: the snapshot returned to the user must match EXACTLY what was presented at signing time.
# When you update the waiver text, create a new version key ("1.1", "1.2", etc) instead of editing old versions.
WAIVER_DOCS: Dict[str, Dict[str, Any]] = {
    "1.0": {
        "language": "en",
        # If we ever store a curated "fullText" block, we can include it here.
        # For now, fullText is generated from sections so it stays consistent.
        "sections": WAIVER_SECTIONS_EN,
        "conductPolicyShort": CONDUCT_POLICY_SHORT_EN,
    },
    # "1.1": {...}  for next waiver version
}

def clean_body(s: str) -> str:
    # Removes indentation from triple-quoted strings and trims outer whitespace.
    # Useful if section bodies contain formatted blocks.
    return textwrap.dedent(s or "").strip()


def build_full_text_from_sections(sections: list[dict]) -> str:
    # Builds a single "fullText" string by concatenating each section title + body.
    # This is convenient for storage/search/PDF output while the UI still uses section rendering.
    parts: list[str] = []
    for s in sections:
        parts.append(f"{s['title']}\n{clean_body(s.get('body', ''))}")
    return "\n\n".join(parts).strip()


def get_waiver_snapshot(version: str, lang: Language = "en") -> Dict[str, Any]:
    # Returns an immutable snapshot of the waiver for the requested version + language.
    # Snapshot format is what frontend and PDF generator consume.
    doc = WAIVER_DOCS.get(version)
    if not doc:
         # If the client requests a version we don't support, fail explicitly.
        raise ValueError(f"Unsupported waiver version: {version}")

    if doc["language"] != lang:
        # Safety: do not silently return the wrong language.
        raise ValueError(f"Unsupported language: {lang}")

    # Snapshot is normalized to a consistent schema:
    # - fullText: derived from sections (keeps text in sync)
    # - sections: stripped down to key/title/body only (stable payload)
    snapshot = {
        "docType": "liability_waiver",
        "version": version,
        "language": lang,
        # "fullText": doc["fullText"],
        "fullText": build_full_text_from_sections(doc["sections"]),
        "sections": [
            {"key": s["key"], "title": s["title"], "body": s["body"]}
            for s in doc["sections"]
        ],
        "conductPolicyShort": doc["conductPolicyShort"],
    }

    # Return a deep copy so callers cannot mutate the in-memory WAIVER_DOCS structures by accident.
    return copy.deepcopy(snapshot)

