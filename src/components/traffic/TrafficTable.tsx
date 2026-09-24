import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Radar,
  Search,
} from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";
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
  TCP: "border-pulse-500/25 bg-pulse-500/[0.08] text-pulse-400",
  UDP: "border-signal-500/30 bg-signal-500/10 text-signal-400",
  ICMP: "border-line-bright bg-ink-750/60 text-mist-400",
};

const RISK_BAR: Record<FlowRiskLevel, string> = {
  LOW: "bg-safe-500",
  MEDIUM: "bg-warn-500",
  HIGH: "bg-crit-500",
  CRITICAL: "bg-crit-400",
};

const fmt = (n: number) => n.toLocaleString("en-US");
const fmtDuration = (s: number) => (s < 10 ? `${s.toFixed(1)}s` : `${Math.round(s)}s`);
const fmtPps = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(1));
const fmtBps = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)} MB/s` : n >= 1000 ? `${(n / 1000).toFixed(1)} KB/s` : `${n} B/s`;

/* Sort IPs as 32-bit integers so octets order correctly. */
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
            .includes(q)),
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
    <section className="rounded-lg border border-line bg-ink-800/60">
      {/* Card header */}
      <header className="flex min-h-11 flex-wrap items-center gap-2.5 border-b border-line px-4 py-2">
        <span aria-hidden className="size-1.5 shrink-0 rounded-xs bg-pulse-500/80" />
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-mist-400">
          Network flows
        </h2>
        <span className="hidden font-mono text-[10px] tracking-wider text-mist-600 sm:inline">
          {"//"} Live capture · edge + core
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[10px] tabular-nums text-mist-500">
            {sorted.length} / {flows.length} flows
          </span>
          <StatusBadge tone="pulse" pulse>
            Streaming
          </StatusBadge>
        </div>
      </header>

      {/* Toolbar: search + protocol chips + risk filter */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-line px-4 py-3">
        <label className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by IP, port, protocol…"
            className="h-9 w-full rounded-md border border-line bg-ink-850 pl-9 pr-3 font-mono text-[12px] text-mist-100 placeholder:font-sans placeholder:text-mist-600 transition-colors focus:border-pulse-500/50 focus:outline-none"
          />
        </label>

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
                "h-9 rounded-md border px-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] transition-colors duration-150",
                protocol === p
                  ? "border-pulse-500/40 bg-pulse-500/10 text-pulse-300"
                  : "border-line text-mist-400 hover:border-line-bright hover:text-mist-100",
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <label className="ml-auto flex items-center gap-2">
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-mist-600 sm:inline">
            Risk
          </span>
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value as (typeof RISK_OPTIONS)[number]);
              setPage(1);
            }}
            aria-label="Risk level filter"
            className="h-9 cursor-pointer rounded-md border border-line bg-ink-850 px-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mist-300 transition-colors focus:border-pulse-500/50 focus:outline-none"
          >
            {RISK_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r === "ALL" ? "All levels" : r}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1060px] border-collapse text-left">
          <caption className="sr-only">
            Captured network flows — searchable, filterable, sortable and paginated; expand a row for
            anomaly context
          </caption>
          <thead>
            <tr className="border-b border-line bg-ink-850/60">
              <th className="w-9 px-2 py-2.5" aria-label="Expand row" />
              {COLUMNS.map((col) => {
                const active = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                    className={cn("whitespace-nowrap px-3 py-2.5", col.align === "right" && "text-right", col.className)}
                  >
                    <button
                      type="button"
                      onClick={() => onSort(col.key)}
                      className={cn(
                        "inline-flex items-center gap-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] transition-colors duration-150",
                        active ? "text-pulse-300" : "text-mist-500 hover:text-mist-200",
                      )}
                    >
                      {col.label}
                      {active ? (
                        sortDir === "asc" ? (
                          <ArrowUp size={11} aria-hidden />
                        ) : (
                          <ArrowDown size={11} aria-hidden />
                        )
                      ) : (
                        <ArrowUpDown size={11} className="opacity-40" aria-hidden />
                      )}
                    </button>
                  </th>
                );
              })}
              <th className="whitespace-nowrap px-3 py-2.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-mist-500">
                Risk
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={13} className="px-4 py-14">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Radar size={22} className="text-mist-600" aria-hidden />
                    <p className="text-[13px] text-mist-400">No flows match the current filters.</p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-md border border-pulse-500/40 bg-pulse-500/10 px-3 py-1.5 text-[12px] font-medium text-pulse-300 transition-colors hover:bg-pulse-500/20"
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
                      "cursor-pointer border-b border-line/60 transition-colors duration-150",
                      expanded ? "bg-pulse-500/5" : "hover:bg-white/2",
                    )}
                  >
                    <td className="px-2 py-2.5 text-center">
                      <button
                        type="button"
                        aria-label={expanded ? "Collapse flow details" : "Expand flow details"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(expanded ? null : flow.id);
                        }}
                        className="grid size-6 place-items-center rounded text-mist-500 transition-all duration-200 hover:bg-white/4 hover:text-pulse-400"
                      >
                        <ChevronRight size={14} className={cn("transition-transform duration-200", expanded && "rotate-90")} />
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] tabular-nums text-mist-300">
                      {flow.timestamp}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11.5px] text-mist-100">{flow.srcIp}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11.5px] text-mist-300">{flow.dstIp}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono text-[11px] tabular-nums text-mist-400">
                      {portLabel(flow, "src")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono text-[11px] tabular-nums text-mist-400">
                      {portLabel(flow, "dst")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <span
                        className={cn(
                          "rounded border px-1.5 py-0.5 font-mono text-[9.5px] font-medium uppercase tracking-widest",
                          PROTO_CHIP[flow.protocol],
                        )}
                      >
                        {flow.protocol}
                      </span>
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-2.5 text-right font-mono text-[11px] tabular-nums text-mist-300 md:table-cell">
                      {fmtDuration(flow.durationSec)}
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-2.5 text-right font-mono text-[11px] tabular-nums text-mist-300 lg:table-cell">
                      {fmt(flow.packets)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono text-[11px] tabular-nums text-mist-300">
                      {fmt(flow.bytes)}
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-2.5 text-right font-mono text-[11px] tabular-nums text-mist-300 xl:table-cell">
                      {fmtPps(flow.pps)}
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-2.5 text-right font-mono text-[11px] tabular-nums text-mist-300 xl:table-cell">
                      {fmtBps(flow.bps)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <RiskLevelBadge level={flow.risk.level} size="sm" />
                    </td>
                  </tr>

                  {/* Expanded flow details */}
                  {expanded && (
                    <tr className="border-b border-line/60 bg-ink-850/50">
                      <td colSpan={13} className="px-4 py-0">
                        <div className="animate-enter py-4 pl-2 pr-1 sm:pl-9">
                          <div className="grid gap-4 lg:grid-cols-3">
                            <div className="rounded-md border border-line bg-ink-850/70 p-3.5">
                              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist-600">
                                Risk assessment
                              </div>
                              <div className="mt-2.5 flex items-center gap-2.5">
                                <RiskLevelBadge level={flow.risk.level} size="sm" />
                                <span className="font-mono text-[11px] tabular-nums text-mist-300">
                                  {flow.risk.score} / 100
                                </span>
                              </div>
                              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink-700">
                                <div
                                  className={cn("h-full rounded-full transition-[width] duration-500", RISK_BAR[flow.risk.level])}
                                  style={{ width: `${flow.risk.score}%` }}
                                />
                              </div>
                              <dl className="mt-3.5 space-y-1.5 font-mono text-[10.5px]">
                                <div className="flex justify-between gap-3">
                                  <dt className="uppercase tracking-[0.12em] text-mist-600">Origin</dt>
                                  <dd className="text-right text-mist-300">{flow.origin}</dd>
                                </div>
                                <div className="flex justify-between gap-3">
                                  <dt className="uppercase tracking-[0.12em] text-mist-600">Interface</dt>
                                  <dd className="text-right text-mist-300">{flow.iface}</dd>
                                </div>
                                <div className="flex justify-between gap-3">
                                  <dt className="uppercase tracking-[0.12em] text-mist-600">Detector</dt>
                                  <dd className="text-right text-mist-300">{flow.detector}</dd>
                                </div>
                              </dl>
                            </div>

                            <div className="rounded-md border border-line bg-ink-850/70 p-3.5 lg:col-span-2">
                              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist-600">
                                Anomaly indicators
                              </div>
                              <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {flow.flags.length === 0 && (
                                  <span className="rounded border border-safe-500/25 bg-safe-500/8 px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-safe-400">
                                    Consistent with baseline
                                  </span>
                                )}
                                {flow.flags.map((flag) => (
                                  <span
                                    key={flag}
                                    className="rounded border border-warn-500/25 bg-warn-500/8 px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-warn-400"
                                  >
                                    {flag}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-3.5 font-mono text-[9px] uppercase tracking-[0.16em] text-mist-600">
                                Analyst notes
                              </div>
                              <p className="mt-1 text-[12px] leading-relaxed text-mist-400">{flow.notes}</p>
                              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line/60 pt-3.5">
                                <Link
                                  to="/risk-analysis"
                                  className="inline-flex items-center gap-1.5 rounded-md border border-pulse-500/40 bg-pulse-500/10 px-2.5 py-1.5 text-[11.5px] font-medium text-pulse-300 transition-colors hover:bg-pulse-500/20"
                                >
                                  Open Risk Analysis <ChevronRight size={12} aria-hidden />
                                </Link>
                                <Link
                                  to="/alerts"
                                  className="inline-flex items-center rounded-md border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-mist-400 transition-colors hover:border-line-bright hover:text-mist-100"
                                >
                                  Related alerts
                                </Link>
                                <span className="ml-auto font-mono text-[9.5px] tabular-nums text-mist-600">
                                  {flow.id} · captured {flow.capturedAt}
                                </span>
                              </div>
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
      <footer className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-3">
        <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.12em] text-mist-500">
          Showing {from}–{to} of {sorted.length} flows
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous page"
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
            className="grid size-8 place-items-center rounded-md border border-line text-mist-400 transition-colors hover:border-line-bright hover:text-mist-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`Page ${n}`}
              aria-current={n === safePage ? "page" : undefined}
              onClick={() => setPage(n)}
              className={cn(
                "grid size-8 place-items-center rounded-md border font-mono text-[11px] tabular-nums transition-colors duration-150",
                n === safePage
                  ? "border-pulse-500/40 bg-pulse-500/10 text-pulse-300"
                  : "border-line text-mist-400 hover:border-line-bright hover:text-mist-100",
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
            className="grid size-8 place-items-center rounded-md border border-line text-mist-400 transition-colors hover:border-line-bright hover:text-mist-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </footer>
    </section>
  );
}
