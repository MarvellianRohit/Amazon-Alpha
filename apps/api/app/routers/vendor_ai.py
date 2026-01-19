from fastapi import APIRouter, HTTPException, Depends
from app.services.gemini import GeminiService
from app.services.vendor_data import VendorDataService
from pydantic import BaseModel
# In a real app, we would inject the current user dependency to get vendor_id securely.
# For this prototype, we will accept vendor_id in the payload or header (simulated auth).

router = APIRouter()

class ConsultRequest(BaseModel):
    query: str
    vendor_id: str # strictly for prototype; in prod, extract from JWT

@router.post("/consult")
async def consult_vendor_ai(payload: ConsultRequest):
    # 1. Fetch Secure Data
    vendor_data = VendorDataService.get_vendor_stats(payload.vendor_id)
    
    # 2. Generate Insight
    answer = await GeminiService.generate_consultant_response(payload.query, vendor_data)
    
    return {"answer": answer, "data_used": vendor_data}
