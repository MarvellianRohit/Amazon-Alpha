from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import google.generativeai as genai
from app.services.gemini import GeminiService

router = APIRouter()

class GenerateRequest(BaseModel):
    title: str

class GenerateResponse(BaseModel):
    description: str

class ChatRequest(BaseModel):
    message: str
    context: str = ""

class ChatResponse(BaseModel):
    response: str

# Configure Gemini
# In production, ensure GOOGLE_API_KEY is set in .env
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

@router.post("/generate_desc", response_model=GenerateResponse)
async def generate_product_description(request: GenerateRequest):
    if not request.title:
         raise HTTPException(status_code=400, detail="Title is required")
    
    if not GOOGLE_API_KEY:
        # Fallback Mock if no API Key (for development safety)
        return {"description": f"[MOCK AI] This is a premium {request.title} featuring state-of-the-art design and durability. Perfect for daily use."}

    try:
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"Write a compelling, professional e-commerce product description for a product titled '{request.title}'. Keep it under 50 words."
        
        # Use async generate for consistency
        response = await model.generate_content_async(prompt)
        return {"description": response.text}
    except Exception as e:
        print(f"Gemini Error: {e}")
        # Fallback on error
        return {"description": f"Experience the best with the {request.title}. Engineered for excellence."}

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message is required")

    response_text = await GeminiService.generate_chat_response(request.message, request.context)
    return {"response": response_text}
