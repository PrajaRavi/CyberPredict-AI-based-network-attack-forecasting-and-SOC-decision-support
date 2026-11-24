/**
 * Module registry — single source of truth for every CyberPredict module.
 * Drives navigation, routing metadata and layout headers.
 */
import {
  Activity,
  BarChart3,
  Bell,
  Compass,
  FlaskConical,
  Globe,
  Home,
  PlaySquare,
  Search,
  type LucideIcon,
} from "lucide-react";

export type ModuleId =
  | "dashboard"
  | "monitoring"
  | "observatory"
  | "behaviour"
  | "forecast"
  | "investigation"
  | "alerts"
  | "simulator"
  | "research";

export type ModuleStatus = "Operational" | "In development" | "Active";
export type ModulePriority = "P0" | "P1" | "P2";
export type PreviewKind = "stats" | "chart" | "table" | "matrix" | "gauge" | "signal";

export interface ModuleMeta {
  id: ModuleId;
  path: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  searchPlaceholder: string;
  status: ModuleStatus;
  priority: ModulePriority;
  phase: string;
  endpoint: string;
  capabilities: string[];
  preview: [PreviewKind, PreviewKind];
}

export const MODULES: Record<ModuleId, ModuleMeta> = {
  dashboard: {
    id: "dashboard",
    path: "/dashboard",
    code: "SOC-01",
    title: "Command Center",
    tagline: "Network intelligence at a glance.",
    description: "Unified threat posture and predictive risk overview across the monitored enterprise.",
    icon: Home,
    searchPlaceholder: "Search across network...",
    status: "Operational",
    priority: "P0",
    phase: "Phase 3 · Production",
    endpoint: "/overview",
    capabilities: [
      "Predictive Risk Overview gauge and timeline",
      "Network traffic and connection telemetry",
      "Suspicious event clustering",
      "Behaviour intelligence deviation summaries",
    ],
    preview: ["stats", "chart"],
  },
  monitoring: {
    id: "monitoring",
    path: "/monitoring",
    code: "NET-02",
    title: "Live Monitoring",
    tagline: "Observe network activity and security signals.",
    description: "Real-time incoming and outgoing packet flow rates, throughput and telemetry signals.",
    icon: Activity,
    searchPlaceholder: "Search across network...",
    status: "Operational",
    priority: "P0",
    phase: "Phase 3 · Production",
    endpoint: "/network/flows",
    capabilities: [
      "Real-time dual-line area traffic curves",
      "Network event stream triage",
      "Simulated packet generator control",
      "Data throughput and connection frequency",
    ],
    preview: ["chart", "table"],
  },
  observatory: {
    id: "observatory",
    path: "/observatory",
    code: "OBS-03",
    title: "Network Observatory",
    tagline: "Explore traffic flows, endpoints and communication patterns.",
    description: "Interactive network topology graph, endpoint inspector, and flow explorer.",
    icon: Globe,
    searchPlaceholder: "Search by IP address...",
    status: "Operational",
    priority: "P1",
    phase: "Phase 3 · Production",
    endpoint: "/network/topology",
    capabilities: [
      "Interactive SVG node topology canvas",
      "Endpoint inspector and traffic breakdown",
      "Protocol distribution donut analysis",
      "NetFlow stream search and pagination",
    ],
    preview: ["chart", "table"],
  },
  behaviour: {
    id: "behaviour",
    path: "/behaviour",
    code: "BEH-04",
    title: "Behaviour Intelligence",
    tagline: "Understand network patterns. Identify behavioural deviations.",
    description: "Baseline comparison, traffic volume anomalies, and behavioural deviation scoring.",
    icon: BarChart3,
    searchPlaceholder: "Search across network...",
    status: "Operational",
    priority: "P0",
    phase: "Phase 3 · Production",
    endpoint: "/risk/analysis",
    capabilities: [
      "Baseline deviation spike detection",
      "Historical period grouped comparison",
      "Risk factor contribution weights",
      "Behavioural anomaly log table",
    ],
    preview: ["matrix", "chart"],
  },
  forecast: {
    id: "forecast",
    path: "/forecast",
    code: "FCST-05",
    title: "Threat Forecast",
    tagline: "Explore future network risk windows using historical traffic behaviour.",
    description: "Temporal AI forecasting projecting risk windows 10-60 minutes in advance.",
    icon: Compass,
    searchPlaceholder: "Search across network...",
    status: "Operational",
    priority: "P0",
    phase: "Phase 3 · Production",
    endpoint: "/forecast/window",
    capabilities: [
      "Multi-horizon risk window projection",
      "Temporal boundary observations vs forecasts",
      "High-risk window interval identification",
      "Interval inspector with feature breakdown",
    ],
    preview: ["signal", "stats"],
  },
  investigation: {
    id: "investigation",
    path: "/investigation",
    code: "INV-06",
    title: "Threat Investigation",
    tagline: "Investigate suspicious network behaviour through connected traffic evidence.",
    description: "Interactive incident triage queue, connected evidence timeline, and analyst workspace.",
    icon: Search,
    searchPlaceholder: "Search investigations...",
    status: "Operational",
    priority: "P1",
    phase: "Phase 3 · Production",
    endpoint: "/investigations",
    capabilities: [
      "Investigation queue and triage status",
      "Endpoint communication relationship flow",
      "Evidence timeline tracking",
      "Analyst notes workspace and disposition",
    ],
    preview: ["table", "stats"],
  },
  alerts: {
    id: "alerts",
    path: "/alerts",
    code: "ALR-07",
    title: "Alerts & Response",
    tagline: "Prioritise network alerts and manage analyst response workflows.",
    description: "Severity-ranked incident queue, indicator breakdowns, and response workflow pipeline.",
    icon: Bell,
    searchPlaceholder: "Search alerts...",
    status: "Operational",
    priority: "P0",
    phase: "Phase 3 · Production",
    endpoint: "/alerts",
    capabilities: [
      "Severity-filtered alert management queue",
      "Supporting indicator contribution bars",
      "Response workflow transition pipeline",
      "Recent alert activity audit feed",
    ],
    preview: ["table", "chart"],
  },
  simulator: {
    id: "simulator",
    path: "/simulator",
    code: "SIM-08",
    title: "Scenario Simulator",
    tagline: "Explore hypothetical network conditions and understand their impact on traffic risk.",
    description: "Counterfactual parameter sandbox testing traffic surges and anomaly scenarios.",
    icon: PlaySquare,
    searchPlaceholder: "Search scenarios...",
    status: "Operational",
    priority: "P1",
    phase: "Phase 3 · Production",
    endpoint: "/simulation/what-if",
    capabilities: [
      "Preset attack scenario profiles",
      "Dynamic traffic parameter sliders",
      "Comparative baseline vs modified charts",
      "Scenario risk classification assessment",
    ],
    preview: ["gauge", "chart"],
  },
  research: {
    id: "research",
    path: "/research",
    code: "RES-09",
    title: "Research & Validation",
    tagline: "Explore the dataset, temporal methodology, and evaluation framework behind CyberPredict.",
    description: "CSE-CIC-IDS2018 dataset benchmarks, temporal framework, and leakage prevention.",
    icon: FlaskConical,
    searchPlaceholder: "Search research...",
    status: "Operational",
    priority: "P2",
    phase: "Phase 3 · Production",
    endpoint: "/models/metrics",
    capabilities: [
      "CSE-CIC-IDS2018 dataset explorer",
      "Data processing pipeline architecture",
      "Temporal forecasting framework spec",
      "Methodology comparison and leakage safeguards",
    ],
    preview: ["stats", "matrix"],
  },
};

export const MODULE_LIST: ModuleMeta[] = [
  MODULES.dashboard,
  MODULES.monitoring,
  MODULES.observatory,
  MODULES.behaviour,
  MODULES.forecast,
  MODULES.investigation,
  MODULES.alerts,
  // MODULES.simulator,
  // MODULES.research,
];
