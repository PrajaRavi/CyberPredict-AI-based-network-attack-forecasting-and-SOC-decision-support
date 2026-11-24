from typing import List, Optional
from pydantic import BaseModel, Field


class ForecastSummaryItem(BaseModel):
    id: str
    label: str
    value: str
    sub: str
    tone: str


class HorizonPoint(BaseModel):
    label: str
    observed: Optional[float] = None
    projected: Optional[float] = None
    band: Optional[List[float]] = None


class ForecastPeak(BaseModel):
    at: str
    value: float


class ForecastHorizon(BaseModel):
    threshold: float
    peak: ForecastPeak
    note: str
    points: List[HorizonPoint]


class ForecastPayload(BaseModel):
    summary: List[ForecastSummaryItem]
    horizon: ForecastHorizon


class WhatIfRequest(BaseModel):
    trafficMultiplier: float = Field(1.0, ge=0.1, le=10.0, description="Traffic volume scalar (1.0 = baseline)")
    rateLimitActive: bool = Field(False, description="Whether DDoS scrubbing / rate limiting is active")
    packetRateKpps: Optional[float] = Field(None, description="Optional override for incoming kpps")
    scenarioName: Optional[str] = Field("Custom Scenario", description="Label for what-if scenario")


class WhatIfResponse(BaseModel):
    scenario: str
    simulatedRiskScore: int = Field(..., ge=0, le=100)
    simulatedRiskLevel: str
    simulatedConfidence: int = Field(..., ge=0, le=100)
    predictedVector: str
    expectedPeakMinutes: str
    riskDeltaPct: float
    mitigationEfficiency: str
    recommendation: str
