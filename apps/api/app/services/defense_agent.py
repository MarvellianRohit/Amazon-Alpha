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
        """
        content = message.get("context", {}).get("content", "").lower()
        threats = ["system override", "ignore previous", "drop table", "admin access"]
        
        if any(t in content for t in threats):
            print(f"[DEFENSE] Threat Detected: {content}")
            return True
        return False

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
