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
app.include_router(github.router, prefix="/api/v1/github", tags=["DevOps"])

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

