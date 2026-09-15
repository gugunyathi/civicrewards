import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Filter,
  Flame,
  Globe2,
  HelpCircle,
  Laptop,
  Layers,
  MapPin,
  Maximize2,
  Radio,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/councillor")({
  head: () => ({
    meta: [
      {
        title: "Councillor Signal Desk — CivicRewards Municipal Outage Intelligence",
      },
      {
        name: "description",
        content:
          "Institutional Smart City Intelligence platform for Ward Councillors across South African municipalities. Real-time outage triage, contractor SLAs, and citizen resolution tracking.",
      },
    ],
  }),
  component: CouncillorDashboardPage,
});

const COUNCILLOR_APP_URL = "https://signal-desk-municipal-councillor.vercel.app/dashboard";

export default function CouncillorDashboardPage() {
  const [selectedWard, setSelectedWard] = useState("Ward 115 (City of Joburg)");
  const [activeFilter, setActiveFilter] = useState("all");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [viewMode, setViewMode] = useState<"embedded" | "workspace">("workspace");

  const [triageItems, setTriageItems] = useState([
    {
      id: "SIG-8091",
      department: "Water & Sanitation",
      title: "Burst 250mm Water Trunk Main — Douglasdale & Leslie Ave",
      status: "Contractor Dispatched",
      slaTimeLeft: "2h 15m left (P1 Critical)",
      severity: "CRITICAL",
      residentCount: 42,
      contractor: "AquaTech Municipal Works",
      timeLogged: "45 mins ago",
    },
    {
      id: "SIG-8088",
      department: "Electricity & Power",
      title: "Medium Voltage Feeder Tripped — Witkoppen Substation Bay 4",
      status: "In Diagnostic Review",
      slaTimeLeft: "3h 40m left (P1 Critical)",
      severity: "CRITICAL",
      residentCount: 188,
      contractor: "City Power First Response",
      timeLogged: "1 hr ago",
    },
    {
      id: "SIG-8072",
      department: "Traffic & Streetlights",
      title: "Synchronized Signal Outage — William Nicol & Broadacres",
      status: "JMPD Pointsmen On-Site",
      slaTimeLeft: "4h 10m left (P2 Medium)",
      severity: "MEDIUM",
      residentCount: 19,
      contractor: "SignalCorp SA",
      timeLogged: "2.5 hrs ago",
    },
    {
      id: "SIG-8055",
      department: "Roads & Stormwater",
      title: "Hazardous Pothole Cluster near Primary School Entrance",
      status: "Scheduled for Asphalt Patch",
      slaTimeLeft: "18h left (P3 Standard)",
      severity: "STANDARD",
      residentCount: 31,
      contractor: "RoadWorks JHB",
      timeLogged: "5 hrs ago",
    },
  ]);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastMsg("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans">
      {/* Top Header & Context */}
      <header className="border-b border-slate-800 bg-[#161b22] px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-slate-700 hover:text-emerald-300 border border-slate-700 transition shadow-sm mr-1"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Back to Website Home</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="grid size-9 place-items-center rounded-xl bg-emerald-500 font-black text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
                CR
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-extrabold text-sm sm:text-base text-white">CivicRewards</p>
                  <span className="rounded bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Councillor Desk
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Municipal Intelligence & Signal Desk</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/ReportApp"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 transition"
            >
              <Smartphone className="size-3.5" />
              Resident App
            </Link>

            {/* Launch External Councillor App Link requested by user */}
            <a
              href={COUNCILLOR_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-emerald-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition"
            >
              <span>Open Signal Desk App</span>
              <ArrowUpRight className="size-3.5 sm:size-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Ward Overview & Quick Links Banner */}
        <div className="rounded-2xl border border-slate-800 bg-[#161b22] p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Radio className="size-3.5 animate-pulse" />
                <span>Live Municipal Outage Stream · Active Monitoring</span>
              </div>
              <h1 className="mt-1 font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Ward Councillor Signal Desk
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
                Real-time citizen reporting triangulation, automated municipal department dispatch,
                and contractor SLA monitoring for municipal leadership.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setViewMode("workspace")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "workspace"
                    ? "bg-slate-800 text-white border border-slate-700 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="size-3.5" />
                <span>Signal Overview</span>
              </button>
              <button
                onClick={() => setViewMode("embedded")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "embedded"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Laptop className="size-3.5" />
                <span>Embedded Web App</span>
              </button>
              <a
                href={COUNCILLOR_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition flex items-center gap-1.5 shrink-0"
              >
                <span>Launch in New Tab</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Embedded App Mode */}
        {viewMode === "embedded" ? (
          <div className="rounded-2xl border border-slate-800 bg-[#161b22] overflow-hidden shadow-2xl">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-emerald-400">{COUNCILLOR_APP_URL}</span>
              <a
                href={COUNCILLOR_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-300 hover:text-white font-semibold"
              >
                <Maximize2 className="size-3" />
                <span>Full screen</span>
              </a>
            </div>
            <div className="relative w-full h-[750px] bg-slate-950">
              <iframe
                src={COUNCILLOR_APP_URL}
                title="Municipal Councillor Signal Desk"
                className="w-full h-full border-0"
                allow="geolocation; camera; microphone"
              />
            </div>
          </div>
        ) : (
          /* Workspace Dashboard Overview */
          <div className="space-y-6">
            {/* Key Ward KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-[#161b22] p-4 sm:p-5">
                <p className="text-xs font-semibold text-slate-400">Active Ward Faults</p>
                <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">24 Active</p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <TrendingDown className="size-3.5" />
                  <span>-18% vs last week</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#161b22] p-4 sm:p-5">
                <p className="text-xs font-semibold text-slate-400">Contractor SLA Adherence</p>
                <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-400">92.4%</p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="size-3.5" />
                  <span>Target exceeded (85%)</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#161b22] p-4 sm:p-5">
                <p className="text-xs font-semibold text-slate-400">Resident Satisfaction</p>
                <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-amber-400">4.8 / 5.0</p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Based on 1,420 ratings</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#161b22] p-4 sm:p-5">
                <p className="text-xs font-semibold text-slate-400">Verified Citizen Reports</p>
                <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-cyan-400">388</p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-cyan-400 font-medium">
                  <span>46,560 Credits Awarded</span>
                </div>
              </div>
            </div>

            {/* Grid: Live Outage Triage Queue & Ward Broadcast Tool */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Triage Queue (8 cols) */}
              <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-[#161b22] p-5 sm:p-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-white">
                      Live Incident Triage & Contractor Dispatch
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Prioritized by AI verification, citizen report clustering, and infrastructure
                      severity
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                    4 Priority Incidents
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {triageItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-700"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                                item.severity === "CRITICAL"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : item.severity === "MEDIUM"
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {item.severity}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                              {item.department}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">{item.id}</span>
                          </div>
                          <h3 className="text-sm font-bold text-white mt-1.5">{item.title}</h3>
                        </div>

                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-900/50 shrink-0 self-start">
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-y-2 border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                        <div className="flex items-center gap-4">
                          <span className="text-amber-400 font-medium flex items-center gap-1">
                            <Clock className="size-3.5" />
                            {item.slaTimeLeft}
                          </span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <Users className="size-3.5 text-slate-400" />
                            {item.residentCount} Reports Triangulated
                          </span>
                        </div>
                        <span className="text-slate-400">
                          Contractor: <strong className="text-slate-200">{item.contractor}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Councillor Tools & Ward Broadcast (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Broadcast Outage Alert */}
                <div className="rounded-2xl border border-slate-800 bg-[#161b22] p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <Bell className="size-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Ward Resident Broadcast</h3>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Send verified outage alerts directly to registered Ward 115 residents on the
                    CivicRewards app.
                  </p>

                  <form onSubmit={handleBroadcast} className="mt-4 space-y-3">
                    <textarea
                      rows={3}
                      value={broadcastMsg}
                      onChange={(e) => setBroadcastMsg(e.target.value)}
                      placeholder="e.g. City Power technicians on-site at Witkoppen Substation. ETR 16:30. Water tankers positioned at Douglasdale Shopping Centre."
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />

                    {broadcastSent && (
                      <p className="text-xs font-bold text-emerald-400 animate-in fade-in">
                        ✓ Broadcast sent to 3,820 Ward 115 residents!
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition flex items-center justify-center gap-1.5"
                    >
                      <Send className="size-3.5" />
                      <span>Send Ward Notification</span>
                    </button>
                  </form>
                </div>

                {/* External App Launch Card */}
                <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-slate-900 p-5 text-white">
                  <h4 className="text-sm font-bold text-emerald-300">
                    Signal Desk Production Cloud
                  </h4>
                  <p className="mt-1 text-xs text-slate-300">
                    Access deep telemetry, GIS shapefiles, municipal contractor procurement
                    rankings, and SLA penalty adjudications.
                  </p>
                  <a
                    href={COUNCILLOR_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow"
                  >
                    <span>Launch Full Councillor App</span>
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
