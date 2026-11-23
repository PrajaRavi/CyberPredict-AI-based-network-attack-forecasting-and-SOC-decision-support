from typing import List, Optional
from pydantic import BaseModel, Field


class TimeSeriesPoint(BaseModel):
    timestamp: str = Field(..., description="ISO-8601 or offset label, e.g. -15m or 14:02:31")
    value: float


class TimelinePoint(BaseModel):
    label: str
    past: Optional[float] = None
    forecast: Optional[float] = None
    band: Optional[List[float]] = None


class RiskFactor(BaseModel):
    id: str
    label: str
    metric: str
    detail: str
    contribution: int
    severity: str


class RecommendedAction(BaseModel):
    headline: str
    rationale: str
    steps: List[str]
    approvalNote: str


class RiskScore(BaseModel):
    value: int
    max: int = 100
    level: str
    delta: int
    deltaWindow: str
    trend: str
    baseline: int
    caption: str


class ForecastStatus(BaseModel):
    status: str
    tone: str
    window: str
    model: str
    lastRun: str
    nextRun: str


class AlternateVector(BaseModel):
    vector: str
    probability: int


class Prediction(BaseModel):
    attackType: str
    attackLabel: str
    confidence: int
    riskWindow: str
    headline: str
    summary: str
    disclaimer: str
    alternateVectors: List[AlternateVector]


class OverviewPayload(BaseModel):
    riskScore: RiskScore
    prediction: Prediction
    forecastStatus: ForecastStatus
    riskTimeline: dict
    riskFactors: List[RiskFactor]
    recommendedAction: RecommendedAction
