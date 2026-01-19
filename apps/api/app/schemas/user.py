from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserProfileBase(BaseModel):
    full_name: Optional[str] = None
    role: str = "customer"

class UserProfileCreate(UserProfileBase):
    pass

class UserProfile(UserProfileBase):
    id: UUID
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
