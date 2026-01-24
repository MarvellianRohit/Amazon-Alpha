from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.agent import AgentIntent, AgentAction, ReplenishmentItem
from app.services.agent_orchestrator import agent_system

router = APIRouter()

@router.post("/intent")
def submit_intent(intent: AgentIntent):
    """
    Submit a natural language intent to the User Agent.
    """
    action_id = agent_system.process_intent(intent.raw_query, intent.user_id)
    return {"status": "accepted", "action_id": action_id}

@router.get("/activity", response_model=List[AgentAction])
def get_agent_activity():
    """
    Get real-time feed of multi-agent system actions.
    """
    return agent_system.get_activity_feed()

@router.get("/replenishment", response_model=List[ReplenishmentItem])
def get_replenishment_queue():
    """
    Get items predicted for auto-replenishment.
    """
    return agent_system.get_replenishment_predictions()

from app.services.ai_engine import BuyerAgentService
from app.schemas.agent import DealApproval

@router.post("/approve")
async def approve_deal(approval: DealApproval):
    """
    Human-in-the-Loop Confirmation.
    Finalizes the deal, triggers payment and blockchain.
    """
    return await BuyerAgentService.finalize_deal(approval.deal_id, approval.user_id)

from app.services.replenishment_service import ReplenishmentService

@router.get("/replenishment/queue")
def get_replenishment_queue_v2(user_id: str = "demo_user"):
    return ReplenishmentService.get_upcoming_orders(user_id)

@router.post("/replenishment/{pattern_id}/postpone")
def postpone_replenishment(pattern_id: str, days: int = 7):
    return ReplenishmentService.postpone_order(pattern_id, days)

@router.post("/replenishment/{pattern_id}/cancel")
def cancel_replenishment(pattern_id: str):
    return ReplenishmentService.cancel_auto_replenishment(pattern_id)
