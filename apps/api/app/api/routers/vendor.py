from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.vendor_deps import require_vendor_role
from app.api.deps import get_current_user
from app.core.security import get_supabase
from app.schemas.product import Product
from typing import Any
User = Any

router = APIRouter()

@router.get("/products", response_model=List[Product])
def list_vendor_products(user: User = Depends(require_vendor_role)):
    """
    List all products belonging to the authenticated vendor.
    """
    supabase = get_supabase()
    # Enforce filtering by vendor_id = user.id
    response = supabase.table("products").select("*").eq("vendor_id", user.id).execute()
    
    return response.data
