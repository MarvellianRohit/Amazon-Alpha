from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from app.api.v1.endpoints import products, vendors, auth, students
# Note: In a real migration, we would move existing routers to app/api/v1/endpoints/
# For now, we assume these modules are being created or we import from existing locations and re-alias

app = FastAPI(
    title="Amazon-Alpha API", 
    version="1.0.0",
    description="High-Performance E-Commerce API with Multi-Vendor & Student Discount Logic"
)

# CORS Setup
origins = [
    "http://localhost:3000",  # Next.js frontend
    "*"  # Allow all for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Amazon-Alpha API v1.0 is running", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# --- V1 API Router Registration ---
# Assuming we will move routers here gradually. 
# For meeting the prompt's request, I will stub/import the structure.

# Example: app.include_router(products.router, prefix="/api/v1/products", tags=["Marketplace"])
# Example: app.include_router(vendors.router, prefix="/api/v1/vendors", tags=["Vendor Portal"])
# Example: app.include_router(students.router, prefix="/api/v1/students", tags=["Student Exclusive"])

# To keep the app running with EXISTING routers while adapting structure:
from app.api.routers import products as existing_products
from app.api.routers import cart
from app.api.routers import orders
from app.api.routers import vendor as existing_vendor
from app.routers import ai
from app.routers import student as existing_student
from app.routers import vendor_ai
from app.routers import github

app.include_router(existing_products.router, prefix="/api/v1/products", tags=["Marketplace"])
app.include_router(cart.router, prefix="/api/v1/cart", tags=["Marketplace"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Logistics"])
app.include_router(existing_vendor.router, prefix="/api/v1/vendor", tags=["Vendor Portal"])
app.include_router(existing_student.router, prefix="/api/v1/students", tags=["Student Exclusive"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Engine"])
app.include_router(vendor_ai.router, prefix="/api/v1/vendor/ai", tags=["Vendor Portal"]) # Nested under vendor
from app.routers import vendor_analytics
app.include_router(vendor_analytics.router, prefix="/api/v1/vendor", tags=["Vendor Portal"])
app.include_router(github.router, prefix="/api/v1/github", tags=["DevOps"])

# User Management
from app.routers import user
app.include_router(user.router, prefix="/api/v1/users", tags=["User Management"])

# Agentic AI
from app.routers import signals
from app.routers import negotiation
app.include_router(signals.router, prefix="/api/v1/signals", tags=["Agentic AI"])
app.include_router(negotiation.router, prefix="/api/v1/ws/negotiate", tags=["Negotiation Room"]) # Note: WebSocket endpoints often handled differently but include_router works

# Blockchain
from app.routers import blockchain
app.include_router(blockchain.router, prefix="/api/v1/blockchain", tags=["Product Transparency"])

# Social Discovery
from app.routers import social
app.include_router(social.router, prefix="/api/v1/social", tags=["Social Discovery"])

# Agentic Ecosystem
from app.routers import agents
from app.routers import notifications
from app.routers import group_buy
from app.routers import search

app.include_router(agents.router, prefix="/api/v1/agents", tags=["Autonomous Agents"])
app.include_router(group_buy.router, prefix="/api/v1/group-buy", tags=["Group Buy"])
app.include_router(search.router, prefix="/api/v1/visual-search", tags=["Visual Search"])

# Spanner Inventory
from app.routers import inventory
app.include_router(inventory.router, prefix="/api/v1/inventory", tags=["Global Ledger"])

# Audit & Governance
from app.routers import audit
from app.routers import security
app.include_router(audit.router, prefix="/api/v1/audit", tags=["Enterprise Governance"])
app.include_router(security.router, prefix="/api/v1/security", tags=["Red Team Lab"])

# Spanner Analytics
from app.routers import analytics
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Data Boost"])

# Local Inference (MLX)
from app.routers import local_inference
app.include_router(local_inference.router, prefix="/api/v1/local", tags=["On-Device AI"])

# Offline Sync (CRDT)
from app.routers import sync
app.include_router(sync.router, prefix="/api/v1/sync", tags=["Offline Sync"])

# Spatial AI (C++ Backend)
from app.routers import spatial_ai
app.include_router(spatial_ai.router, prefix="/api/v1/spatial", tags=["Sensor Fusion"])

# Quorum & Reliability
from app.routers import quorum
app.include_router(quorum.router, prefix="/api/v1/quorum", tags=["SRE Reliability"])

# Decision Room (Handoff)
from app.routers import decision_room
from app.routers import workflow
app.include_router(decision_room.router, prefix="/api/v1/room", tags=["Decision Room"])
app.include_router(workflow.router, prefix="/api/v1/workflow", tags=["Durable Async"])

# Spatial Search (Ensemble)
from app.routers import spatial_search
app.include_router(spatial_search.router, prefix="/api/v1/spatial-search", tags=["Spatial Intelligence"])

# Global CDN & Cache
from app.middleware.telemetry import TelemetryMiddleware
from app.middleware.entra_auth import EntraAuthMiddleware

app.add_middleware(TelemetryMiddleware)
app.add_middleware(EntraAuthMiddleware)

from app.services.consistency_service import consistency_service
from app.services.prefetch_service import prefetch_service

@app.post("/api/v1/reviews/global")
async def write_global_review(product_id: str, review: dict):
    return await consistency_service.write_review(product_id, review)

@app.get("/api/v1/cdn/prefetch")
async def trigger_prefetch(user_id: str, category: str):
    return await prefetch_service.predict_and_warm(user_id, category)
