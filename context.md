# CyberPredict — Frontend Foundation Context

## 1. Project Overview

**CyberPredict** is an AI-powered cybersecurity forecasting and Security Operations Center (SOC) decision-support platform. Unlike conventional reactive intrusion detection systems (IDS) that trigger alarms only after volumetric damage or signature matches occur, CyberPredict leverages neural time-series forecasting models to project attack likelihoods and risk windows 10–60 minutes in advance.

This repository (`cyberpredict-frontend-foundation`) houses the complete frontend dashboard application. It provides an aesthetic, responsive single-page application (SPA) with stubbed telemetry fixtures ready for integration with backend model-serving APIs.

---

## 2. Core Technical Stack

- **Runtime & Framework**: [React 19](https://react.dev/) with [TypeScript 5.9](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 7](https://vitejs.dev/) with `@vitejs/plugin-react`
- **Styling & Design Tokens**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Component Primitives**: [shadcn/ui](https://ui.shadcn.com/) architecture powered by `class-variance-authority` (CVA) and `@radix-ui/react-slot`
- **Data Visualization**: [Recharts 3.10](https://recharts.org/) (Area, Line, Bar, Composed, and Pie/Donut charts)
- **Icons**: [lucide-react](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) using `HashRouter` for zero-configuration static file deployments
- **Single-File Packaging**: `vite-plugin-singlefile` (inlines all HTML, JS, CSS, and SVGs into a self-contained distributable artifact)

---

## 3. Design System & Theming

The UI design follows a modern SaaS / FinTech light theme inspired by premium analytics dashboards (FINCHECK aesthetic):

### 3.1 Color Palette
- **Canvas / Background**: Light lavender/blue canvas (`#F4F6FB` / `ink-950`) with an ambient radial wash and subtle grid utility (`bg-grid`).
- **Cards & Surfaces**: Pure crisp white (`#FFFFFF` / `ink-900`) with soft diffused drop shadows (`shadow-[0_4px_24px_-4px_rgba(20,30,55,0.05)]`) and subtle slate borders (`#E8EEF5`).
- **Hero KPI Card Gradients**:
  - **Mint / Teal Cyan**: `from-[#10e5be] via-[#0ccda9] to-[#05b293]` (Composite Risk Score)
  - **Sky Blue**: `from-[#68a5fd] via-[#5493f7] to-[#3b7bf6]` (Predicted Attack Vector)
  - **Coral / Rose Pink**: `from-[#ff7e95] via-[#fb6380] to-[#e84666]` (Threat Posture Status)
  - **Lavender / Violet Purple**: `from-[#b388ff] via-[#9d68fe] to-[#8042f8]` (Model Confidence & Agreement)
- **Semantic Status Tones**:
  - **Critical**: `#F43F5E` / `#E11D48` (`crit-400` / `crit-500`)
  - **Warning**: `#F59E0B` / `#D97706` (`warn-400` / `warn-500`)
  - **Safe / Nominal**: `#10B981` / `#059669` (`safe-400` / `safe-500`)
  - **Signal / Cyan Accent**: `#0EA5E9` / `#0284C7` (`pulse-400` / `pulse-500`)

### 3.2 Typography
- **Display & Headings**: `Plus Jakarta Sans` / `Space Grotesk`
- **Body & Controls**: `Plus Jakarta Sans` / `IBM Plex Sans`
- **Data, Code & Telemetry**: `IBM Plex Mono` (tabular numbers, IP addresses, ports, timestamps)

### 3.3 Micro-Interactions & Hover Reactions
- All interactive cards, tiles, and table rows implement reactive hover states (`hover:-translate-y-1` to `hover:-translate-y-1.5`, soft elevation gain, and border transitions).
- Meaningful Lucide icons are encapsulated within soft-tinted circular or rounded badge containers matching their semantic tone.

---

## 4. Architecture & Directory Structure

```
cyberpredict-frontend-foundation/
├── components.json             # Official shadcn/ui configuration
├── index.html                  # HTML template with Google Fonts
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration with path mapping (@/*)
├── vite.config.ts              # Vite plugins (@tailwindcss/vite, singlefile)
├── src/
│   ├── App.tsx                 # Route definitions & HashRouter
│   ├── main.tsx                # React DOM root entry
│   ├── index.css               # Tailwind v4 theme tokens, utilities, base styles
│   ├── assets/                 # Brand assets & SVG logos
│   ├── lib/
│   │   └── utils.ts            # Core shadcn helper (cn with clsx & tailwind-merge)
│   ├── components/
│   │   ├── ui/                 # Reusable shadcn/ui primitives
│   │   │   ├── card.tsx        # Card, CardHeader, CardTitle, CardContent, CardFooter
│   │   │   ├── button.tsx      # Button with CVA variants (default, outline, soft, gradient)
│   │   │   ├── badge.tsx       # Badge, StatusBadge, ThreatChip
│   │   │   ├── input.tsx       # Form input
│   │   │   ├── tabs.tsx        # Tabs, TabsList, TabsTrigger, TabsContent
│   │   │   ├── avatar.tsx      # Avatar, AvatarImage, AvatarFallback
│   │   │   ├── progress.tsx    # Progress bar
│   │   │   ├── separator.tsx   # Divider
│   │   │   ├── Panel.tsx       # Bordered module container with header & actions
│   │   │   └── PageHeader.tsx  # Uniform module header with icon badge & metadata
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx # Persistent frame (Sidebar, Header, Main Outlet)
│   │   │   ├── Header.tsx          # Responsive top bar (Greeting, Search, Profile)
│   │   │   └── Sidebar.tsx         # Brand logo, navigation links, model status
│   │   ├── dashboard/          # Overview widgets
│   │   │   ├── RiskScoreCard.tsx      # Mint gradient composite risk gauge
│   │   │   ├── PredictionCard.tsx     # Sky blue gradient predicted attack card
│   │   │   ├── ForecastStatus.tsx     # Pink gradient engine status card
│   │   │   ├── ConfidenceCard.tsx     # Purple gradient confidence bar
│   │   │   ├── RiskTimeline.tsx       # Historical + forecast spline area chart
│   │   │   ├── ActivityDonutCard.tsx  # Attack vector activity donut chart
│   │   │   ├── RecentIncidentsTable.tsx # Transaction-style incident history table
│   │   │   ├── DefenseGoalsCard.tsx   # Segmented mitigation progress bars
│   │   │   ├── RiskFactorCard.tsx     # Contributing risk factors with icons
│   │   │   ├── RecommendedAction.tsx  # Analyst decision support & review actions
│   │   │   └── RiskLevelBadge.tsx     # Semantic risk level pill
│   │   ├── traffic/
│   │   │   └── TrafficTable.tsx       # Filterable, sortable NetFlow-style table
│   │   ├── analysis/
│   │   │   ├── BehaviourStat.tsx      # Traffic behaviour snapshot tiles
│   │   │   ├── TrafficChartCard.tsx   # Trailing trend charts with projected tails
│   │   │   └── RiskWindowCard.tsx     # Peak likelihood risk window segment breakdown
│   │   ├── forecast/
│   │   │   ├── ForecastHorizonChart.tsx # Attack probability horizon curve & band
│   │   │   ├── ForecastStatTile.tsx   # Compact KPI summary tiles
│   │   │   └── WhatIfSimulation.tsx   # Scenario forecasting sandbox (locked)
│   │   └── metrics/
│   │       ├── LeadTimePanel.tsx      # Dimension diagram of early alarm lead time
│   │       ├── AlarmTimeCard.tsx      # Onset-to-alarm comparison cards
│   │       ├── MetricCard.tsx         # Headline accuracy/precision/recall tiles
│   │       ├── CompareBarChart.tsx    # Grouped benchmark comparison bars
│   │       ├── VersionTrendChart.tsx  # Rolling version trend line chart
│   │       └── ConfusionMatrix.tsx    # 2x2 detection confusion matrix
│   ├── data/                   # Realistic mock datasets & fixtures
│   │   ├── modules.ts          # Module metadata registry
│   │   ├── navigation.ts       # Navigation routes & badge definitions
│   │   ├── mockDashboard.js    # Overview KPIs, risk score, factors, actions
│   │   ├── mockTraffic.js      # NetFlow-style traffic flow records & summaries
│   │   ├── mockRiskAnalysis.js # Traffic behaviour metrics & 120m timeline
│   │   ├── mockForecast.js     # Attack probability horizon points & summaries
│   │   ├── mockAlerts.js       # Severity-ranked incident queue
│   │   └── mockMetrics.js      # Model performance evaluation benchmarks
│   ├── pages/                  # Module route page views
│   │   ├── Dashboard.tsx        # /dashboard (Command Overview)
│   │   ├── NetworkTraffic.tsx   # /traffic (Flow Telemetry)
│   │   ├── RiskAnalysis.tsx     # /risk-analysis (Threat Scoring)
│   │   ├── Forecast.tsx         # /forecast (Attack Prediction)
│   │   ├── Alerts.tsx           # /alerts (Incident Queue)
│   │   ├── ModelPerformance.tsx # /model-performance (Model Telemetry)
│   │   └── NotFound.tsx         # Fallback 404 view
│   └── services/
│       ├── api.js              # Centralized Axios client & stubbed endpoints
│       └── types.ts            # Shared API payload interfaces
```

---

## 5. Modules & Navigation Routes

| Route | Module Code | Title | Core Features |
|---|---|---|---|
| `/dashboard` | `SOC-01` | **Overview** | 4 Hero gradient cards, Risk Timeline area chart, Activity donut chart, Recent Incidents table, Defense Goals, Contributing factors, Analyst recommendation. |
| `/traffic` | `NET-02` | **Network Traffic** | Summary KPI tiles, protocol filter chips (`ALL`, `TCP`, `UDP`, `ICMP`), risk dropdown, search bar, sortable NetFlow table, expandable row detail drawer with anomaly indicators. |
| `/risk-analysis` | `RSK-03` | **Risk Analysis** | 6 live snapshot behaviour tiles (`pps`, `byte rate`, `active flows`, `conn rate`, `duration`, `anomaly score`), trailing trend charts, risk factors, detailed 120m timeline + 30m horizon, expected risk window breakdown. |
| `/forecast` | `FCST-04` | **Forecast** | Forecast summary tiles, Attack probability horizon chart with confidence band, prediction and confidence cards, risk timeline, What-If simulation sandbox. |
| `/alerts` | `ALR-05` | **Alerts** | Severity filter pills (`ALL`, `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) with real-time counters, incident cards with severity accents, route badges, and analyst acknowledgement toggles. |
| `/model-performance` | `MLO-06` | **Model Performance** | Forecast lead-time hero track diagram, headline metric cards (`Accuracy`, `Precision`, `Recall`, `F1`, `FAR`), grouped comparison bars, version trend lines, confusion matrix. |

---

## 6. Key Design Patterns & Principles

1. **Probabilistic Language Only**:
   - The UI adheres strictly to forecasting semantics (e.g., *"Anticipated attack likelihood"*, *"Expected risk window"*, *"Probabilistic forecast — not a confirmed event"*). It never implies automated blocking or destructive actions.
2. **Human-in-the-Loop Decision Support**:
   - Triage actions and mitigation approvals are modeled as analyst review items requiring human confirmation.
3. **Mobile & Viewport Responsiveness**:
   - Header welcome text uses fluid scaling and truncation safeguards to prevent overflow on 320px–480px devices.
   - Global search transitions to an in-place icon toggle on small phones and full pill inputs on tablet/desktop.
   - Grid layouts step down from `4` columns on desktop, to `2` on tablet, and `1` on mobile.
   - All data tables are wrapped in horizontal scroll containers (`overflow-x-auto`) to preserve layout integrity.
4. **Accessible Semantics**:
   - ARIA roles on tabs, navigation landmarks, screen-reader text on charts, and visible focus rings.

---

## 7. Developer & Build Workflows

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Available Scripts
- `npm run dev`: Starts the local Vite development server with HMR.
- `npm run build`: Type-checks with `tsc` and compiles the production bundle into a single self-contained `dist/index.html` via `vite-plugin-singlefile`.
- `npm run preview`: Previews the compiled production artifact locally.

### Path Mapping
The project uses the `@/*` alias mapped to `src/*` in both [tsconfig.json](file:///E:/cyberpredict-frontend-foundation/tsconfig.json) and [vite.config.ts](file:///E:/cyberpredict-frontend-foundation/vite.config.ts).
