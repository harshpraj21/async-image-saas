import time
import uuid
from celery import Celery
from loguru import logger
from sqlmodel import Session

from app.core.config import config
from app.core.db import engine
from app.models.tasks import TaskStatus, Tasks
from app.utils.image_utils import apply_grayscale


celery_app = Celery(
    "image_tasks",
    broker=config.REDIS_URL,
    backend=config.REDIS_URL,
    include=["app.workers.task_worker"],
)

celery_app.conf.task_routes = {
    "app.workers.task_worker.process_image_task": {"queue": "image_tasks"},
}

@celery_app.task(name="app.workers.task_worker.process_image_task")
def process_image_task(task_id: str, image_path: str):
    time.sleep(5) # Delay of 5 seconds 
    with Session(engine) as db:
        logger.info(f"Processing {task_id}")
        task = db.get(Tasks, uuid.UUID(task_id))
        if not task:
            logger.info("Task not found")
            return

        task.status = TaskStatus.processing
        db.add(task)
        db.commit()

        try:
            result_path = apply_grayscale(image_path)
            task.result_path = result_path
            task.status = TaskStatus.completed
            logger.success("Image processed successfuly!")
        except Exception:
            logger.warning("Image processed failed!")
            task.status = TaskStatus.failed

        db.add(task)
        db.commit()