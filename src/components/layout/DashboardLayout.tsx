import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

/**
 * DashboardLayout — fully responsive application frame:
 * Persistent Sidebar + Header around a scrolling content region,
 * with fluid padding and overflow containment for all screen sizes.
 */
export function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement | null>(null);

  /* Reset scroll + close the mobile drawer on route change. */
  useEffect(() => {
    setMobileNavOpen(false);
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#F4F6FB] text-slate-800">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile drawer with slide-in animation */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <Sidebar
            className="flex w-[280px] max-w-[85vw] shadow-2xl animate-enter"
            onNavigate={() => setMobileNavOpen(false)}
          />
          <button
            type="button"
            aria-label="Close navigation"
            className="flex-1 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenu={() => setMobileNavOpen(true)} />

        <main ref={mainRef} className="relative flex-1 overflow-y-auto overflow-x-hidden">
          {/* Ambient subtle backdrops */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-grid opacity-60"
          />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-glow opacity-80" />

          <div className="relative mx-auto w-full max-w-[1520px] px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-5 sm:space-y-6">
            <div key={pathname} className="animate-enter">
              <Outlet />
            </div>

            <footer className="mt-8 sm:mt-12 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-slate-200/80 pt-5 sm:pt-6 font-sans text-xs text-slate-600">
              <div className="flex items-center gap-2 font-medium">
                <span className="font-bold text-slate-700">CyberPredict Enterprise</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">AI-Driven Attack Forecasting</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Telemetry Nominal
                </span>
                <span className="text-slate-600">v2.4.1</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
