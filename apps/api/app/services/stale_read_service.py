import time
from typing import Dict, Any

class StaleReadService:
    """
    Simulates a Read-Only Replica on the Client Device (Samsung Tab).
    Allows 'Stale Reads' (Exact Staleness) to bypass main Spanner/Paxos latency.
    """
    
    def __init__(self):
        # Mock Catalog Versioning
        self.data_versions = [
            {"ts": time.time() - 100, "version": 10, "data": "Product List v10"},
            {"ts": time.time() - 10,  "version": 11, "data": "Product List v11"},
            {"ts": time.time(),       "version": 12, "data": "Product List v12 (Live)"},
        ]

    def get_product_catalog(self, exact_staleness_sec: int = 0) -> Dict[str, Any]:
        """
        Fetches data respecting the staleness bound.
        If staleness > 0, we can return older data (simulated Read-Only Replica).
        """
        now = time.time()
        
        # Find the freshest version that satisfies the staleness constraint
        # i.e., version_ts <= now - staleness
        
        target_time = now - exact_staleness_sec
        selected_version = None
        
        for record in reversed(self.data_versions):
            if record["ts"] <= target_time:
                selected_version = record
                break
        
        if not selected_version:
            # Fallback to oldest or empty
            selected_version = self.data_versions[0]

        return {
            "mode": "STRONG_READ" if exact_staleness_sec == 0 else "STALE_READ",
            "staleness_requested": f"{exact_staleness_sec}s",
            "served_version": selected_version["version"],
            "data": selected_version["data"],
            "replica_location": "Samsung Tab S11 (Simulated Local Cace)" if exact_staleness_sec > 0 else "Cloud Leader"
        }

stale_read_service = StaleReadService()
