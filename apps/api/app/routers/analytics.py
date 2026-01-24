from fastapi import APIRouter
from app.services.spanner_geo import spanner_geo_service

router = APIRouter()

@router.post("/forecast")
async def run_sales_forecast(query: str = "SELECT * FROM sales WHERE VECTOR_SEARCH(...)"):
    """
    Executes an analytics query using Spanner Data Boost.
    """
    return await spanner_geo_service.execute_analytics_query(query)

@router.post("/partition-check")
async def check_partition_routing(region: str, data: dict):
    return spanner_geo_service.route_write(region, data)
