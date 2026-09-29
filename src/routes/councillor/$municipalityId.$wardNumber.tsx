import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Twitter,
} from "lucide-react";
import { getPublicWardSummary, getWardCommunityChannels, type PublicWardSummary, type WardCommunityChannel } from "@/lib/wardDirectory";

export const Route = createFileRoute("/councillor/$municipalityId/$wardNumber")({
  head: () => ({
    meta: [
      { title: "Ward Councillor — CivicRewards" },
      {
        name: "description",
        content: "Find your ward's councillor, live report activity, and community channels on CivicRewards.",
      },
    ],
  }),
  component: WardProfilePage,
});

const ACCENT = "#C6FF3D";
const CARD = "#161b22";
const BORDER = "rgba(255,255,255,0.08)";

const PLATFORM_ICON: Record<WardCommunityChannel["platform"], typeof MessageCircle> = {
  telegram: Send,
  whatsapp: MessageCircle,
  x: Twitter,
  facebook: Facebook,
};

const PLATFORM_LABEL: Record<WardCommunityChannel["platform"], string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  x: "X",
  facebook: "Facebook",
};

function WardProfilePage() {
  const { municipalityId, wardNumber } = Route.useParams();
  const [summary, setSummary] = useState<PublicWardSummary | null | "loading">("loading");
  const [channels, setChannels] = useState<WardCommunityChannel[]>([]);

  useEffect(() => {
    setSummary("loading");
    getPublicWardSummary({ data: { municipalityId, wardNumber } })
      .then(setSummary)
      .catch(() => setSummary(null));
    getWardCommunityChannels({ data: { wardNumber } })
      .then(setChannels)
      .catch(() => setChannels([]));
  }, [municipalityId, wardNumber]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-[#161b22] px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <Link
            to="/councillor"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-slate-700 hover:text-emerald-300 border border-slate-700 transition shadow-sm"
          >
            <ArrowLeft className="size-3.5" />
            Directory
          </Link>
          <p className="font-extrabold text-sm sm:text-base text-white">CivicRewards</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        {summary === "loading" && <p className="text-sm text-slate-400">Loading ward profile…</p>}

        {summary === null && (
          <div className="rounded-2xl p-8 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-sm font-semibold text-slate-200">We don't have this ward yet</p>
            <p className="text-xs text-slate-500 mt-1.5">
              Ward {wardNumber} isn't in our directory for that municipality.
            </p>
            <Link
              to="/councillor"
              className="inline-block mt-4 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
            >
              Back to Directory
            </Link>
          </div>
        )}

        {summary && summary !== "loading" && (
          <>
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex items-start gap-4">
                {summary.photoUrl ? (
                  <img
                    src={summary.photoUrl}
                    alt={summary.councillorName ?? "Councillor"}
                    className="size-16 sm:size-20 rounded-2xl object-cover shrink-0"
                    style={{ border: `1px solid ${BORDER}` }}
                  />
                ) : (
                  <div
                    className="size-16 sm:size-20 rounded-2xl shrink-0 flex items-center justify-center text-lg font-extrabold"
                    style={{ background: "rgba(198,255,61,0.08)", border: `1px solid ${ACCENT}30`, color: ACCENT }}
                  >
                    W{summary.wardNumber}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {summary.municipalityName}
                    </p>
                    {summary.party && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(226,232,240,0.75)", border: `1px solid ${BORDER}` }}
                      >
                        {summary.party}
                      </span>
                    )}
                  </div>
                  <h1 className="font-extrabold text-xl sm:text-2xl text-white mt-1">
                    Ward {summary.wardNumber} — {summary.regionName}
                  </h1>
                  <p className="text-sm mt-1" style={{ color: summary.councillorName ? ACCENT : "rgba(226,232,240,0.4)" }}>
                    {summary.councillorName ? `Cllr ${summary.councillorName}` : "Unclaimed profile"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {summary.residentEstimate && (
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                    {summary.residentEstimate}
                  </span>
                )}
                {summary.openReportCount != null && (
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                    {summary.openReportCount} Active Reports
                  </span>
                )}
              </div>

              {(summary.email || summary.whatsappNumber || summary.twitterHandle || summary.facebookUrl || summary.instagramHandle || summary.linkedinUrl) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                  {summary.email && (
                    <a
                      href={`mailto:${summary.email}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                    >
                      <Mail className="size-3.5" /> Email
                    </a>
                  )}
                  {summary.whatsappNumber && (
                    <a
                      href={`https://wa.me/${summary.whatsappNumber.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                    >
                      <Phone className="size-3.5" /> WhatsApp
                    </a>
                  )}
                  {summary.twitterHandle && (
                    <a
                      href={`https://x.com/${summary.twitterHandle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                    >
                      <Twitter className="size-3.5" /> X
                    </a>
                  )}
                  {summary.facebookUrl && (
                    <a
                      href={summary.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                    >
                      <Facebook className="size-3.5" /> Facebook
                    </a>
                  )}
                  {summary.instagramHandle && (
                    <a
                      href={`https://instagram.com/${summary.instagramHandle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                    >
                      <Instagram className="size-3.5" /> Instagram
                    </a>
                  )}
                  {summary.linkedinUrl && (
                    <a
                      href={summary.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                    >
                      <Linkedin className="size-3.5" /> LinkedIn
                    </a>
                  )}
                </div>
              )}

              <div className="mt-6">
                {summary.approved ? (
                  <Link
                    to="/councillor/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition"
                  >
                    <ShieldCheck className="size-4" />
                    Sign In to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/councillor/dashboard"
                    search={{ ward: summary.wardNumber, municipality: summary.municipalityId }}
                    className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold transition"
                    style={{ background: ACCENT, color: "#0a0a0a" }}
                  >
                    Claim This Profile
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Community Channels
              </h2>
              {channels.length === 0 ? (
                <p className="text-xs text-slate-500">No community channels linked yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {channels.map((c) => {
                    const Icon = PLATFORM_ICON[c.platform];
                    return (
                      <a
                        key={c.id}
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:border-emerald-400/40"
                        style={{ background: CARD, border: `1px solid ${BORDER}` }}
                      >
                        <Icon className="size-4 text-slate-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {c.label ?? PLATFORM_LABEL[c.platform]}
                          </p>
                          <p className="text-[11px] text-slate-500">{PLATFORM_LABEL[c.platform]}</p>
                        </div>
                        <ExternalLink className="size-3.5 text-slate-500 shrink-0" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
