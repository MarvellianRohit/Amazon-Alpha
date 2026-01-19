from fastapi import APIRouter, HTTPException, BackgroundTasks, Body
from supabase import create_client, Client
import os
from app.services.gemini import GeminiService
from pydantic import BaseModel
from typing import List

router = APIRouter()

# Initialize Supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

class ProductIDs(BaseModel):
    product_ids: List[str]

@router.post("/generate-embeddings")
async def generate_embeddings_background(background_tasks: BackgroundTasks):
    """
    Background Task: Fetches products without embeddings and generates them using Gemini.
    """
    background_tasks.add_task(process_embeddings)
    return {"status": "started", "message": "Embedding generation started in background"}

async def process_embeddings():
    # 1. Fetch products missing embeddings
    # Note: 'is' null check might vary in Supabase py client, using filter logic
    response = supabase.table("products").select("id, name, description").is_("embedding", "null").limit(10).execute()
    products = response.data
    
    if not products:
        print("No products need embeddings.")
        return

    for product in products:
        text_to_embed = f"{product['name']}: {product['description']}"
        embedding = GeminiService.generate_embedding(text_to_embed)
        
        # 2. Update Product
        supabase.table("products").update({"embedding": embedding}).eq("id", product['id']).execute()
        print(f"Updated embedding for {product['name']}")

@router.post("/recommend")
async def get_recommendations(payload: ProductIDs):
    """
    Returns recommended products based on the viewed history (product_ids).
    """
    if not payload.product_ids:
        return []

    try:
        # 1. Fetch embeddings of viewed products
        response = supabase.table("products").select("embedding").in_("id", payload.product_ids).execute()
        embeddings = [item['embedding'] for item in response.data if item.get('embedding')]
        
        if not embeddings:
            return []

        # 2. Calculate average vector (Centroid)
        # Zip them together to sum each dimension, then divide by count
        avg_vector = [sum(col) / len(col) for col in zip(*embeddings)]

        # 3. RPC Call for Similarity Search
        # We assume a postgres function `match_products` exists or we simulate
        # For this prototype, if RPC isn't set up, we might not get results.
        # Let's try calling a standard RPC "match_products"
        
        rpc_response = supabase.rpc("match_products", {
            "query_embedding": avg_vector,
            "match_threshold": 0.5,
            "match_count": 5
        }).execute()
        
        return rpc_response.data

    except Exception as e:
        print(f"Rec Error: {e}")
        # Fallback: Return random or popular products
        fallback = supabase.table("products").select("*").limit(5).execute()
        return fallback.data
