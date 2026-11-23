from typing import List, Optional
from pydantic import BaseModel
from .common import RiskFactor, TimelinePoint


class BehaviourStat(BaseModel):
    id: str
    label: str
    value: str
    unit: str
    baseline: str
    delta: str
    tone: str
    note: str


class TrafficMetricPoint(BaseModel):
    t: str
    v: Optional[float] = None
    f: Optional[float] = None


class TrafficMetric(BaseModel):
    id: str
    label: str
    unit: str
    current: str
    baseline: float
    deltaPct: str
    tone: str
    hasForecast: bool
    series: List[TrafficMetricPoint]


class RiskTimelineDetailed(BaseModel):
    threshold: int
    historyStart: str
    forecastEnd: str
    code: str
    points: List[TimelinePoint]


class RiskWindowSegment(BaseModel):
    label: str
    probability: int
    inWindow: bool


class RiskWindow(BaseModel):
    label: str
    peakLikelihood: int
    segments: List[RiskWindowSegment]
    note: str


class RiskAnalysisPayload(BaseModel):
    trafficBehaviour: List[BehaviourStat]
    trafficMetrics: List[TrafficMetric]
    riskFactors: List[RiskFactor]
    riskTimelineDetailed: RiskTimelineDetailed
    riskWindow: RiskWindow
