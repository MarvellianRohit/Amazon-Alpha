from app.managers.notification_manager import notification_manager
from typing import Dict

class DefenseAgent:
    """
    Security Sentinel.
    Monitors MQ messages for Prompt Injection.
    """
    def scan_message(self, message: Dict) -> bool:
        """
        Returns True if threat detected.
        Checks: Static Threats + Regex + LLM Intent.
        """
        content = message.get("context", {}).get("content", "").lower()
        
        # 1. Static Threats
        threats = ["system override", "ignore previous", "drop table", "admin access"]
        if any(t in content for t in threats):
            print(f"[DEFENSE] Static Threat Detected: {content}")
            return True
            
        # 2. Regex (Infinite Loop / Budget Drain)
        import re
        if re.search(r"(repeat){5,}", content): # Simple loop check
             print("[DEFENSE] Infinite Loop Pattern Detected")
             return True
             
        # 3. LLM Intent Analysis (Mock)
        if self._analyze_intent_llm(content) == "MALICIOUS":
             print("[DEFENSE] LLM Intent Analysis Flagged Malicious Payload")
             return True
             
        return False

    def _analyze_intent_llm(self, text: str) -> str:
        # Simulates a fast call to a specialized Shield model
        if "steal" in text or "drain" in text:
            return "MALICIOUS"
        return "SAFE"

    async def kill_transaction(self, flow_id: str, reason: str):
        """
        Kills the flow and alerts user.
        """
        alert_msg = f"SECURITY ALERT: Transaction {flow_id} terminated. Reason: {reason}"
        print(f"[DEFENSE] KILL SWITCH ENGAGED. {alert_msg}")
        
        # WebSocket Alert
        await notification_manager.send_notification("admin-user", alert_msg)
        return {"status": "TERMINATED", "alert_sent": True}

defense_agent = DefenseAgent()
