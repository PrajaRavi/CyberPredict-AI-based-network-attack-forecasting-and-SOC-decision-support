from fastapi import APIRouter
from ...services.mock_engine import mock_engine
from ...schemas.forecast import ForecastPayload

router = APIRouter(prefix="/forecast", tags=["Forecast"])


@router.get("/window", response_model=ForecastPayload, summary="Get Attack Probability Horizon & Summary")
@router.get("", response_model=ForecastPayload, summary="Get Attack Forecast Horizon")
def get_forecast():
    """
    Returns the attack-probability horizon curve, peak likelihood timestamp,
    confidence intervals, and forecast summary KPIs.
    """
    return mock_engine.get_forecast_data()
