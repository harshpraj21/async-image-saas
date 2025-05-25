from datetime import datetime, timezone
import json
from typing import List, Optional
import uuid
from pydantic import BaseModel, field_validator
from sqlmodel import Field, SQLModel
from enum import Enum


class TaskStatus(str, Enum):
    queued = "queued"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class Tasks(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    title: Optional[str] = Field(nullable=False, max_length=255)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    image_path: str
    task_metadata: Optional[str] = None
    status: TaskStatus = Field(default=TaskStatus.queued)
    result_path: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TaskRead(BaseModel):
    id: uuid.UUID
    title: Optional[str]
    image_path: str
    status: TaskStatus
    task_metadata: Optional[dict]
    created_at: datetime
    result_path: Optional[str] = None

    @field_validator("task_metadata", mode="before")
    @classmethod
    def parse_metadata(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return {}
        return v

    class Config:
        from_attributes = True

class TaskReadStatus(BaseModel):
    id: uuid.UUID
    status: TaskStatus
    
    class Config:
        from_attributes = True
