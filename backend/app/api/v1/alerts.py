from fastapi import APIRouter, HTTPException, status
from ...services.mock_engine import mock_engine
from ...schemas.alerts import AlertsPayload, AlertItem, AlertAcknowledgeRequest, AlertAcknowledgeResponse

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=AlertsPayload, summary="List Active Security Incidents")
def get_alerts():
    """
    Returns the severity-ranked incident queue with model-assisted triage recommendations.
    Initially contains only LOW and MEDIUM category alerts.
    """
    return {"alerts": mock_engine.get_alerts()}


@router.post("/activate", response_model=AlertItem, summary="Inject Critical Threat Alert")
def activate_critical_alert():
    """
    Simulates an incoming high-priority Critical threat notification,
    triggering dashboard-wide warning postures.
    """
    return mock_engine.activate_critical_alert()


@router.post("/reset", response_model=AlertsPayload, summary="Reset Alert Queue to Low/Medium Baseline")
def reset_alerts():
    """
    Resets the alert queue back to initial baseline containing only LOW and MEDIUM alerts.
    """
    return {"alerts": mock_engine.reset_alerts()}


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
