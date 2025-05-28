import traceback
import uuid
from fastapi import HTTPException, status
from loguru import logger
import razorpay
from sqlmodel import Session, select

from app.core import config

import hmac
import hashlib

from app.models.payment import (
    CreditOrder,
    CreditPlan,
    OrderStatus,
    PaymentHistory,
    PaymentStatus,
)
from app.models.users import User


_client = razorpay.Client(auth=(config.RAZORPAY_KEY_ID, config.RAZORPAY_KEY_SECRET))


def get_all_credit_plans(db: Session):
    return db.exec(select(CreditPlan).order_by(CreditPlan.credits.asc())).all()


def create_credit_order(
    db: Session, user_id: uuid.UUID, plan_id: uuid.UUID
) -> CreditOrder:
    plan = db.get(CreditPlan, plan_id)
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    try:
        payload = {
            "amount": plan.price * 100,
            "currency": "INR",
            "payment_capture": 1,
        }
        logger.info(payload)
        razorpay_order = _client.order.create(payload)
    except Exception as e:
        logger.info(f"Error: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    order = CreditOrder(
        user_id=user_id,
        razorpay_order_id=razorpay_order["id"],
        credits_requested=plan.credits,
        amount=razorpay_order["amount"],
        currency="INR",
        status=OrderStatus.created,
    )

    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def verify_signature(raw_body: bytes, signature: str, secret: str) -> bool:
    generated_signature = hmac.new(
        key=bytes(secret, "utf-8"), msg=raw_body, digestmod=hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(generated_signature, signature)


def handle_payment_webhook(payload: dict, db: Session):
    event = payload.get("event")
    payment = payload.get("payload", {}).get("payment", {}).get("entity", {})

    razorpay_order_id = payment.get("order_id")
    payment_id = payment.get("id")
    amount = payment.get("amount")
    currency = payment.get("currency", "INR")

    if not razorpay_order_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Missing Razorpay order ID",
        )

    order = db.exec(
        select(CreditOrder).where(CreditOrder.razorpay_order_id == razorpay_order_id)
    ).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    payment_log = db.exec(
        select(PaymentHistory).where(PaymentHistory.payment_id == payment_id)
    ).first()
    if not payment_log:
        payment_log = PaymentHistory(
            user_id=order.user_id,
            order_id=order.id,
            payment_id=payment_id,
            amount=amount,
            currency=currency,
        )

    # Handle different event types
    if event == "payment.captured":
        order.status = OrderStatus.paid
        payment_log.status = PaymentStatus.success

        # Add credits to user
        user = db.exec(select(User).where(User.id == order.user_id)).first()
        user.credits += order.credits_requested
        db.add(user)
        logger.success("Payment Successful. User credits added")

    elif event == "payment.failed":
        order.status = OrderStatus.failed
        payment_log.status = PaymentStatus.failed

    elif event == "refund.created":
        payment_log.status = PaymentStatus.refunded

    else:
        # Unknown/unhandled event
        return

    db.add(order)
    db.add(payment_log)
    db.commit()
