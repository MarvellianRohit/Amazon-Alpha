import httpx
import os
import uuid
import datetime
from typing import Dict, Any, Optional

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
VENDOR_API_URL = os.getenv("VENDOR_API_URL", "http://127.0.0.1:8000/api/v1/vendor") # Default to internal

HEADERS = {
    "apikey": SUPABASE_KEY or "",
    "Authorization": f"Bearer {SUPABASE_KEY or ''}",
    "Content-Type": "application/json"
}

from app.managers.notification_manager import manager

class BuyerAgentService:
    # ... (other methods)

    @staticmethod
    async def _evaluate_response(
        negotiation_id: str, 
        vendor_reply: Dict, 
        max_budget: float,
        product_id: str,
        user_id: str
    ) -> Dict[str, Any]:
        """
        Decision Logic:
        - If ACCEPTED: Proceed.
        - If COUNTERED: Check budget.
        - If REJECTED: Give up (for now).
        """
        status = vendor_reply.get("status")
        counter_price = float(vendor_reply.get("price", 0))

        if status == "ACCEPTED":
             await BuyerAgentService._execute_order(negotiation_id, user_id, product_id, counter_price)
             return {"status": "DEAL_MAKER", "final_price": counter_price}

        elif status == "COUNTERED":
            # AUTONOMOUS DECISION
            if counter_price <= max_budget:
                await BuyerAgentService._log_chat(negotiation_id, "BUYER_AGENT", f"Counter ${counter_price} is within budget (${max_budget}). requesting HI-TL Confirmation.")
                
                # TRIGGER NOTIFICATION FOR HUMAN APPROVAL
                # We do NOT auto-execute anymore, we wait for human.
                
                # 1. Save Draft Order in DB
                await BuyerAgentService._save_draft_order(negotiation_id, user_id, product_id, counter_price)

                # 2. Notify User
                msg = {
                    "type": "DEAL_APPROVAL_NEEDED",
                    "deal_id": negotiation_id,
                    "item_name": product_id, # In real app, fetch name
                    "final_price": counter_price,
                    "vendor_name": "VendorBot"
                }
                await manager.send_personal_message(msg, user_id)
                
                return {"status": "WAITING_APPROVAL", "final_price": counter_price}
            else:
                await BuyerAgentService._log_chat(negotiation_id, "BUYER_AGENT", f"Counter ${counter_price} exceeds budget (${max_budget}). Walk away.")
                return {"status": "WALK_AWAY", "message": "Price too high."}

        return {"status": "CLOSED", "message": "Negotiation ended."}

    @staticmethod
    async def finalize_deal(negotiation_id: str, user_id: str):
        """
        Called when Human approves the deal.
        Triggers Stripe Payment and Blockchain Minting.
        """
        await BuyerAgentService._log_chat(negotiation_id, "SYSTEM", "User Approved Deal. Processing Payment...")
        
        # 1. Trigger Stripe (Mock)
        # await stripe_service.charge(...)
        
        # 2. Trigger Blockchain (Mock)
        # await blockchain_service.mint_passport(...)
        
        # 3. Update Order Status
        await BuyerAgentService._log_chat(negotiation_id, "SYSTEM", "Payment Successful. Order #ORD-123 Created. Blockchain Passport Minted.")
        
        return {"status": "SUCCESS", "order_id": "ORD-123", "tx_hash": "0x123...abc"}

    @staticmethod
    async def _save_draft_order(negotiation_id: str, user_id: str, product_id: str, price: float):
        """
        Persist order with status AWAITING_HUMAN_CONFIRMATION
        """
        # DB Insert Mock
        await BuyerAgentService._log_chat(negotiation_id, "SYSTEM", f"Draft Order Saved. Status: AWAITING_HUMAN_CONFIRMATION. Price: ${price}")

    @staticmethod
    async def _execute_order(negotiation_id: str, user_id: str, product_id: str, price: float):
        """
        Move order to PENDING_PAYMENT.
        """
        await BuyerAgentService._log_chat(negotiation_id, "SYSTEM", f"Order Created for {product_id} at ${price}. Status: PENDING_PAYMENT")
        # In a real app, call OrderService.create_order(...) here
        pass

    @staticmethod
    async def _log_chat(negotiation_id: str, sender: str, message: str):
        if not SUPABASE_URL:
            print(f"[Log Mock] {sender}: {message}")
            return

        async with httpx.AsyncClient() as client:
            try:
                await client.post(
                    f"{SUPABASE_URL}/rest/v1/negotiation_logs",
                    headers=HEADERS,
                    json={
                        "negotiation_id": negotiation_id,
                        "sender": sender,
                        "message": message,
                        "timestamp": datetime.datetime.utcnow().isoformat()
                    }
                )
            except Exception as e:
                print(f"Failed to log negotiation: {e}")
