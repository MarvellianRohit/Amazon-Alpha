from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID
from app.api.deps import get_current_user
from app.core.security import get_supabase
from app.schemas.order import Order
from decimal import Decimal

router = APIRouter()

@router.post("/checkout", response_model=Order)
def checkout(user = Depends(get_current_user)):
    supabase = get_supabase()
    
    # 1. Get Cart Items
    cart_res = supabase.table("carts").select("id").eq("user_id", user.id).execute()
    if not cart_res.data:
        raise HTTPException(status_code=400, detail="No active cart found")
    cart_id = cart_res.data[0]['id']
    
    items_res = supabase.table("cart_items")\
        .select("*, product:products(*)")\
        .eq("cart_id", cart_id)\
        .execute()
        
    if not items_res.data:
        raise HTTPException(status_code=400, detail="Cart is empty")
        
    items = items_res.data
    
    # 2. Calculate Total & Validate Stock
    total = Decimal(0)
    order_items_data = []
    
    for item in items:
        qty = item['quantity']
        product = item['product']
        
        if not product:
            raise HTTPException(status_code=400, detail=f"Product for item {item['id']} not found")
            
        if product['stock'] < qty:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product['title']}")
            
        price = Decimal(str(product['price'])) # Convert float/string to Decimal safely
        total += price * qty
        
        order_items_data.append({
            "product_id": product['id'],
            "quantity": qty,
            "price_at_purchase": float(price) # Supabase expects float/numeric
        })

    # 3. Create Order
    # Note: A real transaction would be best. Supabase/PostgREST doesn't expose explicit transactions via API easily 
    # without RPC. For V1 we do sequential steps. Failure mid-way is a risk but acceptable for MVP.
    
    order_res = supabase.table("orders").insert({
        "user_id": user.id,
        "total_amount": float(total),
        "status": "paid" # Mock payment
    }).execute()
    
    if not order_res.data:
        raise HTTPException(status_code=500, detail="Failed to create order")
        
    order = order_res.data[0]
    
    # 4. Create Order Items & Decrement Stock
    for item_data in order_items_data:
        # Add order_id
        item_data["order_id"] = order['id']
        supabase.table("order_items").insert(item_data).execute()
        
        # Decrement Stock
        # We need to fetch current stock again? Or rely on previous fetch?
        # Ideally atomic decrement: update products set stock = stock - qty where id = ...
        # Supabase-py doesn't easily do "stock - 1" without RPC.
        # We'll read-modify-write.
        
        # Re-fetch for safety or use loop data? Use loop data for speed in MVP.
        # But wait, we need to know the *current* stock in DB to decrement correctly if it changed?
        # Let's assume naive read-modify-write.
        
        pass # Optimization: do this in a batch or RPC later.
        
        # Let's do the update:
        # We know product['stock'] from step 1.
        # We should ideally decrement.
        
        # Actually, let's just do it:
        current_stock = [i['product']['stock'] for i in items if i['product']['id'] == item_data['product_id']][0]
        new_stock = current_stock - item_data['quantity']
        supabase.table("products").update({"stock": new_stock}).eq("id", item_data['product_id']).execute()

    # 5. Clear Cart
    supabase.table("cart_items").delete().eq("cart_id", cart_id).execute()
    
    # 6. Return Order (with items populated?)
    # Return basic order details.
    
    return order


@router.get("/", response_model=List[Order])
def list_orders(user = Depends(get_current_user)):
    supabase = get_supabase()
    # Fetch orders + items
    res = supabase.table("orders").select("*, items:order_items(*)").eq("user_id", user.id).order("created_at", desc=True).execute()
    return res.data
