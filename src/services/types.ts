/**
 * Shared API contract types for CyberPredict.
 *
 * These describe the shape of payloads the forecasting backend will
 * eventually return. They exist now so pages and widgets can be built
 * against a stable contract before integration.
 */

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type AttackVector =
  | "ddos"
  | "brute-force"
  | "port-scan"
  | "malware"
  | "data-exfiltration"
  | "intrusion";

/** One sampled point on a traffic / telemetry timeline. */
export interface TimeSeriesPoint {
  /** ISO-8601 timestamp */
  timestamp: string;
  value: number;
}

/** Probabilistic attack forecast for a future time bucket. */
export interface AttackForecastPoint {
  timestamp: string;
  /** 0..1 probability of an attack in this bucket */
  probability: number;
  /** Confidence band around the probability */
  confidenceLow: number;
  confidenceHigh: number;
  likelyVector: AttackVector;
}

/** Aggregated network flow record. */
export interface NetworkFlowSummary {
  timestamp: string;
  ingressMbps: number;
  egressMbps: number;
  packetCount: number;
  anomalyScore: number;
  topProtocol: string;
}

/** A raised alert / incident in the queue. */
export interface AlertRecord {
  id: string;
  severity: RiskLevel;
  title: string;
  source: string;
  target: string;
  vector: AttackVector;
  createdAt: string;
  acknowledged: boolean;
}

/** Evaluation snapshot for the forecasting model. */
export interface ModelMetricsSnapshot {
  modelVersion: string;
  precision: number;
  recall: number;
  f1: number;
  falsePositiveRate: number;
  driftIndex: number;
  evaluatedAt: string;
}

/** Per-asset risk score produced by the risk engine. */
export interface AssetRiskScore {
  assetId: string;
  assetLabel: string;
  exposure: number;
  likelihood: number;
  composite: number;
  level: RiskLevel;
}
