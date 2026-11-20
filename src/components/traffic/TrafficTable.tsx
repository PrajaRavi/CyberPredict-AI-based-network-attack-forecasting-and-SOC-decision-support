import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  // Filter,
  Radar,
  Search,
  // SlidersHorizontal,
} from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { RiskLevelBadge } from "../dashboard/RiskLevelBadge";
import { StatusBadge } from "../ui/Badge";

export type FlowRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface TrafficFlow {
  id: string;
  timestamp: string;
  srcIp: string;
  srcPort: number;
  dstIp: string;
  dstPort: number;
  protocol: "TCP" | "UDP" | "ICMP";
  durationSec: number;
  packets: number;
  bytes: number;
  pps: number;
  bps: number;
  risk: { level: FlowRiskLevel; score: number };
  flags: readonly string[];
  notes: string;
  iface: string;
  origin: string;
  detector: string;
  capturedAt: string;
}

type SortKey =
  | "timestamp"
  | "srcIp"
  | "dstIp"
  | "srcPort"
  | "dstPort"
  | "protocol"
  | "durationSec"
  | "packets"
  | "bytes"
  | "pps"
  | "bps";

interface Column {
  key: SortKey;
  label: string;
  align?: "right";
  className?: string;
}

const COLUMNS: Column[] = [
  { key: "timestamp", label: "Timestamp" },
  { key: "srcIp", label: "Source IP" },
  { key: "dstIp", label: "Destination IP" },
  { key: "srcPort", label: "S.Port", align: "right" },
  { key: "dstPort", label: "D.Port", align: "right" },
  { key: "protocol", label: "Protocol" },
  { key: "durationSec", label: "Duration", align: "right", className: "hidden md:table-cell" },
  { key: "packets", label: "Packets", align: "right", className: "hidden lg:table-cell" },
  { key: "bytes", label: "Bytes", align: "right" },
  { key: "pps", label: "Pkts/s", align: "right", className: "hidden xl:table-cell" },
  { key: "bps", label: "Bytes/s", align: "right", className: "hidden xl:table-cell" },
];

const PAGE_SIZE = 10;
const PROTOCOLS = ["ALL", "TCP", "UDP", "ICMP"] as const;
const RISK_OPTIONS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;

const PROTO_CHIP: Record<TrafficFlow["protocol"], string> = {
  TCP: "border-blue-200 bg-blue-50 text-blue-700 font-semibold",
  UDP: "border-purple-200 bg-purple-50 text-purple-700 font-semibold",
  ICMP: "border-slate-200 bg-slate-100 text-slate-700 font-semibold",
};

const RISK_BAR: Record<FlowRiskLevel, string> = {
  LOW: "bg-emerald-500",
  MEDIUM: "bg-amber-500",
  HIGH: "bg-rose-500",
  CRITICAL: "bg-rose-600",
};

const fmt = (n: number) => n.toLocaleString("en-US");
const fmtDuration = (s: number) => (s < 10 ? `${s.toFixed(1)}s` : `${Math.round(s)}s`);
const fmtPps = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(1));
const fmtBps = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)} MB/s` : n >= 1000 ? `${(n / 1000).toFixed(1)} KB/s` : `${n} B/s`;

const ipToNumber = (ip: string) => ip.split(".").reduce((acc, o) => acc * 256 + Number(o), 0);

const sortValue = (f: TrafficFlow, key: SortKey): number | string => {
  switch (key) {
    case "srcIp":
      return ipToNumber(f.srcIp);
    case "dstIp":
      return ipToNumber(f.dstIp);
    case "srcPort":
      return f.srcPort;
    case "dstPort":
      return f.dstPort;
    case "durationSec":
      return f.durationSec;
    case "packets":
      return f.packets;
    case "bytes":
      return f.bytes;
    case "pps":
      return f.pps;
    case "bps":
      return f.bps;
    default:
      return f[key];
  }
};

const portLabel = (flow: TrafficFlow, which: "src" | "dst") => {
  const port = which === "src" ? flow.srcPort : flow.dstPort;
  return flow.protocol === "ICMP" ? "—" : String(port);
};

export function TrafficTable({ flows }: { flows: readonly TrafficFlow[] }) {
  const [query, setQuery] = useState("");
  const [protocol, setProtocol] = useState<(typeof PROTOCOLS)[number]>("ALL");
  const [riskFilter, setRiskFilter] = useState<(typeof RISK_OPTIONS)[number]>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flows.filter(
      (f) =>
        (protocol === "ALL" || f.protocol === protocol) &&
        (riskFilter === "ALL" || f.risk.level === riskFilter) &&
        (q === "" ||
          [f.id, f.srcIp, f.dstIp, String(f.srcPort), String(f.dstPort), f.protocol]
            .join(" ")
            .toLowerCase()
            .includes(q))
    );
  }, [flows, query, protocol, riskFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = sortValue(a, sortKey);
      const vb = sortValue(b, sortKey);
      const cmp =
        typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const resetFilters = () => {
    setQuery("");
    setProtocol("ALL");
    setRiskFilter("ALL");
    setPage(1);
  };

  const from = sorted.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, sorted.length);

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white shadow-[0_4px_24px_-4px_rgba(20,30,55,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(20,30,55,0.09)] overflow-hidden">
      {/* Header */}
      <header className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-linear-to-r from-slate-50/80 via-white to-slate-50/40 px-6 py-3">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-blue-600 shadow-xs shadow-blue-500/50" />
          <h2 className="font-display text-[15px] font-bold uppercase tracking-wider text-slate-800">
            Network Flows
          </h2>
          <span className="hidden font-mono text-xs text-slate-400 sm:inline">
            {"//"} Live Capture · Edge + Core Interfaces
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-slate-500">
            {sorted.length} / {flows.length} flows
          </span>
          <StatusBadge tone="safe" pulse>
            Streaming Live
          </StatusBadge>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-white px-6 py-4">
        {/* Search input pill */}
        <label className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by IP, port, protocol…"
            className="h-10 w-full rounded-full border border-slate-200/80 bg-slate-50/70 pl-10 pr-4 font-sans text-xs text-slate-800 placeholder:text-slate-400 transition-colors focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
        </label>

        {/* Protocol chips */}
        <div className="flex items-center gap-1.5" role="group" aria-label="Protocol filter">
          {PROTOCOLS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setProtocol(p);
                setPage(1);
              }}
              className={cn(
                "h-9 rounded-full px-3.5 font-mono text-xs font-bold transition-all duration-150 cursor-pointer",
                protocol === p
                  ? "bg-blue-600 text-white shadow-xs shadow-blue-500/25"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Risk filter */}
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden font-sans text-xs font-semibold text-slate-500 sm:inline">
            Risk:
          </span>
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value as (typeof RISK_OPTIONS)[number]);
              setPage(1);
            }}
            aria-label="Risk level filter"
            className="h-9 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-700 shadow-2xs hover:bg-slate-50 focus:border-blue-500 focus:outline-none"
          >
            {RISK_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r === "ALL" ? "All levels" : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1060px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="w-10 px-3 py-3" aria-label="Expand row" />
              {COLUMNS.map((col) => {
                const active = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                    className={cn("whitespace-nowrap px-3.5 py-3", col.align === "right" && "text-right", col.className)}
                  >
                    <button
                      type="button"
                      onClick={() => onSort(col.key)}
                      className={cn(
                        "inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer",
                        active ? "text-blue-600 font-extrabold" : "text-slate-400 hover:text-slate-700"
                      )}
                    >
                      {col.label}
                      {active ? (
                        sortDir === "asc" ? (
                          <ArrowUp size={12} strokeWidth={2.5} />
                        ) : (
                          <ArrowDown size={12} strokeWidth={2.5} />
                        )
                      ) : (
                        <ArrowUpDown size={11} className="opacity-40" />
                      )}
                    </button>
                  </th>
                );
              })}
              <th className="whitespace-nowrap px-3.5 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Risk
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/70 text-xs">
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={13} className="px-4 py-16">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Radar size={28} className="text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">No flows match the current filters.</p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Clear filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {pageRows.map((flow) => {
              const expanded = expandedId === flow.id;
              return (
                <Fragment key={flow.id}>
                  <tr
                    onClick={() => setExpandedId(expanded ? null : flow.id)}
                    className={cn(
                      "cursor-pointer transition-colors duration-150",
                      expanded ? "bg-blue-50/40" : "hover:bg-slate-50/80"
                    )}
                  >
                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        aria-label={expanded ? "Collapse flow details" : "Expand flow details"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(expanded ? null : flow.id);
                        }}
                        className="grid size-6 place-items-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all cursor-pointer"
                      >
                        <ChevronRight
                          size={14}
                          className={cn("transition-transform duration-200", expanded && "rotate-90")}
                        />
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 font-mono text-[11px] font-medium text-slate-500">
                      {flow.timestamp}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 font-mono text-xs font-bold text-slate-900">
                      {flow.srcIp}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 font-mono text-xs font-medium text-slate-700">
                      {flow.dstIp}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 text-right font-mono text-xs text-slate-500">
                      {portLabel(flow, "src")}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 text-right font-mono text-xs text-slate-500">
                      {portLabel(flow, "dst")}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3">
                      <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[10px]", PROTO_CHIP[flow.protocol])}>
                        {flow.protocol}
                      </span>
                    </td>
                    <td className="hidden whitespace-nowrap px-3.5 py-3 text-right font-mono text-xs text-slate-600 md:table-cell">
                      {fmtDuration(flow.durationSec)}
                    </td>
                    <td className="hidden whitespace-nowrap px-3.5 py-3 text-right font-mono text-xs text-slate-600 lg:table-cell">
                      {fmt(flow.packets)}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 text-right font-mono text-xs font-medium text-slate-800">
                      {fmt(flow.bytes)}
                    </td>
                    <td className="hidden whitespace-nowrap px-3.5 py-3 text-right font-mono text-xs text-slate-600 xl:table-cell">
                      {fmtPps(flow.pps)}
                    </td>
                    <td className="hidden whitespace-nowrap px-3.5 py-3 text-right font-mono text-xs text-slate-600 xl:table-cell">
                      {fmtBps(flow.bps)}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3">
                      <RiskLevelBadge level={flow.risk.level} size="sm" />
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expanded && (
                    <tr className="border-b border-slate-100 bg-blue-50/20">
                      <td colSpan={13} className="px-6 py-5">
                        <div className="grid gap-5 lg:grid-cols-3 animate-enter">
                          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Risk Assessment
                            </div>
                            <div className="mt-2.5 flex items-center justify-between">
                              <RiskLevelBadge level={flow.risk.level} size="sm" />
                              <span className="font-display font-extrabold text-base text-slate-900">
                                {flow.risk.score} / 100
                              </span>
                            </div>
                            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={cn("h-full rounded-full transition-all duration-500", RISK_BAR[flow.risk.level])}
                                style={{ width: `${flow.risk.score}%` }}
                              />
                            </div>
                            <dl className="mt-4 space-y-2 font-mono text-[11px]">
                              <div className="flex justify-between">
                                <dt className="text-slate-400">Origin:</dt>
                                <dd className="font-bold text-slate-700">{flow.origin}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-slate-400">Interface:</dt>
                                <dd className="font-bold text-slate-700">{flow.iface}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-slate-400">Detector:</dt>
                                <dd className="font-bold text-slate-700">{flow.detector}</dd>
                              </div>
                            </dl>
                          </div>

                          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm lg:col-span-2">
                            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Anomaly Indicators
                            </div>
                            <div className="mt-2.5 flex flex-wrap gap-2">
                              {flow.flags.length === 0 ? (
                                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-[10px] font-bold uppercase text-emerald-700">
                                  Consistent with baseline
                                </span>
                              ) : (
                                flow.flags.map((flag) => (
                                  <span
                                    key={flag}
                                    className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 font-mono text-[10px] font-bold uppercase text-amber-700"
                                  >
                                    {flag}
                                  </span>
                                ))
                              )}
                            </div>
                            <div className="mt-3.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Analyst Notes
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600">{flow.notes}</p>
                            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
                              <Link
                                to="/risk-analysis"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
                              >
                                Open Risk Analysis <ChevronRight size={13} />
                              </Link>
                              <Link
                                to="/alerts"
                                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                View Related Alerts
                              </Link>
                              <span className="ml-auto font-mono text-[10.5px] text-slate-400">
                                {flow.id} · Captured {flow.capturedAt}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-3.5">
        <span className="font-sans text-xs font-semibold text-slate-500">
          Showing {from}–{to} of {sorted.length} flows
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous page"
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
            className="grid size-8 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`Page ${n}`}
              onClick={() => setPage(n)}
              className={cn(
                "grid size-8 place-items-center rounded-xl font-mono text-xs font-bold transition-all cursor-pointer",
                n === safePage
                  ? "bg-blue-600 text-white shadow-xs shadow-blue-500/25"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs"
              )}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={safePage === pageCount}
            onClick={() => setPage(safePage + 1)}
            className="grid size-8 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </footer>
    </section>
  );
}
