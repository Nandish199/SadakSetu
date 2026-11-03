from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

from app.models.enums import AssignmentStatus, ComplaintStatus, SeverityLevel, TeamAvailability


class TeamCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=2, max_length=160)
    lead_name: str = Field(min_length=2, max_length=160)
    phone: str = Field(min_length=5, max_length=40)
    email: EmailStr
    availability: TeamAvailability = TeamAvailability.AVAILABLE


class TeamUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = Field(default=None, min_length=2, max_length=160)
    lead_name: str | None = Field(default=None, min_length=2, max_length=160)
    phone: str | None = Field(default=None, min_length=5, max_length=40)
    email: EmailStr | None = None
    availability: TeamAvailability | None = None
    is_active: bool | None = None

    @model_validator(mode="after")
    def require_a_change(self):
        values = (self.name, self.lead_name, self.phone, self.email, self.availability, self.is_active)
        if all(value is None for value in values):
            raise ValueError("At least one team field must be provided")
        return self


class TeamAvailabilityUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    availability: TeamAvailability


class TeamResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    lead_name: str
    phone: str
    email: EmailStr
    availability: TeamAvailability
    is_active: bool
    created_at: datetime
    updated_at: datetime


class TeamListResponse(BaseModel):
    items: list[TeamResponse]
    total: int
    page: int
    page_size: int


class AssignedComplaintResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    complaint_number: str
    status: ComplaintStatus
    severity: SeverityLevel
    title: str
    assigned_team_id: UUID | None
    created_at: datetime
    updated_at: datetime


class TeamAssignmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    complaint_id: UUID
    team_id: UUID
    assigned_by_id: UUID
    status: AssignmentStatus
    released_at: datetime | None
    created_at: datetime
    updated_at: datetime
