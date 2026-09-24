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
    <div className="space-y-5">
      <PageHeader
        icon={Gauge}
        eyebrow="Module MLO-06 · Model telemetry"
        title="Model Performance"
        description="Research-style evaluation of the forecasting ensemble against a static-threshold baseline — headline metrics, alarm lead time, version trends and detection counts."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="neutral">Ensemble v2.4.1</StatusBadge>
            <StatusBadge tone="pulse">Demo metrics</StatusBadge>
          </div>
        }
      />

      {/* Demo-data disclosure */}
      <div className="flex items-start gap-3 rounded-lg border border-pulse-500/25 bg-pulse-500/[0.06] px-4 py-3">
        <FlaskConical size={16} className="mt-0.5 shrink-0 text-pulse-400" aria-hidden />
        <div>
          <div className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-pulse-400">
            Demo evaluation data
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-mist-400">{methodology.disclaimer}</p>
        </div>
        <StatusBadge tone="pulse" className="ml-auto hidden shrink-0 sm:inline-flex">
          Mock · Not production
        </StatusBadge>
      </div>

      {/* Hero — forecast lead time */}
      <section aria-label="Forecast lead time" className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <LeadTimePanel data={leadTime} />
        <div className="flex flex-col gap-4">
          {alarmTimes.map((t) => (
            <AlarmTimeCard key={t.id} data={t} />
          ))}
          <article className="flex flex-1 flex-col items-center justify-center rounded-lg border border-safe-500/30 bg-safe-500/[0.07] p-4 text-center">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-safe-400/80">
              Mean lead time gained
            </div>
            <div className="mt-2 font-display text-[34px] font-bold leading-none tabular-nums text-safe-400">
              −{leadTime.average.leadMin}
              <span className="ml-1.5 font-mono text-[12px] font-medium text-safe-400/70">min</span>
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mist-400">
              {leadTime.average.factor} earlier alarm vs baseline
            </div>
          </article>
        </div>
      </section>

      {/* Headline metrics */}
      <section aria-label="Headline metrics" className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metricCards.map((metric, i) => (
          <MetricCard key={metric.id} metric={metric} index={i} />
        ))}
      </section>

      {/* Comparison + version trend */}
      <section aria-label="Metric charts" className="grid gap-4 xl:grid-cols-2">
        <Panel title="Metric comparison" code="CyberPredict v2.4 vs baseline">
          <CompareBarChart data={metricComparison} />
        </Panel>
        <Panel title="Version trend" code="v2.0 → v2.4 · rolling origin">
          <VersionTrendChart data={versionTrend} />
        </Panel>
      </section>

      {/* Detection counts, workload impact, methodology */}
      <section aria-label="Evaluation detail" className="grid gap-4 xl:grid-cols-3">
        <Panel title="Confusion matrix" code="Detection counts">
          <ConfusionMatrix data={confusionMatrix} />
        </Panel>

        <Panel title="Operational impact" code="Analyst workload">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-mist-600">
                  False alarms per day
                </span>
                <span className="rounded border border-safe-500/25 bg-safe-500/10 px-1.5 py-0.5 font-mono text-[9px] font-medium tabular-nums text-safe-400">
                  −{faReduction}%
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-24 shrink-0 font-mono text-[10px] text-mist-400">CyberPredict</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
                    <div
                      className="h-full rounded-full bg-pulse-500 transition-[width] duration-700"
                      style={{ width: `${(fa.cyberpredict / fa.baseline) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-pulse-400">
                    {fa.cyberpredict}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 shrink-0 font-mono text-[10px] text-mist-400">Baseline</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
                    <div className="h-full w-full rounded-full bg-[#4A5C7C] transition-[width] duration-700" />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-mist-300">
                    {fa.baseline}
                  </span>
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-2.5 border-t border-line/60 pt-4 font-mono text-[10px]">
              {[
                ["Eval windows", operationalImpact.evalWindows],
                ["Detection horizon", operationalImpact.detectionHorizon],
                ["Demo scenarios", String(leadTime.scenarios.length)],
                ["Retrains", operationalImpact.retrainCadence],
              ].map(([k, v]) => (
                <div key={k} className="rounded-md border border-line bg-ink-850/60 px-3 py-2.5">
                  <dt className="uppercase tracking-[0.12em] text-mist-600">{k}</dt>
                  <dd className="mt-1 tabular-nums text-mist-200">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Panel>

        <Panel title="Methodology & data" code="Research notes">
          <dl className="space-y-2.5 font-mono text-[10.5px]">
            {[
              ["Dataset", methodology.dataset],
              ["Protocol", methodology.protocol],
              ["Baseline", methodology.baseline],
              ["Alarm definition", methodology.alarmDefinition],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-line/60 pb-2.5 last:border-0 last:pb-0">
                <dt className="uppercase tracking-[0.14em] text-mist-600">{k}</dt>
                <dd className="mt-1 leading-relaxed text-mist-300">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-start gap-2 rounded-md border border-warn-500/20 bg-warn-500/[0.06] px-3 py-2.5">
            <Info size={13} className="mt-0.5 shrink-0 text-warn-400" aria-hidden />
            <p className="text-[11px] leading-relaxed text-mist-400">
              Figures on this page are demonstration fixtures for evaluation-storyboard purposes only.
            </p>
          </div>
        </Panel>
      </section>
    </div>
  );
}
