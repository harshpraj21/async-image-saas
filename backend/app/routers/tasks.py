from typing import Annotated, List
from uuid import UUID
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from loguru import logger
from sqlmodel import Session

from app.core.db import get_session
from app.core.security import get_current_user
from app.models.tasks import TaskPagination, TaskRead, TaskReadStatus
from app.models.users import User
from app.services.task_service import (
    create_task,
    delete_task,
    get_task_by_id,
    get_task_totals,
    get_user_tasks,
)


router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/", response_model=TaskPagination, status_code=status.HTTP_200_OK)
def get_tasks(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_session)],
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(le=100)] = 10,
):
    tasks = get_user_tasks(user_id=current_user.id, db=db, limit=limit, offset=offset)
    total_tasks = get_task_totals(user_id=current_user.id, db=db)
    return TaskPagination(total=total_tasks, results=tasks)


@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def submit_task(
    title: Annotated[str, Form(...)],
    image: Annotated[UploadFile, File(...)],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_session)],
):
    if current_user.credits < 1:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Insufficient credits.",
        )
    task = create_task(title=title, image=image, user=current_user, db=db)
    return task


@router.get("/{task_id}", response_model=TaskRead, status_code=status.HTTP_200_OK)
def get_task(
    task_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_session)],
):
    task = get_task_by_id(db, task_id=task_id, user_id=current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task


@router.get(
    "/status/{task_id}", response_model=TaskReadStatus, status_code=status.HTTP_200_OK
)
def get_task_status(
    task_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_session)],
):
    task = get_task_by_id(db, task_id=task_id, user_id=current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task_route(
    task_id: UUID,
    db: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    deleted = delete_task(db, task_id, current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return
