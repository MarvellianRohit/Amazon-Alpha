from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import List, Optional
from decimal import Decimal

class OrderItemBase(BaseModel):
    product_id: UUID
    quantity: int
    price_at_purchase: Decimal

class OrderItem(OrderItemBase):
    id: UUID
    order_id: UUID
    # Optional: include active product details if needed, but price_at_purchase is key
    
    model_config = ConfigDict(from_attributes=True)

class OrderBase(BaseModel):
    total_amount: Decimal
    status: str

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    items: List[OrderItem] = []

    model_config = ConfigDict(from_attributes=True)
