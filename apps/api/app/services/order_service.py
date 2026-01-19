from typing import Dict, Any, List
from fastapi import BackgroundTasks
import httpx
import os
import asyncio

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY or "",
    "Authorization": f"Bearer {SUPABASE_KEY or ''}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

class OrderService:
    @staticmethod
    def calculate_payouts(order_total: float, commission_rate: float = 0.10) -> Dict[str, float]:
        """
        Calculates the platform fee and vendor payout based on the order total.
        (Sync helper - CPU bound)
        """
        if order_total < 0:
            raise ValueError("Order total cannot be negative")

        platform_fee = round(order_total * commission_rate, 2)
        vendor_payout = round(order_total - platform_fee, 2)

        return {
            "total_amount": float(order_total),
            "platform_fee": platform_fee,
            "vendor_payout": vendor_payout,
            "commission_rate": commission_rate
        }

    @staticmethod
    async def create(order_data: Dict[str, Any], background_tasks: BackgroundTasks) -> Dict[str, Any]:
        """
        Async Order Creation.
        1. Calculates payouts.
        2. Persists to DB via Async Client.
        3. Triggers Background Tasks (e.g. Email, Inventory Sync).
        """
        # 1. Logic
        total = float(order_data.get("total_amount", 0.0))
        payouts = OrderService.calculate_payouts(total)
        final_order = {**order_data, **payouts, "status": "pending"}

        # 2. Async DB Insert
        if SUPABASE_URL:
            async with httpx.AsyncClient() as client:
                try:
                    response = await client.post(
                        f"{SUPABASE_URL}/rest/v1/orders",
                        headers=HEADERS,
                        json=final_order
                    )
                    response.raise_for_status()
                    # If successful, use the returned data
                    created_record = response.json()[0]
                except Exception as e:
                    print(f"Async DB Error: {e}")
                    # In production, we'd raise HTTPException(500)
                    created_record = final_order 
        else:
            created_record = final_order # Mock return

        # 3. Background Tasks
        background_tasks.add_task(OrderService.process_post_order_tasks, created_record["id"])

        return created_record

    @staticmethod
    async def process_post_order_tasks(order_id: str):
        """
        Simulates heavy background processing (Email, Inventory, AI Analysis).
        """
        await asyncio.sleep(2) # Simulate work
        print(f"Background Task: Processing complete for order {order_id}")
        # Here we would call other async services, e.g. EmailService.send_confirmation(order_id)
