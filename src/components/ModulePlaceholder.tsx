/**
 * ModulePlaceholder — the standard scaffold rendered by every module
 * page until real widgets land. Shows the module contract (status,
 * phase, planned capabilities, endpoint) plus a structural preview of
 * the future interface, so the foundation feels intentional, not empty.
 */
import { ArrowUpRight, Check, Terminal } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { MODULES, type ModuleId, type PreviewKind } from "../data/modules";
import { cn } from "../utils/cn";
import { StatusBadge } from "./ui/Badge";
import { PageHeader } from "./ui/PageHeader";
import { Panel } from "./ui/Panel";
import { Skeleton } from "./ui/Skeleton";

/* Deterministic pseudo-noise so scaffolds render identically every time. */
const wave = (i: number, seed = 0) => Math.abs(Math.sin(i * 1.37 + seed * 2.1));

const SIGNAL = Array.from({ length: 24 }, (_, i) => ({
  t: i,
  v: 38 + Math.sin(i / 3.1) * 14 + Math.sin(i * 1.7) * 6 + (i > 15 ? (i - 15) * 2.6 : 0),
}));

const BAR_HEIGHTS = Array.from({ length: 28 }, (_, i) => 0.22 + wave(i) * 0.78);
const BAR_ANOMALIES = new Set([4, 11, 19, 26]);

const MATRIX_CELLS = Array.from({ length: 48 }, (_, i) => {
  const v = wave(i, 2);
  if (v > 0.92) return "bg-crit-500/70";
  if (v > 0.78) return "bg-warn-500/55";
  if (v > 0.5) return "bg-pulse-500/25";
  return "bg-ink-700";
});

const TABLE_ROWS = [
  { dot: "bg-crit-500", width: "w-3/5" },
  { dot: "bg-warn-500", width: "w-1/2" },
  { dot: "bg-pulse-500", width: "w-2/3" },
  { dot: "bg-mist-600", width: "w-2/5" },
];

const FOUNDATION_READY = [
  "Design tokens",
  "App shell & navigation",
  "Routing · 6 modules",
  "API client stub",
  "Chart scaffolding",
  "Icon system",
];

const PREVIEW_LABELS: Record<PreviewKind, string> = {
  stats: "KPI row",
  chart: "Throughput · 24h",
  table: "Event queue",
  matrix: "Exposure matrix",
  gauge: "Model F1",
  signal: "Forecast signal",
};

function PreviewBlock({ kind, moduleId }: { kind: PreviewKind; moduleId: ModuleId }) {
  return (
    <div className="rounded-md border border-line bg-ink-850/70 p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist-600">
          {PREVIEW_LABELS[kind]}
        </span>
        <span aria-hidden className="size-1 rounded-full bg-line-bright" />
      </div>

      {kind === "stats" && (
        <div className="grid grid-cols-3 gap-3 py-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-2 w-10" />
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-2.5 w-8" />
            </div>
          ))}
        </div>
      )}

      {kind === "chart" && (
        <>
          <div className="flex h-24 items-end gap-[3px]">
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                style={{ height: `${h * 100}%` }}
                className={cn(
                  "flex-1 rounded-t-xs",
                  BAR_ANOMALIES.has(i) ? "bg-warn-500/75" : "bg-line-bright/80",
                )}
              />
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-3 font-mono text-[8.5px] uppercase tracking-[0.14em] text-mist-600">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-[1px] bg-line-bright" /> Baseline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-[1px] bg-warn-500/80" /> Anomaly
            </span>
          </div>
        </>
      )}

      {kind === "matrix" && (
        <div className="grid grid-cols-8 gap-1">
          {MATRIX_CELLS.map((tone, i) => (
            <div key={i} className={cn("h-4 rounded-xs", tone)} />
          ))}
        </div>
      )}

      {kind === "table" && (
        <div>
          {TABLE_ROWS.map((row, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b border-line/60 py-2.5 last:border-0"
            >
              <span className={cn("size-1.5 shrink-0 rounded-full", row.dot)} />
              <Skeleton className={cn("h-2.5 flex-1", row.width)} />
              <Skeleton className="h-2.5 w-10" />
              <Skeleton className="h-2.5 w-6" />
            </div>
          ))}
        </div>
      )}

      {kind === "gauge" && (
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 120 66" className="h-20 w-auto shrink-0" aria-hidden>
            <path
              d="M12 60 A48 48 0 0 1 108 60"
              stroke="var(--color-ink-700)"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M12 60 A48 48 0 0 1 108 60"
              stroke="var(--color-pulse-500)"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="150.8"
              strokeDashoffset="42"
              opacity="0.85"
            />
          </svg>
          <div>
            <div className="font-mono text-lg font-medium tabular-nums text-mist-100">0.942</div>
            <div className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-mist-600">
              F1 · trailing 7d
            </div>
          </div>
        </div>
      )}

      {kind === "signal" && (
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SIGNAL} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`signal-fill-${moduleId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1CC5EA" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#1CC5EA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#45DDF8"
                strokeWidth={1.5}
                fill={`url(#signal-fill-${moduleId})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function ModulePlaceholder({ moduleId }: { moduleId: ModuleId }) {
  const meta = MODULES[moduleId];
  const Icon = meta.icon;

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Icon}
        eyebrow={`Module ${meta.code} · ${meta.tagline}`}
        title={meta.title}
        description={meta.description}
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={meta.status === "In development" ? "warn" : "neutral"} pulse={meta.status === "In development"}>
              {meta.status}
            </StatusBadge>
            <StatusBadge tone="crit">{meta.priority}</StatusBadge>
            <StatusBadge tone="pulse">{meta.phase}</StatusBadge>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* Planned capabilities */}
        <Panel title="Planned capabilities" code="Scope">
          <ul>
            {meta.capabilities.map((capability, i) => (
              <li
                key={capability}
                className="flex items-start gap-3 border-b border-line/60 py-2.5 last:border-0"
              >
                <span className="mt-px font-mono text-[10px] tabular-nums text-mist-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[13px] leading-snug text-mist-300">{capability}</span>
                <span className="mt-px shrink-0 rounded border border-line-bright px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-mist-500">
                  Queued
                </span>
              </li>
            ))}
          </ul>

          {/* Endpoint stub */}
          <div className="mt-4 flex items-center gap-2.5 rounded-md border border-line bg-ink-850/70 px-3 py-2.5">
            <Terminal size={13} className="shrink-0 text-mist-500" aria-hidden />
            <span className="truncate font-mono text-[10.5px] text-mist-400">
              GET /api/v1{meta.endpoint}
            </span>
            <StatusBadge tone="neutral" className="ml-auto shrink-0">
              Stub
            </StatusBadge>
          </div>
        </Panel>

        {/* Interface scaffold */}
        <Panel
          title="Interface scaffold"
          code="Preview"
          actions={
            <button
              type="button"
              title="Component spec — arrives with Phase 2"
              className="inline-flex items-center gap-1 rounded border border-line-bright px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-mist-500 transition-colors hover:border-pulse-500/40 hover:text-pulse-400"
            >
              Layout v0.1 <ArrowUpRight size={11} aria-hidden />
            </button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {meta.preview.map((kind) => (
              <PreviewBlock key={kind} kind={kind} moduleId={meta.id} />
            ))}
          </div>
          <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-wide text-mist-600">
            Structural scaffold — live widgets render here once {meta.phase.toLowerCase()} lands.
          </p>
        </Panel>
      </div>

      {/* Foundation readiness */}
      <Panel title="Foundation status" code="Build 0.1.0" bodyClassName="py-3.5">
        <ul className="flex flex-wrap items-center gap-x-7 gap-y-2.5">
          {FOUNDATION_READY.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check size={13} className="shrink-0 text-safe-500" aria-hidden />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-mist-400">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
