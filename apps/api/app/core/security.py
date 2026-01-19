from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client, create_client
import os
from typing import Annotated

# Placeholder env load - ideally use a proper config loader
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

security = HTTPBearer()

def get_supabase() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=500, detail="Supabase credentials not configured")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def get_current_user(credentials: Annotated[HTTPAuthorizationCredentials, Security(security)]):
    """
    Validates the Bearer token using Supabase Auth.
    """
    token = credentials.credentials
    supabase = get_supabase()
    
    try:
        user = supabase.auth.get_user(token)
        if not user or not user.user:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
