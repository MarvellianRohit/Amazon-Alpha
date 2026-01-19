from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File
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

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]

@router.post("/ingest")
async def ingest_knowledge(background_tasks: BackgroundTasks):
    """
    Trigger ingestion of local markdown docs into Vector Store.
    Note: In a real deploy, these files would be read from repo or uploaded.
    For this local setup, we'll read explicit paths if capable, or assume content is sent.
    For simplicity here, we will Mock-Ingest a few key facts if files aren't found.
    """
    background_tasks.add_task(process_ingestion)
    return {"status": "started", "message": "Knowledge ingestion running in background."}

async def process_ingestion():
    # 1. Define Knowledge Sources (Manual for this demo, or read files)
    # Ideally, we read /task.md, /implementation_plan.md etc.
    kb_entries = [
        # Features
        {
            "content": "Student Verification System: Uses .edu email or ID upload. Verified students get separate pricing. Backend: /api/v1/verify-student. Frontend: /student/verify and /student/club.",
            "metadata": {"source": "walkthrough.md", "topic": "Student Discount"}
        },
        {
             "content": "Recommendation Engine: Uses pgvector in Supabase and Gemini text-embedding-004. Backend endpoint: /api/v1/recommendations. Frontend: RecommendedForYou component.",
             "metadata": {"source": "implementation_plan.md", "topic": "AI features"}
        },
         {
             "content": "Admin Dashboard: Features God Mode for compliance, Vendor Approval Queue, and Sales Analytics. Located at /admin/dashboard.",
             "metadata": {"source": "walkthrough.md", "topic": "Admin"}
        },
         {
             "content": "GitHub Sync: Developers can push classwork resources to GitHub 'BCA-Section-B-Work' repo directly from the Admin Dashboard using /api/v1/github/sync endpoint.",
             "metadata": {"source": "walkthrough.md", "topic": "Developer Tools"}
        }
    ]

    for entry in kb_entries:
        embedding = GeminiService.generate_embedding(entry["content"])
        
        # Upsert (using simple insert for now)
        # Check if exists to avoid duplicates (naive check)
        # real implementation would use hash of content as ID
        supabase.table("system_knowledge").insert({
            "content": entry["content"],
            "metadata": entry["metadata"],
            "embedding": embedding
        }).execute()
        
    print("Ingestion Complete")


@router.post("/ask", response_model=ChatResponse)
async def ask_ai(payload: ChatRequest):
    query = payload.query
    embedding = GeminiService.generate_embedding(query)
    
    # 1. Semantic Search in Knowledge Base
    kb_response = supabase.rpc("match_knowledge", { # Assumes function exists, or we use direct lookup
        "query_embedding": embedding,
        "match_threshold": 0.5,
        "match_count": 3
    }).execute()
    
    # Fallback if RPC not made: query manually (less efficient) or use simple filter
    # For prototype, we'll trust the embedding generation and mock retrieval if RPC fails
    # actually, supabase-py filtering with vectors is tricky without RPC.
    # We will assume ingestion worked and we have context.
    
    context_text = ""
    sources = []
    
    if kb_response.data:
        for item in kb_response.data:
            context_text += f"- {item['content']} (Source: {item['metadata'].get('source')})\n"
            sources.append(item['metadata'].get('source'))
    else:
        # Fallback: Just search products
        prod_response = supabase.table("products").select("name, description, embedding").limit(5).execute()
        # Find closest products manually or just append random ones as "Catalog Context"
        for p in prod_response.data[:3]:
             context_text += f"- Product: {p['name']} - {p['description']}\n"
             sources.append("Product Catalog")

    # 2. Search Products (if query looks like product search)
    # (Simplified: always include some product context if KB is empty)

    # 3. Generate Answer
    answer = await GeminiService.generate_chat_response(query, context_text)
    
    return {
        "answer": answer,
        "sources": list(set(sources))
    }
