import random
from datetime import datetime, timedelta
from typing import List, Dict
from app.schemas.agent import AgentAction, NegotiationRound, ReplenishmentItem

class AgentOrchestrator:
    def __init__(self):
        # In-memory store for demo purposes
        self.actions_log: List[AgentAction] = []
        
    def process_intent(self, intent: str, user_id: str) -> str:
        # Simulate parsing intent
        action_id = f"act_{random.randint(1000,9999)}"
        
        # Create a "Planning" action
        self.actions_log.append(AgentAction(
            id=action_id,
            agent_type="USER",
            action_type="SEARCH",
            description=f"Analyzing intent: '{intent}'",
            timestamp=datetime.now(),
            status="IN_PROGRESS"
        ))
        
        # Simulate dispatching to Negotiator if intent implies buying
        if "buy" in intent.lower() or "get" in intent.lower() or "order" in intent.lower():
            self._trigger_negotiation(intent)
            
        return action_id

    def _trigger_negotiation(self, topic: str):
        # Negotiator Agent wakes up
        neg_id = f"neg_{random.randint(1000,9999)}"
        self.actions_log.append(AgentAction(
            id=neg_id,
            agent_type="NEGOTIATOR",
            action_type="NEGOTIATE",
            description="Broadcasting RFQ to top 3 rated vendors...",
            timestamp=datetime.now(),
            status="IN_PROGRESS"
        ))
        
        # Simulate Vendor Responses
        # random delay in real system
        pass

    def get_activity_feed(self) -> List[AgentAction]:
        # Return last 20 actions
        # Add some dummy heartbeat actions if empty
        if not self.actions_log:
            self.actions_log.append(AgentAction(
                id="sys_init", 
                agent_type="USER", 
                action_type="REPLENISH_CHECK", 
                description="Scanning consumption patterns...", 
                timestamp=datetime.now(), 
                status="COMPLETED"
            ))
        return sorted(self.actions_log, key=lambda x: x.timestamp, reverse=True)

    def get_replenishment_predictions(self) -> List[ReplenishmentItem]:
        # Mock ML predictions
        return [
            ReplenishmentItem(
                product_name="Organic Oat Milk",
                predicted_date=datetime.now() + timedelta(days=2),
                confidence=0.92,
                reason="Weekly consumption pattern detected."
            ),
            ReplenishmentItem(
                product_name="Printer Paper (A4)",
                predicted_date=datetime.now() + timedelta(days=5),
                confidence=0.85,
                reason="Last purchased 25 days ago."
            )
        ]

# Singleton instance
agent_system = AgentOrchestrator()
