from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.managers.notification_manager import manager

router = APIRouter()

@router.websocket("/ws/notifications/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            # Keep alive / listen for client acks if needed
            data = await websocket.receive_text()
            # For now we just echo or ignore client messages
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
