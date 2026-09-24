import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

/**
 * DashboardLayout — the reusable application frame shared by every
 * module route: persistent Sidebar + Header around a scrolling content
 * region, with the ambient SOC-grid backdrop behind the content.
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
    <div className="flex h-dvh overflow-hidden bg-ink-950 text-mist-100">
      <Sidebar className="hidden lg:flex" />

      {/* Mobile / tablet drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <Sidebar className="flex" onNavigate={() => setMobileNavOpen(false)} />
          <button
            type="button"
            aria-label="Close navigation"
            className="flex-1 bg-ink-950/70"
            onClick={() => setMobileNavOpen(false)}
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setMobileNavOpen(true)} />

        <main ref={mainRef} className="relative flex-1 overflow-y-auto">
          {/* Ambient layers */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-grid mask-[linear-gradient(to_bottom,black,black_55%,transparent)]"
          />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-glow" />

          <div className="relative mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div key={pathname} className="animate-enter">
              <Outlet />
            </div>

            <footer className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line/70 pb-2 pt-4 font-mono text-[9.5px] uppercase tracking-[0.14em] text-mist-600">
              <span>CyberPredict v0.1.0</span>
              <span aria-hidden className="text-line-bright">/</span>
              <span>AI-based network attack forecasting</span>
              <span aria-hidden className="text-line-bright">/</span>
              <span>Frontend foundation — endpoints stubbed</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
