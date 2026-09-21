import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { CouncillorProfile, WardGroupLink, WardReportSummary } from "@/lib/councillorAuth";
import {
  hasRealReference,
  getWardGroupLinks,
  saveWardGroupLink,
  deactivateWardGroupLink,
} from "@/lib/councillorAuth";
import { wardStatusToBucket, CATEGORY_COLORS } from "@/lib/wardReportUtils";
import MetricTile from "./MetricTile";
import CategoryIcon from "./CategoryIcon";
import WardMap from "./WardMap";
import { Ban, Info, Pencil, X, CheckCircle, AlertCircle } from "lucide-react";

const ACCENT = "#C6FF3D";
const CARD = "#0e0e0f";
const TEXT = "#f5f5f4";
const DIM = "rgba(245,245,244,0.45)";
const BORDER = "rgba(255,255,255,0.08)";

type Tab = "overview" | "reports" | "analytics" | "escalation" | "broadcast";

const NAV: Array<{ key: Tab; label: string; emoji: string }> = [
  { key: "overview", label: "Overview", emoji: "📊" },
  { key: "reports", label: "Reports", emoji: "📋" },
  { key: "analytics", label: "Analytics", emoji: "📈" },
  { key: "escalation", label: "Escalation Contacts", emoji: "📞" },
  { key: "broadcast", label: "Broadcast", emoji: "📢" },
];

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isOpen(r: WardReportSummary): boolean {
  return !["resolved", "closed", "ignored"].includes(r.status) && r.dismissedAt == null;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function CouncillorDashboardV2({
  profile,
  reports,
  accessToken,
}: {
  profile: CouncillorProfile;
  reports: WardReportSummary[];
  accessToken: string;
}) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="flex gap-6" style={{ minHeight: "70vh" }}>
      <aside className="hidden md:flex flex-col w-52 shrink-0" style={{ borderRight: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-3 pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(198,255,61,0.1)",
              border: `1px solid ${ACCENT}40`,
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: ACCENT,
            }}
          >
            W{profile.wardNumber}
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight" style={{ color: TEXT }}>
              Ward {profile.wardNumber}
            </p>
            <p className="text-xs" style={{ color: DIM }}>
              {profile.fullName}
            </p>
          </div>
        </div>

        <nav className="flex-1 py-4">
          {NAV.map((item) => {
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className="w-full flex items-center gap-2.5 text-left"
                style={{
                  padding: active ? "9px 12px 9px 9px" : "9px 12px",
                  borderLeft: active ? `3px solid ${ACCENT}` : "3px solid transparent",
                  borderRadius: 9,
                  marginBottom: 2,
                  color: active ? ACCENT : "rgba(245,245,244,0.45)",
                  background: active ? "rgba(198,255,61,0.04)" : "transparent",
                  fontSize: 13,
                  fontWeight: active ? 500 : 400,
                }}
              >
                <span style={{ fontSize: 15 }}>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-3 flex items-center gap-2" style={{ borderTop: `1px solid ${BORDER}` }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#30D158", display: "inline-block", flexShrink: 0 }} />
          <p className="text-xs" style={{ color: "rgba(245,245,244,0.25)" }}>
            Signal Desk · Live
          </p>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex" style={{ background: "#0a0a0b", borderTop: `1px solid ${BORDER}` }}>
        {NAV.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium"
            style={{ color: tab === item.key ? ACCENT : "rgba(245,245,244,0.4)" }}
          >
            <span style={{ fontSize: 16 }}>{item.emoji}</span>
            <span className="text-[10px]">{item.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-0 pb-16 md:pb-0">
        {tab === "overview" && <OverviewTab reports={reports} />}
        {tab === "reports" && <ReportsTab reports={reports} />}
        {tab === "analytics" && <AnalyticsTab reports={reports} />}
        {tab === "escalation" && <EscalationTab accessToken={accessToken} />}
        {tab === "broadcast" && <BroadcastTab />}
      </div>
    </div>
  );
}

function OverviewTab({ reports }: { reports: WardReportSummary[] }) {
  const open = reports.filter(isOpen);
  const reportsToday = reports.filter((r) => isToday(r.createdAt)).length;
  const resolvedToday = reports.filter((r) => r.resolvedAt && isToday(r.resolvedAt)).length;
  const pendingCount = open.filter((r) => wardStatusToBucket(r.status) === "pending").length;

  const resolvedWithDuration = reports.filter((r) => r.resolvedAt);
  const avgResolutionHours =
    resolvedWithDuration.length > 0
      ? resolvedWithDuration.reduce(
          (sum, r) => sum + (new Date(r.resolvedAt as string).getTime() - new Date(r.createdAt).getTime()) / 3_600_000,
          0,
        ) / resolvedWithDuration.length
      : null;

  const nonDismissed = reports.filter((r) => r.dismissedAt == null);
  const withRef = nonDismissed.filter((r) => hasRealReference(r.referenceNumber)).length;
  const withoutRef = nonDismissed.filter((r) => !hasRealReference(r.referenceNumber)).length;
  const resolvedCount = reports.filter((r) => ["resolved", "closed"].includes(r.status) || r.resolvedAt).length;

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-xl font-bold" style={{ color: TEXT, letterSpacing: "-0.02em" }}>
          Ward Overview
        </h1>
        <p className="text-sm mt-1" style={{ color: DIM }}>
          {new Date().toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricTile label="Reports Today" value={reportsToday} accent="lime" />
        <MetricTile label="Pending Escalation" value={pendingCount} sublabel={pendingCount > 0 ? "Needs attention" : "All clear"} accent="amber" />
        <MetricTile label="Resolved Today" value={resolvedToday} accent="green" />
        <MetricTile label="Avg Resolution" value={avgResolutionHours != null ? `${Math.round(avgResolutionHours)}h` : "—"} accent="blue" />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}`, height: 420 }}>
        <WardMap reports={reports} />
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: DIM }}>
          Report Status
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <MetricTile label="With Reference" value={withRef} sublabel="Complete — dept ref received" accent="lime" />
          <MetricTile label="Without Reference" value={withoutRef} sublabel="Incomplete — needs follow-up" accent="amber" />
          <MetricTile label="Resolved" value={resolvedCount} sublabel="Closed or resolved" accent="green" />
        </div>
      </div>
    </div>
  );
}

type ColumnType = "with_ref" | "without_ref" | "generic" | "escalated";

function getColumn(r: WardReportSummary): ColumnType {
  if (r.status === "escalated") return "escalated";
  if (hasRealReference(r.referenceNumber)) return "with_ref";
  if (r.sourceStatus === "generic") return "generic";
  return "without_ref";
}

function ReportsTab({ reports }: { reports: WardReportSummary[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const open = reports.filter(isOpen);

  const columns: Array<{ key: ColumnType; title: string; items: WardReportSummary[] }> = [
    { key: "with_ref", title: "📋 With Reference", items: open.filter((r) => getColumn(r) === "with_ref") },
    { key: "without_ref", title: "⚠️ Without Reference", items: open.filter((r) => getColumn(r) === "without_ref") },
    { key: "generic", title: "📝 Generic", items: open.filter((r) => getColumn(r) === "generic") },
    { key: "escalated", title: "🚨 Escalated", items: open.filter((r) => getColumn(r) === "escalated") },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: TEXT, letterSpacing: "-0.02em" }}>
          Reports
        </h1>
        <p className="text-sm mt-1" style={{ color: DIM }}>
          Read-only view of live Ward report intake. Action tools (escalate, resolve, forward) are coming in a later phase.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => (
          <div key={col.key} style={{ minWidth: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: TEXT, fontWeight: 600, fontSize: 13 }}>{col.title}</span>
              <span
                style={{
                  background: ACCENT,
                  color: "#050505",
                  fontWeight: 700,
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 20,
                }}
              >
                {col.items.length}
              </span>
            </div>
            <div style={{ maxHeight: 560, overflowY: "auto" }} className="flex flex-col gap-2">
              {col.items.length === 0 ? (
                <div style={{ color: DIM, fontSize: 12, textAlign: "center", padding: "24px 0" }}>All clear ✅</div>
              ) : (
                col.items.map((r) => {
                  const isExpanded = expandedId === r.id;
                  const extRef = hasRealReference(r.referenceNumber) ? r.referenceNumber : null;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setExpandedId((prev) => (prev === r.id ? null : r.id))}
                      style={{
                        background: CARD,
                        border: `1px solid ${isExpanded ? ACCENT : BORDER}`,
                        borderRadius: 12,
                        padding: 12,
                        cursor: "pointer",
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        {extRef && <span style={{ color: ACCENT, fontWeight: 700, fontSize: 12 }}>{extRef}</span>}
                        <span style={{ color: TEXT, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <CategoryIcon category={r.category} size={12} /> {r.category}
                        </span>
                      </div>
                      {r.location && <div style={{ color: DIM, fontSize: 11 }}>📍 {r.location}</div>}
                      <div style={{ color: "rgba(245,245,244,0.28)", fontSize: 10, marginTop: 4 }}>{timeAgo(r.createdAt)}</div>

                      {isExpanded && (
                        <div style={{ marginTop: 10, borderTop: `1px solid ${BORDER}`, paddingTop: 10, fontSize: 11 }}>
                          <div style={{ color: TEXT, marginBottom: 6 }}>{r.description}</div>
                          <div style={{ color: DIM }}>Reporter: {r.reporterName ?? "—"}</div>
                          <div style={{ color: DIM }}>Suburb: {r.reporterSuburb ?? "—"}</div>
                          <div style={{ color: DIM }}>
                            Logged: {new Date(r.createdAt).toLocaleString("en-ZA")}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab({ reports }: { reports: WardReportSummary[] }) {
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    reports.forEach((r) => {
      map[r.category] = (map[r.category] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] ?? "#8899aa" }));
  }, [reports]);

  const byBucket = useMemo(() => {
    const map: Record<string, number> = { pending: 0, escalated: 0, resolved: 0, generic: 0 };
    reports.forEach((r) => {
      const bucket = wardStatusToBucket(r.status);
      map[bucket] = (map[bucket] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [reports]);

  const daily = useMemo(() => {
    const days: Array<{ date: string; count: number }> = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
      const count = reports.filter((r) => new Date(r.createdAt).toDateString() === d.toDateString()).length;
      days.push({ date: label, count });
    }
    return days;
  }, [reports]);

  const resolvedCount = reports.filter((r) => r.resolvedAt).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: TEXT, letterSpacing: "-0.02em" }}>
          Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: DIM }}>
          {reports.length} total reports · {resolvedCount} resolved
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: DIM }}>
            By Category
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {byCategory.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#050505", border: `1px solid ${BORDER}`, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: DIM }}>
            By Status
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byBucket}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(245,245,244,0.4)" fontSize={11} />
              <YAxis stroke="rgba(245,245,244,0.4)" fontSize={11} />
              <Tooltip contentStyle={{ background: "#050505", border: `1px solid ${BORDER}`, fontSize: 12 }} />
              <Bar dataKey="value" fill={ACCENT} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5 lg:col-span-2" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: DIM }}>
            Reports — Last 14 Days
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={daily}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(245,245,244,0.4)" fontSize={10} />
              <YAxis stroke="rgba(245,245,244,0.4)" fontSize={11} />
              <Tooltip contentStyle={{ background: "#050505", border: `1px solid ${BORDER}`, fontSize: 12 }} />
              <Bar dataKey="count" fill="#0A84FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const ESCALATION_CATEGORIES: Array<{ key: string; label: string; defaultLabel: string }> = [
  { key: "water", label: "Water", defaultLabel: "Joburg Water Depot 7" },
  { key: "roads", label: "Roads", defaultLabel: "JRA Depot 4 Fourways" },
  { key: "electricity", label: "Electricity", defaultLabel: "City Power Region E" },
  { key: "refuse", label: "Refuse", defaultLabel: "Pikitup Fourways" },
  { key: "safety", label: "Safety", defaultLabel: "JMPD Sector 7" },
  { key: "billing", label: "Billing", defaultLabel: "CoJ Revenue" },
  { key: "parks", label: "Parks", defaultLabel: "City Parks Fourways" },
  { key: "other", label: "Other", defaultLabel: "Municipality" },
];

type EditState = { category: string; label: string; linkValue: string; saving: boolean; error: string | null };
type Toast = { type: "success" | "error"; message: string };

function EscalationTab({ accessToken }: { accessToken: string }) {
  const [links, setLinks] = useState<WardGroupLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const reload = () => {
    setLoading(true);
    getWardGroupLinks({ data: { accessToken } })
      .then((data) => {
        setLinks(data);
        setLoadError(null);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Could not load contacts"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const linkByCategory = (key: string) => links.find((l) => l.category === key);

  function startEdit(category: string, existing?: WardGroupLink) {
    setEditing({ category, label: existing?.label ?? "", linkValue: existing?.linkValue ?? "", saving: false, error: null });
  }

  async function handleSave() {
    if (!editing) return;
    setEditing({ ...editing, saving: true, error: null });
    try {
      await saveWardGroupLink({
        data: { accessToken, category: editing.category, label: editing.label, linkValue: editing.linkValue },
      });
      setEditing(null);
      setToast({ type: "success", message: "Contact saved" });
      reload();
    } catch (err) {
      setEditing({ ...editing, saving: false, error: err instanceof Error ? err.message : "Could not save contact" });
    }
  }

  async function handleDelete(id: string) {
    try {
      await deactivateWardGroupLink({ data: { accessToken, id } });
      setToast({ type: "success", message: "Contact removed" });
      reload();
    } catch (err) {
      setToast({ type: "error", message: err instanceof Error ? err.message : "Could not remove contact" });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: TEXT, letterSpacing: "-0.02em" }}>
          Escalation Contacts
        </h1>
        <p className="text-sm mt-1" style={{ color: DIM }}>
          Register WhatsApp numbers for each service category.
        </p>
      </div>

      <div className="rounded-xl p-4 flex gap-3" style={{ background: "rgba(198,255,61,0.05)", border: `1px solid ${ACCENT}30` }}>
        <Info size={16} style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: "rgba(245,245,244,0.55)" }}>
          This directory stores contact numbers only. Sending escalations to these contacts is a separate feature
          and is not enabled yet.
        </p>
      </div>

      {toast && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
          style={{
            background: toast.type === "success" ? "rgba(198,255,61,0.12)" : "rgba(255,67,58,0.12)",
            border: `1px solid ${toast.type === "success" ? "rgba(198,255,61,0.25)" : "rgba(255,67,58,0.25)"}`,
            color: toast.type === "success" ? ACCENT : "#FF453A",
          }}
        >
          {toast.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.message}
        </div>
      )}

      {loadError && (
        <div className="rounded-xl p-4 text-xs" style={{ background: "rgba(255,67,58,0.08)", border: "1px solid rgba(255,67,58,0.25)", color: "#FF453A" }}>
          {loadError}
          {loadError.includes("Could not find the table") && (
            <p className="mt-1" style={{ color: "rgba(245,245,244,0.5)" }}>
              Run sql/2026-09-18-ward-group-links.sql in the Supabase SQL editor first.
            </p>
          )}
        </div>
      )}

      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: DIM, background: CARD }}>
            Loading…
          </div>
        ) : (
          ESCALATION_CATEGORIES.map((cat, idx) => {
            const existing = linkByCategory(cat.key);
            const isEditing = editing?.category === cat.key;
            const isLast = idx === ESCALATION_CATEGORIES.length - 1;
            return (
              <div key={cat.key}>
                <div
                  className="px-5 py-4 flex items-center gap-4"
                  style={{ background: CARD, borderBottom: isEditing || isLast ? "none" : `1px solid ${BORDER}` }}
                >
                  <div className="flex items-center gap-2.5 w-32 shrink-0">
                    <CategoryIcon category={cat.key} size={15} />
                    <span className="text-sm font-medium" style={{ color: TEXT }}>
                      {cat.label}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {existing ? (
                      <>
                        <p className="text-sm font-medium truncate" style={{ color: TEXT }}>
                          {existing.label}
                        </p>
                        <p className="text-xs truncate mt-0.5 font-mono" style={{ color: DIM }}>
                          {existing.linkValue}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs" style={{ color: "rgba(245,245,244,0.3)" }}>
                        Not set — e.g. {cat.defaultLabel}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    {existing ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: "rgba(198,255,61,0.1)", color: ACCENT }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                        Active
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: "rgba(255,255,255,0.05)", color: "rgba(245,245,244,0.35)" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(245,245,244,0.2)" }} />
                        Not set
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => (isEditing ? setEditing(null) : startEdit(cat.key, existing))}
                      className="p-2 rounded-lg"
                      style={{ color: isEditing ? "#FF453A" : "rgba(245,245,244,0.4)" }}
                    >
                      {isEditing ? <X size={14} /> : <Pencil size={14} />}
                    </button>
                    {existing && !isEditing && (
                      <button onClick={() => handleDelete(existing.id)} className="p-2 rounded-lg" style={{ color: "rgba(255,67,58,0.6)" }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {isEditing && editing && (
                  <div
                    className="px-5 py-4 flex flex-col gap-3"
                    style={{
                      background: "rgba(198,255,61,0.03)",
                      borderTop: `1px solid ${ACCENT}20`,
                      borderBottom: isLast ? "none" : `1px solid ${BORDER}`,
                    }}
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium" style={{ color: "rgba(245,245,244,0.55)" }}>
                        Label
                      </label>
                      <input
                        type="text"
                        value={editing.label}
                        onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                        placeholder={`e.g. ${cat.defaultLabel}`}
                        maxLength={50}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: "#050505", border: `1px solid ${BORDER}`, color: TEXT }}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium" style={{ color: "rgba(245,245,244,0.55)" }}>
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={editing.linkValue}
                        onChange={(e) => setEditing({ ...editing, linkValue: e.target.value })}
                        placeholder="27821234567"
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none font-mono"
                        style={{ background: "#050505", border: `1px solid ${BORDER}`, color: TEXT }}
                      />
                    </div>

                    {editing.error && (
                      <p className="text-xs" style={{ color: "#FF453A" }}>
                        {editing.error}
                      </p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setEditing(null)}
                        className="px-4 py-2 rounded-xl text-xs font-medium"
                        style={{ color: "rgba(245,245,244,0.45)", border: `1px solid ${BORDER}` }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={editing.saving}
                        className="px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-60"
                        style={{ background: ACCENT, color: "#0a0a0a" }}
                      >
                        {editing.saving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function BroadcastTab() {
  const [message, setMessage] = useState("");
  const MAX_CHARS = 1000;

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold" style={{ color: TEXT, letterSpacing: "-0.02em" }}>
          Broadcast
        </h1>
        <p className="text-sm mt-1" style={{ color: DIM }}>
          Send a message to Ward residents.
        </p>
      </div>

      <div className="rounded-xl p-4 flex gap-3" style={{ background: "rgba(255,159,10,0.06)", border: "1px solid rgba(255,159,10,0.2)" }}>
        <Ban size={16} style={{ color: "#FF9F0A", flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: "rgba(245,245,244,0.55)" }}>
          Broadcast is not enabled on CivicRewards yet — this is a preview of the composer only. No message can be
          sent from this screen.
        </p>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS + 50))}
        placeholder="Type your message…"
        rows={8}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none leading-relaxed"
        style={{ background: CARD, border: `1px solid ${BORDER}`, color: TEXT }}
      />
      <p className="text-xs text-right font-mono" style={{ color: DIM }}>
        {message.length} / {MAX_CHARS}
      </p>

      <button
        disabled
        className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed self-start"
        style={{ background: ACCENT, color: "#0a0a0a" }}
      >
        <Ban size={15} />
        Broadcast is currently unavailable
      </button>
    </div>
  );
}
