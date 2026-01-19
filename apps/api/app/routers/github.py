from fastapi import APIRouter, HTTPException, BackgroundTasks
from supabase import create_client, Client
import os
import httpx
import base64
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

# Initialize Supabase Client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
GITHUB_REPO = os.environ.get("GITHUB_REPO", "rohitchandra/BCA-Section-B-Work") # Default or Env
GITHUB_BRANCH = "main"

class SyncResponse(BaseModel):
    status: str
    message: str
    github_url: str = None
    timestamp: str

def generate_markdown(resources: list) -> str:
    md_content = "# Class Resources & Work\n\n"
    md_content += f"*Last Synced: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
    
    # Group by category logic or similar could go here
    for res in resources:
        title = res.get('title', 'Untitled')
        desc = res.get('description', 'No description.')
        link = res.get('url', '#')
        res_type = res.get('type', 'Material')
        
        md_content += f"## {title}\n"
        md_content += f"- **Type**: {res_type}\n"
        md_content += f"- **Description**: {desc}\n"
        md_content += f"- **Link**: [Access Resource]({link})\n\n"
        md_content += "---\n\n"
    
    return md_content

async def push_to_github(content: str, path: str = "Classwork_Sync.md"):
    if not GITHUB_TOKEN:
        raise Exception("GITHUB_TOKEN not configured")

    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    api_url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{path}"
    
    async with httpx.AsyncClient() as client:
        # 1. Get current SHA if file exists (to update)
        get_res = await client.get(api_url, headers=headers)
        sha = None
        if get_res.status_code == 200:
            sha = get_res.json().get("sha")
            
        # 2. Prepare payload
        encoded_content = base64.b64encode(content.encode("utf-8")).decode("utf-8")
        data = {
            "message": f"Sync Classwork: {datetime.now().strftime('%Y-%m-%d')}",
            "content": encoded_content,
            "branch": GITHUB_BRANCH
        }
        if sha:
            data["sha"] = sha
            
        # 3. PUT request
        put_res = await client.put(api_url, json=data, headers=headers)
        
        if put_res.status_code not in [200, 201]:
             raise Exception(f"GitHub API Error: {put_res.text}")
             
        return put_res.json().get("content", {}).get("html_url")

@router.post("/sync")
async def sync_to_github():
    try:
        # 1. Fetch Resources
        response = supabase.table("resources").select("*").order("created_at", desc=True).execute()
        resources = response.data
        
        if not resources:
            return {"status": "skipped", "message": "No resources to sync."}

        # 2. Generate Markdown
        markdown_text = generate_markdown(resources)
        
        # 3. Push to GitHub
        # Note: In production, consider BackgroundTasks for async
        github_url = await push_to_github(markdown_text)
        
        return {
            "status": "success",
            "message": "Successfully synced to GitHub",
            "github_url": github_url,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        print(f"Sync Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
