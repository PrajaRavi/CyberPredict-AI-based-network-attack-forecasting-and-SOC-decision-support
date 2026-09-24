/**
 * CyberPredict — Model Performance page mock data (DEMO FIXTURES).
 *
 * Illustrative evaluation numbers prepared for the SIH26153 presentation.
 * They do NOT represent a real trained model or live deployment — every
 * surface labels them as demo data.
 */

/** Headline metric cards (CyberPredict v2.4 vs static-threshold baseline). */
/** @type {Array<import("../components/metrics/MetricCard").MetricCardData>} */
export const metricCards = [
  {
    id: "accuracy", label: "Accuracy", value: 96.4, unit: "%", baseline: 88.1,
    delta: "+8.3 pts vs baseline", tone: "safe", higherIsBetter: true,
    note: "Baseline 88.1% · higher is better",
  },
  {
    id: "precision", label: "Precision", value: 94.8, unit: "%", baseline: 82.6,
    delta: "+12.2 pts vs baseline", tone: "safe", higherIsBetter: true,
    note: "Baseline 82.6% · higher is better",
  },
  {
    id: "recall", label: "Recall", value: 93.2, unit: "%", baseline: 79.4,
    delta: "+13.8 pts vs baseline", tone: "safe", higherIsBetter: true,
    note: "Baseline 79.4% · higher is better",
  },
  {
    id: "f1", label: "F1 score", value: 94.0, unit: "%", baseline: 81.0,
    delta: "+13.0 pts vs baseline", tone: "pulse", higherIsBetter: true,
    note: "Baseline 81.0% · harmonic mean",
  },
  {
    id: "false-alarm", label: "False alarm rate", value: 2.1, unit: "%", baseline: 9.7,
    delta: "−7.6 pts vs baseline", tone: "safe", higherIsBetter: false,
    note: "Baseline 9.7% · lower is better",
  },
];

/** Grouped comparison chart data (percent). */
/** @type {Array<import("../components/metrics/CompareBarChart").CompareDatum>} */
export const metricComparison = [
  { metric: "Accuracy", cyberpredict: 96.4, baseline: 88.1 },
  { metric: "Precision", cyberpredict: 94.8, baseline: 82.6 },
  { metric: "Recall", cyberpredict: 93.2, baseline: 79.4 },
  { metric: "F1 score", cyberpredict: 94.0, baseline: 81.0 },
  { metric: "False alarm", cyberpredict: 2.1, baseline: 9.7 },
];

/** Metric trend across model versions (rolling-origin evaluation). */
/** @type {Array<import("../components/metrics/VersionTrendChart").VersionPoint>} */
export const versionTrend = [
  { version: "v2.0", accuracy: 89.2, precision: 84.1, recall: 81.7, f1: 82.9 },
  { version: "v2.1", accuracy: 91.5, precision: 87.3, recall: 84.9, f1: 86.1 },
  { version: "v2.2", accuracy: 93.4, precision: 90.2, recall: 88.6, f1: 89.4 },
  { version: "v2.3", accuracy: 95.1, precision: 92.7, recall: 91.3, f1: 92.0 },
  { version: "v2.4", accuracy: 96.4, precision: 94.8, recall: 93.2, f1: 94.0 },
];

/** Hero figure — alarm times measured from simulated attack onset. */
/** @type {import("../components/metrics/LeadTimePanel").LeadTimeData} */
export const leadTime = {
  trackMaxMin: 40,
  average: { cyberpredict: 4.0, baseline: 27.6, leadMin: 23.6, factor: "6.9×" },
  scenarios: [
    { id: "S-01", vector: "DDoS", cpAlarmMin: 4, baseAlarmMin: 27 },
    { id: "S-02", vector: "Brute force", cpAlarmMin: 3, baseAlarmMin: 22 },
    { id: "S-03", vector: "Port scan", cpAlarmMin: 2, baseAlarmMin: 18 },
    { id: "S-04", vector: "Exfiltration", cpAlarmMin: 6, baseAlarmMin: 34 },
    { id: "S-05", vector: "Intrusion", cpAlarmMin: 5, baseAlarmMin: 37 },
  ],
};

/** Alarm-time stat cards flanking the hero figure. */
/** @type {Array<import("../components/metrics/AlarmTimeCard").AlarmTimeData>} */
export const alarmTimes = [
  {
    id: "cyberpredict", label: "CyberPredict alarm time", value: 4.0, unit: "min after onset",
    tone: "pulse", scaleMax: 30,
    note: "Mean across 5 demo scenarios — the forecast raises an alarm before volumetric damage peaks.",
  },
  {
    id: "baseline", label: "Baseline alarm time", value: 27.6, unit: "min after onset",
    tone: "warn", scaleMax: 30,
    note: "Static-threshold IDS fires only after volume breaches its σ-bands.",
  },
];

/** Confusion-matrix counts (internally consistent with the headline rates). */
/** @type {import("../components/metrics/ConfusionMatrix").ConfusionData} */
export const confusionMatrix = {
  tp: 1841,
  fp: 101,
  fn: 134,
  tn: 4704,
  totalWindows: "6,780 windows",
};

/** Operational workload impact (demo). */
/** @type {{ falseAlarmsPerDay: { cyberpredict: number; baseline: number }; evalWindows: string; detectionHorizon: string; retrainCadence: string }} */
export const operationalImpact = {
  falseAlarmsPerDay: { cyberpredict: 3.2, baseline: 14.6 },
  evalWindows: "6,780",
  detectionHorizon: "60 min",
  retrainCadence: "Weekly (simulated)",
};

/** Research notes shown in the methodology panel. */
/** @type {{ dataset: string; protocol: string; baseline: string; alarmDefinition: string; disclaimer: string }} */
export const methodology = {
  dataset: "Synthetic enterprise capture — CIC-IDS-style replay, 6 weeks",
  protocol: "Sliding 5-min windows · rolling-origin evaluation",
  baseline: "Static-threshold IDS (signature rules + σ-band volume)",
  alarmDefinition: "First sustained window above the decision threshold",
  disclaimer:
    "Demo metrics for the  presentation — illustrative mock values, not a production-trained model.",
};
