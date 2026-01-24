from datetime import datetime, timedelta
from typing import List, Dict, Optional
import random

# Mock Data since we don't have extensive order history yet
class ReplenishmentService:
    
    @staticmethod
    def get_upcoming_orders(user_id: str) -> List[Dict]:
        """
        Fetches the 'Coming Soon' queue.
        In a real app, this queries `user_consumption_patterns`.
        """
        # Mocking the Depletion Model output
        base_queue = [
            {
                "id": "pat_1",
                "product_name": "Organic Oat Milk",
                "product_id": "prod_oat_milk",
                "price": 4.99,
                "predicted_date": (datetime.now() + timedelta(days=2)).isoformat(),
                "frequency_days": 7,
                "confidence": 0.92,
                "auto_order": True # < $25
            },
            {
                "id": "pat_2",
                "product_name": "Toilet Paper (12 pk)",
                "product_id": "prod_tp",
                "price": 18.50,
                "predicted_date": (datetime.now() + timedelta(days=5)).isoformat(),
                "frequency_days": 25,
                "confidence": 0.85,
                "auto_order": True # < $25
            },
            {
                "id": "pat_3",
                "product_name": "Espresso Beans (1kg)",
                "product_id": "prod_coffee",
                "price": 32.00,
                "predicted_date": (datetime.now() + timedelta(days=6)).isoformat(),
                "frequency_days": 30,
                "confidence": 0.88,
                "auto_order": False # > $25, requires HITL
            }
        ]
        return base_queue

    @staticmethod
    def postpone_order(pattern_id: str, days: int) -> Dict:
        """
        User clicked 'Postpone'.
        Updates the model to delay purchasing.
        """
        # DB Update would happen here
        new_date = (datetime.now() + timedelta(days=days)).isoformat()
        return {
            "status": "UPDATED",
            "message": f"Order postponed by {days} days.",
            "new_date": new_date
        }

    @staticmethod
    def cancel_auto_replenishment(pattern_id: str) -> Dict:
        """
        User clicked 'Cancel'.
        Disables auto-ordering for this cycle.
        """
        return {"status": "CANCELLED", "message": "Item removed from queue."}
    
    @staticmethod
    def trigger_ap2_execution(user_id: str, pattern: Dict):
        """
        Agentic Payment Protocol (AP2).
        If price < $25, auto-execute.
        """
        if pattern['price'] < 25.00:
            print(f"[AP2] Authorized Micro-Transaction: {pattern['product_name']} for ${pattern['price']}")
            # Call OrderService.create_order(...)
            return True
        else:
            print(f"[AP2] Auth Required: {pattern['product_name']} is > $25")
            return False
