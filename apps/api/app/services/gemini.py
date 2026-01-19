import google.generativeai as genai
import os
from typing import List, Dict, Any

# Configure Gemini
api_key = os.environ.get("GEMINI_API_KEY")
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
    async def generate_chat_response(query: str, context: str) -> str:
        if not api_key:
            return "I am running in Offline Mode. Please configure GEMINI_API_KEY."
        
        try:
            model = genai.GenerativeModel('gemini-pro')
            
            prompt = f"""
            You are the "God Mode" AI Assistant for Amazon-Alpha, an advanced e-commerce platform.
            You have access to the system's documentation and live data.
            
            CONTEXT FROM KNOWLEDGE BASE:
            {context}
            
            USER QUERY:
            {query}
            
            INSTRUCTIONS:
            - Answer the user's question accurately based ONLY on the provided context.
            - If the context doesn't contain the answer, use your general knowledge but mention you are unsure about specific implementation details.
            - Be helpful, technical (if asked), and concise.
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
            return "AI Consultant Offline. Configure GEMINI_API_KEY."
        
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
