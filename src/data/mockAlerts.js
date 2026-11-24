/**
 * CyberPredict — Alerts page mock data (FRONTEND FIXTURES).
 *
 * Initially contains ONLY 'LOW' and 'MEDIUM' category alerts per specification.
 * Critical alerts are injected dynamically when the user clicks 'Activate'.
 */

/** @type {Array<import("../components/alerts/AlertCard").AlertItem>} */
export const alerts = [
  {
    id: "ALR-7036",
    timestamp: "13:49:05",
    severity: "MEDIUM",
    vector: "Scan",
    message: "Port-scan-like probing observed across monitored subnets from a single internal host.",
    recommendedAction: "Isolate the host's recent authentication events and verify asset ownership.",
    source: "10.99.2.17",
    target: "192.168.10.0/24",
  },
  {
    id: "ALR-7035",
    timestamp: "13:44:51",
    severity: "MEDIUM",
    vector: "Behaviour",
    message: "Mean flow duration dropped 75% below baseline — consistent with flood-pattern signatures.",
    recommendedAction: "Review flow-duration distribution by segment before raising severity.",
    source: "172.16.88.0/24 cluster",
    target: "10.0.4.0/24",
  },
  {
    id: "ALR-7034",
    timestamp: "13:38:27",
    severity: "MEDIUM",
    vector: "DNS",
    message: "Elevated DNS query volume from the internal workstation pool, concentrated on uncommon TLDs.",
    recommendedAction: "Sample queried domains against threat intelligence and check for DGA patterns.",
    source: "192.168.10.0/24",
    target: "10.0.2.53:53",
  },
  {
    id: "ALR-7033",
    timestamp: "13:31:44",
    severity: "MEDIUM",
    vector: "Brute force",
    message: "Repeated authentication failures against the bastion host SSH endpoint.",
    recommendedAction: "Verify MFA enforcement and review source locations for the failing attempts.",
    source: "10.99.2.17",
    target: "10.0.1.9:22",
  },
  {
    id: "ALR-7032",
    timestamp: "13:22:19",
    severity: "LOW",
    vector: "Protocol mix",
    message: "New protocol mix observed on segment 10.0.4.0/24 (GRE tunnels, 0.4% of flows).",
    recommendedAction: "Add to watchlist; no action required unless volume grows.",
    source: "10.0.4.0/24",
    target: "—",
  },
  {
    id: "ALR-7031",
    timestamp: "13:15:03",
    severity: "LOW",
    vector: "Telemetry",
    message: "Telemetry ingestion latency above nominal (2.4s vs 0.8s baseline).",
    recommendedAction: "Monitor collector queue depth; forecast accuracy may degrade if sustained.",
    source: "collector-02",
    target: "Ingestion pipeline",
  },
];

/** Critical alerts injected when the user clicks 'Activate' */
export const criticalAlertTemplates = [
  {
    id: "ALR-7041",
    timestamp: "14:02:31",
    severity: "CRITICAL",
    vector: "DDoS forecast",
    message:
      "CRITICAL THREAT: Neural forecast projects volumetric DDoS pattern surge peaking within next 10–15 min (96% likelihood).",
    recommendedAction:
      "Stage edge DDoS mitigation playbook and pre-position ingress rate limits for edge-01; alert SOC incident lead.",
    source: "172.16.88.0/24 cluster",
    target: "10.0.4.12:443 (edge-01)",
  },
  {
    id: "ALR-7040",
    timestamp: "14:01:58",
    severity: "CRITICAL",
    vector: "DDoS pattern",
    message: "CRITICAL ALERT: Abnormal inbound packet rate exceeding 38.5k pps detected across perimeter interfaces.",
    recommendedAction: "Immediate rate-limiting recommended; isolate suspect source IP range.",
    source: "172.16.88.41",
    target: "10.0.4.12:443",
  },
];
