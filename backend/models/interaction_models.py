from __future__ import annotations
from pydantic import BaseModel, Field, field_validator
from typing import List, TYPE_CHECKING, Optional
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
    limit: int = Field(default=10)

    city: str = Field(min_length=1)
    state: str = Field(min_length=1)
    address: str = Field(min_length=1)
    zipCode: str = Field(pattern=r'^\d{5}(-\d{4})?$')
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    startTime: str = Field(min_length=1)
    endTime: str = Field(min_length=1)

class EventCreate(BaseModel):
    activityId: str = Field(min_length=1)

    name: str = Field(min_length=1)
    description: str = Field(min_length=1)
    notes: str = Field(default="")
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    image: str = Field(min_length=0)
    participants: int = Field(default=0)
    limit: int = Field(default=10)

    city: str = Field(min_length=1)
    state: str = Field(min_length=1)
    address: str = Field(min_length=1)
    zipCode: str = Field(pattern=r'^\d{5}(-\d{4})?$')
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    startTime: str = Field(min_length=1)
    endTime: str = Field(min_length=1)
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
    volunteerLimit: Optional[int] = Field(default=None)

    image: Optional[str] = Field(default=None)
    participants: Optional[int] = Field(default=None)
    limit: Optional[int] = Field(default=None)
    userIds: Optional[List[str]] = Field(default=None)
    childIds: Optional[List[str]] = Field(default=None)


class EnrollChildren(BaseModel):
    childIds: List[str]

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
    time: datetime = Field(default_factory=datetime.now(timezone.utc))
    userId: str = Field(..., description="User id associated with the notification")

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
    time: datetime = Field(default_factory=datetime.now(timezone.utc))
    userId: str | None = None

    class Config:
        form_attributes = True

class NotificationUpdate(BaseModel):
    description: Optional[str] = Field(default=None)
    title: Optional[str] = Field(default=None)
    isRead: Optional[bool] = Field(default=None)
    userId: Optional[str] = Field(default=None)

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
    phoneNumber: str = Field(pattern=r'^\+[1-9]\d{1,14}$')
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

# ! Donations

class DonationCreate(BaseModel):
    donationType: str
    amount: int
    email: Optional[str] = None
    userId: Optional[str] = None