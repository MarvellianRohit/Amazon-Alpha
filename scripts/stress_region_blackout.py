import asyncio
import time
from app.services.quorum_monitor import quorum_monitor

async def stress_region_blackout():
    print("--- REGION BLACKOUT SIMULATION ---")
    print(f"Initial State: {await quorum_monitor.check_integrity()}")
    
    # 1. Normal Operation (Heartbeats Active)
    print("\n[PHASE 1] Normal Operation (Heartbeats Active)")
    for i in range(3):
        await quorum_monitor.register_heartbeat("Kolkata (asia-south1)")
        time.sleep(1)
        print(f"Heartbeat Sent. time={i}s")

    # 2. Blackout (Stop sending heartbeats)
    print("\n[PHASE 2] REGION BLACKOUT (Kolkata Down)")
    print("Waiting for Failover (Threshold: 5s)...")
    
    start_wait = time.time()
    failover_detected = False
    
    while time.time() - start_wait < 8:
        status = await quorum_monitor.check_integrity()
        if status["status"] == "FAILOVER_ACTIVE":
            rto = time.time() - start_wait
            print(f"\n[SUCCESS] Failover Detected! RTO: {rto:.2f}s")
            print(f"New Leader: {status['leader']}")
            failover_detected = True
            break
        time.sleep(0.5)
        print(".", end="", flush=True)
    
    if not failover_detected:
        print("\n[FAIL] System did not failover within timeout.")
    else:
        # 3. Recovery
        print("\n[PHASE 3] Leader Recovery")
        await quorum_monitor.register_heartbeat("Kolkata (asia-south1)")
        status = await quorum_monitor.check_integrity()
        print(f"Status after Recovery: {status['status']} (Leader: {status['leader']})")

if __name__ == "__main__":
    asyncio.run(stress_region_blackout())
