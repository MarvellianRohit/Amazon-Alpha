from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from supabase import create_client, Client
import os
import uuid

router = APIRouter()

# Mock storage for development
MOCK_VERIFICATIONS = {}

def get_supabase_client():
    try:
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_KEY")
        if not url or not key:
            return None
        return create_client(url, key)
    except:
        return None

@router.post("/verify")
async def verify_student(
    email: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        # Mock Logic: Check if email ends with .edu
        is_edu_email = email.lower().endswith(".edu")
        
        # Simulate processing delay or file check
        file_ext = file.filename.split(".")[-1]
        mock_file_path = f"mock/{uuid.uuid4()}.{file_ext}"
        
        # Determine success based on email domain (Demo logic)
        status = "verified" if is_edu_email else "pending"
        message = "Student Verified Successfully" if is_edu_email else "Verification Pending (Non-Edu Email)"

        # In a real app, we would upload to Supabase Storage and update DB
        # supabase = get_supabase_client()
        # if supabase:
        #    ... (upload logic) ...
        
        return {
            "status": "success", 
            "verification_status": status,
            "message": message,
            "data": {
                "email": email,
                "file_path": mock_file_path,
                "is_verified": is_edu_email
            }
        }

    except Exception as e:
        print(f"Verification Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
