from typing import List
import uuid
from fastapi import UploadFile
from sqlmodel import Session, select
from loguru import logger

from app.models.tasks import Tasks
from app.models.users import User
from app.utils.image_utils import extract_metadata, save_image
from app.workers.task_worker import process_image_task




def create_task(db: Session, user: User, title: str | None, image: UploadFile):
    image_path = save_image(image)
    metadata = extract_metadata(image_path)

    task = Tasks(
        title=title, user_id=user.id, task_metadata=metadata, image_path=image_path
    )
    db.add(task)
    
    user.credits -= 1
    db.add(user)


    db.commit()
    db.refresh(task)
    
    logger.info("Calling process worker")
    process_image_task.delay(str(task.id), image_path)

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