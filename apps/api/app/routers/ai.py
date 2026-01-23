from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File
from supabase import create_client, Client
import os
from app.services.gemini import GeminiService
from pydantic import BaseModel
from typing import List, Optional


router = APIRouter()

# Initialize Supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
# Provide fallback for local dev if env missing
if not url or not key:
    supabase = None
else:
    supabase = create_client(url, key)

class ProductSimple(BaseModel):
    id: str
    name: str
    price: float
    image: str
    category: str

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]
    recommended_products: Optional[List[ProductSimple]] = []

@router.post("/ingest")
async def ingest_knowledge(background_tasks: BackgroundTasks):
    """
    Trigger ingestion of local markdown docs into Vector Store.
    """
    background_tasks.add_task(process_ingestion)
    return {"status": "started", "message": "Knowledge ingestion running in background."}

async def process_ingestion():
    # Stub for ingestion logic
    print("Ingestion Stub")

@router.post("/ask", response_model=ChatResponse)
async def ask_ai(payload: ChatRequest):
    query = payload.query
    context_text = ""
    sources = []
    recommended_products = []

    # 1. Product Search (Simple Keyword Fallback)
    # In a real app, uses pgvector. Here we simulate "Semantic" search via simple keywords or mock.
    # We'll use the supabase client to fetch products if available, matching keywords.
    
    # Mock Products for fallback
    mock_products = [
        {"id": "prod_1", "name": "Sony WH-1000XM5 Wireless Noise Canceling Headphones", "price": 348.00, "image": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb", "category": "Electronics"},
        {"id": "prod_2", "name": "MacBook Pro 14-inch M3 Pro", "price": 1999.00, "image": "https://images.unsplash.com/photo-1592919933511-ea9d487c85e4", "category": "Electronics"},
        {"id": "prod_3", "name": "Herman Miller Aeron Chair", "price": 1250.00, "image": "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1", "category": "Home"},
    ]
    
    # Simple Keyword Match
    lower_q = query.lower()
    for p in mock_products:
        if p["name"].lower() in lower_q or p["category"].lower() in lower_q or "headphone" in lower_q and "Electronics" in p["category"]:
             if len(recommended_products) < 2:
                recommended_products.append(p)
    
    
    # 2. AI Answer Generation
    try:
        if recommended_products:
             context_text += f"\nFound products: {', '.join([p['name'] for p in recommended_products])}"

        answer = await GeminiService.generate_chat_response(query, context_text)
        
        # Override offline message if we found products but AI is offline
        if "Offline Mode" in answer and recommended_products:
            answer = f"I found some great products for you based on '{query}'."

    except Exception as e:
        answer = "I'm having trouble connecting to my brain, but I can still look up products."

    return {
        "answer": answer,
        "sources": sources,
        "recommended_products": recommended_products
    }

