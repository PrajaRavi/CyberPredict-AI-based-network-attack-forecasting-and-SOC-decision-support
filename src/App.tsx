import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AlertProvider } from "./context/AlertContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";

// 9 Redesigned Pages matching the visual specifications
import DashboardPage from "./pages/Dashboard";
import LiveMonitoringPage from "./pages/LiveMonitoring";
import NetworkObservatoryPage from "./pages/NetworkObservatory";
import BehaviourIntelligencePage from "./pages/BehaviourIntelligence";
import ThreatForecastPage from "./pages/ThreatForecast";
import ThreatInvestigationPage from "./pages/ThreatInvestigation";
import AlertsResponsePage from "./pages/AlertsResponse";
import ScenarioSimulatorPage from "./pages/ScenarioSimulator";
import ResearchValidationPage from "./pages/ResearchValidation";
import NotFoundPage from "./pages/NotFound";

/**
 * CyberPredict Route Registry
 *
 * HashRouter is used so the single-file production build works from any
 * static host without server-side rewrites.
 */
export default function App() {
  return (
    <HashRouter>
      <AlertProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* 9 Core Dedicated Modules */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/monitoring" element={<LiveMonitoringPage />} />
            <Route path="/observatory" element={<NetworkObservatoryPage />} />
            <Route path="/behaviour" element={<BehaviourIntelligencePage />} />
            <Route path="/forecast" element={<ThreatForecastPage />} />
            <Route path="/investigation" element={<ThreatInvestigationPage />} />
            <Route path="/alerts" element={<AlertsResponsePage />} />
            <Route path="/simulator" element={<ScenarioSimulatorPage />} />
            <Route path="/research" element={<ResearchValidationPage />} />

            {/* Backward-Compatible Route Aliases */}
            <Route path="/traffic" element={<Navigate to="/monitoring" replace />} />
            <Route path="/risk-analysis" element={<Navigate to="/behaviour" replace />} />
            <Route path="/model-performance" element={<Navigate to="/research" replace />} />

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AlertProvider>
    </HashRouter>
  );
}
