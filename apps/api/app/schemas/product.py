from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from decimal import Decimal

class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: Decimal
    stock: int = 0
    images: List[str] = []
    category: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None
    images: Optional[List[str]] = None
    category: Optional[str] = None

class Product(ProductBase):
    id: UUID
    vendor_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
