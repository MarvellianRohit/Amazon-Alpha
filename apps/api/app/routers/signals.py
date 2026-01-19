from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from pydantic import BaseModel
import httpx
import os
from datetime import datetime

# In a real app, we'd import this from a shared deps module
# from app.api.deps import get_current_user

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY or "",
    "Authorization": f"Bearer {SUPABASE_KEY or ''}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

class BrowsingSignal(BaseModel):
    product_id: Optional[str] = None
    event_type: str # 'view', 'scroll', 'click'
    metadata: Dict[str, Any] = {}

class SignalIngestionService:
    @staticmethod
    async def log_signal(user_id: str, signal: BrowsingSignal):
        """
        Async log signal to Supabase.
        """
        if not SUPABASE_URL:
            print("Skipping signal log (No DB URL)")
            return

        payload = {
            "user_id": user_id,
            "product_id": signal.product_id,
            "event_type": signal.event_type,
            "metadata": signal.metadata,
            "created_at": datetime.utcnow().isoformat()
        }

        async with httpx.AsyncClient() as client:
            try:
                # We use the Service Role key here to ensure we can write even if RLS is strict,
                # though ideally we flow the user's JWT. For ingestion service, service role is often safer for reliability.
                await client.post(
                    f"{SUPABASE_URL}/rest/v1/browsing_signals",
                    headers=HEADERS,
                    json=payload
                )
            except Exception as e:
                print(f"Failed to log signal: {e}")

    @staticmethod
    async def trigger_dna_update(user_id: str):
        """
        Placeholder for DNA Generator trigger.
        In a real system, this might run only after every 10th signal or via Cron.
        """
        pass

@router.post("/signals")
async def capture_signal(
    signal: BrowsingSignal,
    background_tasks: BackgroundTasks,
    # current_user: dict = Depends(get_current_user) # Uncomment in real app
):
    # Mock User ID for now since we don't have the full auth context in this snippet
    user_id = "mock-user-id" 
    # if current_user: user_id = current_user.get("id")

    # Fire and forget
    background_tasks.add_task(SignalIngestionService.log_signal, user_id, signal)
    
    # Optionally trigger DNA update check
    background_tasks.add_task(SignalIngestionService.trigger_dna_update, user_id)

    return {"status": "captured"}
