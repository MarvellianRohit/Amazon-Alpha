from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
import time
import statistics
from collections import deque

# Store last 1000 request latencies
latency_window = deque(maxlen=1000)

class TelemetryMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        response = await call_next(request)
        
        process_time = (time.time() - start_time) * 1000 # ms
        latency_window.append(process_time)
        
        # Inject Header
        response.headers["X-Response-Time"] = str(round(process_time, 2))
        
        # Determine global p99
        if len(latency_window) > 10:
            p99 = statistics.quantiles(latency_window, n=100)[98] # approx 99th
            # print(f"[Telemetry] Path: {request.url.path} | Time: {process_time:.2f}ms | p99: {p99:.2f}ms")
            
        return response
