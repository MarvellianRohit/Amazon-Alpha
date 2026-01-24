import asyncio
import time
import random
import uuid
from typing import Dict, Any
from app.services.crdt_service import HybridLogicalClock

class SpannerLedgerService:
    """
    Simulates Google Cloud Spanner features:
    1. TrueTime (Commit Wait + HLC)
    2. Paxos Replication (Multi-Region)
    3. Optimistic Concurrency Control (OCC)
    """
    def __init__(self):
        # Ledger Data: SKU -> {stock, version, timestamp}
        self._ledger = {
            "SKU-EXCLUSIVE-B": {"stock": 500, "version": 1, "ts": 0}
        }
        self.regions = ["us-east1 (Leader)", "asia-south1 (Follower)"]
        self.clock = HybridLogicalClock("cloud-leader-us-east1")

    async def execute_flash_sale_order(self, sku: str, quantity: int, uncertainty_ms: float = None) -> Dict[str, Any]:
        """
        Attempts to buy item using OCC loop.
        uncertainty_ms: Simulated Clock Uncertainty (Epsilon). If None, random jitter.
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
                # We wait out the uncertainty window (~4ms usually, or configurable)
                # This ensures external consistency across regions
                if uncertainty_ms is not None:
                     # Spanner Rule: Wait out 2 * Epsilon (avg error)
                     commit_wait = (uncertainty_ms / 1000.0)
                else:
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
                
                # Assign TrueTime Timestamp (HLC)
                commit_ts = self.clock.now() # {p: phys, l: log, n: node}
                self._ledger[sku]["ts"] = commit_ts["p"]
                
                # Simulate Replication Latency
                repl_latency = 0.045 # 45ms to Asia
                
                return {
                    "status": "SUCCESS",
                    "tx_id": str(uuid.uuid4()),
                    "metrics": {
                        "commit_wait_ms": round(commit_wait * 1000, 2),
                        "replication_latency_ms": round(repl_latency * 1000, 2),
                        "consistency_mode": "EXTERNAL_CONSISTENCY (TrueTime)",
                        "uncertainty_window_ms": uncertainty_ms if uncertainty_ms else "DYNAMIC",
                        "attempts": attempt + 1
                    }
                }
                
            except Exception as e:
                print(f"Spanner Tx Error: {e}")
                
        return {"status": "FAILURE", "message": "High contention. Please retry."}

    def get_stock(self, sku: str) -> int:
        return self._ledger.get(sku, {}).get("stock", 0)

spanner_service = SpannerLedgerService()
