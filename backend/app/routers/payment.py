from typing import Annotated
import uuid
from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from sqlmodel import Session

from app.models.users import User
from app.core.security import get_current_user
from app.models.payment import RazorpayOrderResponse
from app.core.db import get_session
from app.services.payment_service import (
    create_credit_order,
    handle_payment_webhook,
    verify_signature,
)
from app.core import config


router = APIRouter(prefix="/payment", tags=["Payment"])


# @router.get("/plans")
# def list_credit_plans(db: Session = Depends(get_db)):
#     return db.exec(select(CreditPlan)).all()


@router.post(
    "/create-order",
    response_model=RazorpayOrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_razorpay_order(
    plan_id: uuid.UUID,
    db: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    order = create_credit_order(db=db, user_id=current_user.id, plan_id=plan_id)
    return {
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"],
    }


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
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid signature"
        )

    payload = await request.json()
    handle_payment_webhook(payload, db)
    return {"status": "ok"}
