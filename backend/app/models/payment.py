from datetime import datetime, timezone
from enum import Enum
from typing import Optional
import uuid
from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class OrderStatus(str, Enum):
    created = "created"
    attempted = "attempted"
    paid = "paid"
    failed = "failed"


class PaymentStatus(str, Enum):
    success = "success"
    failed = "failed"
    refunded = "refunded"
    pending = "pending"


class CreditPlan(SQLModel, table=True):
    __tablename__ = "credit_plans"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    credit_amount: int = Field(..., gt=0)
    price_in_rupees: int = Field(..., gt=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CreditOrder(SQLModel, table=True):
    __tablename__ = "credit_orders"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    razorpay_order_id: Optional[str] = Field(default=None, index=True, unique=True)
    credits_requested: int = Field(..., gt=0)
    amount: int = Field(..., gt=0, description="In Paise")
    currency: str = Field(default="INR", max_length=10)
    status: OrderStatus = Field(default=OrderStatus.created)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
class PaymentHistory(SQLModel, table=True):
    __tablename__ = "payment_history"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    order_id: uuid.UUID = Field(foreign_key="credit_orders.id")
    payment_id: Optional[str] = Field(default=None, index=True)
    status: PaymentStatus = Field(default=PaymentStatus.pending)
    amount: int = Field(..., gt=0)
    currency: str = Field(default="INR", max_length=10)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RazorpayOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
