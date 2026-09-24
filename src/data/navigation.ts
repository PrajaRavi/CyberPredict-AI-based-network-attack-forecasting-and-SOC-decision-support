/**
 * Sidebar navigation — derived from the module registry so nav,
 * routing and page metadata never drift apart.
 */
import type { LucideIcon } from "lucide-react";
import { MODULE_LIST, type ModuleId } from "./modules";

export interface NavBadge {
  label: string;
  tone: "crit" | "warn";
}

export interface NavItem {
  id: ModuleId;
  path: string;
  label: string;
  code: string;
  icon: LucideIcon;
  badge?: NavBadge;
}

const BADGES: Partial<Record<ModuleId, NavBadge>> = {
  alerts: { label: "12", tone: "crit" },
};

export const NAV_ITEMS: NavItem[] = MODULE_LIST.map((m) => ({
  id: m.id,
  path: m.path,
  label: m.title,
  code: m.code,
  icon: m.icon,
  badge: BADGES[m.id],
}));
