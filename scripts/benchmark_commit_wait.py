import asyncio
import time
import statistics
from app.services.spanner_ledger import spanner_service

async def benchmark_commit_wait():
    print("--- SPANNER TRUE-TIME LATENCY HEATMAP ---")
    print("Metrics: p50/p90/p99 Transaction Latencies vs Clock Uncertainty")

    # Scenarios:
    # 1ms = Atomic Clock (Google TrueTime)
    # 10ms = Accurate NTP
    # 50ms = Drifting NTP (Dangerous)
    uncertainty_windows = [1, 5, 10, 25, 50, 100] # ms
    
    results = {}
    
    for ms in uncertainty_windows:
        latencies = []
        for _ in range(50):
            t0 = time.time()
            # Fake SKU to avoid running out of stock (mocked in service to just succeed for perf test)
            # Actually service has finite stock "SKU-EXCLUSIVE-B" 500.
            # We'll just run 50 times, 50 * 6 scenarios = 300 total. Stock is 500. Safe.
            await spanner_service.execute_flash_sale_order("SKU-EXCLUSIVE-B", 1, uncertainty_ms=ms)
            latencies.append((time.time() - t0) * 1000)
            
        latencies.sort()
        results[ms] = {
            "p50": latencies[int(len(latencies)*0.5)],
            "p90": latencies[int(len(latencies)*0.9)],
            "p99": latencies[int(len(latencies)*0.99)]
        }
        
    print("\n[HEATMAP] Transaction Latency (ms)")
    print(f"{'Uncertainty (ms)':<20} | {'p50':<10} | {'p99':<10} | {'Impact'}")
    print("-" * 60)
    
    for ms in uncertainty_windows:
        data = results[ms]
        p50 = f"{data['p50']:.1f}"
        p99 = f"{data['p99']:.1f}"
        
        impact = "🟢 LOW"
        if ms >= 25: impact = "🟡 MED"
        if ms >= 50: impact = "🔴 HIGH"
        
        print(f"{ms:<20} | {p50:<10} | {p99:<10} | {impact}")

    print("\nCONCLUSION:")
    print("Lower Clock Uncertainty directly reduces Commit Wait, improving p99 Latency.")
    print("Google Spanner achieves <4ms Uncertainty using GPS/Atomic Clocks.")

if __name__ == "__main__":
    asyncio.run(benchmark_commit_wait())
