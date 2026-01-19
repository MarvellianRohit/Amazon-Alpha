from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
from app.services.blockchain_service import blockchain_service
import httpx
import os
from datetime import datetime

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
HEADERS = {
    "apikey": SUPABASE_KEY or "",
    "Authorization": f"Bearer {SUPABASE_KEY or ''}",
    "Content-Type": "application/json"
}

class MintRequest(BaseModel):
    user_id: str
    product_id: str
    # In real app, we might look up user's wallet from profile using user_id
    user_wallet: str 

class BlockchainRouter:
    @staticmethod
    async def _update_registry(product_id: str, user_id: str, mint_result: dict):
        if not SUPABASE_URL: return
        
        payload = {
            "product_id": product_id,
            "user_id": user_id,
            "token_id": mint_result["token_id"],
            "transaction_hash": mint_result["transaction_hash"],
            "status": "minted"
        }
        
        async with httpx.AsyncClient() as client:
            try:
                await client.post(
                    f"{SUPABASE_URL}/rest/v1/nft_registry",
                    headers=HEADERS,
                    json=payload
                )
            except Exception as e:
                print(f"Registry Update Failed: {e}")

@router.post("/mint")
async def mint_nft(req: MintRequest, background_tasks: BackgroundTasks):
    """
    Triggered after a purchase (e.g. via Webhook or Order Service).
    Mints the Digital Twin.
    """
    # 1. Generate Metadata URI (Mocked)
    metadata_uri = f"https://api.amazon-alpha.com/metadata/{req.product_id}.json"
    
    # 2. Call Blockchain Service
    try:
        # In production, this might be slow, so we could offload the whole thing to background
        # But we'll await the 'submission' and record pending status ideally.
        result = await blockchain_service.mint_digital_twin(req.user_wallet, req.product_id, metadata_uri)
        
        # 3. Update DB (Background)
        background_tasks.add_task(BlockchainRouter._update_registry, req.product_id, req.user_id, result)
        
        return {"status": "mint_initiated", "tx_hash": result["transaction_hash"]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
