import asyncio
from typing import Optional, Dict
from app.services.gemini import GeminiService

class VendorAgentService:
    @staticmethod
    async def process_user_message(negotiation_id: str, user_message: str, current_offer: float) -> Dict:
        """
        AI Logic powered by Gemini.
        Decides whether to accept, counter, or reject based on margin and AI persona.
        """
        # Simulate thinking time for realism
        await asyncio.sleep(1)

        # Floor Price Logic (Business Constraint)
        # In a real app, this would come from the database (Product -> Cost Price)
        floor_price = current_offer * 0.8
        
        # Prepare Context for Gemini (Persona & Constraints)
        context = f"""
        You are an intelligent Negotiation Agent for a vendor.
        Your goal is to sell the product at the highest possible price, but you can offer discounts to close the deal.
        
        CURRENT STATE:
        - Current Offer: ${current_offer}
        - Minimum Acceptable Price (Floor): ${floor_price}
        
        STRATEGY:
        - Be polite but firm.
        - If the user asks for a discount, check if you can lower the price.
        - You can offer small discounts (e.g., 2-5%) at a time.
        - NEVER go below the Floor Price of ${floor_price}.
        - If the user's offer is below floor, politely reject it and offer the lowest possible price or a price near it.
        - If the user agrees or the price is good, close the deal.
        
        OUTPUT FORMAT:
        Return ONLY a JSON string with this structure:
        {{
            "content": "your message to the user",
            "price": number (the new offer price, or current price if no change),
            "type": "counter_offer" | "message" | "accept_deal" | "reject_deal"
        }}
        """
        
        # Call Gemini
        ai_response_text = await GeminiService.generate_chat_response(
            query=f"User says: '{user_message}'", 
            context=context
        )
        
        # Parse Gemini Response (Simple heuristic parsing or expect JSON)
        # Since text-only model might return markdown, we try to clean it.
        try:
            import json
            # Clean potential markdown code blocks
            clean_text = ai_response_text.replace("```json", "").replace("```", "").strip()
            response_data = json.loads(clean_text)
            
            # Enforce Hard Constraints (Safety Layer)
            if response_data.get("price") and response_data["price"] < floor_price:
                response_data["price"] = floor_price
                response_data["content"] = "I cannot go any lower than this final price."
                
            return response_data
            
        except Exception as e:
            print(f"Vendor Agent Parse Error: {e} \nAI Output: {ai_response_text}")
            # Fallback if AI output is malformed
            return {
                "type": "message",
                "content": "I'm considering your offer, please tell me more.",
                "price": current_offer
            }
