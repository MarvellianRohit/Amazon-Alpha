from typing import Optional, Dict, Any, List
import httpx
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY or "",
    "Authorization": f"Bearer {SUPABASE_KEY or ''}",
    "Content-Type": "application/json"
}

class ProductService:
    @staticmethod
    def get_product_price(product: Dict[str, Any], user: Optional[Dict[str, Any]] = None) -> float:
        """
        Calculates the final price for a user.
        Returns student_price if user is a verified student, otherwise regular_price.
        (Sync helper function - CPU bound)
        """
        regular_price = float(product.get("regular_price", 0.0))
        
        # Check if user exists and is a verified student
        if user and user.get("is_verified_student", False):
            student_price = product.get("student_price")
            # Ensure student_price is valid and lower than regular
            if student_price is not None and float(student_price) < regular_price:
                return float(student_price)
        
        return regular_price

    @staticmethod
    async def get_all(limit: int = 100) -> List[Dict[str, Any]]:
        """
        Async fetch all products using direct REST API to Supabase (via httpx).
        This ensures non-blocking I/O.
        """
        if not SUPABASE_URL:
             # Fallback/Mock for local devs without env vars
            return []

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{SUPABASE_URL}/rest/v1/products",
                    headers=HEADERS,
                    params={"select": "*", "limit": str(limit)}
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                print(f"Async DB Error: {e}")
                return []

    @staticmethod
    def format_product_response(product: Dict[str, Any], user: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Enriches product data with the computed price and active discount flag.
        """
        final_price = ProductService.get_product_price(product, user)
        is_student_price = (final_price == float(product.get("student_price", 0.0) or 0)) and (final_price < float(product.get("regular_price", 0.0)))
        
        return {
            **product,
            "display_price": final_price,
            "is_student_discount_applied": is_student_price
        }
