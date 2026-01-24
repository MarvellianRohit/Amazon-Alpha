from fastapi import APIRouter
from app.services.decision_tracer import decision_tracer
from app.services.durable_runtime import durable_runtime

router = APIRouter()

@router.get("/traces")
def get_audit_traces():
    """
    Returns the OpenTelemetry-style Trace Map for all Agent decisions.
    """
    return decision_tracer.get_traces()

@router.get("/durable/{agent_id}")
def get_agent_state(agent_id: str):
    """
    Debug endpoint to check the 'Dehydrated' state of a sleeping agent.
    """
    try:
        return durable_runtime.rehydrate_agent(agent_id)
    except ValueError as e:
        return {"error": str(e)}
