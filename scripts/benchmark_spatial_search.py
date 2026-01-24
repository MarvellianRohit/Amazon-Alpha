import time
import asyncio
from app.services.spatial_search_service import spatial_search_service

async def benchmark_dag_performance():
    print("--- SPATIAL SEARCH DAG BENCHMARK ---")
    print("Pipeline: C++ -> YOLOv11 (TRT) -> Llama-3 (4-bit)")
    
    iters = 100
    latencies = []
    
    for i in range(iters):
        # Simulate Request
        t0 = time.time()
        result = await spatial_search_service.process_spatial_query("Find me a sofa", b"mock_lidar")
        t1 = time.time()
        
        latencies.append((t1 - t0) * 1000)
    
    avg_lat = sum(latencies) / len(latencies)
    ttft = avg_lat + 20 # Overhead assumption
    tps = 1000 / avg_lat
    
    print(f"\nRESULTS:")
    print(f"End-to-End Latency (Avg): {avg_lat:.2f} ms")
    print(f"Estimated TTFT: {ttft:.2f} ms")
    print(f"Throughput (Requests/sec): {tps:.2f}")
    
    if ttft < 100:
        print("[PASS] Real-Time Interactive Latency Achieved.")
    else:
        print("[WARN] Latency Optimization Recommended.")

if __name__ == "__main__":
    asyncio.run(benchmark_dag_performance())
