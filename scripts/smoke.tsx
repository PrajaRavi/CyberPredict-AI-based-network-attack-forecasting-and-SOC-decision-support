/**
 * Route render smoke test — server-renders every route through the real
 * DashboardLayout and asserts each surface's signature content appears.
 *
 * Run: npx esbuild scripts/smoke.tsx --bundle --platform=node --format=cjs
 *      --jsx=automatic --loader:.svg=dataurl
 *      --define:process.env.NODE_ENV='"production"' --outfile=/tmp/cp-smoke.cjs
 *      && node /tmp/cp-smoke.cjs
 */
import { renderToString } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../src/components/layout/DashboardLayout";
import AlertsPage from "../src/pages/Alerts";
import DashboardPage from "../src/pages/Dashboard";
import ForecastPage from "../src/pages/Forecast";
import ModelPerformancePage from "../src/pages/ModelPerformance";
import NetworkTrafficPage from "../src/pages/NetworkTraffic";
import NotFoundPage from "../src/pages/NotFound";
import RiskAnalysisPage from "../src/pages/RiskAnalysis";

const ROUTES = [
  { path: "/dashboard", match: "Composite risk score", element: <DashboardPage /> },
  { path: "/traffic", match: "Network flows", element: <NetworkTrafficPage /> },
  { path: "/risk-analysis", match: "Current traffic behaviour", element: <RiskAnalysisPage /> },
  { path: "/forecast", match: "Attack probability horizon", element: <ForecastPage /> },
  { path: "/alerts", match: "Incident queue", element: <AlertsPage /> },
  { path: "/model-performance", match: "Forecast lead time", element: <ModelPerformancePage /> },
  { path: "/no-such-route", match: "Signal lost", element: <NotFoundPage /> },
];

let failed = 0;

for (const route of ROUTES) {
  const html = renderToString(
    <MemoryRouter initialEntries={[route.path]}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="*" element={route.element} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
  const ok = html.includes(route.match) && html.includes("CyberPredict");
  console.log(`${ok ? "PASS" : "FAIL"}  ${route.path.padEnd(20)} (${html.length.toLocaleString()} chars)`);
  if (!ok) failed += 1;
}

if (failed > 0) {
  console.error(`\n${failed} route(s) failed the smoke test.`);
  process.exit(1);
}
console.log("\nAll routes render through DashboardLayout.");
