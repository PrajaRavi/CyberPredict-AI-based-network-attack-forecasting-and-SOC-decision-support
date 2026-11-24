# CyberPredict — FastAPI Mock Backend & ML Serving Gateway

This directory houses the FastAPI backend for **CyberPredict**. It provides real-time telemetry, probabilistic forecasting endpoints, NetFlow anomaly detection simulation, and scenario modeling.

---

## 1. Quick Start

### 1.1 Activate Environment & Install Dependencies
The virtual environment is located at `backend/.venv`:

```powershell
# In PowerShell:
.\backend\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

### 1.2 Start the FastAPI Server
```powershell
python backend\run.py
```
- **API Base URL**: `http://127.0.0.1:8000/api/v1`
- **Interactive Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`
- **OpenAPI Schema**: `http://127.0.0.1:8000/openapi.json`
- **Health Check**: `http://127.0.0.1:8000/health`

---

## 2. API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/overview` | Composite SOC risk score, primary prediction, timeline, and recommended actions. |
| `GET` | `/api/v1/network/flows` | NetFlow capture summary and flow records with anomaly classifications. |
| `POST` | `/api/v1/network/inspect` | Real-time flow inspection (computes pps/bps, anomaly score, and mitigation advice). |
| `GET` | `/api/v1/forecast/window` | Attack probability horizon (+5m to +60m), confidence intervals, and KPI tiles. |
| `GET` | `/api/v1/risk/analysis` | Live behavioural snapshots (pps, byte rate, active flows), trailing trends, and risk window. |
| `GET` | `/api/v1/alerts` | Incident queue with triage severity ratings and SOC analyst recommendations. |
| `POST` | `/api/v1/alerts/{id}/acknowledge` | Toggle analyst acknowledgment for an alert. |
| `GET` | `/api/v1/models/metrics` | Model evaluation benchmarks (Accuracy, Precision, Recall, F1, lead time, confusion matrix). |
| `POST` | `/api/v1/simulation/what-if` | Counterfactual scenario forecasting sandbox (traffic multiplier, scrubbing active). |

---

## 3. Transitioning from Mock to Real Trained Models

When your ML models (e.g. PyTorch, ONNX, Scikit-learn, XGBoost) are trained:
1. Create your model loading module inside `backend/app/services/` (e.g. `ml_engine.py`).
2. Implement your inference functions using the exact same Pydantic schemas in `backend/app/schemas/`.
3. Swap `from .mock_engine import mock_engine` with your trained engine in the router files (`backend/app/api/v1/*.py`).
4. **No frontend changes will be necessary**, as all API response contracts remain 100% stable.

---

## 4. Connecting to the React Frontend

1. Ensure the backend is running (`python backend\run.py`).
2. In `src/services/api.js`, flip `const USE_MOCK = false;`.
3. Start the Vite dev server with `npm run dev`. Requests to `/api/v1/*` are automatically proxied to `http://127.0.0.1:8000/api/v1/*`.
