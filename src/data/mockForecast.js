/**
 * CyberPredict — Forecast page mock data (FRONTEND FIXTURES).
 * Simulates the payload shape of GET /api/v1/forecast/window.
 * Probabilistic language only — likelihood, never confirmation.
 *
 * Shared fixtures (risk score, prediction, status, factors, action) are
 * reused from mockDashboard.js so every page tells the same live story.
 */

/** KPI strip across the top of the Forecast page. */
/** @type {Array<import("../components/forecast/ForecastStatTile").ForecastStat>} */
export const forecastSummary = [
  {
    id: "risk-score",
    label: "Current risk score",
    value: "87 / 100",
    sub: "High · +12 pts in 15 min",
    tone: "crit",
  },
  {
    id: "attack-type",
    label: "Predicted attack type",
    value: "DDoS",
    sub: "Denial-of-service pattern",
    tone: "mist",
  },
  {
    id: "confidence",
    label: "Prediction confidence",
    value: "94%",
    sub: "Ensemble agreement",
    tone: "pulse",
  },
  {
    id: "status",
    label: "Forecast status",
    value: "Elevated Risk",
    sub: "Above elevated threshold",
    tone: "warn",
  },
  {
    id: "window",
    label: "Expected risk window",
    value: "Next 10–15 min",
    sub: "From current evaluation",
    tone: "warn",
  },
  {
    id: "trend",
    label: "Risk trend",
    value: "+12 pts",
    sub: "Trailing 15 minutes",
    tone: "crit",
  },
];

/**
 * Attack-probability horizon — the Forecast page's primary visualization.
 * `observed` = realized risk backcast, `projected` = forecast probability,
 * `band` = [low, high] confidence interval.
 */
/** @type {import("../components/forecast/ForecastHorizonChart").HorizonData} */
export const forecastHorizon = {
  threshold: 70,
  peak: { at: "+10m", value: 94 },
  note: "Probabilities express modelled likelihood of attack-pattern activity — no event has been confirmed.",
  points: [
    { label: "-45m", observed: 44, projected: null, band: null },
    { label: "-40m", observed: 47, projected: null, band: null },
    { label: "-35m", observed: 45, projected: null, band: null },
    { label: "-30m", observed: 51, projected: null, band: null },
    { label: "-25m", observed: 55, projected: null, band: null },
    { label: "-20m", observed: 60, projected: null, band: null },
    { label: "-15m", observed: 64, projected: null, band: null },
    { label: "-10m", observed: 71, projected: null, band: null },
    { label: "-5m", observed: 79, projected: null, band: null },
    { label: "now", observed: 87, projected: 87, band: [87, 87] },
    { label: "+5m", observed: null, projected: 91, band: [85, 96] },
    { label: "+10m", observed: null, projected: 94, band: [84, 98] },
    { label: "+15m", observed: null, projected: 92, band: [80, 98] },
    { label: "+20m", observed: null, projected: 86, band: [74, 95] },
    { label: "+30m", observed: null, projected: 78, band: [63, 90] },
    { label: "+45m", observed: null, projected: 69, band: [52, 84] },
    { label: "+60m", observed: null, projected: 61, band: [43, 76] },
  ],
};
