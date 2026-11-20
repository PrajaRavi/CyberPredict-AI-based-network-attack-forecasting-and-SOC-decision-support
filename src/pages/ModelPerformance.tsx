import { FlaskConical, Gauge, Info } from "lucide-react";
import { AlarmTimeCard } from "../components/metrics/AlarmTimeCard";
import { CompareBarChart } from "../components/metrics/CompareBarChart";
import { ConfusionMatrix } from "../components/metrics/ConfusionMatrix";
import { LeadTimePanel } from "../components/metrics/LeadTimePanel";
import { MetricCard } from "../components/metrics/MetricCard";
import { VersionTrendChart } from "../components/metrics/VersionTrendChart";
import { StatusBadge } from "../components/ui/Badge";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import {
  alarmTimes,
  confusionMatrix,
  leadTime,
  methodology,
  metricCards,
  metricComparison,
  operationalImpact,
  versionTrend,
} from "../data/mockMetrics.js";

export default function ModelPerformancePage() {
  const fa = operationalImpact.falseAlarmsPerDay;
  const faReduction = Math.round((1 - fa.cyberpredict / fa.baseline) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Gauge}
        eyebrow="Module MLO-06 · Model telemetry"
        title="Model Performance"
        description="Comprehensive evaluation of the AI forecasting ensemble against a static-threshold baseline — headline metrics, early lead time, and detection counts."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="neutral">Ensemble v2.4.1</StatusBadge>
            <StatusBadge tone="safe">Evaluation Verified</StatusBadge>
          </div>
        }
      />

      {/* Demo-data disclosure alert card */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-linear-to-r from-blue-50/70 via-indigo-50/40 to-white p-4 shadow-2xs">
        <FlaskConical size={18} className="mt-0.5 shrink-0 text-blue-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-blue-700">
            Research Evaluation Protocol
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{methodology.disclaimer}</p>
        </div>
        <StatusBadge tone="pulse" className="hidden shrink-0 sm:inline-flex">
          Benchmark v2.4
        </StatusBadge>
      </div>

      {/* Hero — forecast lead time */}
      <section aria-label="Forecast lead time" className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <LeadTimePanel data={leadTime} />
        <div className="flex flex-col gap-4">
          {alarmTimes.map((t) => (
            <AlarmTimeCard key={t.id} data={t} />
          ))}
          <article className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50/80 via-teal-50/50 to-white p-5 text-center shadow-xs">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Mean Early Warning Gain
            </div>
            <div className="mt-2 font-display text-[36px] sm:text-[40px] font-extrabold leading-none tabular-nums text-emerald-600 drop-shadow-2xs">
              −{leadTime.average.leadMin}
              <span className="ml-1 font-sans text-sm font-bold text-emerald-600">min</span>
            </div>
            <div className="mt-2 font-sans text-xs font-semibold text-slate-500">
              {leadTime.average.factor} earlier warning vs static IDS
            </div>
          </article>
        </div>
      </section>

      {/* Headline metrics */}
      <section aria-label="Headline metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {metricCards.map((metric, i) => (
          <MetricCard key={metric.id} metric={metric} index={i} />
        ))}
      </section>

      {/* Comparison + version trend */}
      <section aria-label="Metric charts" className="grid gap-6 xl:grid-cols-2">
        <Panel title="Metric Comparison" code="CyberPredict v2.4 vs Baseline">
          <CompareBarChart data={metricComparison} />
        </Panel>
        <Panel title="Version Trend" code="v2.0 → v2.4 · Rolling Origin">
          <VersionTrendChart data={versionTrend} />
        </Panel>
      </section>

      {/* Detection counts, workload impact, methodology */}
      <section aria-label="Evaluation detail" className="grid gap-6 xl:grid-cols-3">
        <Panel title="Confusion Matrix" code="Detection Counts">
          <ConfusionMatrix data={confusionMatrix} />
        </Panel>

        <Panel title="Operational Impact" code="Analyst Workload">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  False Alarms Per Day
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-xs font-bold tabular-nums text-emerald-700">
                  −{faReduction}% Reduction
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-24 shrink-0 font-sans text-xs font-semibold text-slate-700">CyberPredict</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-700"
                      style={{ width: `${(fa.cyberpredict / fa.baseline) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-xs font-bold tabular-nums text-blue-600">
                    {fa.cyberpredict}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 shrink-0 font-sans text-xs font-semibold text-slate-500">Baseline</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-full rounded-full bg-slate-300 transition-all duration-700" />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-xs font-bold tabular-nums text-slate-500">
                    {fa.baseline}
                  </span>
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-2.5 border-t border-slate-100 pt-4 font-mono text-[11px]">
              {[
                ["Eval windows", operationalImpact.evalWindows],
                ["Detection horizon", operationalImpact.detectionHorizon],
                ["Scenarios", String(leadTime.scenarios.length)],
                ["Retrains", operationalImpact.retrainCadence],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3">
                  <dt className="uppercase font-bold text-[9px] tracking-wider text-slate-400">{k}</dt>
                  <dd className="mt-1 font-bold text-slate-800 text-xs">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Panel>

        <Panel title="Methodology & Data" code="Research Notes">
          <dl className="space-y-2.5 text-xs">
            {[
              ["Dataset", methodology.dataset],
              ["Protocol", methodology.protocol],
              ["Baseline", methodology.baseline],
              ["Alarm definition", methodology.alarmDefinition],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</dt>
                <dd className="mt-1 leading-relaxed text-slate-700 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/60 p-2.5 text-[11.5px] text-amber-800">
            <Info size={14} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />
            <p className="leading-relaxed">
              Figures represent standard research storyboard benchmarks for model validation.
            </p>
          </div>
        </Panel>
      </section>
    </div>
  );
}
