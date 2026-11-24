/**
 * Sidebar navigation — derived from the module registry.
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

export const NAV_ITEMS: NavItem[] = MODULE_LIST.map((m) => ({
  id: m.id,
  path: m.path,
  label: m.title,
  code: m.code,
  icon: m.icon,
}));
