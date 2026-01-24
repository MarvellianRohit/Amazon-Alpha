import time
import asyncio
from typing import Dict, Any, List
from fastapi import WebSocket

# --- Mock Redis ---
class RedisMock:
    def __init__(self):
        self._store: Dict[str, Any] = {}
        self._expiry: Dict[str, float] = {}

    def get(self, key: str) -> Any:
        if key in self._expiry and time.time() > self._expiry[key]:
            del self._store[key]
            del self._expiry[key]
            return None
        return self._store.get(key)
    
    def set(self, key: str, value: Any, ex: int = None):
        self._store[key] = value
        if ex:
            self._expiry[key] = time.time() + ex
    
    def incr(self, key: str) -> int:
        val = self.get(key) or 0
        new_val = int(val) + 1
        self._store[key] = new_val
        return new_val

redis = RedisMock()
# ------------------

class GroupBuyConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, squad_id: str):
        await websocket.accept()
        if squad_id not in self.active_connections:
            self.active_connections[squad_id] = []
        self.active_connections[squad_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, squad_id: str):
         if squad_id in self.active_connections:
            if websocket in self.active_connections[squad_id]:
                self.active_connections[squad_id].remove(websocket)

    async def broadcast(self, squad_id: str, message: dict):
        if squad_id in self.active_connections:
            for connection in self.active_connections[squad_id]:
                try:
                    await connection.send_json(message)
                except:
                    pass

ws_manager = GroupBuyConnectionManager()

class GroupBuyEngine:
    @staticmethod
    async def join_squad(squad_id: str, user_id: str):
        # 1. Redis Incr
        redis_key = f"squad:{squad_id}"
        count = redis.incr(redis_key)
        
        # 2. Add TTL if new
        if count == 1:
            redis.set(redis_key, 1, ex=86400) # 24 hrs
            
        print(f"User {user_id} joined Squad {squad_id}. Count: {count}")
        
        # 3. Broadcast
        await ws_manager.broadcast(squad_id, {
            "type": "UPDATE",
            "count": count,
            "threshold": 20 # Mock Target
        })
        
        # 4. Check Threshold triggers
        if count in [5, 10, 20]:
            await GroupBuyEngine.trigger_vendor_proposal(squad_id, count)
            
        return {"status": "JOINED", "count": count}

    @staticmethod
    async def trigger_vendor_proposal(squad_id: str, count: int):
        print(f"Squad {squad_id} reached {count} users! Sending Bulk Proposal to Vendor...")
        # Simulate Vendor Negotiation API Call
        await ws_manager.broadcast(squad_id, {
            "type": "MILESTONE",
            "message": f"{count} Users! Discount unlocked.",
            "discount_level": f"{count}% OFF" # Mock
        })

group_buy_engine = GroupBuyEngine()
