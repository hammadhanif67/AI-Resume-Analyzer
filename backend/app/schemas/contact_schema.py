from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=120)
    message: str = Field(..., min_length=1, max_length=5000)


class ContactMessageStatusUpdate(BaseModel):
    status: str = Field(..., min_length=1, max_length=50)


class ContactMessageResponse(ContactMessageCreate):
    id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
