from fastapi import APIRouter
from app.services.red_team.py import red_team_service

router = APIRouter()

@router.post("/simulate-attack")
def trigger_red_team():
    """
    Triggers a simulated adversarial attack to test Prompt Shields.
    """
    return red_team_service.run_simulation()
