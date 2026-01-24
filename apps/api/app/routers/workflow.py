from fastapi import APIRouter
from app.services.durable_workflow import durable_workflow

router = APIRouter()

@router.post("/start")
async def start_async_workflow(price: float, budget: float, content: str = "Standard Deal"):
    """
    Starts the Async Durable Workflow via Message Queue.
    Includes content for Red Team testing.
    """
    context = {"price": price, "budget": budget, "content": content}
    return await durable_workflow.start_flow(context)
