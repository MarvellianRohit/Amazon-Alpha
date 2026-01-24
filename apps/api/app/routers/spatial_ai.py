from fastapi import APIRouter
from app.services.spatial_ai import spatial_ai_service

router = APIRouter()

@router.post("/process-stream")
async def process_spatial_stream(lidar_size: int = 1000, spen_active: bool = True):
    """
    Ingests high-frequency sensor data via C++ Backend.
    """
    # Mock byte buffers
    lidar_bytes = b'\x00' * lidar_size
    spen_bytes = b'\x01' * 16
    
    return await spatial_ai_service.process_sensor_stream(lidar_bytes, spen_bytes)
