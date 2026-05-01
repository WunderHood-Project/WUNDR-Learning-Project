from __future__ import annotations
from pydantic import BaseModel, Field, field_validator, EmailStr, HttpUrl
from typing import List, TYPE_CHECKING, Optional, Literal
from enum import Enum
from datetime import datetime, timezone


if TYPE_CHECKING:
    from models.user_models import User


# ! Activities
class Activity(BaseModel):
    id: str = Field(min_length=1, description="Activity identifier")
    name: str = Field(min_length=1, max_length=50)
    description: str = Field(min_length=1, max_length=750)
    events: List["Event"] = Field(default_factory=list)

class ActivityCreate(BaseModel):
    name: str = Field(min_length=1)
    description: str = Field(min_length=1)

class ActivityUpdate(BaseModel):
    name: str = Field(min_length=1)
    description: str = Field(min_length=1)

class EventSchoolAccess(str, Enum):
    ALL = "all"
    HOMESCHOOL_ONLY = "homeschool_only"
    PUBLIC_CUSTER_ONLY = "public_custer_only"
    PRIVATE_CUSTER_ONLY = "private_custer_only"

class EventLabel(str, Enum):
    WONDERHOOD = "wonderhood"
    PARTNER = "partner"

class EventStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

# ! Events
class Event(BaseModel):
    id: str = Field(..., min_length=1, description="Event identifier")
    activity: "Activity"

    name: str = Field(min_length=1)
    description: str = Field(min_length=1)
    notes: str = Field(default="")
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    image: str = Field(min_length=1)
    participants: int = Field(default=0)
    limit: Optional[int] = Field(default=None)
    schoolAccess: EventSchoolAccess = EventSchoolAccess.ALL
    label: EventLabel = EventLabel.WONDERHOOD

    city: str = Field(min_length=1)
    state: str = Field(min_length=1)
    address: str = Field(min_length=1)
    zipCode: str = Field(pattern=r'^\d{5}(-\d{4})?$')
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    startTime: Optional[str] = Field(min_length=None)
    endTime: Optional[str] = Field(min_length=None)
    ageMin: Optional[int] = Field(default=None)
    ageMax: Optional[int] = Field(default=None)

class EventCreate(BaseModel):
    activityId: str = Field(min_length=1)

    name: str = Field(min_length=1)
    description: str = Field(min_length=1)
    notes: str = Field(default="")
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    image: str = Field(min_length=0)
    participants: int = Field(default=0)
    limit: Optional[int] = Field(default=None)
    schoolAccess: EventSchoolAccess = EventSchoolAccess.ALL
    label: EventLabel = EventLabel.WONDERHOOD

    city: str = Field(min_length=1)
    state: str = Field(min_length=1)
    address: str = Field(min_length=1)
    zipCode: str = Field(pattern=r'^\d{5}(-\d{4})?$')
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    startTime: Optional[str] = Field(min_length=None)
    endTime: Optional[str] = Field(min_length=None)
    ageMin: Optional[int] = Field(default=None)
    ageMax: Optional[int] = Field(default=None)
    volunteerLimit: int = Field(default=3)

    userIds: List[str] = Field(default_factory=list)
    childIds: List[str] = Field(default_factory=list)

    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EventUpdate(BaseModel):
    activityId: Optional[str] = Field(default=None)

    name: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    notes: Optional[str] = Field(default=None)
    date: Optional[datetime] = Field(default=None)

    city: Optional[str] = Field(default=None)
    state: Optional[str] = Field(default=None)
    address: Optional[str] = Field(default=None)
    zipCode: str = Field(default= None, pattern=r'^\d{5}(-\d{4})?$')
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    startTime: Optional[str] = Field(default=None)
    endTime: Optional[str] = Field(default=None)
    ageMin: Optional[int] = Field(default=None)
    ageMax: Optional[int] = Field(default=None)
    volunteerLimit: Optional[int] = Field(default=None)

    image: Optional[str] = Field(default=None)
    participants: Optional[int] = Field(default=None)
    limit: Optional[int] = Field(default=None)
    schoolAccess: Optional[EventSchoolAccess] = Field(default=None)
    label: Optional[EventLabel] = Field(default=None)
    userIds: Optional[List[str]] = Field(default=None)
    childIds: Optional[List[str]] = Field(default=None)


class EventSubmit(BaseModel):
    """DTO for POST /event/submit — used by partners to propose an event for admin approval."""
    activityId: str = Field(min_length=1)
    name: str = Field(min_length=1)
    description: str = Field(min_length=1)
    notes: str = Field(default="")
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    image: str = Field(min_length=0)
    limit: Optional[int] = Field(default=None)
    schoolAccess: EventSchoolAccess = EventSchoolAccess.ALL
    label: EventLabel = EventLabel.PARTNER
    city: str = Field(min_length=1)
    state: str = Field(min_length=1)
    address: str = Field(min_length=1)
    zipCode: str = Field(pattern=r'^\d{5}(-\d{4})?$')
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    startTime: Optional[str] = Field(min_length=None)
    endTime: Optional[str] = Field(min_length=None)
    ageMin: Optional[int] = Field(default=None)
    ageMax: Optional[int] = Field(default=None)
    volunteerLimit: int = Field(default=3)

class EventStatusUpdate(BaseModel):
    """DTO for PATCH /event/{id}/status — admin approves or rejects a pending event."""
    status: EventStatus
    adminNotes: Optional[str] = Field(default=None, max_length=500)

class EnrollChildren(BaseModel):
    childIds: List[str]


# ! Enrichment Programs
class ProgramStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ProgramVenue(str, Enum):
    IN_PERSON = "in_person"
    ONLINE = "online"
    HYBRID = "hybrid"

class ProgramLabel(str, Enum):
    WONDERHOOD = "wonderhood"
    PARTNER = "partner"

class ProgramStatusUpdate(BaseModel):
    """DTO for PATCH /program/{id}/status — admin approves or rejects a pending program."""
    status: ProgramStatus
    adminNotes: Optional[str] = Field(default=None, max_length=500)

class ProgramPhase(BaseModel):
    """A single phase entry, e.g. {season: 'Fall', title: 'Foundations & Exploration'}"""
    season: str = Field(min_length=1, max_length=50)
    title: str = Field(min_length=1, max_length=100)

class EnrichmentProgram(BaseModel):
    id: str = Field(..., min_length=1)
    activity: "Activity"
    name: str
    description: str
    ageMin: int = Field(ge=4)
    ageMax: int = Field(ge=4)
    startDate: datetime
    endDate: datetime
    sessionSchedule: Optional[str] = None
    image: Optional[str] = None
    outcomes: List[str] = Field(default_factory=list)
    label: ProgramLabel = ProgramLabel.WONDERHOOD
    phases: Optional[List[ProgramPhase]] = None
    directorName: Optional[str] = None
    directorTitle: Optional[str] = None
    directorImage: Optional[str] = None
    directorBio: Optional[str] = None
    participants: int = Field(default=0)
    limit: Optional[int] = None
    venue: ProgramVenue = ProgramVenue.IN_PERSON
    city: Optional[str] = None
    state: Optional[str] = None
    address: Optional[str] = None
    zipCode: Optional[str] = Field(default=None, pattern=r'^\d{5}(-\d{4})?$')
    status: ProgramStatus = ProgramStatus.PENDING
    childIds: List[str] = Field(default_factory=list)
    userIds: List[str] = Field(default_factory=list)
    createdAt: datetime
    updatedAt: Optional[datetime] = None

class EnrichmentProgramCreate(BaseModel):
    activityId: Optional[str] = Field(default=None)
    name: str = Field(min_length=1)
    description: str = Field(min_length=1)
    ageMin: int = Field(ge=4)
    ageMax: int = Field(ge=4)
    startDate: datetime
    endDate: datetime
    sessionSchedule: Optional[str] = None
    image: Optional[str] = None
    outcomes: List[str] = Field(default_factory=list)
    label: ProgramLabel = ProgramLabel.WONDERHOOD
    phases: Optional[List[ProgramPhase]] = None
    directorName: Optional[str] = None
    directorTitle: Optional[str] = None
    directorImage: Optional[str] = None
    directorBio: Optional[str] = None
    limit: Optional[int] = None
    venue: ProgramVenue = ProgramVenue.IN_PERSON
    city: Optional[str] = None
    state: Optional[str] = None
    address: Optional[str] = None
    zipCode: Optional[str] = Field(default=None, pattern=r'^\d{5}(-\d{4})?$')
    childIds: List[str] = Field(default_factory=list)
    userIds: List[str] = Field(default_factory=list)

class EnrichmentProgramUpdate(BaseModel):
    activityId: Optional[str] = Field(default=None)
    name: Optional[str] = None
    description: Optional[str] = None
    ageMin: Optional[int] = Field(default=None, ge=4)
    ageMax: Optional[int] = Field(default=None, ge=4)
    startDate: Optional[datetime] = None
    endDate: Optional[datetime] = None
    sessionSchedule: Optional[str] = None
    image: Optional[str] = None
    outcomes: Optional[List[str]] = None
    label: Optional[ProgramLabel] = None
    phases: Optional[List[ProgramPhase]] = None
    directorName: Optional[str] = None
    directorTitle: Optional[str] = None
    directorImage: Optional[str] = None
    directorBio: Optional[str] = None
    limit: Optional[int] = None
    venue: Optional[ProgramVenue] = None
    city: Optional[str] = None
    state: Optional[str] = None
    address: Optional[str] = None
    zipCode: Optional[str] = Field(default=None, pattern=r'^\d{5}(-\d{4})?$')

class EnrichmentProgramSubmit(BaseModel):
    """DTO for POST /program/submit — used by partners to propose a program for admin approval."""
    activityId: Optional[str] = Field(default=None)
    name: str = Field(min_length=1)
    description: str = Field(min_length=1)
    ageMin: int = Field(ge=4)
    ageMax: int = Field(ge=4)
    startDate: datetime
    endDate: datetime
    sessionSchedule: Optional[str] = None
    image: Optional[str] = None
    outcomes: List[str] = Field(default_factory=list)
    phases: Optional[List[ProgramPhase]] = None
    directorName: Optional[str] = None
    directorTitle: Optional[str] = None
    directorImage: Optional[str] = None
    directorBio: Optional[str] = None
    limit: Optional[int] = None
    venue: ProgramVenue = ProgramVenue.IN_PERSON
    city: Optional[str] = None
    state: Optional[str] = None
    address: Optional[str] = None
    zipCode: Optional[str] = Field(default=None, pattern=r'^\d{5}(-\d{4})?$')

# ! Reviews
class Review(BaseModel):
    id: str = Field(..., min_length=1, description="Review identifier")
    rating: int = Field(
        ge = 1,
        le = 5
    )
    description: str = Field(min_length=20, max_length=400)
    event: "Event"
    parent: "User"
    createdAt: datetime
    updatedAt: datetime

class ReviewCreate(BaseModel):
    eventId: str = Field(min_length=1)
    parentId: str = Field(min_length=1)
    rating: int = Field(
        ge=1,
        le=5
    )
    description: str = Field(min_length=20, max_length=400)
    createdAt: datetime = Field(default_factory=datetime.now(timezone.utc))

class ReviewUpdate(BaseModel):
    rating: int = Field(
        ge=1,
        le=5
    )
    description: str = Field(min_length=20, max_length=400)

# ! Notifications
class Notification(BaseModel):
    id: str = Field(..., min_length=1, description="Notification identifier")
    description: str = Field(
        min_length = 1,
        max_length = 500,
    )
    title: str = Field(
        min_length = 1,
        max_length=80,
    )
    isRead: bool = Field(default=False)
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    userId: str

    class Config:
        form_attributes = True

class NotificationCreate(BaseModel):
    # id: str = Field(..., min_length=1, description="Notification identifier")
    description: str = Field(
        min_length = 1,
        max_length = 500,
    )
    title: str = Field(
        min_length = 1,
        max_length=80,
    )
    isRead: bool = Field(default=False)
    time: Optional[datetime] = None
    userId: Optional[str] = None

    class Config:
        form_attributes = True

class NotificationUpdate(BaseModel):
    description: Optional[str] = Field(default=None)
    title: Optional[str] = Field(default=None)
    isRead: Optional[bool] = Field(default=None)
    time: Optional[datetime] = None
    userId: Optional[str] = None
    
#! Jobs
class Jobs(BaseModel):
    id: str
    runAt: datetime
    reminderType: str
    status: str
    jobType: str
    sentAt: Optional[datetime] = None
    errorMessage: Optional[str] = None
    eventId: str

    class Config:
        form_attributes = True

# #! Emergency Contact
class EmergencyContactCreate(BaseModel):
    firstName: str = Field(min_length=1, max_length=100)
    lastName: str = Field(min_length=1, max_length=100)
    relationship: str = Field(min_length=1, max_length=200)
    phoneNumber: str = Field(pattern=r'^\+[0-9]\d{1,14}$')
    # priority: int = Field(ge=1, le=3)

class EmergencyContactUpdate(BaseModel):
    firstName: Optional[str] = Field(default=None)
    lastName: Optional[str] = Field(default=None)
    relationship: Optional[str] = Field(default=None)
    phoneNumber: Optional[str] = Field(default=None)
    # priority: Optional[int] = Field(default=None)

class EmergencyContactResponse(EmergencyContactCreate):
    id: str
    childId: str
    createdAt: datetime
    updatedAt: datetime

# ! Volunteer Opportunity models
class Venue(str, Enum):
   INDOORS= "Indoors"
   OUTDOORS="Outdoors"
   ONLINE="Online"


class VolunteerOpportunityCreate(BaseModel):
  title: str = Field(...,min_length=2, max_length=100, description="title for volunteer opportunity")
  venue: List[Venue] = Field(None, description="Venue types")
  duties: List[str] = Field(default_factory=list, description="list of duties")
  skills: List[str] = Field(default_factory=list, description="List of skills")
  time: str = Field(None, description="Time/schedule information")
  requirements: List[str] = Field(default_factory=list, description="Requirements")
  tags: List[str] = Field(default_factory=list, description="Tags for volunteer opportunity")
  minAge: int = Field(ge=16, description="Age requirement")
  bgCheckRequired: bool = Field(default=True, description="Background check requirement")
  volunteerIds: List[str] = Field(default_factory=list, description="Enrolled Volunteers")

  @field_validator("duties", "skills", "requirements", "tags", mode="before")
  def clean_string_lists(cls, v):
     if v is None:
         return []
     return [item.strip() for item in v if item and item.strip()]

class VolunteerOpportunityResponse(BaseModel):
    id: str = Field(..., description="Opportunity identifier")
    title: str
    venue: List[Venue]
    duties: List[str]
    skills: List[str]
    time: str
    requirements: List[str]
    tags: List[str]
    minAge: int
    bgCheckRequired: bool
    createdAt: datetime
    updatedAt: Optional[datetime]

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class VolunteerOpportunityUpdate(BaseModel):
    title: Optional[str] = Field(default=None)
    venue: Optional[List[Venue]] = Field(default=None)
    duties: Optional[List[str]] = Field(default=None)
    skills: Optional[List[str]] = Field(default=None)
    time: Optional[str] = Field(default=None)
    requirements: Optional[List[str]] = Field(default=None)
    tags: Optional[List[str]] = Field(default=None)
    minAge: Optional[int] =Field(None, ge=16, le=100)
    bgCheckRequired: Optional[bool] = Field(default=None)

    @field_validator("duties", "skills", "requirements", "tags", mode="before")
    def clean_string_list(cls, v):
        if v is None or v == []:
            return None
        return [item.strip() for item in v if item and item.strip()]

#! Partnership
class PartnerType(str, Enum):
    venue     = "venue"
    program   = "program"
    resource  = "resource"
    education = "education"

class PartnerStatus(str, Enum):
    new        = "new"
    reviewing  = "reviewing"
    approved   = "approved"
    rejected   = "rejected"

class PartnerApplicationBase(BaseModel):
    orgName: str = Field(..., min_length=1, max_length=200)
    contactName: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    partnerType: PartnerType

    website: Optional[HttpUrl] = None
    city: Optional[str] = Field(default=None, max_length=100)
    state: Optional[str] = Field(default=None, max_length=100)

    howCanYouHelp: Optional[str] = Field(default=None, max_length=2000)
    preferredDates: Optional[str] = Field(default=None, max_length=300)
    budgetOrInKind: Optional[str] = Field(default=None, max_length=300)
    notes: Optional[str] = Field(default=None, max_length=2000)


class PartnerApplicationCreate(PartnerApplicationBase):
    """DTO for POST /partners"""
    pass


class PartnerApplicationUpdate(BaseModel):
    """If need for future PATCH/PUT — all fields optional"""
    orgName: Optional[str] = Field(default=None, min_length=1, max_length=200)
    contactName: Optional[str] = Field(default=None, min_length=1, max_length=120)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=40)
    partnerType: Optional[PartnerType] = None

    website: Optional[HttpUrl] = None
    city: Optional[str] = Field(default=None, max_length=100)
    state: Optional[str] = Field(default=None, max_length=100)

    howCanYouHelp: Optional[str] = Field(default=None, max_length=2000)
    preferredDates: Optional[str] = Field(default=None, max_length=300)
    budgetOrInKind: Optional[str] = Field(default=None, max_length=300)
    notes: Optional[str] = Field(default=None, max_length=2000)

    # Changing status from the admin panel
    status: Optional[PartnerStatus] = None


class PartnerApplicationResponse(BaseModel):
    """That is convenient to return to the outside"""
    id: str
    orgName: str
    contactName: str
    email: EmailStr
    partnerType: PartnerType
    status: PartnerStatus = PartnerStatus.new
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        from_attributes = True 
    userId: Optional[str] = None

# ! Donations

class DonationCreate(BaseModel):
    donationType: str
    amount: int
    email: Optional[str] = None
    userId: Optional[str] = None


# ! Tax Return Acknowledgment Credentials

class TaxReturnCredentialsCreate(BaseModel):
    donationId: Optional[str] = Field(default=None)
    firstName: str = Field(..., min_length=1, max_length=100, description="First Name")
    lastName: str = Field(..., min_length=1, max_length=100, description="Last Name")
    acknowledgementRequested: bool = Field(default=False, description="Tax Return Request")
    email: EmailStr = Field(None, description="Email")
    address: str = Field(min_length=3, max_length=200)
    address2: Optional[str] = Field(default=None, max_length=200)
    city: str = Field(min_length=1)
    state: str = Field(min_length=1)
    zipCode: str = Field(pattern=r'^\d{5}(-\d{4})?$')
    phoneNumber: Optional[str] = Field(default=None, pattern=r'^[0-9]\d{1,12}$')
    requestSent: bool = Field(default=False, description="Tax return sent to user")

class TaxReturnCredentialsUpdate(BaseModel):
    firstName: Optional[str] = Field(None, min_length=1, max_length=100, description="First Name")
    lastName: Optional[str] = Field(None, min_length=1, max_length=100, description="Last Name")
    acknowledgementRequested: Optional[bool] = Field(None, description="Tax Return Request")
    email: Optional[EmailStr] = Field(None, description="Email")
    address: Optional[str] = Field(None, min_length=3, max_length=200)
    address2: Optional[str] = Field(None, max_length=200)
    city: Optional[str] = Field(None, min_length=1)
    state: Optional[str] = Field(None, min_length=1)
    zipCode: Optional[str] = Field(None, pattern=r'^\d{5}(-\d{4})?$')
    phoneNumber: Optional[str] = Field(None, pattern=r'^[0-9]\d{1,12}$')
    requestSent: Optional[bool] = Field(None, description="Tax return sent to user")

    class Config:
        extra = "forbid"