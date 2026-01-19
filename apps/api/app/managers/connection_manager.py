from typing import List, Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Map negotiation_id -> List[WebSocket]
        # In a scaled app, this would use Redis Pub/Sub
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, negotiation_id: str, websocket: WebSocket):
        await websocket.accept()
        if negotiation_id not in self.active_connections:
            self.active_connections[negotiation_id] = []
        self.active_connections[negotiation_id].append(websocket)

    def disconnect(self, negotiation_id: str, websocket: WebSocket):
        if negotiation_id in self.active_connections:
            if websocket in self.active_connections[negotiation_id]:
                self.active_connections[negotiation_id].remove(websocket)
            if not self.active_connections[negotiation_id]:
                del self.active_connections[negotiation_id]

    async def broadcast(self, negotiation_id: str, message: dict):
        if negotiation_id in self.active_connections:
            for connection in self.active_connections[negotiation_id]:
                await connection.send_json(message)

manager = ConnectionManager()
