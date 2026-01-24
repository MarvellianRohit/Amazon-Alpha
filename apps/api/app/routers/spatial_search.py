from fastapi import APIRouter
from app.services.spatial_search_service import spatial_search_service

router = APIRouter()

@router.post("/query")
async def spatial_query(query: str, sensor_size_kb: int = 1024):
    """
    Executes the Spatial Search Ensemble DAG.
    """
    mock_data = b'\x00' * (sensor_size_kb * 1024)
    return await spatial_search_service.process_spatial_query(query, mock_data)
