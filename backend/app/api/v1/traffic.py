from fastapi import APIRouter
from ...services.mock_engine import mock_engine
from ...schemas.traffic import TrafficPayload, FlowInspectionRequest, FlowInspectionResponse

router = APIRouter(prefix="/network", tags=["Network Traffic"])


@router.get("/flows", response_model=TrafficPayload, summary="List Captured NetFlow Records")
def get_network_flows():
    """
    Returns the network flow capture summary and recent NetFlow-style flow telemetry
    with anomaly classification and risk flags.
    """
    return mock_engine.get_traffic_data()


@router.post("/inspect", response_model=FlowInspectionResponse, summary="Inspect Flow with ML Anomaly Detector")
def inspect_flow(req: FlowInspectionRequest):
    """
    Simulates real-time ML anomaly detection against an incoming network flow record.
    Evaluates packet rate, duration, reflection profile, and assigns risk scoring.
    """
    return mock_engine.inspect_flow(req)
