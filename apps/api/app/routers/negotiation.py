from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from app.managers.connection_manager import manager
from app.services.vendor_agent import VendorAgentService
import uuid

router = APIRouter()

# In-memory mock for negotiation state (in real app, query DB)
# negotiation_id -> { "current_price": float, "status": "active" }
mock_negotiation_state = {}

@router.post("/start")
async def start_negotiation(user_id: str, product_id: str, initial_price: float):
    """
    Creates a new negotiation session.
    """
    negotiation_id = str(uuid.uuid4())
    mock_negotiation_state[negotiation_id] = {
        "current_price": initial_price,
        "status": "active",
        "product_id": product_id,
        "user_id": user_id
    }
    return {"negotiation_id": negotiation_id, "status": "started"}

@router.websocket("/{negotiation_id}")
async def websocket_endpoint(websocket: WebSocket, negotiation_id: str):
    await manager.connect(negotiation_id, websocket)
    
    # Initialize / Get State
    state = mock_negotiation_state.get(negotiation_id)
    if not state:
        await websocket.close(code=4004, reason="Negotiation not found")
        return

    try:
        while True:
            data = await websocket.receive_json()
            # Expecting: { "type": "message", "content": "..." } or { "type": "offer", "price": ... }
            
            user_msg = data.get("content", "")
            
            # Broadcast User Message
            await manager.broadcast(negotiation_id, {
                "sender": "user",
                "content": user_msg
            })

            # Handover to Vendor Agent
            response = await VendorAgentService.process_user_message(
                negotiation_id, 
                user_msg, 
                state["current_price"]
            )
            
            if response.get("price"):
                state["current_price"] = response["price"]

            # Broadcast Vendor Response
            await manager.broadcast(negotiation_id, {
                "sender": "vendor_agent",
                "content": response.get("content"),
                "offer_price": response.get("price"),
                "type": response.get("type")
            })

    except WebSocketDisconnect:
        manager.disconnect(negotiation_id, websocket)
