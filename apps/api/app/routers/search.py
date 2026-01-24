from fastapi import APIRouter, File, UploadFile
from typing import Dict, Any
from app.services.visual_search_service import visual_search_service

router = APIRouter()

@router.post("/query")
async def visual_search_query(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Accepts an image, runs Triton Inference + Milvus Search.
    Returns similar products with performance metrics.
    """
    # In real app, read file.bytes()
    # image_bytes = await file.read()
    
    # Passing mock string for now
    return visual_search_service.process_image_query("mock_image_bytes")
