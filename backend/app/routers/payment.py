import json
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from sqlmodel import Session

from app.models.users import User
from app.core.security import get_current_user
from app.models.payment import CreateOrderRequest, CreditPlanRead, RazorpayOrderResponse
from app.core.db import get_session
from app.services.payment_service import (
    create_credit_order,
    get_all_credit_plans,
    handle_payment_webhook,
    verify_signature,
)
from app.core import config


router = APIRouter(prefix="/payment", tags=["Payment"])


@router.get(
    "/plans",
    response_model=List[CreditPlanRead],
    status_code=status.HTTP_200_OK,
)
def list_credit_plans(db: Annotated[Session, Depends(get_session)]):
    return get_all_credit_plans(db)


@router.post(
    "/create-order",
    response_model=RazorpayOrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_razorpay_order(
    plan: CreateOrderRequest,
    db: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    order = create_credit_order(db=db, user_id=current_user.id, plan_id=plan.plan_id)
    return order


@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    db: Annotated[Session, Depends(get_session)],
    x_razorpay_signature: str = Header(None),
):
    raw_body = await request.body()
    if not verify_signature(
        raw_body, x_razorpay_signature, config.RAZORPAY_WEBHOOK_SECRET
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature"
        )

    payload = json.loads(raw_body)
    handle_payment_webhook(payload, db)
    return {"status": "ok"}
