import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Compass,
  FileText,
  Flame,
  Gift,
  Heart,
  HelpCircle,
  Home,
  Layers,
  MapPin,
  Moon,
  Plus,
  RefreshCw,
  Send,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  Tag,
  ThumbsUp,
  Ticket,
  Upload,
  User,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { submitWardReport, type WardReportCategory } from "@/lib/submitWardReport";
import { createOtpSession, getOtpSessionStatus, verifyOtpCode } from "@/lib/reportOtp";

// Only set once Thami creates the bot via @BotFather and adds this env var
// (see TELEGRAM_BOT_TOKEN/TELEGRAM_WEBHOOK_SECRET from the community-
// channels feature) — until then this whole step stays invisible and
// submission works exactly as it did before, gated on consent alone. The
// moment it's configured, Telegram verification becomes a real, required
// gate automatically. WhatsApp OTP is parked pending a separate decision
// on which production number to send from and confirming real per-message
// cost — not built here at all.
const TELEGRAM_BOT_USERNAME = import.meta.env["VITE_TELEGRAM_BOT_USERNAME"] as string | undefined;

type OtpStepState =
  | { kind: "idle" }
  | { kind: "waitingForStart"; sessionToken: string }
  | { kind: "codeEntry"; sessionToken: string }
  | { kind: "verified"; sessionToken: string };

function TelegramOtpStep({
  isDark,
  onVerifiedChange,
}: {
  isDark: boolean;
  onVerifiedChange: (verified: boolean) => void;
}) {
  const [state, setState] = useState<OtpStepState>({ kind: "idle" });
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    onVerifiedChange(state.kind === "verified");
  }, [state.kind, onVerifiedChange]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startVerification = async () => {
    setError(null);
    setBusy(true);
    try {
      const { sessionToken } = await createOtpSession();
      setState({ kind: "waitingForStart", sessionToken });

      pollRef.current = setInterval(async () => {
        try {
          const status = await getOtpSessionStatus({ data: { sessionToken } });
          if (status.otpSent) {
            if (pollRef.current) clearInterval(pollRef.current);
            setState({ kind: "codeEntry", sessionToken });
          }
        } catch {
          // Transient poll failure — just try again next tick.
        }
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start verification");
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async () => {
    if (state.kind !== "codeEntry") return;
    setError(null);
    setBusy(true);
    try {
      await verifyOtpCode({ data: { sessionToken: state.sessionToken, code } });
      setState({ kind: "verified", sessionToken: state.sessionToken });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify code");
    } finally {
      setBusy(false);
    }
  };

  const startOver = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setState({ kind: "idle" });
    setCode("");
    setError(null);
  };

  const boxClass = `rounded-xl border px-3.5 py-3 text-xs ${
    isDark ? "border-zinc-800 bg-zinc-900/40 text-zinc-300" : "border-zinc-300 bg-zinc-50 text-zinc-700"
  }`;

  if (state.kind === "verified") {
    return (
      <div className={`${boxClass} flex items-center gap-2 text-emerald-400`}>
        <ShieldCheck className="size-4 shrink-0" />
        <span>Verified via Telegram — you can submit this report.</span>
      </div>
    );
  }

  return (
    <div className={boxClass}>
      <div className="flex items-center gap-2 font-semibold mb-1.5">
        <ShieldAlert className="size-4 shrink-0" />
        <span>Verify it's really you before submitting</span>
      </div>

      {state.kind === "idle" && (
        <>
          <p className="mb-2">
            We'll send a one-time code to your Telegram to confirm a real person is submitting this,
            not a bot.
          </p>
          <button
            type="button"
            onClick={startVerification}
            disabled={busy}
            className="rounded-lg bg-[#c4f224] px-3 py-1.5 text-xs font-bold text-black disabled:opacity-50"
          >
            {busy ? "Starting…" : "Verify via Telegram"}
          </button>
        </>
      )}

      {state.kind === "waitingForStart" && (
        <>
          <p className="mb-2">
            Open Telegram and tap Start to receive your code, then come back here.
          </p>
          <a
            href={`https://t.me/${TELEGRAM_BOT_USERNAME}?start=${state.sessionToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-[#c4f224] px-3 py-1.5 text-xs font-bold text-black"
          >
            Open Telegram
          </a>
          <p className="mt-2 text-[11px] opacity-70">Waiting for your code to arrive…</p>
        </>
      )}

      {state.kind === "codeEntry" && (
        <>
          <p className="mb-2">Enter the 6-digit code Telegram sent you.</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className={`w-28 rounded-lg border px-2.5 py-1.5 text-sm font-mono tracking-widest ${
                isDark ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "border-zinc-300 bg-white text-zinc-900"
              }`}
            />
            <button
              type="button"
              onClick={submitCode}
              disabled={busy || code.length !== 6}
              className="rounded-lg bg-[#c4f224] px-3 py-1.5 text-xs font-bold text-black disabled:opacity-50"
            >
              {busy ? "Checking…" : "Verify"}
            </button>
          </div>
        </>
      )}

      {(state.kind === "waitingForStart" || state.kind === "codeEntry") && (
        <button type="button" onClick={startOver} className="mt-2 text-[11px] underline opacity-70">
          Start over
        </button>
      )}

      {error && <p className="mt-2 text-[11px] font-semibold text-red-400">{error}</p>}
    </div>
  );
}

export const Route = createFileRoute("/ReportApp")({
  head: () => ({
    meta: [
      {
        title: "Report a Problem — CivicRewards Resident Reporting App (Ward 115)",
      },
      {
        name: "description",
        content:
          "Report public service outages, water leaks, potholes, and power failures in your ward and earn CivicCredits for verified reports.",
      },
    ],
  }),
  component: ReportAppPage,
});

const DEPARTMENTS: Array<{
  id: string;
  name: string;
  icon: string;
  example: string;
  category: WardReportCategory;
}> = [
  { id: "water", name: "Water & Sanitation", icon: "💧", example: "JWAPP-40128554", category: "water" },
  {
    id: "electricity",
    name: "Electricity & Power Outages",
    icon: "⚡",
    example: "CPWEB5012172",
    category: "electricity",
  },
  {
    id: "roads",
    name: "Roads & Stormwater / Potholes",
    icon: "🛣️",
    example: "JRA-778219",
    category: "roads",
  },
  {
    id: "streetlights",
    name: "Streetlights & Traffic Signals",
    icon: "💡",
    example: "CP-SL99321",
    category: "other",
  },
  {
    id: "waste",
    name: "Waste Management & Illegal Dumping",
    icon: "🗑️",
    example: "PIKIT-10294",
    category: "refuse",
  },
  { id: "parks", name: "Parks, Fallen Trees & Verges", icon: "🌳", example: "CPARK-4491", category: "other" },
  {
    id: "safety",
    name: "Metro Police & Public Safety Hazard",
    icon: "🛡️",
    example: "JMPD-88210",
    category: "safety",
  },
  {
    id: "health",
    name: "Environmental Health & Pollution",
    icon: "🏥",
    example: "EHD-33019",
    category: "other",
  },
];

// The real intake only accepts reports for Ward 115 today (the endpoint
// hardcodes wardNumber: '115' regardless of what's sent) — offering other
// wards here would silently misfile them. Kept as a visible, disabled list
// rather than removed outright so it's clear more wards are coming, not
// forgotten.
const WARDS = ["Ward 115 (Fourways / Witkoppen / Douglasdale)"];
const COMING_SOON_WARDS = [
  "Ward 102 (Bryanston / Randburg)",
  "Ward 90 (Sandton / Hyde Park / Craighall)",
  "Ward 117 (Rosebank / Parkhurst)",
  "Ward 58 (Johannesburg Central / Fordsburg)",
  "Ward 32 (Modderfontein / Greenstone)",
];

export default function ReportAppPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<
    "report" | "resolved" | "rewards" | "specials" | "profile"
  >("report");
  const [selectedWard, setSelectedWard] = useState("Ward 115 (Fourways / Witkoppen / Douglasdale)");
  const [showWardSelect, setShowWardSelect] = useState(false);

  // Form State
  const [department, setDepartment] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterSuburb, setReporterSuburb] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [description, setDescription] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpStepKey, setOtpStepKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<{
    reference: string | null;
    escalated: boolean;
    noReferenceExpected: boolean;
  } | null>(null);

  // User Balances & Stats
  const [credits, setCredits] = useState(340);
  const [claimedSpecials, setClaimedSpecials] = useState<string[]>([]);

  // Simulated Resolved list
  const [resolvedIssues] = useState([
    {
      id: "RES-9041",
      title: "Burst water main replaced on Leslie Ave & William Nicol",
      dept: "Water & Sanitation",
      reportedAgo: "Resolved 3 hours ago",
      turnaround: "Resolved in 4.5 hrs",
      reporter: "Nomsa M. (Ward 115)",
      creditsAwarded: 120,
      status: "Verified by 8 residents",
      photo:
        "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60",
    },
    {
      id: "RES-8820",
      title: "Traffic lights repaired at Witkoppen & Cedar Rd intersection",
      dept: "Traffic Signals",
      reportedAgo: "Resolved yesterday",
      turnaround: "Resolved in 6 hrs",
      reporter: "David K. (Ward 115)",
      creditsAwarded: 150,
      status: "Verified by City Power",
      photo:
        "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=60",
    },
    {
      id: "RES-8711",
      title: "Deep pothole cluster patched on Campbell Road",
      dept: "Roads & Stormwater",
      reportedAgo: "Resolved 2 days ago",
      turnaround: "Resolved in 24 hrs",
      reporter: "Sipho Z. (Ward 115)",
      creditsAwarded: 120,
      status: "Verified with before/after photos",
      photo:
        "https://images.unsplash.com/photo-1584463699042-3e2b2605e55b?w=600&auto=format&fit=crop&q=60",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (isEmergency) {
      setSubmitError(
        "Emergency reports need a photo, and photo upload isn't connected yet — for an emergency right now, please contact your ward channel directly.",
      );
      return;
    }
    const dept = DEPARTMENTS.find((d) => d.name === department);
    if (!dept) {
      alert("Please select a municipal department.");
      return;
    }
    if (!reporterName.trim() || !reporterSuburb.trim() || !locationText.trim() || !description.trim()) {
      alert("Please fill in your name, suburb, address, and description.");
      return;
    }
    if (!consentGiven) {
      alert("Please confirm you agree to share your details before submitting.");
      return;
    }
    if (TELEGRAM_BOT_USERNAME && !otpVerified) {
      alert("Please verify via Telegram before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitWardReport({
        data: {
          name: reporterName.trim(),
          address: locationText.trim(),
          suburb: reporterSuburb.trim(),
          category: dept.category,
          description: description.trim(),
          ...(refNumber.trim() ? { reference: refNumber.trim() } : {}),
        },
      });
      setSubmittedReport(result);
      // reset form
      setDepartment("");
      setReporterName("");
      setReporterSuburb("");
      setRefNumber("");
      setLocationText("");
      setDescription("");
      setHasPhoto(false);
      setConsentGiven(false);
      setOtpVerified(false);
      setOtpStepKey((k) => k + 1);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Report submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-200 font-sans ${
        isDark ? "bg-[#0c0e12] text-zinc-100" : "bg-[#f4f6f8] text-zinc-900"
      }`}
    >
      {/* Top Prototype Context Bar */}
      <header
        className={`border-b px-4 py-2.5 text-xs ${
          isDark
            ? "border-zinc-800/80 bg-zinc-950/80 text-zinc-400"
            : "border-zinc-200 bg-white/90 text-zinc-600"
        }`}
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                isDark
                  ? "bg-lime-400 text-black hover:bg-lime-300"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Website Home</span>
            </Link>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className={`hidden sm:inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                isDark ? "bg-zinc-800 text-lime-400" : "bg-zinc-100 text-emerald-700"
              }`}
            >
              Resident Portal (Ward 115)
            </span>
            <Link to="/councillor" className="text-zinc-400 hover:text-white transition text-xs">
              Councillor Desk ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container Mobile App Frame */}
      <main className="mx-auto max-w-xl px-4 py-6 sm:py-8">
        {/* App Top Bar */}
        <div className="flex items-center justify-between pb-3">
          <div>
            {/* Ward Selector */}
            <div className="relative inline-block">
              <button
                onClick={() => setShowWardSelect(!showWardSelect)}
                className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition ${
                  isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <span>WARD 115</span>
                <ChevronDown className="size-3.5" />
              </button>

              {showWardSelect && (
                <div
                  className={`absolute left-0 top-6 z-30 w-64 rounded-xl border p-2 shadow-2xl ${
                    isDark
                      ? "border-zinc-800 bg-zinc-900 text-zinc-200"
                      : "border-zinc-200 bg-white text-zinc-800"
                  }`}
                >
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Switch Municipal Ward
                  </p>
                  {WARDS.map((w) => (
                    <button
                      key={w}
                      onClick={() => {
                        setSelectedWard(w);
                        setShowWardSelect(false);
                      }}
                      className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                        selectedWard === w
                          ? isDark
                            ? "bg-lime-400/20 text-lime-400 font-bold"
                            : "bg-emerald-50 text-emerald-800 font-bold"
                          : isDark
                            ? "hover:bg-zinc-800"
                            : "hover:bg-zinc-100"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                  <p className="px-2 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Coming soon (not yet connected)
                  </p>
                  {COMING_SOON_WARDS.map((w) => (
                    <div
                      key={w}
                      title="Reports can only be submitted for Ward 115 right now"
                      className="w-full cursor-not-allowed rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-zinc-500"
                    >
                      {w}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <Link
                to="/"
                title="Back to CivicRewards Home"
                className={`p-1.5 rounded-lg border transition ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
                    : "border-zinc-300 bg-white text-zinc-700 hover:text-black hover:bg-zinc-100"
                }`}
              >
                <ArrowLeft className="size-4" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Report a Problem
              </h1>
            </div>
          </div>

          {/* Light / Dark Mode Switcher matching screenshot */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition ${
              isDark
                ? "border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {isDark ? (
              <>
                <Sun className="size-3.5 text-amber-400" />
                <span>Light mode</span>
              </>
            ) : (
              <>
                <Moon className="size-3.5 text-indigo-500" />
                <span>Dark mode</span>
              </>
            )}
          </button>
        </div>

        {/* Navigation Tabs Bar matching screenshot */}
        <nav
          className={`flex items-center border-b text-sm font-semibold mt-2 ${
            isDark ? "border-zinc-800/80" : "border-zinc-200"
          }`}
        >
          {(
            [
              { id: "report", label: "Report" },
              { id: "resolved", label: "Resolved" },
              { id: "rewards", label: `Rewards (${credits})` },
              { id: "specials", label: "Specials" },
              { id: "profile", label: "Profile" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-3 pt-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold transition ${
                  isActive
                    ? isDark
                      ? "text-lime-400 font-extrabold"
                      : "text-emerald-700 font-extrabold"
                    : isDark
                      ? "text-zinc-400 hover:text-zinc-200"
                      : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-t-full ${
                      isDark ? "bg-[#c4f224]" : "bg-emerald-600"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Tab 1: REPORT (Screenshot Form) */}
        {activeTab === "report" && (
          <div className="mt-5 space-y-4">
            {/* SPONSORED BY Banner matching screenshot */}
            <div>
              <p
                className={`text-[10px] font-extrabold uppercase tracking-widest ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                SPONSORED BY
              </p>
              <div
                className={`mt-1.5 flex items-center justify-between rounded-2xl border p-4 sm:p-5 shadow-sm transition ${
                  isDark ? "border-zinc-800/90 bg-zinc-900/60" : "border-zinc-200 bg-white"
                }`}
              >
                <div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight">
                    15% off on Tuesdays
                  </h3>
                  <p
                    className={`mt-0.5 text-xs font-semibold ${
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    120 credits · Fourways Mall Cafe
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (claimedSpecials.includes("tuesdays")) {
                      alert("You have already claimed this coupon! Check Rewards tab.");
                      return;
                    }
                    if (credits < 120) {
                      alert(
                        "You need 120 CivicCredits. Report an outage below to earn +120 points!",
                      );
                      return;
                    }
                    setCredits((c) => c - 120);
                    setClaimedSpecials((prev) => [...prev, "tuesdays"]);
                    alert("🎉 Offer Claimed! 15% discount code CR-TUES-15 saved to your Rewards.");
                  }}
                  className={`rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-extrabold transition active:scale-95 shadow-sm ${
                    claimedSpecials.includes("tuesdays")
                      ? "bg-zinc-700 text-zinc-300"
                      : "bg-[#c4f224] text-black hover:bg-lime-400"
                  }`}
                >
                  {claimedSpecials.includes("tuesdays") ? "Claimed ✓" : "Claim offer"}
                </button>
              </div>
            </div>

            {/* Emergency Alert Box matching screenshot */}
            <div
              onClick={() => setIsEmergency(!isEmergency)}
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                isEmergency
                  ? "border-red-500 bg-red-950/40 text-red-200 shadow-md ring-1 ring-red-500"
                  : isDark
                    ? "border-red-900/50 bg-[#1e1012] text-red-400 hover:border-red-800/80"
                    : "border-red-200 bg-red-50 text-red-700 hover:border-red-300"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg">🚨</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    Report an emergency (fallen tree, immediate danger) — no reference number
                    required
                  </p>
                  {isEmergency && (
                    <p className="mt-1 text-[11px] text-red-300">
                      ⚡ Emergency mode activated: Immediate high-priority dispatch to Ward 115
                      emergency services.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submission Success Notice */}
            {submittedReport && (
              <div
                className={`rounded-2xl border p-4 sm:p-5 animate-in fade-in zoom-in-95 duration-200 ${
                  isDark
                    ? "border-lime-500/50 bg-lime-950/30 text-lime-200"
                    : "border-emerald-300 bg-emerald-50 text-emerald-900"
                }`}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-lime-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-lime-400">Report Logged</h4>
                      <button
                        onClick={() => setSubmittedReport(null)}
                        className="text-xs opacity-60 hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed">
                      {submittedReport.reference ? (
                        <>
                          Reference{" "}
                          <strong className="font-mono text-white">
                            {submittedReport.reference}
                          </strong>{" "}
                          has been logged with the Ward 115 councillor.
                        </>
                      ) : submittedReport.noReferenceExpected ? (
                        "Logged and sent directly to the Ward 115 councillor — this category doesn't get a municipal reference number."
                      ) : (
                        "Logged, but not yet escalated — this department issues its own reference number once you've reported it with them directly. Add that reference here to escalate to the councillor."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {submitError && (
              <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-4 text-xs font-semibold text-red-300">
                {submitError}
              </div>
            )}

            {/* Report Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {/* Department Selector */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-300 mb-1.5">
                  Department <span className="text-lime-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required={!isEmergency}
                    className={`w-full appearance-none rounded-xl border px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 ${
                      isDark
                        ? "border-zinc-800 bg-zinc-900 text-zinc-100 focus:ring-lime-400 focus:border-lime-400"
                        : "border-zinc-300 bg-white text-zinc-900 focus:ring-emerald-500 focus:border-emerald-500"
                    }`}
                  >
                    <option value="">Select a department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.icon} {dept.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-3.5 size-4 text-zinc-400" />
                </div>
              </div>

              {/* Reporter Name + Suburb */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-zinc-300 mb-1.5">
                    Your Name <span className="text-lime-400">*</span>
                  </label>
                  <input
                    type="text"
                    required={!isEmergency}
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g. Sipho Ndlovu"
                    className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 ${
                      isDark
                        ? "border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus:ring-lime-400"
                        : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-emerald-500"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-zinc-300 mb-1.5">
                    Suburb <span className="text-lime-400">*</span>
                  </label>
                  <input
                    type="text"
                    required={!isEmergency}
                    value={reporterSuburb}
                    onChange={(e) => setReporterSuburb(e.target.value)}
                    placeholder="e.g. Douglasdale"
                    className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 ${
                      isDark
                        ? "border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus:ring-lime-400"
                        : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-emerald-500"
                    }`}
                  />
                </div>
              </div>

              {/* Municipal Reference Number */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-300 mb-1.5">
                  Municipal Reference Number
                </label>
                <input
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="Enter your ref number"
                  className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 ${
                    isDark
                      ? "border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus:ring-lime-400"
                      : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-emerald-500"
                  }`}
                />
                <p
                  className={`mt-1.5 text-[11px] sm:text-xs leading-relaxed ${
                    isDark ? "text-zinc-500" : "text-zinc-500"
                  }`}
                >
                  Only if you already logged this with the department yourself — leave blank
                  otherwise. Looks like CPWEB5012172 or JWAPP-40128554.
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-300 mb-1.5">
                  Street Address / Intersection / Landmark
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    placeholder="e.g. Corner of Witkoppen Rd & Leslie Ave"
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
                      isDark
                        ? "border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus:ring-lime-400"
                        : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-emerald-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLocationText(
                        "Corner of William Nicol Dr & Witkoppen Rd, Fourways (GPS: -26.0192, 28.0054)",
                      );
                    }}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold flex items-center gap-1 shrink-0 transition ${
                      isDark
                        ? "border-zinc-700 bg-zinc-800 text-lime-400 hover:bg-zinc-700"
                        : "border-zinc-300 bg-zinc-100 text-emerald-700 hover:bg-zinc-200"
                    }`}
                  >
                    <MapPin className="size-3.5" />
                    <span className="hidden sm:inline">Use GPS</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-300 mb-1.5">
                  Problem Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue (e.g. Water gushing across left lane, active for 6 hours, hazard to vehicles)"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
                    isDark
                      ? "border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus:ring-lime-400"
                      : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-emerald-500"
                  }`}
                />
              </div>

              {/* Photo Upload simulation */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-300 mb-1.5">
                  Photo Evidence (Earns +50 Bonus Credits)
                </label>
                <div
                  onClick={() => setHasPhoto(!hasPhoto)}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center transition ${
                    hasPhoto
                      ? isDark
                        ? "border-lime-500 bg-lime-950/20 text-lime-300"
                        : "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : isDark
                        ? "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 text-zinc-400"
                        : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 text-zinc-600"
                  }`}
                >
                  {hasPhoto ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold">
                      <CheckCircle2 className="size-4 text-lime-400" />
                      <span>Photo Attached (IMG_2026_OUTAGE.JPG) · Click to remove</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <Camera className="size-5 text-zinc-400" />
                      <p className="text-xs font-semibold">
                        Tap to attach photo or capture live fault
                      </p>
                      <p className="text-[10px] text-zinc-500">JPG, PNG up to 15MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* POPIA consent — required before this personal information
                  (name, address, suburb, description) can be sent on to the
                  ward councillor and municipal department via the real
                  submit-report endpoint. */}
              <label
                className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-xs cursor-pointer ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900/40 text-zinc-300"
                    : "border-zinc-300 bg-zinc-50 text-zinc-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-lime-400"
                />
                <span>
                  I agree that my name, address, suburb and this report's details will be shared with my ward
                  councillor and the relevant municipal department, so the issue can be followed up. CivicRewards
                  does not sell or use this information for anything else.
                </span>
              </label>

              {/* Telegram OTP — invisible and non-blocking until Thami sets
                  VITE_TELEGRAM_BOT_USERNAME (bot not created yet as of this
                  pass), so this can never accidentally break the live
                  report flow. Becomes a real required gate the moment
                  that's configured. */}
              {TELEGRAM_BOT_USERNAME && (
                <TelegramOtpStep key={otpStepKey} isDark={isDark} onVerifiedChange={setOtpVerified} />
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !consentGiven || (!!TELEGRAM_BOT_USERNAME && !otpVerified)}
                className="w-full rounded-2xl bg-[#c4f224] py-3.5 sm:py-4 font-display text-base font-extrabold text-black shadow-md transition hover:bg-lime-400 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="size-5 animate-spin" />
                    <span>Logging Report...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-5" />
                    <span>Submit Report to Ward 115</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: RESOLVED (Community Feed) */}
        {activeTab === "resolved" && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">
                Recently Resolved in {selectedWard.split(" ")[0]} {selectedWard.split(" ")[1]}
              </h2>
              <span className="text-xs text-lime-400 font-semibold">48 repairs this week</span>
            </div>

            {resolvedIssues.map((item) => (
              <div
                key={item.id}
                className={`overflow-hidden rounded-2xl border p-4 sm:p-5 transition ${
                  isDark ? "border-zinc-800 bg-zinc-900/70" : "border-zinc-200 bg-white shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block rounded-md bg-lime-400/20 px-2 py-0.5 text-[10px] font-bold text-lime-400 uppercase tracking-wide">
                      {item.dept}
                    </span>
                    <h3 className="mt-1.5 text-sm sm:text-base font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400 shrink-0">
                    Resolved ✓
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5 text-zinc-500" />
                    {item.turnaround}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="size-3.5 text-zinc-500" />
                    Reported by {item.reporter}
                  </span>
                  <span className="font-semibold text-lime-400">
                    +{item.creditsAwarded} credits paid
                  </span>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs text-zinc-400">
                  <span>{item.status}</span>
                  <button className="flex items-center gap-1 text-zinc-300 hover:text-white">
                    <ThumbsUp className="size-3.5" />
                    Verify Quality (Confirm)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: REWARDS (Wallet & Redemption) */}
        {activeTab === "rewards" && (
          <div className="mt-5 space-y-5">
            {/* Balance Card */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-900/60 to-zinc-900 border border-lime-500/30 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-lime-300">
                Your CivicCredits Balance
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#c4f224]">
                  {credits}
                </span>
                <span className="text-sm font-semibold text-zinc-300">
                  Credits ≈ R {(credits * 0.75).toFixed(2)} Value
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-300">
                Earned by reporting municipal outages, verifying community fixes, and rating
                contractor work.
              </p>
            </div>

            {/* Redeem Options */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Redeem at Partner Stores
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "Pick n Pay R50 Grocery Voucher", cost: 150, brand: "Groceries" },
                  { name: "Checkers R100 Fresh Food Pass", cost: 280, brand: "Groceries" },
                  { name: "Vodacom / MTN 2GB Data Token", cost: 100, brand: "Connectivity" },
                  { name: "Eskom / City Power R100 Units", cost: 250, brand: "Electricity" },
                  { name: "Ward 115 Community Fund Donation", cost: 50, brand: "Civic Impact" },
                  { name: "Uber / Bolt R50 Ride Voucher", cost: 140, brand: "Transport" },
                ].map((rew) => {
                  const canAfford = credits >= rew.cost;
                  return (
                    <div
                      key={rew.name}
                      className={`rounded-xl border p-3.5 flex flex-col justify-between ${
                        isDark ? "border-zinc-800 bg-zinc-900/80" : "border-zinc-200 bg-white"
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">
                          {rew.brand}
                        </span>
                        <h4 className="text-sm font-bold text-zinc-100 mt-0.5">{rew.name}</h4>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#c4f224]">
                          {rew.cost} Credits
                        </span>
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            setCredits((c) => c - rew.cost);
                            alert(`🎉 Redeemed ${rew.name}! Token code sent via SMS.`);
                          }}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                            canAfford
                              ? "bg-lime-400 text-black hover:bg-lime-300"
                              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                          }`}
                        >
                          {canAfford ? "Redeem" : "Need Credits"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: SPECIALS (Local Merchant Deals) */}
        {activeTab === "specials" && (
          <div className="mt-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              Ward 115 Merchant Partner Deals
            </h3>
            {[
              {
                title: "15% off on Tuesdays",
                store: "Fourways Mall Cafe",
                cost: 120,
                desc: "Valid on all breakfast and lunch menus every Tuesday for active reporters.",
              },
              {
                title: "Free Filter Coffee with Bakery Item",
                store: "Pineslopes Bakery",
                cost: 80,
                desc: "Show your CivicRewards app QR code to redeem.",
              },
              {
                title: "20% off Hardware & Plumbing Supplies",
                store: "Mica Hardware Douglasdale",
                cost: 160,
                desc: "For local community members fixing neighborhood infrastructure.",
              },
            ].map((deal) => (
              <div
                key={deal.title}
                className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isDark ? "border-zinc-800 bg-zinc-900/80" : "border-zinc-200 bg-white"
                }`}
              >
                <div>
                  <h4 className="text-base font-bold text-white">{deal.title}</h4>
                  <p className="text-xs font-semibold text-lime-400 mt-0.5">{deal.store}</p>
                  <p className="text-xs text-zinc-400 mt-1">{deal.desc}</p>
                </div>
                <button
                  onClick={() => alert(`🎉 Claimed deal at ${deal.store}!`)}
                  className="rounded-full bg-[#c4f224] px-5 py-2 text-xs font-bold text-black hover:bg-lime-400 shrink-0"
                >
                  Claim ({deal.cost} pts)
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: PROFILE (Citizen Badge & Stats) */}
        {activeTab === "profile" && (
          <div className="mt-5 space-y-5">
            <div
              className={`rounded-2xl border p-5 flex items-center gap-4 ${
                isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-white"
              }`}
            >
              <div className="grid size-14 place-items-center rounded-full bg-lime-400 font-extrabold text-xl text-black">
                SN
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Sipho Ndlovu</h3>
                <p className="text-xs text-zinc-400">Ward 115 Resident · Douglasdale</p>
                <span className="mt-1 inline-block rounded-full bg-lime-400/20 px-2.5 py-0.5 text-[10px] font-bold text-lime-400">
                  Active Citizen · Silver Tier
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div
                className={`rounded-xl border p-3 ${
                  isDark ? "border-zinc-800 bg-zinc-900/60" : "border-zinc-200 bg-white"
                }`}
              >
                <p className="text-xl font-black text-lime-400">14</p>
                <p className="text-[10px] uppercase font-bold text-zinc-400 mt-0.5">
                  Reports Logged
                </p>
              </div>
              <div
                className={`rounded-xl border p-3 ${
                  isDark ? "border-zinc-800 bg-zinc-900/60" : "border-zinc-200 bg-white"
                }`}
              >
                <p className="text-xl font-black text-emerald-400">12</p>
                <p className="text-[10px] uppercase font-bold text-zinc-400 mt-0.5">
                  Repairs Fixed
                </p>
              </div>
              <div
                className={`rounded-xl border p-3 ${
                  isDark ? "border-zinc-800 bg-zinc-900/60" : "border-zinc-200 bg-white"
                }`}
              >
                <p className="text-xl font-black text-amber-400">#3</p>
                <p className="text-[10px] uppercase font-bold text-zinc-400 mt-0.5">Ward Rank</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
