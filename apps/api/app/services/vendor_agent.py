import asyncio
from typing import Optional, Dict

class VendorAgentService:
    @staticmethod
    async def process_user_message(negotiation_id: str, user_message: str, current_offer: float) -> Dict:
        """
        AI Logic (Simulated for now, would be Gemini).
        Decides whether to accept, counter, or reject based on margin.
        """
        # Simulate thinking time
        await asyncio.sleep(1)

        # Mock Logic:
        # If user asks for discount and price is above floor, give small discount.
        # Floor is mocked at 80% of current_offer for this demo.
        floor_price = current_offer * 0.8
        
        lower_message = user_message.lower()
        
        if "expensive" in lower_message or "discount" in lower_message:
            # Offer 5% off
            new_price = round(current_offer * 0.95, 2)
            if new_price >= floor_price:
                return {
                    "type": "counter_offer",
                    "content": f"I can offer you a special deal at ${new_price}. This is a limited time offer.",
                    "price": new_price
                }
            else:
                return {
                    "type": "message",
                    "content": "I'm afraid that's the best price we can do for this quality.",
                    "price": current_offer
                }
        
        return {
            "type": "message",
            "content": "Let me know if you are ready to purchase.",
            "price": current_offer
        }
