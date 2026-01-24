from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
import os
import httpx

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

from typing import Optional

class UpdateUserRequest(BaseModel):
    wallet_address: Optional[str] = None

# Mock database for local development when Supabase is not configured
MOCK_USER_DB = {}

@router.patch("/me")
async def update_user_profile(
    user_data: UpdateUserRequest,
    # In a real app, we would extract the user_id from the JWT token in Authorization header
    # For this mock/demo, we'll accept a mock user_id header or default to a test user
    x_user_id: str = Header("test-user-id", alias="X-User-ID")
):
    """
    Updates the current user's profile.
    Currently used to persist wallet address.
    """
    if not user_data.wallet_address:
         return {"message": "No changes requested"}

    # 1. Try Supabase if configured
    if SUPABASE_URL and SUPABASE_KEY:
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            try:
                # This assumes a 'profiles' table exists and row security allows updates
                # or we are using service role key to bypass (which we are here for simplicity)
                response = await client.patch(
                    f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{x_user_id}",
                    headers=headers,
                    json={"wallet_address": user_data.wallet_address}
                )
                if response.status_code >= 400:
                    print(f"Supabase update failed: {response.text}")
                    # Fallback to mock if API fails (optional, helps dev flow)
            except Exception as e:
                print(f"Supabase connection error: {e}")

    # 2. Local Mock Persistence (for dev/demo consistency)
    MOCK_USER_DB[x_user_id] = {
        **MOCK_USER_DB.get(x_user_id, {}),
        "wallet_address": user_data.wallet_address
    }
    
    return {
        "status": "updated",
        "user_id": x_user_id,
        "data": {
            "wallet_address": user_data.wallet_address
        }
    }

@router.get("/me")
async def get_user_profile(
    x_user_id: str = Header("test-user-id", alias="X-User-ID")
):
    """
    Fetches the current user's profile.
    """
    # 1. Try Supabase
    if SUPABASE_URL and SUPABASE_KEY:
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{x_user_id}&select=*",
                    headers=headers
                )
                if response.status_code == 200 and response.json():
                    return response.json()[0]
            except Exception:
                pass

    # 2. Return Mock Data
    user_data = MOCK_USER_DB.get(x_user_id, {"id": x_user_id, "wallet_address": None})
    return user_data
