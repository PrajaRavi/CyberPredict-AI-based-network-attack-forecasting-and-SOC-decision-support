from fastapi import APIRouter, HTTPException, status
from ...services.mock_engine import mock_engine
from ...schemas.alerts import AlertsPayload, AlertAcknowledgeRequest, AlertAcknowledgeResponse

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=AlertsPayload, summary="List Active Security Incidents")
def get_alerts():
    """
    Returns the severity-ranked incident queue with model-assisted triage recommendations.
    """
    return {"alerts": mock_engine.get_alerts()}


@router.post("/{alert_id}/acknowledge", response_model=AlertAcknowledgeResponse, summary="Acknowledge or Toggle Incident")
def acknowledge_alert(alert_id: str, req: AlertAcknowledgeRequest = AlertAcknowledgeRequest()):
    """
    Analyst review action: updates the human acknowledgment status for a given alert.
    """
    updated = mock_engine.acknowledge_alert(alert_id, req.acknowledged)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Alert {alert_id} not found")
    return AlertAcknowledgeResponse(
        id=updated.id,
        acknowledged=updated.acknowledged,
        status="acknowledged" if updated.acknowledged else "open",
        message=f"Alert {alert_id} triage state updated by analyst."
    )
