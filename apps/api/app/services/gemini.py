import google.generativeai as genai
import os
from typing import List, Dict, Any

# Configure Gemini
api_key = os.environ.get("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class GeminiService:
    @staticmethod
    def generate_embedding(text: str) -> List[float]:
        if not api_key:
            return [0.0] * 768
        try:
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text,
                task_type="retrieval_document",
                title="Product Description"
            )
            return result['embedding']
        except Exception as e:
            print(f"Gemini Embedding Error: {e}")
            return [0.0] * 768

    @staticmethod
    async def analyze_image(image_bytes: bytes, mime_type: str) -> Dict[str, str]:
        if not api_key:
            return {"query": "red running shoes", "description": "Offline Mode: Simulated Image Analysis"}
        
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            image_part = {
                "mime_type": mime_type,
                "data": image_bytes
            }
            
            prompt = """
            Analyze this image for an e-commerce platform.
            1. Describe the main product shown.
            2. Extract key attributes: Category, Color, Style, Material.
            3. Formulate a search query to find this exact or similar product.
            
            Output strictly in JSON format:
            {
                "description": "Short visual description...",
                "search_query": "Key search terms..."
            }
            """
            
            response = await model.generate_content_async([prompt, image_part])
            
            # Clean up response to ensure valid JSON
            text = response.text.replace("```json", "").replace("```", "").strip()
            import json
            return json.loads(text)
        except Exception as e:
            print(f"Gemini Vision Error: {e}")
            return {"query": "error", "description": "Could not analyze image."}


    @staticmethod
    async def generate_chat_response(query: str, context: str) -> str:
        if not api_key:
            # Simulated "Smart" AI Response for Demo/Offline Mode
            query_lower = query.lower()
            if "hello" in query_lower or "hi" in query_lower or "who are you" in query_lower:
                return "Hello! I am Jarvis, your AI shopping assistant. How can I help you today?"
            elif "search" in query_lower or "find" in query_lower:
                return f"I can certainly help you find '{query.replace('search for', '').replace('find', '').strip()}'. Checking our inventory now..."
            elif "order" in query_lower:
                return "I can help you track your recent orders. Please go to the 'My Orders' section for real-time updates."
            elif "recommend" in query_lower:
                return "Based on popular trends, I recommend checking out our new 'Holodeck' section for immersive shopping."
            else:
                return "That's an interesting question. While I'm currently in 'Offline Demo Mode', I can still help you navigate the store. Try asking me to search for products or check your cart."
        
        try:
            # deterministic guardrail for identity
            if "who are you" in query.lower() or "your name" in query.lower():
                return "I am Jarvis, your AI shopping assistant."

            model = genai.GenerativeModel('gemini-pro')
            
            prompt = f"""
            You are "Jarvis", the advanced AI shopping assistant for Amazon-Alpha.
            You have access to the system's documentation and live data.
            
            CONTEXT FROM KNOWLEDGE BASE:
            {context}
            
            USER QUERY:
            {query}
            
            INSTRUCTIONS:
            - You are Jarvis. If asked who you are, ALWAYS answer "I am Jarvis, your AI shopping assistant."
            - For product questions, answer based on the provided context.
            - If the answer is not in the context, you can use your general knowledge to be helpful.
            - Format your response in Markdown.
            """
            
            response = await model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini Chat Error: {e}")
            return "Create a support ticket. My AI brain is currently overloaded."

    @staticmethod
    async def generate_consultant_response(query: str, data_context: Dict[str, Any]) -> str:
        if not api_key:
            return "AI Consultant Offline. Configure GOOGLE_API_KEY."
        
        try:
            model = genai.GenerativeModel('gemini-1.5-pro') # Using 1.5 Pro as requested
            
            prompt = f"""
            You are an Expert E-Commerce Business Consultant for a specific vendor on Amazon-Alpha.
            You have access to the vendor's real-time performance data.

            VENDOR DATA CONTEXT:
            {data_context}

            USER QUERY:
            {query}

            INSTRUCTIONS:
            - Analyze the provided data to answer the query.
            - If asking about "best products", refer to the "top_products" list.
            - If asking about "inventory risks", refer to "low_stock".
            - Be professional, data-driven, and actionable.
            - Suggest specific strategies (e.g., "Run a flash sale on X", "Restock Y immediately").
            - Format response in Markdown.
            """
            
            response = await model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini Consultant Error: {e}")
            # Fallback to standard model if 1.5-pro not available in tier
            try:
                model = genai.GenerativeModel('gemini-pro')
                response = await model.generate_content_async(prompt)
                return response.text
            except:
                return "I'm having trouble analyzing your business data right now."
