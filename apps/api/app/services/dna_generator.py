import httpx
import os
import asyncio
from typing import List, Dict, Any

# Mock Gemini Service import if not available
# from app.services.gemini import GeminiService

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY or "",
    "Authorization": f"Bearer {SUPABASE_KEY or ''}",
    "Content-Type": "application/json"
}

class DNAGenerator:
    @staticmethod
    async def generate_user_dna(user_id: str):
        """
        1. Fetch recent signals.
        2. Summarize using Gemini.
        3. Generate Embedding.
        4. Update `user_dna` table.
        """
        print(f"Generating DNA for {user_id}...")
        
        # 1. Fetch Signals
        signals = await DNAGenerator._fetch_recent_signals(user_id)
        if not signals:
            return

        # 2. Analyze (Mocking Gemini call for now)
        summary = f"User has viewed {len(signals)} items. Prefers Electronics and fast delivery."
        
        # 3. Embedding (Mocking 1536 dim vector)
        fake_embedding = [0.01] * 1536 

        # 4. Upsert DNA
        await DNAGenerator._upsert_dna(user_id, summary, fake_embedding)
        print(f"DNA updated for {user_id}")

    @staticmethod
    async def _fetch_recent_signals(user_id: str) -> List[Dict[str, Any]]:
        if not SUPABASE_URL: return []
        
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(
                    f"{SUPABASE_URL}/rest/v1/browsing_signals?user_id=eq.{user_id}&order=created_at.desc&limit=50",
                    headers=HEADERS
                )
                if resp.status_code == 200:
                    return resp.json()
            except:
                pass
        return []

    @staticmethod
    async def _upsert_dna(user_id: str, summary: str, embedding: List[float]):
        if not SUPABASE_URL: return

        payload = {
            "user_id": user_id,
            "dna_summary": summary,
            "embedding": embedding # pgvector format usually handled by library or raw string in REST
        }
        
        # Supabase REST upsert
        async with httpx.AsyncClient() as client:
            try:
                await client.post(
                    f"{SUPABASE_URL}/rest/v1/user_dna",
                    headers={**HEADERS, "Prefer": "resolution=merge-duplicates"},
                    json=payload
                )
            except Exception as e:
                print(f"DNA Write error: {e}")
