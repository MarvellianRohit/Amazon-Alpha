from fastapi import APIRouter
from app.services.mlx_inference import mlx_service

router = APIRouter()

@router.post("/chat")
async def local_chat(prompt: str, max_tokens: int = 100):
    """
    Runs inference locally on the M3 Max NPU/GPU using MLX.
    """
    return await mlx_service.generate(prompt, max_tokens)
