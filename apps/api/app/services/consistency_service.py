import asyncio
import time
from typing import Dict, Any, List

# Simulating 3 Nodes in different regions
NODES = ["US-EAST", "EU-WEST", "AP-SOUTH"]

class ConsistencyService:
    def __init__(self):
        # Mock Data Store per Node: Node -> {Key -> (Value, Timestamp)}
        self._distributed_store: Dict[str, Dict[str, tuple]] = {
            node: {} for node in NODES
        }

    async def write_review(self, product_id: str, review_data: Dict, consistency_level: str = "QUORUM") -> Dict:
        """
        Writes data to nodes based on Consistency Level.
        QUORUM: W = (N/2) + 1 = 2
        """
        N = len(NODES)
        W = 2 if consistency_level == "QUORUM" else 1
        
        timestamp = time.time()
        success_count = 0
        
        # Simulate Parallel Writes
        results = await asyncio.gather(*[
            self._write_to_node(node, product_id, review_data, timestamp) for node in NODES
        ])
        
        success_count = sum(1 for res in results if res)
        
        if success_count >= W:
            return {
                "status": "SUCCESS", 
                "message": f"Persisted to {success_count}/{N} nodes (Quorum Met).",
                "consistency": consistency_level
            }
        else:
            return {"status": "FAILURE", "message": "Quorum Write Failed"}

    async def _write_to_node(self, node: str, key: str, value: Any, timestamp: float) -> bool:
        # Simulate Network Latency
        latency = 0.05 if node == "US-EAST" else 0.15 # Further nodes slower
        await asyncio.sleep(latency)
        
        # Last-Write-Wins Logic (LWW)
        existing = self._distributed_store[node].get(key)
        if existing:
            _, old_ts = existing
            if old_ts > timestamp:
                return False # Stale write
        
        self._distributed_store[node][key] = (value, timestamp)
        return True

consistency_service = ConsistencyService()
