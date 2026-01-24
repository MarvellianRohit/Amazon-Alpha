import uuid
from app.services.durable_runtime import durable_runtime
from app.services.message_queue import mq_service
from app.services.defense_agent import defense_agent
from app.services.finance_agent import finance_agent

class DurableWorkflowService:
    """
    Event-Driven Workflow.
    Uses MQ + Memento Pattern.
    """
    def __init__(self):
        # Bind Workers
        mq_service.subscribe("AGENT_HANDOFF", self.handle_handoff)

    async def start_flow(self, deal_context: dict):
        flow_id = str(uuid.uuid4())
        state = {
            "flow_id": flow_id,
            "step": "INIT",
            "context": deal_context,
            "memento_snapshot": {} # Placeholder for extensive state
        }
        
        # Initial Checkpoint
        durable_runtime.dehydrate_agent(flow_id, state)
        
        # Publish Start Event
        await mq_service.publish("AGENT_HANDOFF", state)
        return {"flow_id": flow_id, "status": "STARTED"}

    async def handle_handoff(self, message: dict):
        """
        Worker Function.
        """
        flow_id = message["flow_id"]
        
        # 1. Defense Scan
        if defense_agent.scan_message(message):
            await defense_agent.kill_transaction(flow_id, "Prompt Injection in Message Payload")
            return

        # 2. Rehydrate (Load Memento)
        state = durable_runtime.rehydrate_agent(flow_id)
        current_step = state["step"]
        
        print(f"[Workflow] Processing Step: {current_step}")

        # Step Transition Logic (Simplified)
        if current_step == "INIT":
            state["step"] = "FINANCE_REVIEW"
            durable_runtime.dehydrate_agent(flow_id, state) # Checkpoint
            await mq_service.publish("AGENT_HANDOFF", state) # Async Handoff
            
        elif current_step == "FINANCE_REVIEW":
            # Finance Agent Logic
            context = state["context"]
            result = finance_agent.review_budget(context)
            
            if result["status"] == "FLAGGED":
                # Pause (No publish)
                print("[Workflow] Paused for Decision Room.")
                state["step"] = "PAUSED_FOR_USER"
                durable_runtime.dehydrate_agent(flow_id, state)
            else:
                state["step"] = "COMPLETED"
                durable_runtime.dehydrate_agent(flow_id, state)
                print("[Workflow] Flow Completed Successfully.")

durable_workflow = DurableWorkflowService()
