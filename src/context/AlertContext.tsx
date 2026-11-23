import React, { createContext, useContext, useMemo, useState } from "react";
import type { AlertItem } from "../components/alerts/AlertCard";
import { alerts as rawFixtures } from "../data/mockAlerts.js";

/**
 * Filter fixtures so initial state contains ONLY 'LOW' and 'MEDIUM' category alerts.
 * All CRITICAL and HIGH alerts are excluded until the user activates a critical alert.
 */
const BASELINE_ALERTS: AlertItem[] = (rawFixtures as AlertItem[]).filter(
  (alert) => alert.severity === "LOW" || alert.severity === "MEDIUM"
);

interface AlertContextValue {
  alerts: AlertItem[];
  hasCriticalOrHigh: boolean;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  totalCount: number;
  isBannerDismissed: boolean;
  activateCriticalAlert: () => AlertItem;
  resetToBaseline: () => void;
  dismissBanner: () => void;
  reopenBanner: () => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  // Initially contains ONLY LOW and MEDIUM alerts
  const [alerts, setAlerts] = useState<AlertItem[]>(() => [...BASELINE_ALERTS]);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  const counts = useMemo(() => {
    let crit = 0;
    let high = 0;
    let med = 0;
    let low = 0;

    for (const a of alerts) {
      if (a.severity === "CRITICAL") crit += 1;
      else if (a.severity === "HIGH") high += 1;
      else if (a.severity === "MEDIUM") med += 1;
      else if (a.severity === "LOW") low += 1;
    }

    return {
      CRITICAL: crit,
      HIGH: high,
      MEDIUM: med,
      LOW: low,
      TOTAL: alerts.length,
      hasCriticalOrHigh: crit > 0 || high > 0,
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

    const newId = `ALR-CRIT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCriticalAlert: AlertItem = {
      id: newId,
      timestamp: `${timestamp} UTC`,
      severity: "CRITICAL",
      vector: "DDoS forecast",
      message:
        "CRITICAL THREAT: Imminent volumetric DDoS pattern surge detected. Neural forecast predicts 96% attack likelihood with edge gateway saturation in 10–15 min.",
      recommendedAction:
        "IMMEDIATE ACTION REQUIRED: Deploy upstream edge scrubbing playbook, pre-position ingress rate limits on edge-01, and alert tier-3 SOC incident commander.",
      source: "172.16.88.0/24 cluster",
      target: "10.0.4.12:443 (edge-01)",
    };

    setAlerts((prev) => [newCriticalAlert, ...prev]);
    setIsBannerDismissed(false); // Re-open warning banner across whole dashboard
    return newCriticalAlert;
  };

  /**
   * Reset alerts back to initial baseline containing only LOW and MEDIUM alerts.
   */
  const resetToBaseline = () => {
    setAlerts([...BASELINE_ALERTS]);
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
    isBannerDismissed,
    activateCriticalAlert,
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
