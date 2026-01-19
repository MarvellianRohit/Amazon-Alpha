from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List
from uuid import UUID
from app.api.deps import get_current_user
from app.core.security import get_supabase
from app.schemas.product import Product, ProductCreate, ProductUpdate
from supabase import Client

router = APIRouter()

@router.get("/", response_model=List[Product])
def list_products():
    supabase = get_supabase()
    response = supabase.table("products").select("*").execute()
    return response.data

@router.get("/{id}", response_model=Product)
def get_product(id: UUID):
    supabase = get_supabase()
    response = supabase.table("products").select("*").eq("id", str(id)).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return response.data[0]

@router.post("/", response_model=Product)
def create_product(product: ProductCreate, user = Depends(get_current_user)):
    # Verify user role is vendor (optional: enforce here or rely on RLS)
    # RLS checks (auth.uid() = vendor_id) so we must supply vendor_id matching auth.uid()
    # But for cleaner API, we inject it.
    
    product_data = product.model_dump()
    product_data["vendor_id"] = user.id
    
    supabase = get_supabase()
    # Ensure RLS allows this. supabase-py uses service key if not configured with auth? 
    # Actually, getting a fresh client in `get_supabase` uses generic env keys. 
    # To properly trigger RLS for the *user*, we should ideally pass the user's token to Supabase.
    # However, supabase-py `create_client` is usually admin or anon.
    # For now, we will rely on manual checks or just insert with the service role if we trusted the backend Auth check.
    # BETTER: We should forward the user's token or rely on backend logic.
    # Since we verified the token in `get_current_user`, we know who they are.
    # We will insert standardly.
    
    response = supabase.table("products").insert(product_data).execute()
    
    # Check for RLS error if any, though supabase-py might raise exception
    if not response.data:
         raise HTTPException(status_code=400, detail="Could not create product")
    return response.data[0]

@router.put("/{id}", response_model=Product)
def update_product(id: UUID, product_update: ProductUpdate, user = Depends(get_current_user)):
    supabase = get_supabase()
    
    # 1. Verify ownership (since we are using server-side client which bypasses RLS unless scoped)
    # Note: If `get_supabase` uses SERVICE_KEY it bypasses RLS. If ANON_KEY, it respects RLS but acts as anon.
    # To act as USER, we need `supabase.auth.set_session(access_token)`.
    # For simple backend implementation now, we will manually check ownership.
    
    existing = supabase.table("products").select("vendor_id").eq("id", str(id)).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if existing.data[0]['vendor_id'] != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this product")

    update_data = product_update.model_dump(exclude_unset=True)
    response = supabase.table("products").update(update_data).eq("id", str(id)).execute()
    
    return response.data[0]


@router.post("/create", response_model=Product)
def create_product_multipart(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    category: str = Form(...),
    files: List[UploadFile] = File(None),
    user = Depends(get_current_user)
):
    supabase = get_supabase()
    
    # 1. Upload Images to Supabase Storage
    image_url = None
    if files:
        # Just taking the first file as the main image for now
        file = files[0]
        file_content = file.file.read()
        file_path = f"products/{user.id}/{file.filename}"
        
        try:
            # Assuming bucket 'product-images' exists
            supabase.storage.from_("product-images").upload(
                path=file_path,
                file=file_content,
                file_options={"content-type": file.content_type}
            )
            
            # Get Public URL
            image_url = supabase.storage.from_("product-images").get_public_url(file_path)
        except Exception as e:
            print(f"Upload failed: {e}") 
            
    # 2. Insert Product
    product_data = {
        "name": name,
        "description": description,
        "price": price,
        "stock": stock,
        "category": category,
        "vendor_id": user.id,
        "imageUrl": image_url
    }
    
    response = supabase.table("products").insert(product_data).execute()
    
    if not response.data:
         raise HTTPException(status_code=400, detail="Could not create product")
    return response.data[0]

