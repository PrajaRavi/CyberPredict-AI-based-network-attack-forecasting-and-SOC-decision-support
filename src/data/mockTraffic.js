/**
 * CyberPredict — Network Traffic page mock data (FRONTEND FIXTURES).
 * Simulates captured flow records (NetFlow-style) for the foundation build.
 * All addresses are private/internal ranges per deployment policy.
 */

/** Summary tiles above the flow table. */
/** @type {Array<import("../components/forecast/ForecastStatTile").ForecastStat>} */
export const trafficSummary = [
  { id: "flows", label: "Flows captured", value: "26", sub: "Current 60-min window", tone: "mist" },
  { id: "anomalous", label: "Anomalous flows", value: "7", sub: "High risk and above", tone: "crit" },
  { id: "top-protocol", label: "Top protocol", value: "TCP", sub: "19 of 26 flows", tone: "pulse" },
  { id: "peak-rate", label: "Peak packet rate", value: "22.9k pps", sub: "F-1042 · 172.16.88.41", tone: "crit" },
];

/** Captured flows — newest first. pps/bps derived from packets/bytes ÷ duration. */
/** @type {Array<import("../components/traffic/TrafficTable").TrafficFlow>} */
export const trafficFlows = [
  {
    id: "F-1042", timestamp: "14:02:31", srcIp: "172.16.88.41", srcPort: 52214, dstIp: "10.0.4.12", dstPort: 443,
    protocol: "TCP", durationSec: 2.1, packets: 48200, bytes: 3856000, pps: 22952.4, bps: 1836190,
    risk: { level: "CRITICAL", score: 96 }, flags: ["SYN flood pattern", "3.2× baseline pps", "Low-reputation ASN"],
    notes: "Handshake completion near zero; requests concentrated on a single virtual host.",
    iface: "edge-01", origin: "Segment 172.16.88.0/24", detector: "flow-anomaly v3", capturedAt: "2026-02-14 14:02:31 UTC",
  },
  {
    id: "F-1041", timestamp: "14:02:18", srcIp: "172.16.88.42", srcPort: 48902, dstIp: "10.0.4.12", dstPort: 53,
    protocol: "UDP", durationSec: 1.8, packets: 39600, bytes: 4752000, pps: 22000, bps: 2640000,
    risk: { level: "CRITICAL", score: 94 }, flags: ["UDP amplification profile", "Reflection signature"],
    notes: "Amplification ratio consistent with DNS reflection against open resolvers.",
    iface: "edge-01", origin: "Segment 172.16.88.0/24", detector: "flow-anomaly v3", capturedAt: "2026-02-14 14:02:18 UTC",
  },
  {
    id: "F-1040", timestamp: "14:01:47", srcIp: "172.16.88.57", srcPort: 51108, dstIp: "10.0.4.8", dstPort: 443,
    protocol: "TCP", durationSec: 4.6, packets: 61200, bytes: 4284000, pps: 13304.3, bps: 931304,
    risk: { level: "HIGH", score: 88 }, flags: ["Sustained single-target rate"],
    notes: "Steady request pressure on one endpoint; no legitimate session growth to match.",
    iface: "edge-01", origin: "Segment 172.16.88.0/24", detector: "flow-anomaly v3", capturedAt: "2026-02-14 14:01:47 UTC",
  },
  {
    id: "F-1039", timestamp: "14:01:02", srcIp: "172.16.88.63", srcPort: 44710, dstIp: "10.0.4.12", dstPort: 80,
    protocol: "TCP", durationSec: 3.9, packets: 44800, bytes: 3136000, pps: 11487.2, bps: 804102,
    risk: { level: "HIGH", score: 85 }, flags: ["HTTP flood candidate"],
    notes: "GET-heavy request mix with truncated user agents across rotating source ports.",
    iface: "edge-01", origin: "Segment 172.16.88.0/24", detector: "flow-anomaly v3", capturedAt: "2026-02-14 14:01:02 UTC",
  },
  {
    id: "F-1038", timestamp: "14:00:26", srcIp: "172.16.88.49", srcPort: 39226, dstIp: "10.0.4.15", dstPort: 443,
    protocol: "TCP", durationSec: 6.2, packets: 51900, bytes: 4671000, pps: 8371, bps: 753387,
    risk: { level: "HIGH", score: 82 }, flags: ["Bursty request cadence"],
    notes: "Periodic bursts at ~2s intervals — consistent with scripted clients.",
    iface: "edge-01", origin: "Segment 172.16.88.0/24", detector: "flow-anomaly v3", capturedAt: "2026-02-14 14:00:26 UTC",
  },
  {
    id: "F-1037", timestamp: "13:59:41", srcIp: "10.99.2.17", srcPort: 60112, dstIp: "192.168.10.5", dstPort: 3389,
    protocol: "TCP", durationSec: 22, packets: 1840, bytes: 221000, pps: 83.6, bps: 10045,
    risk: { level: "HIGH", score: 78 }, flags: ["Credential-storm pattern", "Off-hours access"],
    notes: "Rapid RDP re-authentication attempts from an unmanaged internal host.",
    iface: "core-sw-02", origin: "Host 10.99.2.17 (unmanaged)", detector: "flow-anomaly v3", capturedAt: "2026-02-14 13:59:41 UTC",
  },
  {
    id: "F-1036", timestamp: "13:58:55", srcIp: "172.16.88.71", srcPort: 47355, dstIp: "10.0.4.8", dstPort: 8080,
    protocol: "TCP", durationSec: 5.1, packets: 38400, bytes: 2688000, pps: 7529.4, bps: 527058,
    risk: { level: "HIGH", score: 76 }, flags: ["Elevated retry ratio"],
    notes: "High retry-to-success ratio on the admin listener; possible saturation probing.",
    iface: "edge-01", origin: "Segment 172.16.88.0/24", detector: "flow-anomaly v3", capturedAt: "2026-02-14 13:58:55 UTC",
  },
  {
    id: "F-1035", timestamp: "13:56:32", srcIp: "192.168.10.44", srcPort: 55019, dstIp: "10.0.2.53", dstPort: 53,
    protocol: "UDP", durationSec: 8.4, packets: 9600, bytes: 768000, pps: 1142.9, bps: 91428,
    risk: { level: "MEDIUM", score: 64 }, flags: ["Unusual DNS volume"],
    notes: "Query rate ~6× workstation norm; domains sampled for DGA patterns.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.10.0/24", detector: "dns-watcher v2", capturedAt: "2026-02-14 13:56:32 UTC",
  },
  {
    id: "F-1034", timestamp: "13:54:10", srcIp: "192.168.10.45", srcPort: 55102, dstIp: "10.0.2.53", dstPort: 53,
    protocol: "UDP", durationSec: 7.9, packets: 8800, bytes: 704000, pps: 1113.9, bps: 89113,
    risk: { level: "MEDIUM", score: 61 }, flags: ["Unusual DNS volume"],
    notes: "Same resolver target as F-1035 — possibly coordinated across the pool.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.10.0/24", detector: "dns-watcher v2", capturedAt: "2026-02-14 13:54:10 UTC",
  },
  {
    id: "F-1033", timestamp: "13:52:47", srcIp: "10.99.2.17", srcPort: 44018, dstIp: "192.168.10.9", dstPort: 22,
    protocol: "TCP", durationSec: 41, packets: 620, bytes: 74400, pps: 15.1, bps: 1814,
    risk: { level: "MEDIUM", score: 58 }, flags: ["Sequential port probing"],
    notes: "Short-lived connection attempts walking common service ports in order.",
    iface: "core-sw-02", origin: "Host 10.99.2.17 (unmanaged)", detector: "scan-detect v1", capturedAt: "2026-02-14 13:52:47 UTC",
  },
  {
    id: "F-1032", timestamp: "13:51:20", srcIp: "10.99.2.17", srcPort: 44277, dstIp: "192.168.10.9", dstPort: 23,
    protocol: "TCP", durationSec: 39, packets: 540, bytes: 64800, pps: 13.8, bps: 1661,
    risk: { level: "MEDIUM", score: 57 }, flags: ["Sequential port probing", "Telnet target"],
    notes: "Continuation of the F-1033 probe sequence against legacy services.",
    iface: "core-sw-02", origin: "Host 10.99.2.17 (unmanaged)", detector: "scan-detect v1", capturedAt: "2026-02-14 13:51:20 UTC",
  },
  {
    id: "F-1031", timestamp: "13:49:58", srcIp: "172.16.88.90", srcPort: 50233, dstIp: "10.0.4.20", dstPort: 443,
    protocol: "TCP", durationSec: 9.8, packets: 11200, bytes: 1568000, pps: 1142.9, bps: 160000,
    risk: { level: "MEDIUM", score: 54 }, flags: ["Bursty cadence"],
    notes: "Irregular burst spacing; below flood threshold but above baseline envelope.",
    iface: "edge-01", origin: "Segment 172.16.88.0/24", detector: "flow-anomaly v3", capturedAt: "2026-02-14 13:49:58 UTC",
  },
  {
    id: "F-1030", timestamp: "13:47:33", srcIp: "192.168.20.31", srcPort: 57881, dstIp: "10.0.6.3", dstPort: 8443,
    protocol: "TCP", durationSec: 12.6, packets: 7400, bytes: 1184000, pps: 587.3, bps: 93968,
    risk: { level: "MEDIUM", score: 51 }, flags: ["First-seen destination pair"],
    notes: "New source/destination pairing for this host; volume modest but atypical.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.20.0/24", detector: "flow-anomaly v3", capturedAt: "2026-02-14 13:47:33 UTC",
  },
  {
    id: "F-1029", timestamp: "13:45:12", srcIp: "192.168.10.24", srcPort: 51872, dstIp: "10.0.4.8", dstPort: 443,
    protocol: "TCP", durationSec: 62, packets: 4200, bytes: 1890000, pps: 67.7, bps: 30483,
    risk: { level: "LOW", score: 24 }, flags: [],
    notes: "Routine HTTPS session; profile matches the host's 30-day norm.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.10.0/24", detector: "netflow collector", capturedAt: "2026-02-14 13:45:12 UTC",
  },
  {
    id: "F-1028", timestamp: "13:44:40", srcIp: "192.168.10.25", srcPort: 51930, dstIp: "10.0.4.8", dstPort: 443,
    protocol: "TCP", durationSec: 58, packets: 3900, bytes: 1755000, pps: 67.2, bps: 30258,
    risk: { level: "LOW", score: 21 }, flags: [],
    notes: "Routine HTTPS session within expected parameters.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.10.0/24", detector: "netflow collector", capturedAt: "2026-02-14 13:44:40 UTC",
  },
  {
    id: "F-1027", timestamp: "13:42:19", srcIp: "192.168.20.11", srcPort: 60443, dstIp: "10.0.1.4", dstPort: 80,
    protocol: "TCP", durationSec: 34, packets: 2600, bytes: 1040000, pps: 76.5, bps: 30588,
    risk: { level: "LOW", score: 18 }, flags: [],
    notes: "Internal portal usage during working hours.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.20.0/24", detector: "netflow collector", capturedAt: "2026-02-14 13:42:19 UTC",
  },
  {
    id: "F-1026", timestamp: "13:40:05", srcIp: "192.168.10.9", srcPort: 54321, dstIp: "10.0.2.7", dstPort: 123,
    protocol: "UDP", durationSec: 0.4, packets: 8, bytes: 640, pps: 20, bps: 1600,
    risk: { level: "LOW", score: 8 }, flags: [],
    notes: "NTP clock synchronization.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.10.0/24", detector: "netflow collector", capturedAt: "2026-02-14 13:40:05 UTC",
  },
  {
    id: "F-1025", timestamp: "13:38:47", srcIp: "192.168.30.3", srcPort: 49220, dstIp: "10.0.8.20", dstPort: 873,
    protocol: "TCP", durationSec: 240, packets: 18600, bytes: 96400000, pps: 77.5, bps: 401666,
    risk: { level: "LOW", score: 26 }, flags: ["Scheduled backup"],
    notes: "Nightly rsync window — long duration and high byte count are expected.",
    iface: "core-sw-02", origin: "Backup segment 192.168.30.0/24", detector: "netflow collector", capturedAt: "2026-02-14 13:38:47 UTC",
  },
  {
    id: "F-1024", timestamp: "13:36:22", srcIp: "192.168.10.61", srcPort: 52764, dstIp: "10.0.4.9", dstPort: 443,
    protocol: "TCP", durationSec: 47, packets: 3100, bytes: 1395000, pps: 66, bps: 29680,
    risk: { level: "LOW", score: 19 }, flags: [],
    notes: "Routine HTTPS session within expected parameters.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.10.0/24", detector: "netflow collector", capturedAt: "2026-02-14 13:36:22 UTC",
  },
  {
    id: "F-1023", timestamp: "13:33:51", srcIp: "192.168.10.12", srcPort: 53018, dstIp: "10.0.2.53", dstPort: 53,
    protocol: "UDP", durationSec: 1.2, packets: 24, bytes: 1920, pps: 20, bps: 1600,
    risk: { level: "LOW", score: 9 }, flags: [],
    notes: "Standard DNS lookups.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.10.0/24", detector: "netflow collector", capturedAt: "2026-02-14 13:33:51 UTC",
  },
  {
    id: "F-1022", timestamp: "13:31:14", srcIp: "192.168.20.44", srcPort: 58206, dstIp: "10.0.1.6", dstPort: 443,
    protocol: "TCP", durationSec: 51, packets: 3500, bytes: 1575000, pps: 68.6, bps: 30882,
    risk: { level: "LOW", score: 17 }, flags: [],
    notes: "Routine HTTPS session within expected parameters.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.20.0/24", detector: "netflow collector", capturedAt: "2026-02-14 13:31:14 UTC",
  },
  {
    id: "F-1021", timestamp: "13:28:40", srcIp: "192.168.10.8", srcPort: 0, dstIp: "10.0.4.12", dstPort: 0,
    protocol: "ICMP", durationSec: 5, packets: 40, bytes: 3200, pps: 8, bps: 640,
    risk: { level: "LOW", score: 12 }, flags: ["Monitoring probe"],
    notes: "Echo sweep from the observability platform.",
    iface: "core-sw-02", origin: "Monitoring 192.168.10.8", detector: "netflow collector", capturedAt: "2026-02-14 13:28:40 UTC",
  },
  {
    id: "F-1020", timestamp: "13:25:09", srcIp: "192.168.10.77", srcPort: 54990, dstIp: "10.0.4.8", dstPort: 443,
    protocol: "TCP", durationSec: 66, packets: 4600, bytes: 2070000, pps: 69.7, bps: 31363,
    risk: { level: "LOW", score: 22 }, flags: [],
    notes: "Routine HTTPS session within expected parameters.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.10.0/24", detector: "netflow collector", capturedAt: "2026-02-14 13:25:09 UTC",
  },
  {
    id: "F-1019", timestamp: "13:22:36", srcIp: "192.168.10.33", srcPort: 56112, dstIp: "10.0.4.9", dstPort: 80,
    protocol: "TCP", durationSec: 29, packets: 2100, bytes: 840000, pps: 72.4, bps: 28965,
    risk: { level: "LOW", score: 16 }, flags: [],
    notes: "Internal web traffic within expected parameters.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.10.0/24", detector: "netflow collector", capturedAt: "2026-02-14 13:22:36 UTC",
  },
  {
    id: "F-1018", timestamp: "13:19:58", srcIp: "192.168.20.18", srcPort: 59034, dstIp: "10.0.6.3", dstPort: 443,
    protocol: "TCP", durationSec: 44, packets: 2900, bytes: 1305000, pps: 65.9, bps: 29659,
    risk: { level: "LOW", score: 15 }, flags: [],
    notes: "Routine HTTPS session within expected parameters.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.20.0/24", detector: "netflow collector", capturedAt: "2026-02-14 13:19:58 UTC",
  },
  {
    id: "F-1017", timestamp: "13:16:27", srcIp: "192.168.10.52", srcPort: 50448, dstIp: "10.0.2.53", dstPort: 53,
    protocol: "UDP", durationSec: 0.9, packets: 18, bytes: 1440, pps: 20, bps: 1600,
    risk: { level: "LOW", score: 7 }, flags: [],
    notes: "Standard DNS lookups.",
    iface: "core-sw-02", origin: "Workstation pool 192.168.10.0/24", detector: "netflow collector", capturedAt: "2026-02-14 13:16:27 UTC",
  },
];
