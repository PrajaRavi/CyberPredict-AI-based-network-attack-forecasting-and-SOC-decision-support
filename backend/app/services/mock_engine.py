import datetime
import random
from typing import List, Dict, Any, Optional

from ..schemas.common import (
    RiskScore, Prediction, ForecastStatus, RiskFactor, RecommendedAction, AlternateVector
)
from ..schemas.traffic import TrafficSummaryItem, TrafficFlow, FlowInspectionRequest, FlowInspectionResponse
from ..schemas.forecast import ForecastSummaryItem, ForecastHorizon, ForecastPeak, HorizonPoint, WhatIfRequest, WhatIfResponse
from ..schemas.risk import BehaviourStat, TrafficMetric, TrafficMetricPoint, RiskTimelineDetailed, RiskWindow, RiskWindowSegment
from ..schemas.alerts import AlertItem
from ..schemas.models import (
    MetricCard, CompareDatum, VersionPoint, LeadTimeData, LeadTimeAverage, LeadTimeScenario,
    AlarmTimeData, ConfusionData
)


class MockInferenceEngine:
    """
    Central Mock Engine simulating ML inference, forecasting, and NetFlow analytics.
    When real ML weights (PyTorch, ONNX, Scikit-learn) are available, this class
    serves as the reference blueprint for model inputs and outputs.
    """

    def __init__(self):
        self._alerts_db: List[Dict[str, Any]] = self._init_alerts()

    # -------------------------------------------------------------------------
    # Helper: dynamic time formatting
    # -------------------------------------------------------------------------
    @staticmethod
    def _get_time_offset(minutes_delta: int) -> str:
        t = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=minutes_delta)
        return t.strftime("%H:%M:%S")

    # -------------------------------------------------------------------------
    # 1. Overview Dashboard
    # -------------------------------------------------------------------------
    def get_overview_data(self) -> Dict[str, Any]:
        risk_score = RiskScore(
            value=87,
            max=100,
            level="HIGH",
            delta=12,
            deltaWindow="15 min",
            trend="rising",
            baseline=64,
            caption="Composite of flow, behaviour and exposure signals across monitored endpoints."
        )

        prediction = Prediction(
            attackType="DDoS",
            attackLabel="Distributed denial-of-service pattern",
            confidence=94,
            riskWindow="Next 10–15 minutes",
            headline="Elevated attack risk detected",
            summary=(
                "The forecasting model anticipates DDoS-pattern activity within the expected risk window. "
                "This is a probabilistic forecast derived from live traffic signals — no attack has been confirmed."
            ),
            disclaimer="Forecast output for analyst review. CyberPredict indicates likelihood, never confirmation.",
            alternateVectors=[
                AlternateVector(vector="Brute force", probability=31),
                AlternateVector(vector="Port scan", probability=18),
                AlternateVector(vector="Data exfiltration", probability=9),
            ]
        )

        forecast_status = ForecastStatus(
            status="Elevated Risk",
            tone="warn",
            window="Next 10–15 minutes",
            model="Ensemble v2.4.1",
            lastRun="42s ago",
            nextRun="in 18s"
        )

        risk_timeline = {
            "threshold": 75,
            "points": [
                {"label": "-60m", "past": 41, "forecast": None, "band": None},
                {"label": "-55m", "past": 44, "forecast": None, "band": None},
                {"label": "-50m", "past": 39, "forecast": None, "band": None},
                {"label": "-45m", "past": 47, "forecast": None, "band": None},
                {"label": "-40m", "past": 52, "forecast": None, "band": None},
                {"label": "-35m", "past": 49, "forecast": None, "band": None},
                {"label": "-30m", "past": 55, "forecast": None, "band": None},
                {"label": "-25m", "past": 58, "forecast": None, "band": None},
                {"label": "-20m", "past": 63, "forecast": None, "band": None},
                {"label": "-15m", "past": 66, "forecast": None, "band": None},
                {"label": "-10m", "past": 72, "forecast": None, "band": None},
                {"label": "-5m", "past": 79, "forecast": None, "band": None},
                {"label": "now", "past": 87, "forecast": 87, "band": [87, 87]},
                {"label": "+5m", "past": None, "forecast": 90, "band": [83, 95]},
                {"label": "+10m", "past": None, "forecast": 93, "band": [80, 97]},
                {"label": "+15m", "past": None, "forecast": 91, "band": [76, 97]},
            ]
        }

        risk_factors = [
            RiskFactor(
                id="packet-rate",
                label="High packet rate",
                metric="3.2× baseline",
                detail="Inbound packet rate running 3.2× the 7-day baseline across edge interfaces.",
                contribution=28,
                severity="high",
            ),
            RiskFactor(
                id="traffic-volume",
                label="Abnormal traffic volume",
                metric="+214%",
                detail="Aggregate ingress volume exceeds the seasonal envelope expected for this hour.",
                contribution=26,
                severity="high",
            ),
            RiskFactor(
                id="source-behaviour",
                label="Unusual source behaviour",
                metric="142 sources",
                detail="Low-reputation source cluster showing synchronized, repeating request patterns.",
                contribution=19,
                severity="medium",
            ),
            RiskFactor(
                id="connection-frequency",
                label="Increased connection frequency",
                metric="+86%",
                detail="New connection attempts rising sharply across monitored endpoints.",
                contribution=14,
                severity="medium",
            ),
        ]

        recommended_action = RecommendedAction(
            headline="Investigate abnormal source traffic and review affected endpoints.",
            rationale="Prioritized from the top contributing risk factors and the 15-minute forecast window.",
            steps=[
                "Trace the top contributing source IPs and ASN origins",
                "Review affected endpoints for early saturation signals",
                "Stage the DDoS mitigation playbook for on-call approval",
            ],
            approvalNote="Recommendation for human approval — CyberPredict does not execute automated responses."
        )

        return {
            "riskScore": risk_score,
            "prediction": prediction,
            "forecastStatus": forecast_status,
            "riskTimeline": risk_timeline,
            "riskFactors": risk_factors,
            "recommendedAction": recommended_action
        }

    # -------------------------------------------------------------------------
    # 2. Network Traffic Flows
    # -------------------------------------------------------------------------
    def get_traffic_data(self) -> Dict[str, Any]:
        summary = [
            TrafficSummaryItem(id="flows", label="Flows captured", value="26", sub="Current 60-min window", tone="mist"),
            TrafficSummaryItem(id="anomalous", label="Anomalous flows", value="7", sub="High risk and above", tone="crit"),
            TrafficSummaryItem(id="top-protocol", label="Top protocol", value="TCP", sub="19 of 26 flows", tone="pulse"),
            TrafficSummaryItem(id="peak-rate", label="Peak packet rate", value="22.9k pps", sub="F-1042 · 172.16.88.41", tone="crit"),
        ]

        flows = [
            TrafficFlow(
                id="F-1042", timestamp=self._get_time_offset(0), srcIp="172.16.88.41", srcPort=52214, dstIp="10.0.4.12", dstPort=443,
                protocol="TCP", durationSec=2.1, packets=48200, bytes=3856000, pps=22952.4, bps=1836190,
                risk={"level": "CRITICAL", "score": 96}, flags=["SYN flood pattern", "3.2× baseline pps", "Low-reputation ASN"],
                notes="Handshake completion near zero; requests concentrated on a single virtual host.",
                iface="edge-01", origin="Segment 172.16.88.0/24", detector="flow-anomaly v3", capturedAt="2026-02-14 14:02:31 UTC"
            ),
            TrafficFlow(
                id="F-1041", timestamp=self._get_time_offset(-1), srcIp="172.16.88.42", srcPort=48902, dstIp="10.0.4.12", dstPort=53,
                protocol="UDP", durationSec=1.8, packets=39600, bytes=4752000, pps=22000, bps=2640000,
                risk={"level": "CRITICAL", "score": 94}, flags=["UDP amplification profile", "Reflection signature"],
                notes="Amplification ratio consistent with DNS reflection against open resolvers.",
                iface="edge-01", origin="Segment 172.16.88.0/24", detector="flow-anomaly v3", capturedAt="2026-02-14 14:02:18 UTC"
            ),
            TrafficFlow(
                id="F-1040", timestamp=self._get_time_offset(-2), srcIp="172.16.88.57", srcPort=51108, dstIp="10.0.4.8", dstPort=443,
                protocol="TCP", durationSec=4.6, packets=61200, bytes=4284000, pps=13304.3, bps=931304,
                risk={"level": "HIGH", "score": 88}, flags=["Sustained single-target rate"],
                notes="Steady request pressure on one endpoint; no legitimate session growth to match.",
                iface="edge-01", origin="Segment 172.16.88.0/24", detector="flow-anomaly v3", capturedAt="2026-02-14 14:01:47 UTC"
            ),
            TrafficFlow(
                id="F-1039", timestamp=self._get_time_offset(-3), srcIp="172.16.88.63", srcPort=44710, dstIp="10.0.4.12", dstPort=80,
                protocol="TCP", durationSec=3.9, packets=44800, bytes=3136000, pps=11487.2, bps=804102,
                risk={"level": "HIGH", "score": 85}, flags=["HTTP flood candidate"],
                notes="GET-heavy request mix with truncated user agents across rotating source ports.",
                iface="edge-01", origin="Segment 172.16.88.0/24", detector="flow-anomaly v3", capturedAt="2026-02-14 14:01:02 UTC"
            ),
            TrafficFlow(
                id="F-1038", timestamp=self._get_time_offset(-4), srcIp="172.16.88.49", srcPort=39226, dstIp="10.0.4.15", dstPort=443,
                protocol="TCP", durationSec=6.2, packets=51900, bytes=4671000, pps=8371.0, bps=753387,
                risk={"level": "HIGH", "score": 82}, flags=["Bursty request cadence"],
                notes="Asymmetric send-to-receive ratio on high-privilege service port.",
                iface="edge-01", origin="Segment 172.16.88.0/24", detector="flow-anomaly v3", capturedAt="2026-02-14 14:00:26 UTC"
            ),
            TrafficFlow(
                id="F-1037", timestamp=self._get_time_offset(-6), srcIp="10.99.2.17", srcPort=41002, dstIp="10.0.4.12", dstPort=22,
                protocol="TCP", durationSec=8.4, packets=4200, bytes=294000, pps=500.0, bps=35000,
                risk={"level": "HIGH", "score": 78}, flags=["SSH probe pattern", "Repeated handshake reset"],
                notes="Multiple failed authentication attempts across 30-second window.",
                iface="edge-02", origin="VLAN-99 Internal", detector="rule-sig v1.2", capturedAt="2026-02-14 13:58:12 UTC"
            ),
            TrafficFlow(
                id="F-1036", timestamp=self._get_time_offset(-8), srcIp="192.168.1.105", srcPort=58334, dstIp="10.0.4.12", dstPort=443,
                protocol="TCP", durationSec=14.2, packets=2100, bytes=1470000, pps=147.9, bps=103521,
                risk={"level": "LOW", "score": 14}, flags=["Standard TLS session"],
                notes="Normal user checkout traffic pattern.",
                iface="edge-01", origin="Office LAN", detector="flow-anomaly v3", capturedAt="2026-02-14 13:56:04 UTC"
            ),
        ]

        return {"summary": summary, "flows": flows}

    def inspect_flow(self, req: FlowInspectionRequest) -> FlowInspectionResponse:
        """Simulate real-time ML anomaly detection on a single network flow."""
        pps = req.packets / req.durationSec
        bps = (req.bytes * 8) / req.durationSec

        flags = []
        anomaly_score = 0.10
        risk_score = 15

        if pps > 15000:
            flags.append("High packet rate (> 15k pps)")
            flags.append("Volumetric flood signature")
            anomaly_score += 0.65
            risk_score += 65
        elif pps > 5000:
            flags.append("Elevated packet rate")
            anomaly_score += 0.35
            risk_score += 35

        if req.protocol.upper() == "UDP" and req.dstPort in [53, 123, 1900]:
            flags.append("Reflection-prone port profile")
            anomaly_score += 0.30
            risk_score += 30

        if req.dstPort in [22, 3389] and pps > 100:
            flags.append("Potential brute-force probe")
            anomaly_score += 0.30
            risk_score += 25

        anomaly_score = min(1.0, round(anomaly_score, 2))
        risk_score = min(100, risk_score)
        is_anomalous = anomaly_score >= 0.5 or risk_score >= 60

        if risk_score >= 85:
            risk_level = "CRITICAL"
            action = "Immediate rate-limiting recommended; isolate suspect source IP range."
        elif risk_score >= 70:
            risk_level = "HIGH"
            action = "Stage DDoS defense profile and inspect endpoint saturation."
        elif risk_score >= 40:
            risk_level = "MEDIUM"
            action = "Monitor source IP activity for repeated pattern triggers."
        else:
            risk_level = "LOW"
            action = "Nominal traffic flow. No analyst intervention needed."

        return FlowInspectionResponse(
            flowId=f"F-INSPECT-{random.randint(1000, 9999)}",
            pps=round(pps, 2),
            bps=round(bps, 2),
            anomalyScore=anomaly_score,
            riskScore=risk_score,
            riskLevel=risk_level,
            isAnomalous=is_anomalous,
            detectedFlags=flags if flags else ["Normal flow metrics"],
            inferenceTimeMs=round(random.uniform(1.2, 3.8), 2),
            recommendedAction=action
        )

    # -------------------------------------------------------------------------
    # 3. Forecast Page & Horizon
    # -------------------------------------------------------------------------
    def get_forecast_data(self) -> Dict[str, Any]:
        summary = [
            ForecastSummaryItem(id="risk-score", label="Current risk score", value="87 / 100", sub="High · +12 pts in 15 min", tone="crit"),
            ForecastSummaryItem(id="attack-type", label="Predicted attack type", value="DDoS", sub="Denial-of-service pattern", tone="mist"),
            ForecastSummaryItem(id="confidence", label="Prediction confidence", value="94%", sub="Ensemble agreement", tone="pulse"),
            ForecastSummaryItem(id="status", label="Forecast status", value="Elevated Risk", sub="Above elevated threshold", tone="warn"),
            ForecastSummaryItem(id="window", label="Expected risk window", value="Next 10–15 min", sub="From current evaluation", tone="warn"),
            ForecastSummaryItem(id="trend", label="Risk trend", value="+12 pts", sub="Trailing 15 minutes", tone="crit"),
        ]

        horizon = ForecastHorizon(
            threshold=70.0,
            peak=ForecastPeak(at="+10m", value=94.0),
            note="Probabilities express modelled likelihood of attack-pattern activity — no event has been confirmed.",
            points=[
                HorizonPoint(label="-45m", observed=44.0, projected=None, band=None),
                HorizonPoint(label="-40m", observed=47.0, projected=None, band=None),
                HorizonPoint(label="-35m", observed=45.0, projected=None, band=None),
                HorizonPoint(label="-30m", observed=51.0, projected=None, band=None),
                HorizonPoint(label="-25m", observed=55.0, projected=None, band=None),
                HorizonPoint(label="-20m", observed=60.0, projected=None, band=None),
                HorizonPoint(label="-15m", observed=64.0, projected=None, band=None),
                HorizonPoint(label="-10m", observed=71.0, projected=None, band=None),
                HorizonPoint(label="-5m", observed=79.0, projected=None, band=None),
                HorizonPoint(label="now", observed=87.0, projected=87.0, band=[87.0, 87.0]),
                HorizonPoint(label="+5m", observed=None, projected=91.0, band=[85.0, 96.0]),
                HorizonPoint(label="+10m", observed=None, projected=94.0, band=[84.0, 98.0]),
                HorizonPoint(label="+15m", observed=None, projected=92.0, band=[80.0, 98.0]),
                HorizonPoint(label="+20m", observed=None, projected=86.0, band=[74.0, 95.0]),
                HorizonPoint(label="+30m", observed=None, projected=78.0, band=[63.0, 90.0]),
                HorizonPoint(label="+45m", observed=None, projected=69.0, band=[52.0, 84.0]),
                HorizonPoint(label="+60m", observed=None, projected=61.0, band=[43.0, 76.0]),
            ]
        )

        return {"summary": summary, "horizon": horizon}

    def simulate_what_if(self, req: WhatIfRequest) -> WhatIfResponse:
        """Counterfactual scenario simulation sandbox."""
        base_risk = 87
        multiplier = req.trafficMultiplier
        rate_limit = req.rateLimitActive

        # Calculate simulated score based on multiplier & active rate limits
        score_shift = (multiplier - 1.0) * 15
        if rate_limit:
            score_shift -= 35

        simulated_score = int(max(10, min(99, base_risk + score_shift)))
        confidence = int(max(60, min(98, 94 - abs(multiplier - 1.0) * 5)))

        if simulated_score >= 80:
            level = "CRITICAL"
            recommendation = "Simulated load exceeds safe threshold. Immediate upstream scrubbing required."
            vector = "DDoS"
        elif simulated_score >= 65:
            level = "HIGH"
            recommendation = "High risk envelope. Pre-position ingress throttling on edge routers."
            vector = "DDoS / High Volume"
        elif simulated_score >= 40:
            level = "ELEVATED"
            recommendation = "Within tolerable margins. Maintain standard telemetry monitoring."
            vector = "Distributed Flood (Moderate)"
        else:
            level = "SAFE"
            recommendation = "Low impact envelope. Simulated mitigation effectively suppressed anomalous volume."
            vector = "Nominal"

        risk_delta = round(((simulated_score - base_risk) / base_risk) * 100, 1)

        return WhatIfResponse(
            scenario=req.scenarioName or "Parametric What-If",
            simulatedRiskScore=simulated_score,
            simulatedRiskLevel=level,
            simulatedConfidence=confidence,
            predictedVector=vector,
            expectedPeakMinutes="+10m to +15m",
            riskDeltaPct=risk_delta,
            mitigationEfficiency="42% reduction with active scrubbing" if rate_limit else "None (Unmitigated)",
            recommendation=recommendation
        )

    # -------------------------------------------------------------------------
    # 4. Risk Analysis
    # -------------------------------------------------------------------------
    def get_risk_analysis_data(self) -> Dict[str, Any]:
        traffic_behaviour = [
            BehaviourStat(id="packet-rate", label="Packet rate", value="384", unit="k pps", baseline="baseline 120", delta="+220%", tone="crit", note="3.2× the 7-day baseline on edge interfaces"),
            BehaviourStat(id="byte-rate", label="Byte rate", value="655", unit="MB/s", baseline="baseline 210", delta="+212%", tone="warn", note="Ingress-dominated, low egress response"),
            BehaviourStat(id="active-flows", label="Active flows", value="18,432", unit="flows", baseline="baseline 9,100", delta="+103%", tone="warn", note="Surge of short-lived, single-purpose flows"),
            BehaviourStat(id="conn-rate", label="New connections", value="1,240", unit="conn/min", baseline="baseline 450", delta="+176%", tone="crit", note="Synchronized connection bursts across sources"),
            BehaviourStat(id="flow-duration", label="Mean flow duration", value="2.1", unit="sec", baseline="baseline 8.4", delta="−75%", tone="warn", note="Collapsing durations — flood-pattern signature"),
            BehaviourStat(id="anomaly-score", label="Anomaly score", value="0.86", unit="/ 1.0", baseline="threshold 0.60", delta="exceeded", tone="crit", note="Unsupervised detector, 95th-percentile breach"),
        ]

        def make_series(hist: List[float], fcst: Optional[List[float]] = None) -> List[TrafficMetricPoint]:
            labels = ["-60m", "-55m", "-50m", "-45m", "-40m", "-35m", "-30m", "-25m", "-20m", "-15m", "-10m", "-5m", "now"]
            pts = [TrafficMetricPoint(t=labels[i], v=hist[i], f=None) for i in range(len(labels))]
            if fcst:
                pts[-1].f = hist[-1]
                fcst_labels = ["+5m", "+10m", "+15m"]
                for i, val in enumerate(fcst):
                    pts.append(TrafficMetricPoint(t=fcst_labels[i], v=None, f=val))
            return pts

        traffic_metrics = [
            TrafficMetric(
                id="packet-rate", label="Packet rate", unit="k pps", current="384", baseline=120.0,
                deltaPct="+220%", tone="crit", hasForecast=True,
                series=make_series([118, 124, 121, 127, 132, 129, 138, 151, 176, 214, 268, 324, 384], [412, 438, 421])
            ),
            TrafficMetric(
                id="byte-rate", label="Byte rate", unit="MB/s", current="655", baseline=210.0,
                deltaPct="+212%", tone="warn", hasForecast=True,
                series=make_series([205, 212, 198, 221, 214, 232, 248, 276, 318, 392, 486, 574, 655], [702, 745, 718])
            ),
            TrafficMetric(
                id="flow-duration", label="Flow duration", unit="sec", current="2.1", baseline=8.4,
                deltaPct="−75%", tone="warn", hasForecast=False,
                series=make_series([8.6, 8.4, 8.5, 8.1, 7.8, 7.4, 6.9, 6.1, 5.2, 4.3, 3.4, 2.7, 2.1])
            ),
            TrafficMetric(
                id="conn-behaviour", label="Connection behaviour", unit="conn/min", current="1,240", baseline=450.0,
                deltaPct="+176%", tone="crit", hasForecast=False,
                series=make_series([430, 448, 441, 462, 478, 502, 548, 624, 742, 896, 1042, 1158, 1240])
            ),
            TrafficMetric(
                id="traffic-volume", label="Traffic volume", unit="GB / 5 min", current="196", baseline=63.0,
                deltaPct="+212%", tone="crit", hasForecast=True,
                series=make_series([61, 64, 60, 66, 63, 69, 74, 83, 96, 118, 146, 172, 196], [214, 228, 219])
            ),
        ]

        risk_factors = self.get_overview_data()["riskFactors"]

        risk_timeline_detailed = RiskTimelineDetailed(
            threshold=75,
            historyStart="-120m",
            forecastEnd="+30m",
            code="120m window · 30m horizon",
            points=[
                {"label": "-120m", "past": 38, "forecast": None, "band": None},
                {"label": "-110m", "past": 41, "forecast": None, "band": None},
                {"label": "-100m", "past": 37, "forecast": None, "band": None},
                {"label": "-90m", "past": 44, "forecast": None, "band": None},
                {"label": "-80m", "past": 42, "forecast": None, "band": None},
                {"label": "-70m", "past": 48, "forecast": None, "band": None},
                {"label": "-60m", "past": 46, "forecast": None, "band": None},
                {"label": "-50m", "past": 53, "forecast": None, "band": None},
                {"label": "-40m", "past": 57, "forecast": None, "band": None},
                {"label": "-30m", "past": 62, "forecast": None, "band": None},
                {"label": "-20m", "past": 68, "forecast": None, "band": None},
                {"label": "-10m", "past": 76, "forecast": None, "band": None},
                {"label": "-5m", "past": 82, "forecast": None, "band": None},
                {"label": "now", "past": 87, "forecast": 87, "band": [87, 87]},
                {"label": "+5m", "past": None, "forecast": 91, "band": [84, 96]},
                {"label": "+10m", "past": None, "forecast": 94, "band": [83, 98]},
                {"label": "+15m", "past": None, "forecast": 92, "band": [80, 98]},
                {"label": "+20m", "past": None, "forecast": 88, "band": [76, 96]},
                {"label": "+25m", "past": None, "forecast": 83, "band": [70, 93]},
                {"label": "+30m", "past": None, "forecast": 79, "band": [64, 90]},
            ]
        )

        risk_window = RiskWindow(
            label="Next 10–15 minutes",
            peakLikelihood=87,
            segments=[
                RiskWindowSegment(label="0–5 min", probability=58, inWindow=False),
                RiskWindowSegment(label="5–10 min", probability=72, inWindow=False),
                RiskWindowSegment(label="10–15 min", probability=87, inWindow=True),
                RiskWindowSegment(label="15–20 min", probability=76, inWindow=False),
                RiskWindowSegment(label="20–30 min", probability=61, inWindow=False),
            ],
            note="Window estimates shift as new telemetry arrives — treat as guidance, not certainty. No response is automated."
        )

        return {
            "trafficBehaviour": traffic_behaviour,
            "trafficMetrics": traffic_metrics,
            "riskFactors": risk_factors,
            "riskTimelineDetailed": risk_timeline_detailed,
            "riskWindow": risk_window
        }

    # -------------------------------------------------------------------------
    # 5. Alerts Queue & Triage
    # -------------------------------------------------------------------------
    def _init_alerts(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "ALR-7041", "timestamp": "14:02:31", "severity": "CRITICAL", "vector": "DDoS forecast",
                "message": "Forecast model projects DDoS-pattern activity peaking within the next 10–15 minutes (87% likelihood).",
                "recommendedAction": "Stage the DDoS mitigation playbook and pre-position rate limits for affected endpoints; execution requires SOC lead approval.",
                "source": "172.16.88.0/24 cluster", "target": "10.0.4.12 (edge-01)", "acknowledged": False
            },
            {
                "id": "ALR-7040", "timestamp": "14:01:58", "severity": "HIGH", "vector": "DDoS pattern",
                "message": "Potential DDoS risk detected due to abnormal packet rate.",
                "recommendedAction": "Investigate high-volume source traffic and review affected endpoints.",
                "source": "172.16.88.41", "target": "10.0.4.12:443", "acknowledged": False
            },
            {
                "id": "ALR-7039", "timestamp": "14:00:47", "severity": "HIGH", "vector": "Flood",
                "message": "Synchronized connection bursts detected from a clustered low-reputation source group.",
                "recommendedAction": "Correlate source ASN history and prepare connection-rate thresholds for review.",
                "source": "172.16.88.0/24 cluster", "target": "10.0.4.0/24 services", "acknowledged": False
            },
            {
                "id": "ALR-7038", "timestamp": "13:58:12", "severity": "HIGH", "vector": "Volume",
                "message": "Ingress byte rate exceeded the seasonal envelope by 212% on edge interfaces.",
                "recommendedAction": "Compare ingress/egress asymmetry and validate upstream scrubbing options.",
                "source": "edge-01", "target": "core-sw-02", "acknowledged": False
            },
            {
                "id": "ALR-7037", "timestamp": "13:55:36", "severity": "HIGH", "vector": "Risk index",
                "message": "Composite risk score crossed the elevated threshold (87 > 75) and is still rising.",
                "recommendedAction": "Escalate to tier-3 review and re-check forecast assumptions before the risk window opens.",
                "source": "Platform (SOC-01)", "target": "Overview dashboard", "acknowledged": False
            },
            {
                "id": "ALR-7036", "timestamp": "13:49:05", "severity": "MEDIUM", "vector": "Scan",
                "message": "Port-scan-like probing observed across monitored subnets from a single internal host.",
                "recommendedAction": "Isolate the host's recent authentication events and verify asset ownership.",
                "source": "10.99.2.17", "target": "192.168.10.0/24", "acknowledged": False
            },
            {
                "id": "ALR-7035", "timestamp": "13:44:51", "severity": "MEDIUM", "vector": "Behaviour",
                "message": "Mean flow duration dropped 75% below baseline — consistent with flood-pattern signatures.",
                "recommendedAction": "Correlate with edge interface metrics and check for handshake drops.",
                "source": "Segment 172.16.88.0/24", "target": "10.0.4.12:443", "acknowledged": False
            },
            {
                "id": "ALR-7034", "timestamp": "13:40:19", "severity": "MEDIUM", "vector": "Brute force",
                "message": "Elevated SSH login failure rate against perimeter bastion host.",
                "recommendedAction": "Temporarily elevate fail2ban threshold on bastion-01 and verify MFA logs.",
                "source": "10.99.2.17", "target": "bastion-01:22", "acknowledged": False
            },
            {
                "id": "ALR-7033", "timestamp": "13:35:00", "severity": "LOW", "vector": "Telemetry",
                "message": "NetFlow collector buffer utilization peaked at 78% during ingress surge.",
                "recommendedAction": "Increase ring buffer size if sustained ingress rates persist.",
                "source": "collector-01", "target": "Buffer memory", "acknowledged": True
            },
            {
                "id": "ALR-7032", "timestamp": "13:28:44", "severity": "LOW", "vector": "DNS",
                "message": "Minor increase in NXDOMAIN response ratio from internal resolver.",
                "recommendedAction": "Routine check of query logs during next scheduled maintenance window.",
                "source": "resolver-02", "target": "Internal DNS zone", "acknowledged": True
            },
        ]

    def get_alerts(self) -> List[AlertItem]:
        return [AlertItem(**a) for a in self._alerts_db]

    def acknowledge_alert(self, alert_id: str, acknowledged: bool = True) -> Optional[AlertItem]:
        for a in self._alerts_db:
            if a["id"].upper() == alert_id.upper():
                a["acknowledged"] = acknowledged
                return AlertItem(**a)
        return None

    # -------------------------------------------------------------------------
    # 6. Model Performance & Evaluation
    # -------------------------------------------------------------------------
    def get_model_metrics(self) -> Dict[str, Any]:
        metric_cards = [
            MetricCard(id="accuracy", label="Accuracy", value=96.4, unit="%", baseline=88.1, delta="+8.3 pts vs baseline", tone="safe", higherIsBetter=True, note="Baseline 88.1% · higher is better"),
            MetricCard(id="precision", label="Precision", value=94.8, unit="%", baseline=82.6, delta="+12.2 pts vs baseline", tone="safe", higherIsBetter=True, note="Baseline 82.6% · higher is better"),
            MetricCard(id="recall", label="Recall", value=93.2, unit="%", baseline=79.4, delta="+13.8 pts vs baseline", tone="safe", higherIsBetter=True, note="Baseline 79.4% · higher is better"),
            MetricCard(id="f1", label="F1 score", value=94.0, unit="%", baseline=81.0, delta="+13.0 pts vs baseline", tone="pulse", higherIsBetter=True, note="Baseline 81.0% · harmonic mean"),
            MetricCard(id="false-alarm", label="False alarm rate", value=2.1, unit="%", baseline=9.7, delta="−7.6 pts vs baseline", tone="safe", higherIsBetter=False, note="Baseline 9.7% · lower is better"),
        ]

        metric_comparison = [
            CompareDatum(metric="Accuracy", cyberpredict=96.4, baseline=88.1),
            CompareDatum(metric="Precision", cyberpredict=94.8, baseline=82.6),
            CompareDatum(metric="Recall", cyberpredict=93.2, baseline=79.4),
            CompareDatum(metric="F1 score", cyberpredict=94.0, baseline=81.0),
            CompareDatum(metric="False alarm", cyberpredict=2.1, baseline=9.7),
        ]

        version_trend = [
            VersionPoint(version="v2.0", accuracy=89.2, precision=84.1, recall=81.7, f1=82.9),
            VersionPoint(version="v2.1", accuracy=91.5, precision=87.3, recall=84.9, f1=86.1),
            VersionPoint(version="v2.2", accuracy=93.4, precision=90.2, recall=88.6, f1=89.4),
            VersionPoint(version="v2.3", accuracy=95.1, precision=92.7, recall=91.3, f1=92.0),
            VersionPoint(version="v2.4", accuracy=96.4, precision=94.8, recall=93.2, f1=94.0),
        ]

        lead_time = LeadTimeData(
            trackMaxMin=40.0,
            average=LeadTimeAverage(cyberpredict=4.0, baseline=27.6, leadMin=23.6, factor="6.9×"),
            scenarios=[
                LeadTimeScenario(id="S-01", vector="DDoS", cpAlarmMin=4.0, baseAlarmMin=27.0),
                LeadTimeScenario(id="S-02", vector="Brute force", cpAlarmMin=3.0, baseAlarmMin=22.0),
                LeadTimeScenario(id="S-03", vector="Port scan", cpAlarmMin=2.0, baseAlarmMin=18.0),
                LeadTimeScenario(id="S-04", vector="Exfiltration", cpAlarmMin=6.0, baseAlarmMin=34.0),
                LeadTimeScenario(id="S-05", vector="Intrusion", cpAlarmMin=5.0, baseAlarmMin=37.0),
            ]
        )

        alarm_times = [
            AlarmTimeData(id="cyberpredict", label="CyberPredict alarm time", value=4.0, unit="min after onset", tone="pulse", scaleMax=30.0, note="Mean across 5 demo scenarios — the forecast raises an alarm before volumetric damage peaks."),
            AlarmTimeData(id="baseline", label="Baseline alarm time", value=27.6, unit="min after onset", tone="warn", scaleMax=30.0, note="Static-threshold IDS fires only after volume breaches its σ-bands."),
        ]

        confusion_matrix = ConfusionData(
            tp=1841,
            fp=101,
            fn=134,
            tn=4704,
            totalWindows="6,780 windows"
        )

        operational_impact = {
            "falseAlarmsPerDay": {"cyberpredict": 3.2, "baseline": 18.7},
            "evalWindows": "6,780 test windows across 14 simulated attack runs",
            "detectionHorizon": "15-minute lead-time prior to peak volume",
            "retrainCadence": "Weekly rolling origin"
        }

        methodology = {
            "dataset": "Simulated multi-stage NetFlow corpus with injected synthetic volumetric attacks",
            "split": "70% train / 15% val / 15% test (temporally ordered, zero look-ahead leak)",
            "calibration": "Platt scaling on ensemble logits"
        }

        return {
            "metricCards": metric_cards,
            "metricComparison": metric_comparison,
            "versionTrend": version_trend,
            "leadTime": lead_time,
            "alarmTimes": alarm_times,
            "confusionMatrix": confusion_matrix,
            "operationalImpact": operational_impact,
            "methodology": methodology
        }


# Singleton engine instance
mock_engine = MockInferenceEngine()
