from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from supabase import create_client, Client
import os
import uuid

router = APIRouter()

# Initialize Supabase Client (Verify environment variables are loaded in main app)
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

@router.post("/api/v1/verify-student")
async def verify_student(file: UploadFile = File(...), user_id: str = "test-user"): # Replace with Auth dependency
    try:
        # 1. Upload File to Storage
        file_ext = file.filename.split(".")[-1]
        file_name = f"{user_id}/{uuid.uuid4()}.{file_ext}"
        file_content = await file.read()
        
        storage_response = supabase.storage.from_("student-ids").upload(
            path=file_name,
            file=file_content,
            file_options={"content-type": file.content_type}
        )

        # 2. Get Public URL (or signed URL if private)
        # For this demo, assuming public read or using path
        # storage_path = storage_response.get('path') # Check response structure
        
        # 3. Update Profile
        data, count = supabase.table("profiles").update({
            "is_verified_student": True, # Auto-verify for demo
            "college_id_url": file_name
        }).eq("id", user_id).execute()

        return {"status": "success", "message": "Student Verified", "data": data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
