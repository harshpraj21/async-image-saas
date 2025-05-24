from typing import Optional
import uuid

from pydantic import EmailStr, BaseModel
from sqlmodel import Field, SQLModel
from enum import Enum
from datetime import datetime, timezone


class UserRole(str, Enum):
    admin = "admin"
    user = "user"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(nullable=False, max_length=255)
    email: str = Field(index=True, unique=True, nullable=False, max_length=255)
    hashed_password: str = Field(nullable=False, max_length=255)
    role: Optional[UserRole] = Field(default=UserRole.user)
    credits: int = Field(default=0)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )
    last_login: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )

    def __repr__(self):
        return f"<User(name={self.name}, email={self.email}>"


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    credits: int

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
