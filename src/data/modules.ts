/**
 * Module registry — single source of truth for every CyberPredict module.
 * Drives navigation, routing metadata and the placeholder scaffolds.
 */
import {
  BellRing,
  Gauge,
  LayoutDashboard,
  Network,
  ShieldAlert,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type ModuleId =
  | "dashboard"
  | "network-traffic"
  | "risk-analysis"
  | "forecast"
  | "alerts"
  | "model-performance";

export type ModuleStatus = "In development" | "Planned";
export type ModulePriority = "P0" | "P1" | "P2";

/** Kind of structural preview a module's scaffold renders. */
export type PreviewKind = "stats" | "chart" | "table" | "matrix" | "gauge" | "signal";

export interface ModuleMeta {
  id: ModuleId;
  path: string;
  /** Short ops code, e.g. SOC-01 */
  code: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  status: ModuleStatus;
  priority: ModulePriority;
  phase: string;
  /** Primary backend endpoint this module will consume. */
  endpoint: string;
  capabilities: string[];
  preview: [PreviewKind, PreviewKind];
}

export const MODULES: Record<ModuleId, ModuleMeta> = {
  dashboard: {
    id: "dashboard",
    path: "/dashboard",
    code: "SOC-01",
    title: "Overview",
    tagline: "Command overview",
    description:
      "Unified threat posture across the monitored estate — live KPIs, active incidents and forecasting-model health on a single pane of glass.",
    icon: LayoutDashboard,
    status: "In development",
    priority: "P0",
    phase: "Phase 2 · Data integration",
    endpoint: "/overview",
    capabilities: [
      "Live threat posture and severity distribution",
      "Cross-module KPI roll-up with time-window filters",
      "Active incident and alert summary",
      "Forecasting model health at a glance",
      "SOC shift notes and handover log",
    ],
    preview: ["stats", "chart"],
  },
  "network-traffic": {
    id: "network-traffic",
    path: "/traffic",
    code: "NET-02",
    title: "Network Traffic",
    tagline: "Flow telemetry",
    description:
      "Ingress and egress flow analysis with protocol breakdowns, baseline-deviation overlays and early anomaly clustering.",
    icon: Network,
    status: "Planned",
    priority: "P1",
    phase: "Phase 2 · Data integration",
    endpoint: "/network/flows",
    capabilities: [
      "Ingress / egress throughput timelines",
      "Protocol and port distribution",
      "Baseline deviation overlay (σ-bands)",
      "Source IP and geolocation breakdown",
      "Anomalous packet cluster detection",
    ],
    preview: ["chart", "table"],
  },
  "risk-analysis": {
    id: "risk-analysis",
    path: "/risk-analysis",
    code: "RSK-03",
    title: "Risk Analysis",
    tagline: "Threat scoring",
    description:
      "Asset-level risk quantification combining exposure, exploitability and forecast attack likelihood into prioritized composite scores.",
    icon: ShieldAlert,
    status: "Planned",
    priority: "P1",
    phase: "Phase 3 · Risk engine",
    endpoint: "/risk/scores",
    capabilities: [
      "Asset risk scoring with CVSS weighting",
      "Exposure × likelihood risk matrix",
      "Lateral-movement path simulation",
      "Business-impact-adjusted prioritization",
      "Mitigation playbooks per risk cluster",
    ],
    preview: ["matrix", "gauge"],
  },
  forecast: {
    id: "forecast",
    path: "/forecast",
    code: "FCST-04",
    title: "Forecast",
    tagline: "Attack prediction",
    description:
      "The core AI engine output — probabilistic attack forecasts over 24-to-72-hour horizons with confidence intervals and attack-vector classification.",
    icon: TrendingUp,
    status: "In development",
    priority: "P0",
    phase: "Phase 3 · Model serving",
    endpoint: "/forecast/window",
    capabilities: [
      "24 / 48 / 72-hour attack probability curves",
      "Confidence-interval bands per horizon",
      "Attack-vector classification (DDoS, brute force, exfil…)",
      "Seasonal and diurnal pattern detection",
      "Scenario comparison vs. trailing baseline",
    ],
    preview: ["signal", "stats"],
  },
  alerts: {
    id: "alerts",
    path: "/alerts",
    code: "ALR-05",
    title: "Alerts",
    tagline: "Incident queue",
    description:
      "Severity-ranked incident queue with model-assisted triage, correlation grouping and SLA tracking for analyst response.",
    icon: BellRing,
    status: "In development",
    priority: "P1",
    phase: "Phase 2 · Data integration",
    endpoint: "/alerts",
    capabilities: [
      "Severity-ranked triage queue",
      "Model-assisted triage suggestions",
      "Duplicate and correlated alert grouping",
      "SLA timers and escalation paths",
      "Analyst assignment and disposition log",
    ],
    preview: ["table", "chart"],
  },
  "model-performance": {
    id: "model-performance",
    path: "/model-performance",
    code: "MLO-06",
    title: "Model Performance",
    tagline: "Model telemetry",
    description:
      "Continuous evaluation of the forecasting models — accuracy trends, false-positive load, drift indicators and retraining history.",
    icon: Gauge,
    status: "Planned",
    priority: "P2",
    phase: "Phase 3 · Model serving",
    endpoint: "/models/metrics",
    capabilities: [
      "Precision / recall / F1 trend monitoring",
      "False-positive and false-negative load",
      "Data and concept drift indicators",
      "Feature importance snapshots",
      "Retraining runs and version history",
    ],
    preview: ["gauge", "signal"],
  },
};

export const MODULE_LIST: ModuleMeta[] = Object.values(MODULES);
