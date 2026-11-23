from fastapi import APIRouter
from ...services.mock_engine import mock_engine
from ...schemas.common import OverviewPayload

router = APIRouter(tags=["Overview"])


@router.get("/overview", response_model=OverviewPayload, summary="Get Overview Dashboard Aggregate")
def get_overview():
    """
    Returns the composite SOC overview including current risk score, primary
    probabilistic prediction, engine status, timeline, and analyst action items.
    """
    return mock_engine.get_overview_data()
