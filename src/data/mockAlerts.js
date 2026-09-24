/**
 * CyberPredict — Alerts page mock data (FRONTEND FIXTURES).
 * Simulates the incident queue (12 active, matching the sidebar badge).
 * Alerts are decision-support only — no automated blocking or destructive
 * actions are ever implied or executed.
 */

/** @type {Array<import("../components/alerts/AlertCard").AlertItem>} */
export const alerts = [
  {
    id: "ALR-7041", timestamp: "14:02:31", severity: "CRITICAL", vector: "DDoS forecast",
    message:
      "Forecast model projects DDoS-pattern activity peaking within the next 10–15 minutes (87% likelihood).",
    recommendedAction:
      "Stage the DDoS mitigation playbook and pre-position rate limits for affected endpoints; execution requires SOC lead approval.",
    source: "172.16.88.0/24 cluster", target: "10.0.4.12 (edge-01)",
  },
  {
    id: "ALR-7040", timestamp: "14:01:58", severity: "HIGH", vector: "DDoS pattern",
    message: "Potential DDoS risk detected due to abnormal packet rate.",
    recommendedAction: "Investigate high-volume source traffic and review affected endpoints.",
    source: "172.16.88.41", target: "10.0.4.12:443",
  },
  {
    id: "ALR-7039", timestamp: "14:00:47", severity: "HIGH", vector: "Flood",
    message: "Synchronized connection bursts detected from a clustered low-reputation source group.",
    recommendedAction: "Correlate source ASN history and prepare connection-rate thresholds for review.",
    source: "172.16.88.0/24 cluster", target: "10.0.4.0/24 services",
  },
  {
    id: "ALR-7038", timestamp: "13:58:12", severity: "HIGH", vector: "Volume",
    message: "Ingress byte rate exceeded the seasonal envelope by 212% on edge interfaces.",
    recommendedAction: "Compare ingress/egress asymmetry and validate upstream scrubbing options.",
    source: "edge-01", target: "core-sw-02",
  },
  {
    id: "ALR-7037", timestamp: "13:55:36", severity: "HIGH", vector: "Risk index",
    message: "Composite risk score crossed the elevated threshold (87 > 75) and is still rising.",
    recommendedAction: "Escalate to tier-3 review and re-check forecast assumptions before the risk window opens.",
    source: "Platform (SOC-01)", target: "Overview dashboard",
  },
  {
    id: "ALR-7036", timestamp: "13:49:05", severity: "MEDIUM", vector: "Scan",
    message: "Port-scan-like probing observed across monitored subnets from a single internal host.",
    recommendedAction: "Isolate the host's recent authentication events and verify asset ownership.",
    source: "10.99.2.17", target: "192.168.10.0/24",
  },
  {
    id: "ALR-7035", timestamp: "13:44:51", severity: "MEDIUM", vector: "Behaviour",
    message: "Mean flow duration dropped 75% below baseline — consistent with flood-pattern signatures.",
    recommendedAction: "Review flow-duration distribution by segment before raising severity.",
    source: "172.16.88.0/24 cluster", target: "10.0.4.0/24",
  },
  {
    id: "ALR-7034", timestamp: "13:38:27", severity: "MEDIUM", vector: "DNS",
    message: "Elevated DNS query volume from the internal workstation pool, concentrated on uncommon TLDs.",
    recommendedAction: "Sample queried domains against threat intelligence and check for DGA patterns.",
    source: "192.168.10.0/24", target: "10.0.2.53:53",
  },
  {
    id: "ALR-7033", timestamp: "13:31:44", severity: "MEDIUM", vector: "Brute force",
    message: "Repeated authentication failures against the bastion host SSH endpoint.",
    recommendedAction: "Verify MFA enforcement and review source locations for the failing attempts.",
    source: "10.99.2.17", target: "10.0.1.9:22",
  },
  {
    id: "ALR-7032", timestamp: "13:22:19", severity: "LOW", vector: "Protocol mix",
    message: "New protocol mix observed on segment 10.0.4.0/24 (GRE tunnels, 0.4% of flows).",
    recommendedAction: "Add to watchlist; no action required unless volume grows.",
    source: "10.0.4.0/24", target: "—",
  },
  {
    id: "ALR-7031", timestamp: "13:15:03", severity: "LOW", vector: "Telemetry",
    message: "Telemetry ingestion latency above nominal (2.4s vs 0.8s baseline).",
    recommendedAction: "Monitor collector queue depth; forecast accuracy may degrade if sustained.",
    source: "collector-02", target: "Ingestion pipeline",
  },
  {
    id: "ALR-7030", timestamp: "13:05:48", severity: "CRITICAL", vector: "Risk window",
    message: "Risk window likelihood reached 87% for the 10–15 minute horizon with 94% model confidence.",
    recommendedAction: "Notify the on-call lead and open the incident bridge; all response steps remain manual.",
    source: "Forecast FCST-04", target: "SOC watch floor",
  },
];
