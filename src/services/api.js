/**
 * CyberPredict — unified data service façade (FRONTEND ONLY).
 *
 * Every function currently resolves from the local mock fixtures with a
 * simulated network latency, so loading states stay honest.
 *
 * Architecture — Mock Data → FastAPI, without UI rewrites:
 *   1. Deploy FastAPI behind /api/v1
 *   2. Set VITE_API_BASE_URL (defaults to /api/v1)
 *   3. Flip USE_MOCK to false
 *
 * React components never touch Axios, endpoints or this module's internals —
 * they consume the aggregated payload shapes below. The mock fixtures and
 * the future FastAPI responses share those same shapes (see services/types.ts).
 */
import axios from "axios";

import { alerts } from "../data/mockAlerts.js";
import {
  forecastStatus,
  prediction,
  recommendedAction,
  riskFactors,
  riskScore,
  riskTimeline,
} from "../data/mockDashboard.js";
import {
  alarmTimes,
  confusionMatrix,
  leadTime,
  methodology,
  metricCards,
  metricComparison,
  operationalImpact,
  versionTrend,
} from "../data/mockMetrics.js";
import { trafficFlows, trafficSummary } from "../data/mockTraffic.js";
import {
  riskTimelineDetailed,
  riskWindow,
  trafficBehaviour,
  trafficMetrics,
} from "../data/mockRiskAnalysis.js";

/* ------------------------------------------------------------------ */
/*  Axios client (dormant while USE_MOCK is true)                      */
/* ------------------------------------------------------------------ */

export const API_BASE_URL =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL) || "/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  // TODO(auth): attach the analyst bearer token once the auth backend lands.
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO(errors): normalize into { code, message } for the ErrorState surface.
    return Promise.reject(error);
  },
);

/* ------------------------------------------------------------------ */
/*  Mock ↔ live switch                                                 */
/* ------------------------------------------------------------------ */

const USE_MOCK = true;
const SIMULATED_LATENCY_MS = 400;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Resolve a resource from mock fixtures (with latency) or from FastAPI.
 * @param {string} path   FastAPI route, e.g. "/overview".
 * @param {() => unknown} produceMock  Aggregates the local fixtures.
 */
async function fetchOrMock(path, produceMock) {
  if (USE_MOCK) {
    await wait(SIMULATED_LATENCY_MS);
    return produceMock();
  }
  const { data } = await api.get(path);
  return data;
}

/* ------------------------------------------------------------------ */
/*  Public service surface                                             */
/* ------------------------------------------------------------------ */

/** Overview dashboard aggregate. */
export function getDashboardData() {
  return fetchOrMock("/overview", () => ({
    riskScore,
    prediction,
    forecastStatus,
    riskTimeline,
    riskFactors,
    recommendedAction,
  }));
}

/** Network traffic: window summary + captured flows. */
export function getTrafficData() {
  return fetchOrMock("/network/flows", () => ({
    summary: trafficSummary,
    flows: trafficFlows,
  }));
}

/** Incident queue. */
export function getAlerts() {
  return fetchOrMock("/alerts", () => ({ alerts }));
}

/** Model performance evaluation bundle. */
export function getModelMetrics() {
  return fetchOrMock("/models/metrics", () => ({
    metricCards,
    metricComparison,
    versionTrend,
    leadTime,
    alarmTimes,
    confusionMatrix,
    operationalImpact,
    methodology,
  }));
}

/** Risk analysis bundle (behaviour snapshot, trends, detailed timeline, window). */
export function getRiskAnalysisData() {
  return fetchOrMock("/risk/analysis", () => ({
    trafficBehaviour,
    trafficMetrics,
    riskFactors,
    riskTimelineDetailed,
    riskWindow,
  }));
}
