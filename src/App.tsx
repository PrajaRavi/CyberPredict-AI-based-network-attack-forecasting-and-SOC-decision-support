import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import AlertsPage from "./pages/Alerts";
import DashboardPage from "./pages/Dashboard";
import ForecastPage from "./pages/Forecast";
import ModelPerformancePage from "./pages/ModelPerformance";
import NetworkTrafficPage from "./pages/NetworkTraffic";
import NotFoundPage from "./pages/NotFound";
import RiskAnalysisPage from "./pages/RiskAnalysis";

/**
 * CyberPredict route table.
 *
 * HashRouter is used so the single-file production build works from any
 * static host without server-side rewrites. Swap for BrowserRouter when
 * deploying behind a server that handles history fallback.
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/traffic" element={<NetworkTrafficPage />} />
          <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/model-performance" element={<ModelPerformancePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
