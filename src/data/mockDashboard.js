/**
 * CyberPredict — Overview dashboard mock data (FRONTEND FIXTURES).
 *
 * Simulates the payload shapes of the future overview / forecast services.
 * All dashboard widgets read from here — no hard-coded values in components.
 * Forecasting language only: likelihood, never confirmation.
 */

/** Composite risk posture for the monitored estate. */
export const riskScore = /** @type {const} */ ({
  value: 87,
  max: 100,
  level: "HIGH",
  delta: 12,
  deltaWindow: "15 min",
  trend: "rising",
  baseline: 64,
  caption: "Composite of flow, behaviour and exposure signals across monitored endpoints.",
});

/** Primary model prediction — probabilistic, never a confirmed event. */
export const prediction = /** @type {const} */ ({
  attackType: "DDoS",
  attackLabel: "Distributed denial-of-service pattern",
  confidence: 94,
  riskWindow: "Next 10–15 minutes",
  headline: "High attack risk detected",
  summary:
    "The forecasting model anticipates DDoS-pattern activity within the expected risk window. This is a probabilistic forecast derived from live traffic signals — no attack has been confirmed.",
  disclaimer:
    "Forecast output for analyst review. CyberPredict indicates likelihood, never confirmation.",
  alternateVectors: [
    { vector: "Brute force", probability: 31 },
    { vector: "Port scan", probability: 18 },
    { vector: "Data exfiltration", probability: 9 },
  ],
});

/** Aggregate forecast status shown in the KPI row. */
export const forecastStatus = /** @type {const} */ ({
  status: "High Risk",
  tone: "warn",
  window: "Next 10–15 minutes",
  model: "Ensemble v2.4.1",
  lastRun: "42s ago",
  nextRun: "in 18s",
});

/**
 * Risk timeline — 60 min of history plus a 15 min forecast horizon at
 * 5-minute resolution. `past` feeds the historical series, `forecast`
 * the projected series, `band` the [low, high] confidence interval.
 */
export const riskTimeline = /** @type {const} */ ({
  threshold: 75,
  points: [
    { label: "-60m", past: 41, forecast: null, band: null },
    { label: "-55m", past: 44, forecast: null, band: null },
    { label: "-50m", past: 39, forecast: null, band: null },
    { label: "-45m", past: 47, forecast: null, band: null },
    { label: "-40m", past: 52, forecast: null, band: null },
    { label: "-35m", past: 49, forecast: null, band: null },
    { label: "-30m", past: 55, forecast: null, band: null },
    { label: "-25m", past: 58, forecast: null, band: null },
    { label: "-20m", past: 63, forecast: null, band: null },
    { label: "-15m", past: 66, forecast: null, band: null },
    { label: "-10m", past: 72, forecast: null, band: null },
    { label: "-5m", past: 79, forecast: null, band: null },
    { label: "now", past: 87, forecast: 87, band: [87, 87] },
    { label: "+5m", past: null, forecast: 90, band: [83, 95] },
    { label: "+10m", past: null, forecast: 93, band: [80, 97] },
    { label: "+15m", past: null, forecast: 91, band: [76, 97] },
  ],
});

/** Top contributors behind the elevated composite score. */
export const riskFactors = /** @type {const} */ ([
  {
    id: "packet-rate",
    label: "High packet rate",
    metric: "3.2× baseline",
    detail: "Inbound packet rate running 3.2× the 7-day baseline across edge interfaces.",
    contribution: 28,
    severity: "high",
  },
  {
    id: "traffic-volume",
    label: "Abnormal traffic volume",
    metric: "+214%",
    detail: "Aggregate ingress volume exceeds the seasonal envelope expected for this hour.",
    contribution: 26,
    severity: "high",
  },
  {
    id: "source-behaviour",
    label: "Unusual source behaviour",
    metric: "142 sources",
    detail: "Low-reputation source cluster showing synchronized, repeating request patterns.",
    contribution: 19,
    severity: "medium",
  },
  {
    id: "connection-frequency",
    label: "Increased connection frequency",
    metric: "+86%",
    detail: "New connection attempts rising sharply across monitored endpoints.",
    contribution: 14,
    severity: "medium",
  },
]);

/** Analyst-facing guidance — always pending human approval. */
export const recommendedAction = /** @type {const} */ ({
  headline: "Investigate abnormal source traffic and review affected endpoints.",
  rationale:
    "Prioritized from the top contributing risk factors and the 15-minute forecast window.",
  steps: [
    "Trace the top contributing source IPs and ASN origins",
    "Review affected endpoints for early saturation signals",
    "Stage the DDoS mitigation playbook for on-call approval",
  ],
  approvalNote:
    "Recommendation for human approval — CyberPredict does not execute automated responses.",
});
