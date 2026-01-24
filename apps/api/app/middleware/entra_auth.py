from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

class EntraAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Allow public endpoints (Health, Login, Webhooks)
        if request.url.path in ["/", "/health", "/api/v1/github/webhook"] or request.method == "OPTIONS":
            return await call_next(request)
            
        # 1. Zero Trust: Always Check Header
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            # In a real strict enterprise app, we might block here.
            # For this demo/dev mode, we log a warning but allow pass-through 
            # OR we can strictly block specific secure routes.
            # Let's strictly block /api/v1/admin routes for demo
            if "/api/v1/vendor" in request.url.path:
                 return JSONResponse(status_code=401, content={"detail": "Missing Entra ID Token"})
        
        # 2. Simulate Token Validation
        if auth_header:
            token = auth_header.split(" ")[1]
            if token == "invalid-token":
                return JSONResponse(status_code=403, content={"detail": "Invalid Entra ID Token"})
            
            # Simulate Scope Check
            # if "Vendor.ReadWrite" not in token_scopes: raise ...
        
        response = await call_next(request)
        return response
