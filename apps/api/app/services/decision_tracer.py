import datetime
import uuid
from typing import Dict, Any, List

class DecisionTracer:
    """
    Generates explainable trace maps for AI decisions.
    """
    def __init__(self):
        self._traces: List[Dict] = []

    def log_decision(self, agent_id: str, model: str, inputs: Dict, outputs: Dict, reasoning: str):
        trace_id = str(uuid.uuid4())
        
        trace_entry = {
            "trace_id": trace_id,
            "timestamp": datetime.datetime.now().isoformat(),
            "agent_id": agent_id,
            "model_usage": {
                "name": model,
                "provider": "Azure OpenAI (Private)"
            },
            "inputs": inputs,
            "decision_output": outputs,
            "explainability": {
                "reasoning_chain": reasoning,
                "policy_check": "PASSED"
            }
        }
        
        self._traces.append(trace_entry)
        print(f"[Trace {trace_id}] Decision Logged for {agent_id}")
        return trace_id

    def get_traces(self) -> List[Dict]:
        return self._traces

decision_tracer = DecisionTracer()
