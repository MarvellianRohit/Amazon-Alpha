from fastapi import APIRouter, HTTPException, BackgroundTasks
from supabase import create_client
import os
from app.services.gemini import GeminiService
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# --- Existing Models & Config ---

# Initialize Supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
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

class SearchRequest(BaseModel):
    query: str

class SearchResponse(BaseModel):
    answer: str
    sources: List[str]
    recommended_products: Optional[List[ProductSimple]] = []

# --- New Models for Voice Assistant ---
class VoiceChatRequest(BaseModel):
    message: str
    context: str = ""

class VoiceChatResponse(BaseModel):
    response: str

class GenerateRequest(BaseModel):
    title: str

class GenerateResponse(BaseModel):
    description: str

# --- Endpoints ---

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

@router.post("/ask", response_model=SearchResponse)
async def ask_ai(payload: SearchRequest):
    """
    Original Semantic Search Endpoint
    """
    query = payload.query
    context_text = ""
    sources = []
    recommended_products = []

    # Mock Products for fallback
    mock_products = [
        {"id": "prod_1", "name": "Sony WH-1000XM5 Wireless Noise Canceling Headphones", "price": 348.00, "image": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb", "category": "Electronics"},
        {"id": "prod_2", "name": "MacBook Pro 14-inch M3 Pro", "price": 1999.00, "image": "https://images.unsplash.com/photo-1592919933511-ea9d487c85e4", "category": "Electronics"},
        {"id": "prod_3", "name": "Herman Miller Aeron Chair", "price": 1250.00, "image": "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1", "category": "Home"},
    ]
    
    # Simple Keyword Match
    lower_q = query.lower()
    for p in mock_products:
        if p["name"].lower() in lower_q or p["category"].lower() in lower_q or ("headphone" in lower_q and "Electronics" in p["category"]):
             if len(recommended_products) < 2:
                recommended_products.append(p)
    
    # AI Answer Generation
    try:
        if recommended_products:
             context_text += f"\nFound products: {', '.join([p['name'] for p in recommended_products])}"

        answer = await GeminiService.generate_chat_response(query, context_text)
        
        if "Offline Mode" in answer and recommended_products:
            answer = f"I found some great products for you based on '{query}'."

    except Exception as e:
        answer = "I'm having trouble connecting to my brain, but I can still look up products."

    return {
        "answer": answer,
        "sources": sources,
        "recommended_products": recommended_products
    }

# --- New Voice Assistant Endpoint ---
@router.post("/chat", response_model=VoiceChatResponse)
async def chat_with_assistant(request: VoiceChatRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message is required")

    response_text = await GeminiService.generate_chat_response(request.message, request.context)
    return {"response": response_text}

@router.post("/generate_desc", response_model=GenerateResponse)
async def generate_product_description(request: GenerateRequest):
    if not request.title:
         raise HTTPException(status_code=400, detail="Title is required")
    
    # Use GeminiService directly here for consistency
    try:
        # Assuming GeminiService *could* expose a generic generate method, but chat response is fine too
        # Or we use the genai directly if we need specific prompt
         
        # Let's reuse chat response for now to keep it simple and centralized
        prompt = f"Write a compelling, professional e-commerce product description for a product titled '{request.title}'. Keep it under 50 words."
        description = await GeminiService.generate_chat_response(prompt, "You are a professional copywriter.")
        return {"description": description}
    except Exception as e:
        return {"description": f"Experience the best with the {request.title}."}

# --- New Visual Search Endpoint ---
from fastapi import UploadFile, File

class ImageAnalysisResponse(BaseModel):
    description: str
    search_query: str

@router.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze an uploaded image using Gemini Vision to find products.
    """
    try:
        content = await file.read()
        analysis = await GeminiService.analyze_image(content, file.content_type or "image/jpeg")
        
        return {
            "description": analysis.get("description", "Image analyzed"),
            "search_query": analysis.get("search_query", "")
        }
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))
