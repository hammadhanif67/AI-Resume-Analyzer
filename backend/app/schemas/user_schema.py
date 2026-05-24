from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, computed_field


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    role: str
    profile_image: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    @property
    def profile_image_url(self) -> str | None:
        return self.profile_image


class UserProfileUpdate(BaseModel):
    name: str
