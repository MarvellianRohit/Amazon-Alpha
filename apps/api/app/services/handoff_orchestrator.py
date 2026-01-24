import uuid
from app.services.durable_runtime import durable_runtime
from app.services.finance_agent import finance_agent
from app.services.supervisor_agent import supervisor_agent
# Reuse internal logic for Buyer simulation or assume context passed in

class HandoffOrchestrator:
    """
    Manages the Sequential Handoff: Buyer -> Finance -> Policy.
    Ensures State Persistence at every step.
    """
    
    def start_negotiation_flow(self, deal_context: dict):
        flow_id = str(uuid.uuid4())
        state = {
            "flow_id": flow_id, 
            "step": "INIT", 
            "context": deal_context,
            "history": []
        }
        
        # Checkpoint 1: Initialization
        durable_runtime.dehydrate_agent(flow_id, state)
        return self._execute_step(flow_id)

    def _execute_step(self, flow_id: str):
        # Load State (Resume)
        state = durable_runtime.rehydrate_agent(flow_id)
        current_step = state["step"]
        context = state["context"]
        
        print(f"[Orchestrator] Executing Step: {current_step} for Flow {flow_id}")
        
        # Step 1: Buyer (Simulated here as 'Passed' for handoff demo)
        if current_step == "INIT":
            state["step"] = "FINANCE_CHECK"
            state["history"].append({"agent": "Buyer", "action": "Deal Found", "price": context["price"]})
            durable_runtime.dehydrate_agent(flow_id, state)
            return self._execute_step(flow_id) # Next
            
        # Step 2: Finance Agent
        if current_step == "FINANCE_CHECK":
            result = finance_agent.review_budget(context)
            if result["status"] == "FLAGGED":
                # Pause for HITL
                state["step"] = "WAITING_FOR_HUMAN"
                state["status"] = "PAUSED"
                durable_runtime.dehydrate_agent(flow_id, state)
                return {"status": "PAUSED", "reason": "Budget Exceeded. Waiting in Decision Room."}
            
            state["step"] = "POLICY_CHECK"
            state["history"].append({"agent": "Finance", "action": "Approved"})
            durable_runtime.dehydrate_agent(flow_id, state)
            return self._execute_step(flow_id)

        # Step 3: Policy Agent (Supervisor)
        if current_step == "POLICY_CHECK":
            # Mock step dict for supervisor
            step_data = {"price": context["price"], "content": "Deal for Student ID 123"}
            audit = supervisor_agent.audit_negotiation_step(step_data, [], 100)
            
            if not audit["compliant"]:
                 state["step"] = "REJECTED_POLICY"
                 durable_runtime.dehydrate_agent(flow_id, state)
                 return {"status": "REJECTED", "issues": audit["issues"]}
            
            state["step"] = "COMPLETED"
            durable_runtime.dehydrate_agent(flow_id, state)
            return {"status": "COMPLETED", "history": state["history"]}
            
        return state

    def human_approval_callback(self, flow_id: str, approved: bool):
        """
        Resumes the flow after Human Intervention.
        """
        state = durable_runtime.rehydrate_agent(flow_id)
        if state["step"] != "WAITING_FOR_HUMAN":
            return {"error": "Flow not waiting for human"}
        
        if approved:
            print("[Decision Room] Human Approved. Resuming...")
            state["step"] = "POLICY_CHECK" # Proceed
            durable_runtime.dehydrate_agent(flow_id, state)
            return self._execute_step(flow_id)
        else:
            state["step"] = "REJECTED_HUMAN"
            durable_runtime.dehydrate_agent(flow_id, state)
            return {"status": "TERMINATED"}

handoff_orchestrator = HandoffOrchestrator()
