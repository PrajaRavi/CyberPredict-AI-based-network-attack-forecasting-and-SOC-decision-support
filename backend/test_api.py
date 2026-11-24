import sys
from pathlib import Path

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app
from app.services.mock_engine import mock_engine
from app.schemas.traffic import FlowInspectionRequest
from app.schemas.forecast import WhatIfRequest


def test_endpoints():
    print("Testing CyberPredict API Route Registrations via OpenAPI schema...")
    routes = list(app.openapi()["paths"].keys())
    expected_paths = [
        "/health",
        "/",
        "/api/v1/overview",
        "/api/v1/network/flows",
        "/api/v1/network/inspect",
        "/api/v1/forecast/window",
        "/api/v1/risk/analysis",
        "/api/v1/alerts",
        "/api/v1/alerts/activate",
        "/api/v1/alerts/reset",
        "/api/v1/alerts/{alert_id}/acknowledge",
        "/api/v1/models/metrics",
        "/api/v1/simulation/what-if"
    ]
    
    for path in expected_paths:
        assert path in routes, f"Missing route: {path}. Available: {routes}"
        print(f"  [PASS] Route registered: {path}")

    print("\nTesting Mock Engine Outputs...")
    overview = mock_engine.get_overview_data()
    assert overview["riskScore"].value == 87
    print("  [PASS] Overview risk score:", overview["riskScore"].value)

    traffic = mock_engine.get_traffic_data()
    assert len(traffic["flows"]) > 0
    print(f"  [PASS] Traffic flows returned: {len(traffic['flows'])}")

    # Test flow inspection
    req = FlowInspectionRequest(
        srcIp="172.16.88.41",
        srcPort=52214,
        dstIp="10.0.4.12",
        dstPort=443,
        protocol="TCP",
        durationSec=2.0,
        packets=40000,
        bytes=3000000
    )
    inspection = mock_engine.inspect_flow(req)
    assert inspection.isAnomalous is True
    print(f"  [PASS] Flow inspection: score={inspection.anomalyScore}, risk={inspection.riskLevel}")

    # Test simulation
    sim_req = WhatIfRequest(trafficMultiplier=2.5, rateLimitActive=True)
    sim_res = mock_engine.simulate_what_if(sim_req)
    print(f"  [PASS] What-If simulation: score={sim_res.simulatedRiskScore}, level={sim_res.simulatedRiskLevel}")

    # Test initial alerts (should be only LOW and MEDIUM)
    initial_alerts = mock_engine.get_alerts()
    severities = {a.severity for a in initial_alerts}
    assert "CRITICAL" not in severities and "HIGH" not in severities, f"Initial alerts contain critical/high: {severities}"
    print(f"  [PASS] Initial alerts contains only: {severities} (count={len(initial_alerts)})")

    # Test activating critical alert
    new_crit = mock_engine.activate_critical_alert()
    assert new_crit.severity == "CRITICAL"
    print(f"  [PASS] Activate critical alert: {new_crit.id} ({new_crit.vector})")

    # Test alert acknowledge
    ack_res = mock_engine.acknowledge_alert(new_crit.id, True)
    assert ack_res is not None and ack_res.acknowledged is True
    print(f"  [PASS] Alert acknowledgement: {ack_res.id} acknowledged={ack_res.acknowledged}")

    # Test reset
    reset_list = mock_engine.reset_alerts()
    reset_sevs = {a.severity for a in reset_list}
    assert "CRITICAL" not in reset_sevs and "HIGH" not in reset_sevs
    print(f"  [PASS] Reset alerts back to: {reset_sevs}")

    print("\nAll backend logic and route definitions verified successfully!")


if __name__ == "__main__":
    test_endpoints()
