from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class TrafficSummaryItem(BaseModel):
    id: str
    label: str
    value: str
    sub: str
    tone: str


class TrafficFlow(BaseModel):
    id: str
    timestamp: str
    srcIp: str
    srcPort: int
    dstIp: str
    dstPort: int
    protocol: str
    durationSec: float
    packets: int
    bytes: int
    pps: float
    bps: float
    risk: Dict[str, Any]
    flags: List[str]
    notes: str
    iface: str
    origin: str
    detector: str
    capturedAt: str


class TrafficPayload(BaseModel):
    summary: List[TrafficSummaryItem]
    flows: List[TrafficFlow]


class FlowInspectionRequest(BaseModel):
    srcIp: str
    srcPort: int = Field(..., ge=1, le=65535)
    dstIp: str
    dstPort: int = Field(..., ge=1, le=65535)
    protocol: str = Field(..., description="TCP, UDP, ICMP")
    durationSec: float = Field(..., gt=0)
    packets: int = Field(..., ge=1)
    bytes: int = Field(..., ge=1)


class FlowInspectionResponse(BaseModel):
    flowId: str
    pps: float
    bps: float
    anomalyScore: float = Field(..., ge=0.0, le=1.0)
    riskScore: int = Field(..., ge=0, le=100)
    riskLevel: str
    isAnomalous: bool
    detectedFlags: List[str]
    inferenceTimeMs: float
    recommendedAction: str
