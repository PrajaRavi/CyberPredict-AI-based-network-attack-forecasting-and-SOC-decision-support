import React, { createContext, useContext, useMemo, useState } from "react";
import type { AlertItem } from "../components/alerts/AlertCard";
import { alerts as rawFixtures } from "../data/mockAlerts.js";

/**
 * Filter fixtures so initial state contains ONLY 'LOW' and 'MEDIUM' category alerts.
 * All CRITICAL and HIGH alerts are excluded until the user activates a critical alert.
 */
const BASELINE_ALERTS: AlertItem[] = (rawFixtures as AlertItem[])
  .filter((alert) => alert.severity === "LOW" || alert.severity === "MEDIUM")
  .map((alert) => ({
    ...alert,
    status: (alert.status as "Open" | "Acknowledged" | "Resolved" | "Investigating") || "Open",
    title: alert.message.split(":")[0]?.trim() || alert.vector,
    indicator: alert.vector === "Scan" ? "Port Sweep ↑" : alert.vector === "DNS" ? "DNS Query Spike" : "Flow Variation",
    deviation: "+18%",
  }));

interface AlertContextValue {
  alerts: AlertItem[];
  hasCriticalOrHigh: boolean;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  totalCount: number;
  resolvedCount: number;
  isBannerDismissed: boolean;
  latestActiveThreat: AlertItem | null;
  activateCriticalAlert: () => AlertItem;
  solveAlert: (id?: string) => void;
  solveAllThreats: () => void;
  acknowledgeAlert: (id: string) => void;
  resetToBaseline: () => void;
  dismissBanner: () => void;
  reopenBanner: () => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  // Initially contains ONLY LOW and MEDIUM alerts
  const [alerts, setAlerts] = useState<AlertItem[]>(() => [...BASELINE_ALERTS]);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [latestActiveThreat, setLatestActiveThreat] = useState<AlertItem | null>(null);

  const counts = useMemo(() => {
    let crit = 0;
    let high = 0;
    let med = 0;
    let low = 0;
    let openCritOrHigh = 0;
    let resolved = 0;

    for (const a of alerts) {
      if (a.status === "Resolved") {
        resolved += 1;
      }

      if (a.severity === "CRITICAL") {
        crit += 1;
        if (a.status !== "Resolved") openCritOrHigh += 1;
      } else if (a.severity === "HIGH") {
        high += 1;
        if (a.status !== "Resolved") openCritOrHigh += 1;
      } else if (a.severity === "MEDIUM") {
        med += 1;
      } else if (a.severity === "LOW") {
        low += 1;
      }
    }

    return {
      CRITICAL: crit,
      HIGH: high,
      MEDIUM: med,
      LOW: low,
      TOTAL: alerts.length,
      RESOLVED: resolved,
      hasCriticalOrHigh: openCritOrHigh > 0,
      openCriticalOrHighCount: openCritOrHigh,
    };
  }, [alerts]);

  /**
   * Activate / inject a new high-priority CRITICAL notification into the system.
   */
  const activateCriticalAlert = (): AlertItem => {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const newId = `ALT-${Math.floor(7840 + Math.random() * 50)}`;

    const newCriticalAlert: AlertItem = {
      id: newId,
      timestamp: `${timestamp}`,
      severity: "CRITICAL",
      vector: "DDoS forecast",
      title: "Volumetric DDoS Surge Prediction",
      message:
        "CRITICAL THREAT: Imminent volumetric DDoS pattern surge detected. High packet rate deviation (+210%) predicted to saturate edge gateway in 10–15 min.",
      recommendedAction:
        "IMMEDIATE ACTION REQUIRED: Deploy upstream edge scrubbing playbook, pre-position ingress rate limits on edge-01, and isolate affected source endpoints.",
      source: "192.168.1.45",
      target: "8.8.8.8 (edge-01)",
      status: "Open",
      indicator: "Packet Rate ↑ (+210%)",
      deviation: "+210%",
    };

    setAlerts((prev) => [newCriticalAlert, ...prev]);
    setLatestActiveThreat(newCriticalAlert);
    setIsBannerDismissed(false); // Re-open warning banner across whole dashboard
    return newCriticalAlert;
  };

  /**
   * Solve a specific alert by ID or all active critical alerts.
   * Marking them as 'Resolved' clears the critical threat condition.
   */
  const solveAlert = (id?: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (!id || a.id === id) {
          return { ...a, status: "Resolved" as const };
        }
        return a;
      })
    );
  };

  /**
   * Solves all active critical and high severity threats at once.
   */
  const solveAllThreats = () => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.severity === "CRITICAL" || a.severity === "HIGH"
          ? { ...a, status: "Resolved" as const }
          : a
      )
    );
  };

  /**
   * Acknowledge an alert without fully resolving it.
   */
  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Acknowledged" as const } : a))
    );
  };

  /**
   * Reset alerts back to initial baseline containing only LOW and MEDIUM alerts.
   */
  const resetToBaseline = () => {
    setAlerts([...BASELINE_ALERTS]);
    setLatestActiveThreat(null);
    setIsBannerDismissed(false);
  };

  const dismissBanner = () => {
    setIsBannerDismissed(true);
  };

  const reopenBanner = () => {
    setIsBannerDismissed(false);
  };

  const value: AlertContextValue = {
    alerts,
    hasCriticalOrHigh: counts.hasCriticalOrHigh,
    criticalCount: counts.CRITICAL,
    highCount: counts.HIGH,
    mediumCount: counts.MEDIUM,
    lowCount: counts.LOW,
    totalCount: counts.TOTAL,
    resolvedCount: counts.RESOLVED,
    isBannerDismissed,
    latestActiveThreat,
    activateCriticalAlert,
    solveAlert,
    solveAllThreats,
    acknowledgeAlert,
    resetToBaseline,
    dismissBanner,
    reopenBanner,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}

export function useAlerts(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }
  return ctx;
}
