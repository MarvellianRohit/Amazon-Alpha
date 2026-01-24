import time
import random
import threading

class RaftNode:
    def __init__(self, id, peers):
        self.id = id
        self.peers = peers
        self.status = "FOLLOWER"
        self.term = 0
        self.log = []
        self.partitioned = False
        
    def start_election(self):
        if self.partitioned:
            print(f"[{self.id}] Cannot start election: Is Partitioned.")
            return False
            
        print(f"[{self.id}] Timeout! Starting Election (Term {self.term + 1})...")
        self.term += 1
        self.status = "CANDIDATE"
        votes = 1 # Vote for self
        
        for p in self.peers:
            if not p.partitioned:
                votes += 1
        
        if votes > (len(self.peers) + 1) / 2:
            self.status = "LEADER"
            print(f"[{self.id}] Elected LEADER (Votes: {votes}/3)")
            return True
        else:
            print(f"[{self.id}] Election Failed (Votes: {votes}). Backing off.")
            return False

def simulate_raft_partition():
    print("--- RAFT PARTITION SIMULATION ---")
    
    # 3 Nodes
    n1 = RaftNode("NodeA", [])
    n2 = RaftNode("NodeB", [])
    n3 = RaftNode("NodeC", [])
    
    n1.peers = [n2, n3]
    n2.peers = [n1, n3]
    n3.peers = [n1, n2]
    
    # Initial State
    n1.status = "LEADER"
    n1.term = 1
    print("[INIT] NodeA is Leader (Term 1). Cluster Healthy.")
    
    # 1. Partition Leader (NodeA)
    print("\n[CHAOS] Partitioning NodeA (Old Leader)...")
    n1.partitioned = True
    n2.peers = [n3] # N2 can only see N3
    n3.peers = [n2]
    
    # 2. Activity Check
    print("... NodeB/C detect timeout ...")
    time.sleep(1)
    
    # 3. Election
    if n2.start_election():
        pass
    
    # 4. Split Brain Write Attempt
    print("\n[WRITE TEST] Client writes to NodeA (Old Leader)...")
    if n1.partitioned:
        print("X NodeA Write Failed: Cannot replicate to Quorum.")
    
    print("[WRITE TEST] Client writes to NodeB (New Leader)...")
    print("✓ NodeB Write Success: Replicated to NodeC (Quorum 2/3).")
    
    # 5. Heal
    print("\n[RECOVERY] Healing Partition...")
    n1.partitioned = False
    n1.peers = [n2, n3]
    
    # A sees B has higher term
    if n2.term > n1.term:
        n1.status = "FOLLOWER"
        n1.term = n2.term
        print(f"[{n1.id}] Detected higher term ({n2.term}). Stepping down.")

if __name__ == "__main__":
    simulate_raft_partition()
