from typing import List, Dict, Any
from pydantic import BaseModel


class MetricCard(BaseModel):
    id: str
    label: str
    value: float
    unit: str
    baseline: float
    delta: str
    tone: str
    higherIsBetter: bool
    note: str


class CompareDatum(BaseModel):
    metric: str
    cyberpredict: float
    baseline: float


class VersionPoint(BaseModel):
    version: str
    accuracy: float
    precision: float
    recall: float
    f1: float


class LeadTimeScenario(BaseModel):
    id: str
    vector: str
    cpAlarmMin: float
    baseAlarmMin: float


class LeadTimeAverage(BaseModel):
    cyberpredict: float
    baseline: float
    leadMin: float
    factor: str


class LeadTimeData(BaseModel):
    trackMaxMin: float
    average: LeadTimeAverage
    scenarios: List[LeadTimeScenario]


class AlarmTimeData(BaseModel):
    id: str
    label: str
    value: float
    unit: str
    tone: str
    scaleMax: float
    note: str


class ConfusionData(BaseModel):
    tp: int
    fp: int
    fn: int
    tn: int
    totalWindows: str


class ModelMetricsPayload(BaseModel):
    metricCards: List[MetricCard]
    metricComparison: List[CompareDatum]
    versionTrend: List[VersionPoint]
    leadTime: LeadTimeData
    alarmTimes: List[AlarmTimeData]
    confusionMatrix: ConfusionData
    operationalImpact: Dict[str, Any]
    methodology: Dict[str, Any]
