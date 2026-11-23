# CyberPredict — Frontend Foundation Context

## 1. Project Overview

**CyberPredict** is an AI-powered cybersecurity forecasting and Security Operations Center (SOC) decision-support platform. Unlike conventional reactive intrusion detection systems (IDS) that trigger alarms only after volumetric damage or signature matches occur, CyberPredict leverages neural time-series forecasting models to project attack likelihoods and risk windows 10–60 minutes in advance.

This repository (`cyberpredict-frontend-foundation`) houses the complete frontend dashboard application. It provides an aesthetic, responsive single-page application (SPA) with stubbed telemetry fixtures ready for integration with backend model-serving APIs.

---

## 2. Core Technical Stack

### 2.1 Frontend Stack
- **Runtime & Framework**: [React 19](https://react.dev/) with [TypeScript 5.9](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 7](https://vitejs.dev/) with `@vitejs/plugin-react`
- **Styling & Design Tokens**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Component Primitives**: [shadcn/ui](https://ui.shadcn.com/) architecture powered by `class-variance-authority` (CVA) and `@radix-ui/react-slot`
- **Data Visualization**: [Recharts 3.10](https://recharts.org/) (Area, Line, Bar, Composed, and Pie/Donut charts)
- **Icons**: [lucide-react](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) using `HashRouter` for zero-configuration static file deployments
- **Single-File Packaging**: `vite-plugin-singlefile` (inlines all HTML, JS, CSS, and SVGs into a self-contained distributable artifact)

### 2.2 Backend Stack
- **Runtime**: [Python 3.12](https://www.python.org/) in an isolated `.venv`
- **Web Framework**: [FastAPI 0.165+](https://fastapi.tiangolo.com/) with automatic OpenAPI / Swagger documentation
- **ASGI Server**: [Uvicorn 0.54+](https://www.uvicorn.org/) with multi-worker & live reload support
- **Data Validation & Contracts**: [Pydantic v2](https://docs.pydantic.dev/) schemas strictly aligned with frontend TypeScript interfaces
- **API Proxy**: Vite dev server reverse proxy mapping `/api/*` to `http://127.0.0.1:8000/api/*`

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
├── backend/                    # FastAPI Mock Backend & ML Serving Gateway
│   ├── app/
│   │   ├── api/v1/             # Modular v1 REST route controllers
│   │   │   ├── alerts.py       # /api/v1/alerts (Queue & triage)
│   │   │   ├── forecast.py     # /api/v1/forecast (Horizon & probabilities)
│   │   │   ├── models.py       # /api/v1/models (Benchmarks & drift)
│   │   │   ├── overview.py     # /api/v1/overview (Dashboard aggregate)
│   │   │   ├── risk.py         # /api/v1/risk (Telemetry behaviours)
│   │   │   ├── simulation.py   # /api/v1/simulation (What-If sandbox)
│   │   │   └── traffic.py      # /api/v1/network (NetFlow & inspect)
│   │   ├── schemas/            # Pydantic v2 data validation models
│   │   │   ├── alerts.py
│   │   │   ├── common.py
│   │   │   ├── forecast.py
│   │   │   ├── models.py
│   │   │   ├── risk.py
│   │   │   └── traffic.py
│   │   ├── services/
│   │   │   └── mock_engine.py  # Heuristic inference & simulation engine
│   │   ├── config.py           # App settings, CORS, and prefixes
│   │   └── main.py             # FastAPI entrypoint, CORS & OpenAPI config
│   ├── .venv/                  # Python 3.12 virtual environment
│   ├── README.md               # Backend operational documentation
│   ├── requirements.txt        # Backend dependencies (fastapi, uvicorn, pydantic)
│   ├── run.py                  # Server bootstrap script
│   └── test_api.py             # Automated route & inference verification suite
├── components.json             # Official shadcn/ui configuration
├── index.html                  # HTML template with Google Fonts
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration with path mapping (@/*)
├── vite.config.ts              # Vite plugins & API reverse proxy configuration
├── src/
│   ├── App.tsx                 # Route definitions & HashRouter with AlertProvider
│   ├── main.tsx                # React DOM root entry
│   ├── index.css               # Tailwind v4 theme tokens, utilities, base styles
│   ├── assets/                 # Brand assets & SVG logos
│   ├── context/
│   │   └── AlertContext.tsx    # Reactive incident state & threat level management
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
│   │   │   ├── DashboardLayout.tsx # Persistent frame (Sidebar, Header, Banner, Outlet)
│   │   │   ├── GlobalThreatBanner.tsx # Dynamic dashboard-wide critical threat banner
│   │   │   ├── Header.tsx          # Responsive top bar with dynamic notification bell
│   │   │   └── Sidebar.tsx         # Brand logo, navigation links, dynamic alert badge
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
│   │   │   └── WhatIfSimulation.tsx   # Scenario forecasting sandbox
│   │   ├── alerts/
│   │   │   └── AlertCard.tsx          # Severity-ranked incident triage card
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
│   │   ├── Dashboard.tsx        # /dashboard (Command Overview with alert banner)
│   │   ├── NetworkTraffic.tsx   # /traffic (Flow Telemetry)
│   │   ├── RiskAnalysis.tsx     # /risk-analysis (Threat Scoring)
│   │   ├── Forecast.tsx         # /forecast (Attack Prediction)
│   │   ├── Alerts.tsx           # /alerts (Incident Queue with Activate button)
│   │   ├── ModelPerformance.tsx # /model-performance (Model Telemetry)
│   │   └── NotFound.tsx         # Fallback 404 view
│   └── services/
│       ├── api.js              # Centralized Axios client & mock/live toggle
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

---

## 8. Backend Architecture (FastAPI & ML Serving Gateway)

### 8.1 Architectural Strategy: The "Plug-and-Play" Adapter Pattern

The backend is built around a decoupled **Adapter Architecture**. Because trained neural model weights are trained in subsequent iterations, the serving layer isolates HTTP routing, Pydantic data validation, and telemetry aggregation from inference logic:

```
[ Frontend: React 19 / Vite SPA ]
               │
               │ HTTP / JSON via Vite Reverse Proxy (/api/v1)
               ▼
[ FastAPI Application Gateway (backend/app/main.py) ]
  ├── CORS Middleware & Request Lifecycle
  ├── Automatic OpenAPI 3.1 & Swagger Documentation (/docs)
  └── Modular APIRouter Controllers (backend/app/api/v1/*.py)
               │
               │ Validated Request Schemas (Pydantic v2)
               ▼
[ ML Model Serving Interface / Adapter Boundary ]
       │                                  │
       ▼ (Active Now)                     ▼ (Model Handoff)
[ MockInferenceEngine ]            [ RealMLEngine (Future) ]
  • Dynamic Time Offsets             • PyTorch / ONNX / XGBoost
  • Statistical NetFlow Heuristics   • Tensor Preprocessing & Scaling
  • What-If Parametric Sandbox       • Sequence Forecasting (LSTM / N-BEATS)
  • Stateful In-Memory Triage        • Multi-Class Vector Classifier
```

**Key Advantages:**
1. **Zero Frontend Rewrites**: Flipping `const USE_MOCK = false;` in [src/services/api.js](file:///E:/cyberpredict-frontend-foundation/src/services/api.js#L75) connects directly to FastAPI without changing any component or hook.
2. **Deterministic Data Contracts**: Schemas defined in [backend/app/schemas/](file:///E:/cyberpredict-frontend-foundation/backend/app/schemas/) strictly match the frontend TypeScript contracts in [src/services/types.ts](file:///E:/cyberpredict-frontend-foundation/src/services/types.ts).
3. **Seamless Model Integration**: When trained model artifacts (`.pt`, `.onnx`, or `.joblib`) are ready, only the backend service adapter is updated.

---

### 8.2 Backend Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── alerts.py        # /api/v1/alerts (Queue & analyst acknowledgement)
│   │       ├── forecast.py      # /api/v1/forecast & /window (Horizon curve & KPIs)
│   │       ├── models.py        # /api/v1/models/metrics (Benchmarks & drift)
│   │       ├── overview.py      # /api/v1/overview (Composite SOC command view)
│   │       ├── risk.py          # /api/v1/risk/analysis (120m history, 30m horizon)
│   │       ├── simulation.py    # /api/v1/simulation/what-if (Parametric sandbox)
│   │       └── traffic.py       # /api/v1/network/flows & /network/inspect
│   ├── schemas/                 # Pydantic v2 data models
│   │   ├── alerts.py            # AlertItem, AlertAcknowledgeRequest/Response
│   │   ├── common.py            # RiskScore, Prediction, TimelinePoint, RiskFactor
│   │   ├── forecast.py          # ForecastHorizon, WhatIfRequest/Response
│   │   ├── models.py            # MetricCard, LeadTimeData, ConfusionMatrix
│   │   ├── risk.py              # BehaviourStat, TrafficMetric, RiskWindow
│   │   └── traffic.py           # TrafficFlow, FlowInspectionRequest/Response
│   ├── services/
│   │   └── mock_engine.py       # Heuristic anomaly detector & dynamic simulator
│   ├── config.py                # CORS origins, project metadata, API prefixes
│   └── main.py                  # FastAPI initialization, routing & health checks
├── .venv/                       # Python 3.12 isolated virtual environment
├── README.md                    # Backend startup & maintenance guide
├── requirements.txt             # Dependencies: fastapi, uvicorn, pydantic, python-multipart
├── run.py                       # Development server launcher (http://127.0.0.1:8000)
└── test_api.py                  # Automated OpenAPI & engine verification test suite
```

---

### 8.3 REST API Endpoints & Contract Catalog

The backend exposes 11 production-grade endpoints documented via Swagger UI at `/docs` and ReDoc at `/redoc`:

| Method | Endpoint | Router | Description | Input / Output Schema |
|---|---|---|---|---|
| `GET` | `/health` | `main.py` | Health probe reporting service status and mode. | `{"status": "healthy", "service": "...", "mode": "mock-inference"}` |
| `GET` | `/api/v1/overview` | `overview.py` | Composite SOC overview including risk score, primary prediction, 15m forecast status, and recommended analyst actions. | Out: `OverviewPayload` |
| `GET` | `/api/v1/network/flows` | `traffic.py` | NetFlow capture summary and flow records with anomaly flags and pps/bps rates. | Out: `TrafficPayload` |
| `POST` | `/api/v1/network/inspect` | `traffic.py` | Real-time flow inspection simulating an ML anomaly detection model. | In: `FlowInspectionRequest`<br>Out: `FlowInspectionResponse` |
| `GET` | `/api/v1/forecast/window` | `forecast.py` | Attack probability horizon curve (-45m to +60m), confidence interval bands, and KPI tiles. | Out: `ForecastPayload` |
| `GET` | `/api/v1/forecast` | `forecast.py` | Alternate path alias for attack forecast horizon. | Out: `ForecastPayload` |
| `GET` | `/api/v1/risk/analysis` | `risk.py` | Live behaviour snapshot tiles (pps, byte rate, active flows), 60m trend charts, 120m timeline, and risk window. | Out: `RiskAnalysisPayload` |
| `GET` | `/api/v1/alerts` | `alerts.py` | Severity-ranked incident queue with analyst recommendations and triage status. | Out: `AlertsPayload` |
| `POST` | `/api/v1/alerts/{alert_id}/acknowledge` | `alerts.py` | Toggles human-in-the-loop analyst acknowledgement for a specific security alert. | In: `AlertAcknowledgeRequest`<br>Out: `AlertAcknowledgeResponse` |
| `GET` | `/api/v1/models/metrics` | `models.py` | Model evaluation benchmarks (Accuracy, Precision, Recall, F1, FAR, alarm lead times, confusion matrix). | Out: `ModelMetricsPayload` |
| `POST` | `/api/v1/simulation/what-if` | `simulation.py` | Counterfactual scenario sandbox simulating the effect of traffic volume surges and rate limiting. | In: `WhatIfRequest`<br>Out: `WhatIfResponse` |

---

### 8.4 ML Inference & Simulation Engine (`mock_engine.py`)

[backend/app/services/mock_engine.py](file:///E:/cyberpredict-frontend-foundation/backend/app/services/mock_engine.py) provides realistic analytical behavior before real neural weights are trained:

1. **Dynamic Time Generation**:
   - Timestamps for network captures and timelines are dynamically generated relative to `datetime.now(timezone.utc)` (e.g., `now`, `-5m`, `+10m`), preventing stale dates.
2. **NetFlow Anomaly & Heuristic Detection (`inspect_flow`)**:
   - Computes derived telemetry: $\text{pps} = \text{packets} / \text{durationSec}$ and $\text{bps} = (\text{bytes} \times 8) / \text{durationSec}$.
   - Evaluates volumetric signatures ($\text{pps} > 15,000 \rightarrow \text{SYN Flood}$ flag, anomaly score $+0.65$, risk score $+65$).
   - Flags DNS/NTP reflection patterns (UDP on port 53/123/1900) and SSH/RDP brute-force scans (ports 22/3389).
   - Generates actionable SOC mitigation recommendations based on the calculated risk level.
3. **Probabilistic Risk Horizon**:
   - Generates historical telemetry series (-45m backcast) joined with projected attack probability horizon points (+5m to +60m) and dynamic $[low, high]$ confidence interval bands.
4. **Counterfactual "What-If" Scenario Simulator (`simulate_what_if`)**:
   - Accepts parameter inputs: `trafficMultiplier` (0.1× to 10.0×), `rateLimitActive` (boolean), and optional `packetRateKpps`.
   - Computes parametric shifts:
     $$\Delta \text{Risk} = (\text{multiplier} - 1.0) \times 15 - (35 \text{ if rateLimitActive else } 0)$$
   - Returns simulated risk scores, mitigation efficiency ratings, and operational recommendations.
5. **Stateful Incident Queue**:
   - Maintains an in-memory repository of security alerts with support for persistent analyst triage and acknowledgement toggling.

---

### 8.5 Frontend ↔ Backend Integration

1. **Vite Reverse Proxy**:
   [vite.config.ts](file:///E:/cyberpredict-frontend-foundation/vite.config.ts#L18-L27) proxies all frontend requests from `/api/*` to `http://127.0.0.1:8000/api/*`, eliminating CORS issues during development.
2. **Reactive Alert Propagation (`AlertContext`)**:
   [src/context/AlertContext.tsx](file:///E:/cyberpredict-frontend-foundation/src/context/AlertContext.tsx) acts as the state synchronization layer between the backend alert queue and the frontend UI:
   - **Initial State**: Queue starts with **LOW and MEDIUM** alerts only.
   - **Threat Injection**: Clicking **"Activate"** in [Alerts.tsx](file:///E:/cyberpredict-frontend-foundation/src/pages/Alerts.tsx) injects an imminent CRITICAL attack forecast (`ALR-CRIT-xxxx`).
   - **Dashboard-Wide Warning**: [src/components/layout/GlobalThreatBanner.tsx](file:///E:/cyberpredict-frontend-foundation/src/components/layout/GlobalThreatBanner.tsx) automatically renders across all routes, the header bell pulses red, and the overview page activates high-threat mode.

---

### 8.6 Model Handoff Roadmap (Plugging in Real ML Models)

When neural models (PyTorch, ONNX, XGBoost, Scikit-learn) are trained and ready for deployment:

1. **Place Model Weights**: Save trained model files into `backend/app/models/` (e.g. `forecast_lstm.pt`, `vector_classifier.onnx`).
2. **Implement Model Service**: Create `backend/app/services/real_engine.py`:
   ```python
   import torch
   from ..schemas.traffic import FlowInspectionRequest, FlowInspectionResponse

   class RealMLEngine:
       def __init__(self):
           self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
           self.model = torch.load("app/models/forecast_lstm.pt", map_location=self.device)
           self.model.eval()

       def inspect_flow(self, req: FlowInspectionRequest) -> FlowInspectionResponse:
           # 1. Feature extraction & scaling
           # 2. Inference: with torch.no_grad(): output = self.model(tensor)
           # 3. Return FlowInspectionResponse
   ```
3. **Swap the Service**: In `backend/app/api/v1/*.py`, replace `from ...services.mock_engine import mock_engine` with the real engine instance.
4. **No Frontend Changes Needed**: Because Pydantic contracts and endpoint routes remain identical, the frontend transitions to live AI forecasting seamlessly.

---

### 8.7 Backend Execution & Developer Workflows

#### 1. Activate Environment
```powershell
.\backend\.venv\Scripts\Activate.ps1
```

#### 2. Install / Verify Dependencies
```powershell
pip install -r backend\requirements.txt
```

#### 3. Run the Development Server
```powershell
python backend\run.py
```
- Interactive Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc Documentation: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- OpenAPI Specification: [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

#### 4. Run Automated Route & Engine Verification Tests
```powershell
python backend\test_api.py
```
Validates route registration against the live OpenAPI specification, flow inspection anomaly rules, what-if scenario simulations, and alert acknowledgement state.
