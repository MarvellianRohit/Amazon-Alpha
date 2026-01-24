import time
import threading
from typing import Dict, Any, List

class HybridLogicalClock:
    """
    Hybrid Logical Clock (HLC).
    Captures causality across distributed systems.
    Structure: (physical_time, logical_counter, node_id)
    """
    def __init__(self, node_id: str):
        self.node_id = node_id
        self.latest_phys = 0
        self.latest_logical = 0
        self._lock = threading.Lock()

    def now(self) -> Dict[str, Any]:
        """Generates a new timestamp for a local event."""
        with self._lock:
            phys = time.time_ns()
            if phys > self.latest_phys:
                self.latest_phys = phys
                self.latest_logical = 0
            else:
                self.latest_logical += 1
            return {"p": self.latest_phys, "l": self.latest_logical, "n": self.node_id}

    def update(self, remote_ts: Dict[str, Any]):
        """Updates local clock based on a received message timestamp."""
        with self._lock:
            phys = time.time_ns()
            
            # HLC Algorithm: max(local, remote, phys)
            self.latest_phys = max(self.latest_phys, remote_ts["p"], phys)
            
            if self.latest_phys == remote_ts["p"]:
                 self.latest_logical = max(self.latest_logical, remote_ts["l"]) + 1
            elif self.latest_phys == self.latest_phys: # unchanged (local was higher)
                 self.latest_logical += 1
            else:
                 self.latest_logical = 0

class InventoryCRDT:
    """
    PN-Counter (Positive-Negative Counter) CRDT.
    Allows concurrent increments (+) and decrements (-) without conflicts.
    """
    def __init__(self):
        # Maps NodeID -> Count
        self.P: Dict[str, int] = {} # Increments (Stock Added)
        self.N: Dict[str, int] = {} # Decrements (Purchased)
    
    def inc(self, node_id: str, amount: int = 1):
        self.P[node_id] = self.P.get(node_id, 0) + amount
    
    def dec(self, node_id: str, amount: int = 1):
        self.N[node_id] = self.N.get(node_id, 0) + amount
        
    def value(self) -> int:
        return sum(self.P.values()) - sum(self.N.values())

    def merge(self, other_p: Dict, other_n: Dict):
        """
        Merge State: Max(Local, Remote) for every node key.
        Idempotent & Commutative.
        """
        for k, v in other_p.items():
            self.P[k] = max(self.P.get(k, 0), v)
        
        for k, v in other_n.items():
            self.N[k] = max(self.N.get(k, 0), v)

class GCounter:
    """
    Grow-Only Counter CRDT.
    Used for Tracking Squad Members (Count only goes up).
    """
    def __init__(self):
        self.P: Dict[str, int] = {}
        
    def inc(self, node_id: str, amount: int = 1):
        self.P[node_id] = self.P.get(node_id, 0) + amount
        
    def value(self) -> int:
        return sum(self.P.values())
        
    def merge(self, other_p: Dict):
        for k, v in other_p.items():
            self.P[k] = max(self.P.get(k, 0), v)

class CRDTService:
    def __init__(self):
        self.clock = HybridLogicalClock(node_id="server-virginia")
        self.inventory = InventoryCRDT()
        self.squad_tracker = GCounter() # New: for Squads
        
        # Init stock
        self.inventory.inc("server-virginia", 100) # Initial Stock

    def handle_sync(self, node_id: str, p_deltas: Dict, n_deltas: Dict, timestamp: Dict):
        """
        Receives sync from offline client (Samsung Tab).
        """
        # 1. Update Clock
        self.clock.update(timestamp)
        
        # 2. Merge Data
        self.inventory.merge(p_deltas, n_deltas)
        
        # 3. Return converged state
        return {
            "status": "CONVERGED",
            "current_stock": self.inventory.value(),
            "server_ts": self.clock.now(),
            "p_state": self.inventory.P,
            "n_state": self.inventory.N
        }

crdt_service = CRDTService()
