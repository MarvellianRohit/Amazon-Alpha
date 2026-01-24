import os
# from openai import AsyncAzureOpenAI, AsyncOpenAI # In real implementation

class LLMFactory:
    @staticmethod
    def get_client():
        """
        Returns an LLM Client configured for Enterprise Security.
        Prioritizes Azure OpenAI with Private Endpoints.
        """
        # Check for Azure Config
        azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        api_key = os.getenv("AZURE_OPENAI_API_KEY")
        
        if azure_endpoint and api_key:
            print(f"[LLM Factory] Connecting to Azure OpenAI Private Endpoint: {azure_endpoint}")
            # return AsyncAzureOpenAI(
            #     azure_endpoint=azure_endpoint,
            #     api_key=api_key,
            #     api_version="2024-02-15-preview"
            # )
            return MockAzureClient(endpoint=azure_endpoint)
        
        print("[LLM Factory] Defaulting to Standard OpenAI (Public API)")
        # return AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        return MockAzureClient(endpoint="public-openai")

class MockAzureClient:
    def __init__(self, endpoint):
        self.endpoint = endpoint
    
    async def chat(self, *args, **kwargs):
        return "Mocked Azure Response"

llm_factory = LLMFactory()
