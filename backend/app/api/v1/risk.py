from fastapi import APIRouter
from ...services.mock_engine import mock_engine
from ...schemas.risk import RiskAnalysisPayload

router = APIRouter(prefix="/risk", tags=["Risk Analysis"])


@router.get("/analysis", response_model=RiskAnalysisPayload, summary="Get Risk & Behavioural Analysis Bundle")
def get_risk_analysis():
    """
    Returns live behavioural telemetry snapshots (pps, byte rate, active flows),
    trailing 60m trend series with forecasts, detailed 120m timeline, and expected risk window.
    """
    return mock_engine.get_risk_analysis_data()
