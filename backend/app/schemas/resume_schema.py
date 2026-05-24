from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResumeResponse(BaseModel):
    id: int
    user_id: int
    file_name: str
    file_path: str
    file_type: str
    file_size: int
    processing_status: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResumeDetailResponse(ResumeResponse):
    extracted_text: str | None = None
