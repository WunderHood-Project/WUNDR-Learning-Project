import copy
import textwrap
from typing import Dict, Any, Literal

Language = Literal["en"]

# Current versions used by the app when creating new records.
WAIVER_VERSION_CURRENT = "1.0"
PHOTO_CONSENT_VERSION_CURRENT = "1.0"

# Optional short policy text (kept for compatibility; not used in the legal release below).
CONDUCT_POLICY_SHORT_EN = ""

# Canonical waiver content for English.
# Source-of-truth used to build a snapshot stored at signing time.
# Each section has a stable "key" that the frontend uses for checkbox acknowledgements.
WAIVER_SECTIONS_EN = [
    {
        "key": "header_notice",
        "title": 'WonderHood Project — Minor Assumption of Risk and Release of Liability (“Release”)',
        "body": (
            "PLEASE READ CAREFULLY. BY SIGNING BELOW, YOU ARE AGREEING ON BEHALF OF THE MINOR AND ON YOUR OWN "
            "TO RELEASE WONDERHOOD AND OTHER PARTIES RELATED TO IT FROM LIABILITY.\n\n"
            "WonderHood is a nonprofit organization that exists to connect home-learning students in Colorado through outdoor adventures, "
            "creative arts, and community projects in an environment that helps students build friendships, explore interests, and grow in confidence. "
            "WonderHood's philosophy is built on the premise that learning flourishes when families and children come together; to this end, WonderHood "
            "offers free, real-world experiences for homeschool and online learners, sparking new friendships, joyful discovery, and a sense of belonging "
            "in a vibrant community.\n\n"
            "IN CONSIDERATION of the privilege of the Minor's participation in WonderHood's activities and programs, which participation is voluntary "
            "and by my own and the Minor's choosing, I state as follows:"
        ),
    },
    {
        "key": "assumption_of_risk",
        "title": "Assumption of Risk",
        "body": (
            "WonderHood intends to make me aware, and I understand, that participation in WonderHood's activities, including but not limited to outdoor and "
            "other physical activity in natural environments, hiking, climbing, biking, swimming (if applicable), boating (if applicable), sports and games, "
            "workshops, and riding in transportation to and from activity locations (the “Program”), exposes the Minor to certain risks, hazards, and dangers, "
            "including, by way of example, the risk of personal injury (including the risk of permanent disability or death), accidents or illnesses in remote places "
            "(without the immediate availability of medical facilities), vehicle accidents, unpredictable animal behavior, construction or engineering defects, "
            "malfunctioning equipment, slippery or uneven surfaces, exposure to adverse weather conditions, exposure to biting insects and wildlife, including insects "
            "and wildlife that may carry disease, and exposure to viruses or other communicable diseases (both known and unknown), epidemics, and pandemics (the “Risks”).\n\n"
            "There may be other risks, which may not be known by me, or predicted and controlled by the Program, and which could result not only in injury but in social, "
            "economic, or other kinds of losses either not known to me or not foreseeable at this time, and I acknowledge these are included within the Risks. "
            "The Risks may be caused by the Minor's own actions or inactions, the actions of others, the conditions in which the Program takes place, or the negligence "
            "of the “Released Parties” named below.\n\n"
            "I also understand that outdoor and adventure activities require physical exertion and any participant should be in good physical health. I further understand "
            "it is my responsibility to provide adequate clothing and any required personal items for the Minor to participate. If the Minor is not in good health, I realize "
            "this may create additional risk.\n\n"
            "ON MY AND THE MINOR'S BEHALF, I FULLY AND VOLUNTARILY ACCEPT AND ASSUME ALL SUCH RISKS AND ALL RESPONSIBILITY FOR LOSSES, COSTS, AND DAMAGES incurred by "
            "the Minor and me as a result of the Minor's participation in the Program."
        ),
    },
    {
        "key": "release_minor_rights",
        "title": "Release — Minor Rights",
        "body": (
            "I HEREBY ON BEHALF OF THE MINOR RELEASE, DISCHARGE, AND COVENANT NOT TO SUE WonderHood, and any of its directors, affiliates, agents, officers, employees, "
            "members, volunteers, sponsors, vendors, and other participants in the Program (collectively, the “Released Parties”), and each of them, of and from, "
            "and do discharge and waive, any and all claims, demands, losses, damages, and liabilities that the Minor may have or sustain, including attorneys' fees "
            "and costs (collectively, “Claims”), with respect to any and all medical expense, personal injury, property damage, economic loss, and other expense, injury, "
            "or harm and/or death arising directly or indirectly out of the Minor's participation in the Program, including without limitation any and all of those Risks "
            "described above, in accordance with Colorado Revised Statutes section 13-22-107.\n\n"
            "The foregoing sentence shall apply (without limitation) to all Claims for negligence, but not Claims for willful, reckless, or grossly negligent acts or omissions, "
            "as provided in Colorado Revised Statutes section 13-22-107 or by other applicable Colorado law."
        ),
    },
    {
        "key": "release_parent_guardian_rights",
        "title": "Release — Parent/Guardian Rights",
        "body": (
            "I HEREBY RELEASE, DISCHARGE, AND COVENANT NOT TO SUE the Released Parties, and each of them, of and from, and do discharge and waive, any and all claims, "
            "demands, losses, damages, and liabilities that I as the parent/guardian of the Minor may have or sustain, including attorneys' fees and costs, with respect "
            "to any and all medical expense, personal injury, property damage, economic loss, and other expense, injury, or harm and/or death arising directly or indirectly "
            "out of the Minor's participation in the Program, including without limitation any and all of those Risks described above.\n\n"
            "The foregoing sentence shall apply (without limitation) to all Claims for negligence, but not Claims for willful, reckless, or grossly negligent acts or omissions."
        ),
    },
    {
        "key": "application",
        "title": "Application",
        "body": (
            "The covenants and undertakings of this entire Release are given for and shall be binding upon my and the Minor's family, heirs, estate, next of kin, executors, "
            "administrators, legal representatives, beneficiaries, successors and assigns."
        ),
    },
    {
        "key": "indemnification",
        "title": "Indemnification",
        "body": (
            "I FURTHER AGREE TO INDEMNIFY, SAVE, AND HOLD HARMLESS the Released Parties, and each of them, from and against any and all Claims made against or incurred by "
            "any of them, including those for indemnity, contribution, or otherwise, arising from the Minor's participation in the Program and the Risks, whether resulting "
            "from Claims asserted by me or by another person against the Released Parties, except to the extent prohibited by applicable law.\n\n"
            "The foregoing sentence shall apply (without limitation) to all Claims for negligence but not Claims for willful, reckless, or grossly negligent acts or omissions."
        ),
    },
    {
        "key": "medical_treatment",
        "title": "Medical Treatment and Consent to Pay Expenses",
        "body": (
            "Should the Minor be injured or become ill while participating in the Program, I CONSENT to emergency medical treatment, and transport to a hospital or clinic for care.\n\n"
            "I certify that the Minor is covered by a personal or group insurance plan that will cover medical, hospitalization, emergency transportation and treatment, and other "
            "expenses of treatment and care should the Minor be injured or become ill while participating in the Program activities. I agree to pay all costs of medical treatment, "
            "transportation, or care incurred due to illness or injury during participation in the Program that are not covered by such insurance policy."
        ),
    },
    {
        "key": "photo_recording_notice",
        "title": "Photo and Recording Notice",
        "body": (
            "I understand that WonderHood may take photographs, film, or digital recordings during Program activities.\n\n"
            "PHOTO/VIDEO CONSENT IS PROVIDED SEPARATELY in the WonderHood registration process (“Photo Consent” step) and may be withdrawn by email. "
            "WonderHood will stop future use and make reasonable efforts to remove prior posts within its control."
        ),
    },

    {
        "key": "miscellaneous",
        "title": "Miscellaneous",
        "body": (
            "In the event of a dispute between the undersigned and any of the Released Parties, the exclusive venue and jurisdiction for any lawsuit arising out of such dispute "
            "shall be the state courts located in Custer County, Colorado, or the federal courts located in Colorado.\n\n"
            "If any provision of this document is determined to be invalid for any reason, such invalidity shall not affect the validity of any of the other provisions, which other "
            "provisions shall remain in full force and effect as if this document had been executed with the invalid provision eliminated.\n\n"
            "I understand and agree that this document is intended to be as broad and inclusive as permitted under applicable law and shall be governed by Colorado law."
        ),
    },

    # Optional: keep ONLY if you actually do equine/horse activities
    # {
    #     "key": "equine_warning",
    #     "title": "Equine Warning (Colorado Revised Statutes § 13-21-119)",
    #     "body": (
    #         "WARNING: Under Colorado Revised Statutes Section 13-21-119, an equine professional is not liable for an injury to or the death of a participant in equine activities "
    #         "resulting from the inherent risks of equine activities."
    #     ),
    # },

    {
        "key": "attestation",
        "title": "By Signing Below, I Attest As Follows",
        "body": (
            "I HAVE READ THIS AGREEMENT, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE GIVEN UP SUBSTANTIAL RIGHTS BY SIGNING IT, AND HAVE SIGNED IT FREELY AND VOLUNTARILY; "
            "AND I HAVE HAD THE OPPORTUNITY TO REVIEW THIS DOCUMENT WITH LEGAL COUNSEL, IF I WISH, BEFORE SIGNING BELOW."
        ),
    },
]

# Versioned waiver documents.
# The snapshot returned to the user must match EXACTLY what was presented at signing time.
WAIVER_DOCS: Dict[str, Dict[str, Any]] = {
    "1.0": {
        "language": "en",
        "sections": WAIVER_SECTIONS_EN,
        "conductPolicyShort": CONDUCT_POLICY_SHORT_EN,
    }
}

def clean_body(s: str) -> str:
    """Remove indentation and trim outer whitespace."""
    return textwrap.dedent(s or "").strip()

def build_full_text_from_sections(sections: list[dict]) -> str:
    """Build a single fullText string by concatenating section titles + bodies."""
    parts: list[str] = []
    for s in sections:
        parts.append(f"{s['title']}\n{clean_body(s.get('body', ''))}")
    return "\n\n".join(parts).strip()

def get_waiver_snapshot(version: str, lang: Language = "en") -> Dict[str, Any]:
    """
    Returns an immutable snapshot of the waiver for the requested version + language.
    Snapshot format is what frontend and PDF generator consume.
    """
    doc = WAIVER_DOCS.get(version)
    if not doc:
        raise ValueError(f"Unsupported waiver version: {version}")

    if doc["language"] != lang:
        raise ValueError(f"Unsupported language: {lang}")

    snapshot = {
        "docType": "liability_waiver",
        "version": version,
        "language": lang,
        "fullText": build_full_text_from_sections(doc["sections"]),
        "sections": [
            {"key": s["key"], "title": s["title"], "body": s["body"]}
            for s in doc["sections"]
        ],
        "conductPolicyShort": doc.get("conductPolicyShort", ""),
    }

    # Deep copy ensures callers cannot mutate in-memory waiver content.
    return copy.deepcopy(snapshot)