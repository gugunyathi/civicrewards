export type ReportBucket = "pending" | "escalated" | "resolved" | "generic";

// Ported from signal-desk-municipal-councillor/lib/supabase.ts — the single
// canonical raw-status → bucket mapping Mark's real dashboard uses for tiles
// and map pin colors. Kept identical so "the same standard as Mark" actually
// means the same numbers, not a plausible-looking reinvention.
const WARD_STATUS_TO_BUCKET: Record<string, ReportBucket> = {
  new: "pending",
  pending_approval: "pending",
  complete: "pending",
  incomplete: "pending",
  generic: "generic",
  allocated: "escalated",
  escalated: "escalated",
  in_progress: "escalated",
  ignored: "resolved",
  resolved: "resolved",
  closed: "resolved",
  reopened: "pending",
};

export function wardStatusToBucket(status: string): ReportBucket {
  return WARD_STATUS_TO_BUCKET[status] ?? "pending";
}

export const CATEGORY_COLORS: Record<string, string> = {
  water: "#0A84FF",
  roads: "#FF9F0A",
  electricity: "#FFD60A",
  city_power: "#FFD60A",
  eskom: "#FFD60A",
  refuse: "#30D158",
  safety: "#BF5AF2",
  billing: "#FF9F0A",
  parks: "#30D158",
  other: "#8899aa",
  emergency: "#FF453A",
};
