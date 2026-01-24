import asyncio
import time
import random
import uuid
from typing import Dict, Any

class SpannerLedgerService:
    """
    Simulates Google Cloud Spanner features:
    1. TrueTime (Commit Wait)
    2. Paxos Replication (Multi-Region)
    3. Optimistic Concurrency Control (OCC)
    """
    def __init__(self):
        # Ledger Data: SKU -> {stock, version}
        self._ledger = {
            "SKU-EXCLUSIVE-B": {"stock": 500, "version": 1}
        }
        self.regions = ["us-east1 (Leader)", "asia-south1 (Follower)"]

    async def execute_flash_sale_order(self, sku: str, quantity: int) -> Dict[str, Any]:
        """
        Attempts to buy item using OCC loop.
        """
        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                # 1. READ Phase (Snapshot)
                current_data = self._ledger.get(sku)
                if not current_data:
                    raise ValueError(f"SKU {sku} not found")
                
                start_version = current_data["version"]
                start_stock = current_data["stock"]
                
                if start_stock < quantity:
                    return {"status": "SOLD_OUT", "message": "Insufficient stock."}
                
                # 2. COMMIT WAIT (TrueTime Simulation)
                # We wait out the uncertainty window (~4ms)
                # This ensures external consistency across regions
                commit_wait = random.uniform(0.002, 0.008) 
                await asyncio.sleep(commit_wait) 
                
                # 3. WRITE Phase (Validation)
                # Check if version changed since read
                if self._ledger[sku]["version"] != start_version:
                    # Conflict! Someone else bought it.
                    # Backoff and Retry
                    backoff = random.uniform(0.01, 0.05)
                    await asyncio.sleep(backoff)
                    continue 

                # 4. COMMIT
                self._ledger[sku]["stock"] -= quantity
                self._ledger[sku]["version"] += 1
                
                # Simulate Replication Latency
                repl_latency = 0.045 # 45ms to Asia
                
                return {
                    "status": "SUCCESS",
                    "tx_id": str(uuid.uuid4()),
                    "metrics": {
                        "commit_wait_ms": round(commit_wait * 1000, 2),
                        "replication_latency_ms": round(repl_latency * 1000, 2),
                        "consistency_mode": "EXTERNAL_CONSISTENCY (TrueTime)",
                        "attempts": attempt + 1
                    }
                }
                
            except Exception as e:
                print(f"Spanner Tx Error: {e}")
                
        return {"status": "FAILURE", "message": "High contention. Please retry."}

    def get_stock(self, sku: str) -> int:
        return self._ledger.get(sku, {}).get("stock", 0)

spanner_service = SpannerLedgerService()
