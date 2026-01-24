from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.group_buy_engine import group_buy_engine, ws_manager

router = APIRouter()

@router.websocket("/ws/{squad_id}")
async def group_buy_websocket(websocket: WebSocket, squad_id: str):
    await ws_manager.connect(websocket, squad_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, squad_id)

@router.post("/{squad_id}/join")
async def join_squad(squad_id: str, user_id: str = "demo_user"):
    return await group_buy_engine.join_squad(squad_id, user_id)
