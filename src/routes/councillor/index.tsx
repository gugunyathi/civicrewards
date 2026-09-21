import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LayoutGrid, Search, Smartphone } from "lucide-react";
import { TOP_MUNICIPALITIES, WARDS_BY_MUNICIPALITY, getPublicWardSummary } from "@/lib/wardDirectory";

export const Route = createFileRoute("/councillor/")({
  head: () => ({
    meta: [
      { title: "Councillor Directory — CivicRewards" },
      {
        name: "description",
        content: "Find your ward councillor across South Africa's largest municipalities.",
      },
    ],
  }),
  component: CouncillorDirectoryPage,
});

const ACCENT = "#C6FF3D";
const CARD = "#161b22";
const BORDER = "rgba(255,255,255,0.08)";

function CouncillorDirectoryPage() {
  const [selectedId, setSelectedId] = useState(TOP_MUNICIPALITIES[0]!.id);
  const [search, setSearch] = useState("");
  const [openCounts, setOpenCounts] = useState<Record<string, number | null>>({});

  const wards = WARDS_BY_MUNICIPALITY[selectedId] ?? [];
  const selected = TOP_MUNICIPALITIES.find((m) => m.id === selectedId)!;

  useEffect(() => {
    wards.forEach((w) => {
      if (openCounts[w.wardNumber] !== undefined) return;
      getPublicWardSummary({ data: { wardNumber: w.wardNumber } })
        .then((summary) => {
          setOpenCounts((prev) => ({ ...prev, [w.wardNumber]: summary?.openReportCount ?? null }));
        })
        .catch(() => {
          setOpenCounts((prev) => ({ ...prev, [w.wardNumber]: null }));
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const filteredWards = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return wards;
    return wards.filter(
      (w) =>
        w.wardNumber.toLowerCase().includes(q) ||
        w.regionName.toLowerCase().includes(q) ||
        (w.councillorName ?? "").toLowerCase().includes(q),
    );
  }, [wards, search]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-[#161b22] px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-slate-700 hover:text-emerald-300 border border-slate-700 transition shadow-sm"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Back to Website Home</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <p className="font-extrabold text-sm sm:text-base text-white">CivicRewards</p>
              <span className="rounded bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Councillor Directory
              </span>
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
            <Link
              to="/councillor/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
            >
              Councillor Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-6">
        {/* Left panel — Top 9 municipalities, ~25% width */}
        <aside className="md:w-[25%] shrink-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
            Municipalities
          </p>
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-1">
            {TOP_MUNICIPALITIES.map((m) => {
              const active = m.id === selectedId;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className="shrink-0 md:shrink text-left rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition whitespace-nowrap md:whitespace-normal"
                  style={{
                    background: active ? "rgba(198,255,61,0.1)" : "transparent",
                    border: `1px solid ${active ? ACCENT + "60" : BORDER}`,
                    color: active ? ACCENT : "rgba(226,232,240,0.7)",
                  }}
                >
                  {m.name}
                  {!m.connected && (
                    <span className="ml-1.5 text-[10px] font-normal text-slate-500">soon</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right panel — ward explorer, ~75% width */}
        <section className="flex-1 min-w-0">
          <div
            className="sticky top-[61px] z-30 -mx-1 px-1 pb-3 pt-1 flex flex-col sm:flex-row gap-2.5 sm:items-center"
            style={{ background: "#0d1117" }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Ward Number (e.g. Ward 115) or Councillor Name..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
            <button
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold shrink-0"
              style={{ background: "rgba(198,255,61,0.1)", border: `1px solid ${ACCENT}60`, color: ACCENT }}
            >
              <LayoutGrid className="size-3.5" />
              All Councillors by Ward
            </button>
          </div>

          <div className="mt-2">
            <h1 className="font-extrabold text-lg sm:text-xl text-white">{selected.name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              {wards.length === 0
                ? "This municipality isn't connected yet — check back soon."
                : `${filteredWards.length} of ${wards.length} ward${wards.length === 1 ? "" : "s"} shown.`}
            </p>
          </div>

          {wards.length === 0 ? (
            <div
              className="mt-5 rounded-2xl p-8 text-center"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            >
              <p className="text-sm text-slate-300 font-semibold">Not yet connected</p>
              <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto">
                We don't have real ward or councillor data for {selected.name} yet. City of
                Johannesburg's Ward 115 is live today — more municipalities are on our roadmap.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredWards.map((w) => (
                <Link
                  key={w.wardNumber}
                  to="/councillor/$wardNumber"
                  params={{ wardNumber: w.wardNumber }}
                  className="block rounded-2xl p-4 transition hover:border-emerald-400/40"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}
                >
                  <p className="text-sm font-bold text-white">
                    Ward {w.wardNumber} — {w.regionName}
                  </p>
                  <p className="text-xs mt-1" style={{ color: w.councillorName ? ACCENT : "rgba(226,232,240,0.4)" }}>
                    {w.councillorName ? `Cllr ${w.councillorName}` : "Unclaimed"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {w.residentEstimate && (
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                        {w.residentEstimate}
                      </span>
                    )}
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      {openCounts[w.wardNumber] == null ? "…" : `${openCounts[w.wardNumber]} Active Reports`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
