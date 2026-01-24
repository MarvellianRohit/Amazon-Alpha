from fastapi import APIRouter
from app.services.handoff_orchestrator import handoff_orchestrator

router = APIRouter()

@router.post("/start-deal")
def start_deal_flow(price: float, budget: float):
    """
    Initiates the Multi-Agent Handoff Chain.
    """
    context = {"price": price, "budget": budget}
    return handoff_orchestrator.start_negotiation_flow(context)

@router.post("/approve/{flow_id}")
def approve_deal(flow_id: str, approved: bool = True):
    """
    HITL Callback: Human acts as the 4th agent in the loop.
    Resumes the Durable Task.
    """
    return handoff_orchestrator.human_approval_callback(flow_id, approved)
