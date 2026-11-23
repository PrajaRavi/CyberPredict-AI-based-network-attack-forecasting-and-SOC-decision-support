from fastapi import APIRouter
from ...services.mock_engine import mock_engine
from ...schemas.models import ModelMetricsPayload

router = APIRouter(prefix="/models", tags=["Model Telemetry"])


@router.get("/metrics", response_model=ModelMetricsPayload, summary="Get Model Performance Benchmarks")
def get_model_metrics():
    """
    Returns headline evaluation metrics (Accuracy, Precision, Recall, F1, FAR),
    baseline comparisons, rolling version trend lines, and early alarm lead times.
    """
    return mock_engine.get_model_metrics()
