from supabase import create_client, Client
import os
from typing import Dict, Any, List

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

class VendorDataService:
    @staticmethod
    def get_vendor_stats(vendor_id: str) -> Dict[str, Any]:
        """
        Fetches anonymized/aggregated stats for a specific vendor.
        Strictly filters by vendor_id.
        """
        stats = {
            "top_products": [],
            "low_stock": [],
            "recent_orders_summary": {},
            "returns_count": 0
        }

        try:
            # 1. Top Products (by price/sales - assuming straightforward schema for now)
            # In a real app, we'd join with order_items to get actual sales count.
            # For this MVP, we'll list expensive products as "High Value" assets
            products = supabase.table("products")\
                .select("name, price, stock, category")\
                .eq("vendor_id", vendor_id)\
                .order("price", desc=True)\
                .limit(5)\
                .execute()
            
            stats["top_products"] = products.data

            # 2. Low Stock
            low_stock = supabase.table("products")\
                .select("name, stock")\
                .eq("vendor_id", vendor_id)\
                .lt("stock", 10)\
                .limit(5)\
                .execute()
            
            stats["low_stock"] = low_stock.data

            # 3. Recent Orders Summary
            # We need to find orders that contain items from this vendor.
            # This is complex in a simple schema without strict relation.
            # Assuming 'orders' table might not directly link vendor_id if it's per-item.
            # But earlier conversations implied 'products' have 'vendor_id'.
            # We'll skip complex joins for safety and focused on Product Data for this mvp consultant.
            
            # Returns (Mock based on status if exists, else 0)
            # stats["returns_count"] = supabase.table("orders").select("*", count="exact").eq("status", "returned").eq("vendor_id", vendor_id).execute().count
            
        except Exception as e:
            print(f"Error fetching vendor data: {e}")
            return {"error": "Failed to retrieve data"}

        return stats
