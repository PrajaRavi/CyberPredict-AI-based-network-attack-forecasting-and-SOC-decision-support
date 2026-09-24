import { FlaskConical, Lock } from "lucide-react";
import { StatusBadge } from "../ui/Badge";
import { Panel } from "../ui/Panel";

const SCENARIOS = [
  "Packet rate +30%",
  "Block top 5 sources",
  "Ingress volume −20%",
  "Weekend baseline shift",
];

/**
 * What-if simulation — deliberately locked. Scenario forecasts require
 * server-side model execution; CyberPredict never fabricates ML results
 * client-side, so this surface ships disabled until that backend exists.
 */
export function WhatIfSimulation() {
  return (
    <Panel
      title="What-if simulation"
      code="Advanced feature"
      actions={<StatusBadge tone="neutral">Coming soon</StatusBadge>}
    >
      <div className="flex items-start gap-2.5 rounded-md border border-line bg-ink-850/70 px-3.5 py-3">
        <Lock size={13} className="mt-0.5 shrink-0 text-mist-500" aria-hidden />
        <p className="text-[11.5px] leading-relaxed text-mist-400">
          Scenario forecasts require re-scoring the horizon against hypothetical inputs — planned for
          server-side execution. CyberPredict will never fabricate ML results client-side, so this
          module stays locked until the simulation backend ships.
        </p>
      </div>

      <fieldset disabled className="mt-4 opacity-55">
        <legend className="sr-only">What-if simulation controls (disabled — coming soon)</legend>

        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario}
              type="button"
              tabIndex={-1}
              className="cursor-not-allowed rounded-md border border-line px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mist-400"
            >
              {scenario}
            </button>
          ))}
        </div>

        <div className="mt-3.5 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist-600">Parameter</span>
            <select
              defaultValue="packet-rate"
              className="h-9 cursor-not-allowed rounded-md border border-line bg-ink-850 px-3 font-mono text-[11px] text-mist-300"
            >
              <option value="packet-rate">Packet rate</option>
              <option value="byte-rate">Byte rate</option>
              <option value="conn-rate">Connection rate</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist-600">Change</span>
            <input
              type="text"
              defaultValue="+30%"
              className="h-9 w-24 cursor-not-allowed rounded-md border border-line bg-ink-850 px-3 font-mono text-[11px] tabular-nums text-mist-300"
            />
          </label>
          <button
            type="button"
            tabIndex={-1}
            className="inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-md border border-line px-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mist-400"
          >
            <FlaskConical size={13} aria-hidden /> Run simulation
          </button>
        </div>
      </fieldset>

      <p className="mt-4 border-t border-line/60 pt-3 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-mist-600">
        Example: "What if packet rate increases by 30%?" — the forecast horizon and risk window would
        be re-scored server-side.
      </p>
    </Panel>
  );
}
