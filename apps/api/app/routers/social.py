from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.services.social_service import social_service, SocialPost

router = APIRouter()

@router.get("/feed", response_model=List[SocialPost])
async def get_social_feed(user_id: str = "mock_user_id"):
    """
    Get the social discovery feed ranked by Trust Score.
    """
    try:
        return await social_service.get_feed(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
