from fastapi import APIRouter
from .auth import router as auth_router
from .tasks import router as task_router
from .payment import router as payment_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(task_router)
router.include_router(payment_router)