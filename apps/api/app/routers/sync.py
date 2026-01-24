from fastapi import APIRouter
from app.services.crdt_service import crdt_service

router = APIRouter()

@router.post("/inventory/sync")
async def sync_inventory(node_id: str, p_deltas: dict, n_deltas: dict, timestamp: dict):
    """
    Receives CRDT Deltas from client and merges them.
    """
    return crdt_service.handle_sync(node_id, p_deltas, n_deltas, timestamp)
