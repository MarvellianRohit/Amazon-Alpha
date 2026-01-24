from fastapi import APIRouter
from app.services.spanner_ledger import spanner_service

router = APIRouter()

@router.post("/flash-sale/buy")
async def buy_flash_item(sku: str = "SKU-EXCLUSIVE-B", quantity: int = 1):
    """
    High-Concurrency endpoint using Spanner OCC.
    """
    return await spanner_service.execute_flash_sale_order(sku, quantity)

@router.get("/{sku}")
def get_inventory(sku: str):
    return {"sku": sku, "stock": spanner_service.get_stock(sku)}
