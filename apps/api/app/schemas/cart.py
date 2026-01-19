from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import List, Optional
from app.schemas.product import Product

class CartItemBase(BaseModel):
    product_id: UUID
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItem(CartItemBase):
    id: UUID
    cart_id: UUID
    product: Optional[Product] = None # For returning full details
    
    model_config = ConfigDict(from_attributes=True)

class Cart(BaseModel):
    id: UUID
    user_id: UUID
    items: List[CartItem] = []

    model_config = ConfigDict(from_attributes=True)
