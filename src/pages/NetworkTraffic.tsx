import { Network } from "lucide-react";
import { RiskLevelBadge } from "../components/dashboard/RiskLevelBadge";
import { ForecastStatTile } from "../components/forecast/ForecastStatTile";
import { TrafficTable } from "../components/traffic/TrafficTable";
import { StatusBadge } from "../components/ui/Badge";
import { PageHeader } from "../components/ui/PageHeader";
import { trafficFlows, trafficSummary } from "../data/mockTraffic.js";

export default function NetworkTrafficPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Network}
        eyebrow="Module NET-02 · Flow telemetry"
        title="Network Traffic"
        description="Captured flow telemetry across edge and core interfaces — search, filter by protocol/risk, and expand any flow for full anomaly indicators."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <RiskLevelBadge level="HIGH" />
            <StatusBadge tone="pulse" pulse>
              Live Capture Streaming
            </StatusBadge>
          </div>
        }
      />

      {/* Window summary stat cards with meaningful icons */}
      <section aria-label="Traffic summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {trafficSummary.map((stat, i) => (
          <ForecastStatTile key={stat.id} stat={stat} index={i} />
        ))}
      </section>

      {/* Flow table */}
      <TrafficTable flows={trafficFlows} />
    </div>
  );
}
