from app.managers.notification_manager import manager
from typing import Dict

class DefenseAgent:
# ... (lines 5-47 unchanged effectively, handled by start/end line logic of previous tool, but here replacing full file or block)
    async def kill_transaction(self, flow_id: str, reason: str):
        """
        Kills the flow and alerts user.
        """
        alert_msg = f"SECURITY ALERT: Transaction {flow_id} terminated. Reason: {reason}"
        print(f"[DEFENSE] KILL SWITCH ENGAGED. {alert_msg}")
        
        # WebSocket Alert
        await manager.send_personal_message({"type": "SECURITY_ALERT", "message": alert_msg}, "admin-user")
        return {"status": "TERMINATED", "alert_sent": True}

defense_agent = DefenseAgent()
