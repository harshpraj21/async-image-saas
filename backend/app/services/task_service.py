import json
import os
from typing import List
import uuid
from fastapi import UploadFile
from sqlalchemy import Select
from sqlmodel import Session, select
from loguru import logger
from PIL import Image

from app.core.config import config
from app.models.tasks import Tasks


def save_image(image: UploadFile) -> str:
    os.makedirs(config.UPLOAD_DIR, exist_ok=True)
    extension = image.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{extension}"
    file_path = os.path.join(config.UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        buffer.write(image.file.read())
    return file_path


def extract_metadata(image_path: str) -> str:
    image = Image.open(image_path)
    return json.dumps(
        {"format": image.format, "mode": image.mode, "size": image.size, "info" : image.info}
    )


def create_task(db: Session, user_id: str, title: str | None, image: UploadFile):
    logger.info(image)
    image_path = save_image(image)
    metadata = extract_metadata(image_path)
    logger.info(f"Image: {image_path} \nMetadata: {metadata}\n{type(metadata)}")

    task = Tasks(
        title=title, user_id=user_id, task_metadata=metadata, image_path=image_path
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def get_user_tasks(
    db: Session, user_id: uuid.UUID, limit: int, offset: int
) -> List[Tasks]:
    stmt = (
        select(Tasks)
        .where(Tasks.user_id == user_id)
        .order_by(Tasks.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    return db.exec(stmt).all()


def get_task_by_id(db: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> Tasks:
    stmt = select(Tasks).where(Tasks.id == task_id, Tasks.user_id == user_id)
    return db.exec(stmt).first()

def delete_task(db: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    task = get_task_by_id(db, task_id, user_id)
    if not task:
        return False
    db.delete(task)
    db.commit()
    return True