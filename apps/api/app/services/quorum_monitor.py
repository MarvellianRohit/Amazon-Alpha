import time
import asyncio
from typing import Dict, Optional

class QuorumMonitorService:
    """
    Monitors Regional Leaders in the Spanner Cluster.
    Uses TrueTime simulation for Failover logic.
    """
    def __init__(self):
        # Configuration
        self.leader_region = "Kolkata (asia-south1)"
        self.standby_region = "Virginia (us-east1)"
        self.heartbeat_threshold = 5.0 # Seconds
        
        # State
        self.last_heartbeat_ts = time.time()
        self.is_failover_active = False
        self.current_status = "HEALTHY"

    async def register_heartbeat(self, region: str):
        """
        Called by Region Node to signal aliveness.
        """
        if region in self.leader_region:
            self.last_heartbeat_ts = time.time()
            if self.is_failover_active:
                # Leader recovered
                print(f"[Quorum] Leader {self.leader_region} recovered. Restoring primary role.")
                self.is_failover_active = False
                self.current_status = "HEALTHY"
        
        return {"status": "ACK", "consensus": "PAXOS_V2"}

    async def check_integrity(self) -> Dict:
        """
        Called periodically (e.g. by dashboard or watchdog).
        Checks if Leader is alive.
        """
        now = time.time()
        time_since_last = now - self.last_heartbeat_ts
        
        if time_since_last > self.heartbeat_threshold:
            # Trigger Failover
            self.failover_to_standby(time_since_last)
        
        return {
            "leader": self.standby_region if self.is_failover_active else self.leader_region,
            "status": self.current_status,
            "last_heartbeat_ago": round(time_since_last, 2),
            "replication_lag_ms": 45 if not self.is_failover_active else 0 # Mock logic
        }

    def failover_to_standby(self, latency):
        if not self.is_failover_active:
            print(f"[CRITICAL] Leader Heartbeat Lost ({latency:.2f}s ago). Initiating Failover to {self.standby_region}.")
            self.is_failover_active = True
            self.current_status = "FAILOVER_ACTIVE"

quorum_monitor = QuorumMonitorService()
