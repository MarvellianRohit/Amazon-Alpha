from fastapi import APIRouter
from app.services.quorum_monitor import quorum_monitor
from app.services.stale_read_service import stale_read_service

router = APIRouter()

@router.get("/status")
async def get_quorum_status():
    return await quorum_monitor.check_integrity()

@router.post("/heartbeat")
async def send_heartbeat(region: str):
    return await quorum_monitor.register_heartbeat(region)

@router.get("/catalog/read")
def read_catalog(staleness: int = 0):
    """
    Supports 'exact_staleness' reads for high-performance edge replicas.
    """
    return stale_read_service.get_product_catalog(exact_staleness_sec=staleness)
