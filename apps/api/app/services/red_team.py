from typing import Dict
from app.services.malicious_agent import malicious_agent
from app.services.supervisor_agent import supervisor_agent
from app.services.decision_tracer import decision_tracer

class RedTeamService:
    @staticmethod
    def run_simulation() -> Dict:
        """
        Executes a Red Team Attack against the Governance Layer.
        """
        # 1. Generate Attack
        attack = malicious_agent.generate_attack()
        
        # 2. Audit (Simulate Buyer passing it to Supervisor)
        # Context: Trying to buy something for $1000 (Benchmark $100)
        audit_result = supervisor_agent.audit_negotiation_step(
            current_step=attack, 
            history=[], 
            benchmark_price=100.0
        )
        
        # 3. Log Trace
        trace_id = decision_tracer.log_decision(
            agent_id="RED_TEAM_SIMULATOR",
            model="Malicious-GPT-4",
            inputs=attack,
            outputs=audit_result,
            reasoning="Testing Injection Shields"
        )
        
        return {
            "attack_payload": attack,
            "defense_result": audit_result,
            "trace_id": trace_id,
            "outcome": "BLOCKED" if not audit_result["compliant"] else "BREACHED"
        }

red_team_service = RedTeamService()
