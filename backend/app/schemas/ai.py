from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.enums import DetectionStatus


class AIDetectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    complaint_image_id: UUID
    model_name: str
    model_version: str
    status: DetectionStatus
    processing_time_ms: int | None
    detection_count: int
    result_metadata: dict[str, Any] | None
    error_message: str | None
    created_at: datetime
