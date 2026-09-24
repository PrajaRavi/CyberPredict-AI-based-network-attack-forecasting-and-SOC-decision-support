/**
 * CyberPredict — Risk Analysis page mock data (FRONTEND FIXTURES).
 * Simulates payload shapes of the future network / risk services.
 * Describes likelihood and observed behaviour only — never confirmed attacks.
 */

const TREND_LABELS = [
  "-60m", "-55m", "-50m", "-45m", "-40m", "-35m", "-30m",
  "-25m", "-20m", "-15m", "-10m", "-5m", "now",
];
const FORECAST_LABELS = ["+5m", "+10m", "+15m"];

/** Build a uniform { t, v, f } series; optionally continues into the forecast region. */
const toSeries = (values, forecastValues = null) => {
  const pts = TREND_LABELS.map((t, i) => ({ t, v: values[i], f: null }));
  if (forecastValues) {
    pts[pts.length - 1].f = values[values.length - 1];
    forecastValues.forEach((f, i) => pts.push({ t: FORECAST_LABELS[i], v: null, f }));
  }
  return pts;
};

/** Section 1 — live snapshot tiles for current traffic behaviour. */
/** @type {Array<import("../components/analysis/BehaviourStat").BehaviourStatData>} */
export const trafficBehaviour = [
  {
    id: "packet-rate",
    label: "Packet rate",
    value: "384",
    unit: "k pps",
    baseline: "baseline 120",
    delta: "+220%",
    tone: "crit",
    note: "3.2× the 7-day baseline on edge interfaces",
  },
  {
    id: "byte-rate",
    label: "Byte rate",
    value: "655",
    unit: "MB/s",
    baseline: "baseline 210",
    delta: "+212%",
    tone: "warn",
    note: "Ingress-dominated, low egress response",
  },
  {
    id: "active-flows",
    label: "Active flows",
    value: "18,432",
    unit: "flows",
    baseline: "baseline 9,100",
    delta: "+103%",
    tone: "warn",
    note: "Surge of short-lived, single-purpose flows",
  },
  {
    id: "conn-rate",
    label: "New connections",
    value: "1,240",
    unit: "conn/min",
    baseline: "baseline 450",
    delta: "+176%",
    tone: "crit",
    note: "Synchronized connection bursts across sources",
  },
  {
    id: "flow-duration",
    label: "Mean flow duration",
    value: "2.1",
    unit: "sec",
    baseline: "baseline 8.4",
    delta: "−75%",
    tone: "warn",
    note: "Collapsing durations — flood-pattern signature",
  },
  {
    id: "anomaly-score",
    label: "Anomaly score",
    value: "0.86",
    unit: "/ 1.0",
    baseline: "threshold 0.60",
    delta: "exceeded",
    tone: "crit",
    note: "Unsupervised detector, 95th-percentile breach",
  },
];

/** Section 2 — trailing trend charts (observed history, optional projection tail). */
/** @type {Array<import("../components/analysis/TrafficChartCard").TrafficMetric>} */
export const trafficMetrics = [
  {
    id: "packet-rate",
    label: "Packet rate",
    unit: "k pps",
    current: "384",
    baseline: 120,
    deltaPct: "+220%",
    tone: "crit",
    hasForecast: true,
    series: toSeries(
      [118, 124, 121, 127, 132, 129, 138, 151, 176, 214, 268, 324, 384],
      [412, 438, 421],
    ),
  },
  {
    id: "byte-rate",
    label: "Byte rate",
    unit: "MB/s",
    current: "655",
    baseline: 210,
    deltaPct: "+212%",
    tone: "warn",
    hasForecast: true,
    series: toSeries(
      [205, 212, 198, 221, 214, 232, 248, 276, 318, 392, 486, 574, 655],
      [702, 745, 718],
    ),
  },
  {
    id: "flow-duration",
    label: "Flow duration",
    unit: "sec",
    current: "2.1",
    baseline: 8.4,
    deltaPct: "−75%",
    tone: "warn",
    hasForecast: false,
    series: toSeries([8.6, 8.4, 8.5, 8.1, 7.8, 7.4, 6.9, 6.1, 5.2, 4.3, 3.4, 2.7, 2.1]),
  },
  {
    id: "conn-behaviour",
    label: "Connection behaviour",
    unit: "conn/min",
    current: "1,240",
    baseline: 450,
    deltaPct: "+176%",
    tone: "crit",
    hasForecast: false,
    series: toSeries([430, 448, 441, 462, 478, 502, 548, 624, 742, 896, 1042, 1158, 1240]),
  },
  {
    id: "traffic-volume",
    label: "Traffic volume",
    unit: "GB / 5 min",
    current: "196",
    baseline: 63,
    deltaPct: "+212%",
    tone: "crit",
    hasForecast: true,
    series: toSeries(
      [61, 64, 60, 66, 63, 69, 74, 83, 96, 118, 146, 172, 196],
      [214, 228, 219],
    ),
  },
];

/** Section 4 — detailed risk timeline: 120m history, 30m forecast horizon. */
/** @type {{ threshold: number; historyStart: string; forecastEnd: string; code: string; points: Array<import("../components/dashboard/RiskTimeline").TimelinePoint> }} */
export const riskTimelineDetailed = {
  threshold: 75,
  historyStart: "-120m",
  forecastEnd: "+30m",
  code: "120m window · 30m horizon",
  points: [
    { label: "-120m", past: 38, forecast: null, band: null },
    { label: "-110m", past: 41, forecast: null, band: null },
    { label: "-100m", past: 37, forecast: null, band: null },
    { label: "-90m", past: 44, forecast: null, band: null },
    { label: "-80m", past: 42, forecast: null, band: null },
    { label: "-70m", past: 48, forecast: null, band: null },
    { label: "-60m", past: 46, forecast: null, band: null },
    { label: "-50m", past: 53, forecast: null, band: null },
    { label: "-40m", past: 57, forecast: null, band: null },
    { label: "-30m", past: 62, forecast: null, band: null },
    { label: "-20m", past: 68, forecast: null, band: null },
    { label: "-10m", past: 76, forecast: null, band: null },
    { label: "-5m", past: 82, forecast: null, band: null },
    { label: "now", past: 87, forecast: 87, band: [87, 87] },
    { label: "+5m", past: null, forecast: 91, band: [84, 96] },
    { label: "+10m", past: null, forecast: 94, band: [83, 98] },
    { label: "+15m", past: null, forecast: 92, band: [80, 98] },
    { label: "+20m", past: null, forecast: 88, band: [76, 96] },
    { label: "+25m", past: null, forecast: 83, band: [70, 93] },
    { label: "+30m", past: null, forecast: 79, band: [64, 90] },
  ],
};

/** Section 5 — expected risk window breakdown by segment. */
/** @type {import("../components/analysis/RiskWindowCard").RiskWindowData} */
export const riskWindow = {
  label: "Next 10–15 minutes",
  peakLikelihood: 87,
  segments: [
    { label: "0–5 min", probability: 58, inWindow: false },
    { label: "5–10 min", probability: 72, inWindow: false },
    { label: "10–15 min", probability: 87, inWindow: true },
    { label: "15–20 min", probability: 76, inWindow: false },
    { label: "20–30 min", probability: 61, inWindow: false },
  ],
  note: "Window estimates shift as new telemetry arrives — treat as guidance, not certainty. No response is automated.",
};
