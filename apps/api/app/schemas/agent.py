from pydantic import BaseModel
from typing import List, Optional, Literal, Dict
from datetime import datetime

class AgentIntent(BaseModel):
    raw_query: string
    user_id: str
    priority: Literal["low", "medium", "high"] = "medium"

class AgentAction(BaseModel):
    id: str
    agent_type: Literal["USER", "NEGOTIATOR", "VENDOR"]
    action_type: Literal["SEARCH", "NEGOTIATE", "ORDER", "REPLENISH_CHECK"]
    description: str
    payload: Dict = {}
    timestamp: datetime
    status: Literal["PENDING", "IN_PROGRESS", "COMPLETED", "WAITING_APPROVAL"]

class NegotiationRound(BaseModel):
    round_id: int
    proposer: str
    price_offered: float
    terms: Optional[str] = None
    accepted: bool = False


class DealApproval(BaseModel):
    deal_id: str
    user_id: str

