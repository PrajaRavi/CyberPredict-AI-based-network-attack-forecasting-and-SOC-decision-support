from typing import List
from pydantic import BaseModel


class AlertItem(BaseModel):
    id: str
    timestamp: str
    severity: str
    vector: str
    message: str
    recommendedAction: str
    source: str
    target: str
    acknowledged: bool = False


class AlertsPayload(BaseModel):
    alerts: List[AlertItem]


class AlertAcknowledgeRequest(BaseModel):
    acknowledged: bool = True
    analystNote: str = "Triage reviewed by SOC analyst."


class AlertAcknowledgeResponse(BaseModel):
    id: str
    acknowledged: bool
    status: str
    message: str
