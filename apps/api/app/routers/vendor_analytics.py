from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from datetime import datetime, timedelta
import random
from app.api.vendor_deps import require_vendor_role
from typing import Any
User = Any

router = APIRouter()

@router.get("/analytics", response_model=Dict[str, Any])
def get_vendor_analytics(user: User = Depends(require_vendor_role)):
    """
    Returns analytics data for the vendor dashboard.
    Mocks data for now to support the frontend charts.
    """
    
    # 1. Mock Sales History (Area Chart)
    # Generate last 6 months of data
    sales_history = []
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    current_month_idx = datetime.now().month - 1
    
    for i in range(5, -1, -1):
        month_idx = (current_month_idx - i) % 12
        sales_history.append({
            "name": months[month_idx],
            "revenue": random.randint(1000, 5000),
            "orders": random.randint(10, 50)
        })

    # 2. Mock Category Distribution (Pie Chart)
    category_distribution = [
        {"name": "Electronics", "value": random.randint(30, 60)},
        {"name": "Books", "value": random.randint(10, 30)},
        {"name": "Home", "value": random.randint(5, 20)},
        {"name": "Fashion", "value": random.randint(5, 15)},
    ]

    return {
        "sales_history": sales_history,
        "category_distribution": category_distribution,
        "total_revenue": sum(item["revenue"] for item in sales_history),
        "total_orders": sum(item["orders"] for item in sales_history)
    }
