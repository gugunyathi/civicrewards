import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  LogOut,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import {
  syncCouncillorProfile,
  getCouncillorWardReports,
  type CouncillorProfile,
  type WardReportSummary,
} from "@/lib/councillorAuth";
import CouncillorDashboardV2 from "@/components/councillor/CouncillorDashboardV2";

function validateSearch(search: Record<string, unknown>): { ward?: string } {
  const ward = search["ward"];
  return typeof ward === "string" && ward.trim() ? { ward: ward.trim() } : {};
}

export const Route = createFileRoute("/councillor/dashboard")({
  validateSearch,
  head: () => ({
    meta: [
      {
        title: "Councillor Sign In — CivicRewards Ward Intelligence",
      },
      {
        name: "description",
        content: "Real-time ward report dashboard for South African municipal councillors.",
      },
    ],
  }),
  component: CouncillorPage,
});

type ViewState =
  | { kind: "checking" }
  | { kind: "signedOut"; mode: "login" | "signup" }
  | { kind: "pending"; profile: CouncillorProfile }
  | { kind: "dashboard"; profile: CouncillorProfile; reports: WardReportSummary[]; accessToken: string };

async function loadCouncillorState(): Promise<ViewState> {
  if (!supabaseBrowser) return { kind: "signedOut", mode: "login" };
  const {
    data: { session },
  } = await supabaseBrowser.auth.getSession();
  if (!session) return { kind: "signedOut", mode: "login" };

  const profile = await syncCouncillorProfile({ data: { accessToken: session.access_token } });
  if (!profile) return { kind: "signedOut", mode: "login" };
  if (!profile.approved) return { kind: "pending", profile };

  const reports = await getCouncillorWardReports({
    data: { accessToken: session.access_token },
  });
  return { kind: "dashboard", profile, reports, accessToken: session.access_token };
}

export default function CouncillorPage() {
  const { ward: wardFromClaim } = Route.useSearch();
  const [view, setView] = useState<ViewState>({ kind: "checking" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    loadCouncillorState()
      .then((next) => {
        // Arriving via a "Claim This Profile" link (?ward=115) means the
        // visitor wants to sign up for that ward, not sign in — default
        // straight to the sign-up form instead of making them click twice.
        if (next.kind === "signedOut" && wardFromClaim) {
          setView({ kind: "signedOut", mode: "signup" });
        } else {
          setView(next);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setView({ kind: "signedOut", mode: "login" });
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSignOut = async () => {
    await supabaseBrowser?.auth.signOut();
    setView({ kind: "signedOut", mode: "login" });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-[#161b22] px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-slate-700 hover:text-emerald-300 border border-slate-700 transition shadow-sm"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Back to Website Home</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-sm sm:text-base text-white">CivicRewards</p>
                <span className="rounded bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Councillor Desk
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/ReportApp"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 transition"
            >
              <Smartphone className="size-3.5" />
              Resident App
            </Link>
            {view.kind === "dashboard" || view.kind === "pending" ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white border border-slate-700 transition"
              >
                <LogOut className="size-3.5" />
                Sign Out
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main
        className={
          view.kind === "dashboard"
            ? "mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12"
            : "mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12"
        }
      >
        {view.kind === "checking" && (
          <p className="text-sm text-slate-400">Checking your session…</p>
        )}

        {view.kind === "signedOut" && (
          <AuthForms
            mode={view.mode}
            error={error}
            busy={busy}
            setBusy={setBusy}
            setError={setError}
            setMode={(mode) => setView({ kind: "signedOut", mode })}
            onAuthed={refresh}
            defaultWard={wardFromClaim}
          />
        )}

        {view.kind === "pending" && (
          <div className="mx-auto max-w-md rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 text-center">
            <Clock className="mx-auto size-8 text-amber-400" />
            <h2 className="mt-3 font-extrabold text-lg text-white">Account pending approval</h2>
            <p className="mt-2 text-sm text-slate-300">
              Thanks, {view.profile.fullName}. Your councillor account for Ward{" "}
              {view.profile.wardNumber} has been created but isn't approved yet. CivicRewards
              manually verifies every councillor account before granting dashboard access.
            </p>
          </div>
        )}

        {view.kind === "dashboard" && (
          <CouncillorDashboardV2
            profile={view.profile}
            reports={view.reports}
            accessToken={view.accessToken}
          />
        )}
      </main>
    </div>
  );
}

function AuthForms({
  mode,
  error,
  busy,
  setBusy,
  setError,
  setMode,
  onAuthed,
  defaultWard,
}: {
  mode: "login" | "signup";
  error: string | null;
  busy: boolean;
  setBusy: (b: boolean) => void;
  setError: (e: string | null) => void;
  setMode: (m: "login" | "signup") => void;
  onAuthed: () => void;
  defaultWard: string | undefined;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [wardNumber, setWardNumber] = useState(defaultWard ?? "115");
  const [signupSent, setSignupSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseBrowser) {
      setError("Councillor sign-in is not configured");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (mode === "login") {
        const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw new Error(signInError.message);
        onAuthed();
      } else {
        const { data, error: signUpError } = await supabaseBrowser.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, ward_number: wardNumber } },
        });
        if (signUpError) throw new Error(signUpError.message);
        if (data.session) {
          onAuthed();
        } else {
          setSignupSent(true);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  if (signupSent) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 text-center">
        <CheckCircle2 className="mx-auto size-8 text-emerald-400" />
        <h2 className="mt-3 font-extrabold text-lg text-white">Check your email</h2>
        <p className="mt-2 text-sm text-slate-300">
          Confirm your email, then come back and sign in. Your account will need manual approval
          before you can see ward data.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center mb-6">
        <ShieldCheck className="mx-auto size-8 text-emerald-400" />
        <h1 className="mt-2 font-extrabold text-xl sm:text-2xl text-white">
          {mode === "login" ? "Councillor Sign In" : "Councillor Sign Up"}
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Real ward report data, restricted to approved councillor accounts.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-slate-800 bg-[#161b22] p-5 sm:p-6"
      >
        {mode === "signup" && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Ward Number</label>
              <input
                type="text"
                required
                value={wardNumber}
                onChange={(e) => setWardNumber(e.target.value)}
                placeholder="e.g. 115"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Only Ward 115 has real report data connected today. Other wards can sign up but
                won't see report data yet.
              </p>
            </div>
          </>
        )}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
        </div>

        {error && <p className="text-xs font-semibold text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition disabled:opacity-50"
        >
          {busy ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setMode(mode === "login" ? "signup" : "login");
          }}
          className="w-full text-center text-xs text-slate-400 hover:text-emerald-400 transition"
        >
          {mode === "login"
            ? "New councillor? Create an account"
            : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}

