from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from app.api.deps import get_current_user
from app.core.security import get_supabase
from app.schemas.cart import Cart, CartItemCreate, CartItemUpdate
from typing import List

router = APIRouter()

@router.get("/", response_model=Cart)
def get_my_cart(user = Depends(get_current_user)):
    supabase = get_supabase()
    
    # 1. Get Cart ID
    cart_res = supabase.table("carts").select("*").eq("user_id", user.id).execute()
    
    if not cart_res.data:
        # Should have been created by trigger, but create if missing
        cart_res = supabase.table("carts").insert({"user_id": user.id}).execute()
        
    cart = cart_res.data[0]
    
    # 2. Get Items with Product details
    # Supabase allows deep joins? Yes: select(*, products(*))
    # Note: "product:products(*)" syntax depends on FK name or relation.
    # Assuming standard relation detection.
    
    items_res = supabase.table("cart_items")\
        .select("*, product:products(*)")\
        .eq("cart_id", cart['id'])\
        .execute()
        
    cart['items'] = items_res.data
    return cart

@router.post("/items", response_model=Cart)
def add_item(item: CartItemCreate, user = Depends(get_current_user)):
    supabase = get_supabase()
    
    # 1. Get Cart
    cart_res = supabase.table("carts").select("id").eq("user_id", user.id).execute()
    if not cart_res.data:
         cart_res = supabase.table("carts").insert({"user_id": user.id}).execute()
    cart_id = cart_res.data[0]['id']
    
    # 2. Check if item exists
    existing = supabase.table("cart_items")\
        .select("*")\
        .eq("cart_id", cart_id)\
        .eq("product_id", str(item.product_id))\
        .execute()
        
    if existing.data:
        # Update quantity
        new_qty = existing.data[0]['quantity'] + item.quantity
        supabase.table("cart_items")\
            .update({"quantity": new_qty})\
            .eq("id", existing.data[0]['id'])\
            .execute()
    else:
        # Insert new
        supabase.table("cart_items").insert({
            "cart_id": cart_id,
            "product_id": str(item.product_id),
            "quantity": item.quantity
        }).execute()
        
    # Return full cart
    return get_my_cart(user)

@router.delete("/items/{item_id}")
def remove_item(item_id: UUID, user = Depends(get_current_user)):
    supabase = get_supabase()
    
    # Verify ownership via cart lookup? RLS handles it if we use user token.
    # Server client bypasses RLS if service role.
    # We must be careful.
    # Cheap check: Just delete where ID matches AND cart belongs to user?
    # Or fetch cart id first.
    
    cart_res = supabase.table("carts").select("id").eq("user_id", user.id).execute()
    if not cart_res.data:
        raise HTTPException(status_code=404, detail="Cart not found")
        
    cart_id = cart_res.data[0]['id']
    
    supabase.table("cart_items")\
        .delete()\
        .eq("id", str(item_id))\
        .eq("cart_id", cart_id)\
        .execute()
        
    return get_my_cart(user)
