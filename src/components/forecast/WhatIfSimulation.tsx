import { FlaskConical, Lock } from "lucide-react";
import { StatusBadge } from "../ui/Badge";
import { Panel } from "../ui/Panel";

const SCENARIOS = [
  "Packet rate +30%",
  "Block top 5 sources",
  "Ingress volume −20%",
  "Weekend baseline shift",
];

export function WhatIfSimulation() {
  return (
    <Panel
      title="What-if Simulation"
      code="Advanced Model Sandbox"
      actions={<StatusBadge tone="neutral">Coming Soon</StatusBadge>}
    >
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <Lock size={15} className="mt-0.5 shrink-0 text-slate-400" aria-hidden />
        <p className="text-xs leading-relaxed text-slate-600">
          Scenario forecasts require re-scoring the horizon against hypothetical inputs — planned for
          server-side execution. CyberPredict will never fabricate ML results client-side, so this
          module stays locked until the simulation backend ships.
        </p>
      </div>

      <fieldset disabled className="mt-5 opacity-60">
        <legend className="sr-only">What-if simulation controls (disabled — coming soon)</legend>

        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario}
              type="button"
              tabIndex={-1}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 font-sans text-xs font-semibold text-slate-600 cursor-not-allowed shadow-2xs"
            >
              {scenario}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">Parameter</span>
            <select
              defaultValue="packet-rate"
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 cursor-not-allowed shadow-2xs"
            >
              <option value="packet-rate">Packet rate</option>
              <option value="byte-rate">Byte rate</option>
              <option value="conn-rate">Connection rate</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 w-28">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">Change</span>
            <input
              type="text"
              defaultValue="+30%"
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 font-mono text-xs font-bold text-slate-700 cursor-not-allowed shadow-2xs"
            />
          </label>
          <button
            type="button"
            tabIndex={-1}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 text-xs font-bold text-slate-500 cursor-not-allowed"
          >
            <FlaskConical size={14} /> Run simulation
          </button>
        </div>
      </fieldset>

      <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
        Example: "What if packet rate increases by 30%?" — the forecast horizon and risk window would
        be re-scored server-side in real-time.
      </p>
    </Panel>
  );
}
