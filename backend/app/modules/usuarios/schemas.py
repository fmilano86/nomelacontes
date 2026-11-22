from datetime import datetime
from typing import Literal
from pydantic import ConfigDict, EmailStr
from sqlmodel import SQLModel
from pydantic import Field

class UserCreate(SQLModel):
    username: str = Field(min_length=3, max_length=50, pattern=r'^[a-zA-Z0-9_.-]+$')
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

class UserPublic(SQLModel):
    id: int
    username: str
    full_name: str
    email: str
    role: Literal['user', 'admin']
    disabled: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
