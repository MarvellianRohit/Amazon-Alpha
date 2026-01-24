import asyncio
import random
from app.services.crdt_service import CRDTService, InventoryCRDT

async def stress_test_crdt():
    print("--- CRDT STRESS TEST: PACKET LOSS & PARTITIONS ---")
    
    server = CRDTService()
    print(f"Initial Stock: {server.inventory.value()}")
    
    # Client 1: Samsung Tab (Offline)
    client1_crdt = InventoryCRDT()
    client1_node_id = "tablet-samsung-01"
    
    # Client 2: iPhone (Offline)
    client2_crdt = InventoryCRDT()
    client2_node_id = "iphone-15-02"
    
    print("\n[SCENARIO] Both clients buy items while OFFLINE.")
    
    # Simulate buying
    for _ in range(5):
        client1_crdt.dec(client1_node_id, 1) # Client 1 buys 5
        
    for _ in range(3):
        client2_crdt.dec(client2_node_id, 1) # Client 2 buys 3
        
    print(f"Client 1 Local State (Pending): -5")
    print(f"Client 2 Local State (Pending): -3")
    print(f"Server State (Before Sync): {server.inventory.value()} (Unaware)")
    
    print("\n[CHAOS] Simulating 50% Packet Loss during Sync...")
    
    # Attempt Sync Client 1
    if random.random() > 0.5:
        print("-> Client 1 Sync SUCCESS.")
        server.handle_sync(client1_node_id, client1_crdt.P, client1_crdt.N, {"p": 0, "l": 0})
    else:
        print("-> Client 1 Sync DROPPED (Packet Loss).")
        
    # Attempt Sync Client 2
    server.handle_sync(client2_node_id, client2_crdt.P, client2_crdt.N, {"p": 0, "l": 0})
    print("-> Client 2 Sync SUCCESS.")
    
    # Retry Logic (Convergence)
    print("\n[RETRY] Client 1 Retries Sync...")
    server.handle_sync(client1_node_id, client1_crdt.P, client1_crdt.N, {"p": 0, "l": 1})
    
    final_stock = server.inventory.value()
    print(f"\nFinal Server Stock: {final_stock}")
    
    expected = 100 - 5 - 3
    if final_stock == expected:
        print("[PASS] System Converged Correctly (100 - 5 - 3 = 92).")
    else:
        print(f"[FAIL] Divergence. Expected {expected}, got {final_stock}")

if __name__ == "__main__":
    asyncio.run(stress_test_crdt())
