import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, ShieldCheck, LogOut, CheckCircle2, XCircle } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { checkAdminAccess, getAllCouncillorAccounts, setCouncillorApproval, type AdminCouncillorRow } from "@/lib/adminAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — CivicRewards" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type ViewState =
  | { kind: "checking" }
  | { kind: "signedOut" }
  | { kind: "notAdmin" }
  | { kind: "dashboard"; accessToken: string; accounts: AdminCouncillorRow[] };

async function loadAdminState(): Promise<ViewState> {
  if (!supabaseBrowser) return { kind: "signedOut" };
  const {
    data: { session },
  } = await supabaseBrowser.auth.getSession();
  if (!session) return { kind: "signedOut" };

  const { isAdmin } = await checkAdminAccess({ data: { accessToken: session.access_token } });
  if (!isAdmin) return { kind: "notAdmin" };

  const accounts = await getAllCouncillorAccounts({ data: { accessToken: session.access_token } });
  return { kind: "dashboard", accessToken: session.access_token, accounts };
}

export default function AdminPage() {
  const [view, setView] = useState<ViewState>({ kind: "checking" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    loadAdminState()
      .then(setView)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setView({ kind: "signedOut" });
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSignOut = async () => {
    await supabaseBrowser?.auth.signOut();
    setView({ kind: "signedOut" });
  };

  const handleSetApproval = async (row: AdminCouncillorRow, approved: boolean) => {
    if (view.kind !== "dashboard") return;
    setBusy(true);
    try {
      await setCouncillorApproval({
        data: { accessToken: view.accessToken, councillorUserId: row.userId, approved },
      });
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update approval");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-[#161b22] px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <p className="font-extrabold text-sm sm:text-base text-white">CivicRewards Admin</p>
          {view.kind === "dashboard" && (
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white border border-slate-700 transition"
            >
              <LogOut className="size-3.5" />
              Sign Out
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        {view.kind === "checking" && <p className="text-sm text-slate-400">Checking your session…</p>}

        {view.kind === "signedOut" && <AdminSignIn error={error} setError={setError} onAuthed={refresh} />}

        {view.kind === "notAdmin" && (
          <div className="mx-auto max-w-md rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-center">
            <ShieldAlert className="mx-auto size-8 text-red-400" />
            <h2 className="mt-3 font-extrabold text-lg text-white">No admin access</h2>
            <p className="mt-2 text-sm text-slate-300">
              This account isn't in the admin list. There's no self-service way to get admin access —
              contact whoever runs this platform directly.
            </p>
            <button
              onClick={handleSignOut}
              className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white border border-slate-700 transition"
            >
              Sign Out
            </button>
          </div>
        )}

        {view.kind === "dashboard" && (
          <AdminDashboard accounts={view.accounts} busy={busy} onSetApproval={handleSetApproval} error={error} />
        )}
      </main>
    </div>
  );
}

function AdminSignIn({
  error,
  setError,
  onAuthed,
}: {
  error: string | null;
  setError: (e: string | null) => void;
  onAuthed: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseBrowser) {
      setError("Admin sign-in is not configured");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({ email, password });
      if (signInError) throw new Error(signInError.message);
      onAuthed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center mb-6">
        <ShieldCheck className="mx-auto size-8 text-emerald-400" />
        <h1 className="mt-2 font-extrabold text-xl sm:text-2xl text-white">Admin Sign In</h1>
        <p className="mt-1 text-xs text-slate-400">
          Restricted to accounts explicitly granted admin access. No sign-up here.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-slate-800 bg-[#161b22] p-5 sm:p-6"
      >
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
          {busy ? "Please wait…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function AdminDashboard({
  accounts,
  busy,
  onSetApproval,
  error,
}: {
  accounts: AdminCouncillorRow[];
  busy: boolean;
  onSetApproval: (row: AdminCouncillorRow, approved: boolean) => void;
  error: string | null;
}) {
  const pending = accounts.filter((a) => !a.approved);
  const approved = accounts.filter((a) => a.approved);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-extrabold text-xl sm:text-2xl text-white">Councillor Accounts</h1>
        <p className="mt-1 text-xs text-slate-400">
          Every councillor account across every ward. Approving here is the only way an account gets
          dashboard access, this replaces flipping it by hand in the Supabase table editor.
        </p>
      </div>

      {error && <p className="text-xs font-semibold text-red-400">{error}</p>}

      <section>
        <h2 className="text-sm font-bold text-amber-400 mb-3">Pending approval ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-xs text-slate-500">Nothing waiting on you.</p>
        ) : (
          <div className="space-y-2">
            {pending.map((row) => (
              <AccountRow key={row.userId} row={row} busy={busy} onSetApproval={onSetApproval} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-bold text-emerald-400 mb-3">Approved ({approved.length})</h2>
        {approved.length === 0 ? (
          <p className="text-xs text-slate-500">No approved councillors yet.</p>
        ) : (
          <div className="space-y-2">
            {approved.map((row) => (
              <AccountRow key={row.userId} row={row} busy={busy} onSetApproval={onSetApproval} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AccountRow({
  row,
  busy,
  onSetApproval,
}: {
  row: AdminCouncillorRow;
  busy: boolean;
  onSetApproval: (row: AdminCouncillorRow, approved: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-[#161b22] px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white truncate">{row.fullName}</p>
        <p className="text-xs text-slate-400">
          Ward {row.wardNumber}
          {row.municipality ? ` · ${row.municipality}` : ""}
          {row.phone ? ` · ${row.phone}` : ""}
        </p>
        <p className="text-[11px] text-slate-500">
          {new Date(row.createdAt).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}
        </p>
      </div>
      <div className="shrink-0">
        {row.approved ? (
          <button
            onClick={() => onSetApproval(row, false)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-950/40 transition disabled:opacity-50"
          >
            <XCircle className="size-3.5" />
            Revoke
          </button>
        ) : (
          <button
            onClick={() => onSetApproval(row, true)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-950/40 transition disabled:opacity-50"
          >
            <CheckCircle2 className="size-3.5" />
            Approve
          </button>
        )}
      </div>
    </div>
  );
}
