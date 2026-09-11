import { createFileRoute } from "@tanstack/react-router";
import heroClay from "@/assets/hero-clay.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CivicRewards Johannesburg — Fix Joburg. Reward Citizens. Grow Your Business." },
      {
        name: "description",
        content:
          "Partner with CivicRewards Johannesburg — the public service delivery rewards program turning active citizenship into local economic growth across the City of Johannesburg.",
      },
      { property: "og:title", content: "CivicRewards Johannesburg — Public Service Delivery Rewards" },
      {
        property: "og:description",
        content:
          "Become a partner, sponsor or advertiser and invest in the infrastructure, safety and commercial vitality of your municipal wards.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tracks = [
  {
    icon: "S",
    iconBg: "bg-brand",
    iconShadow: "shadow-[0_6px_0_oklch(0.475_0.094_162.9)]",
    label: "01 · Municipal Suppliers",
    labelColor: "text-brand-deep",
    cardBg: "bg-white",
    title: "Secure your tenders, meet your SLAs",
    bulletColor: "text-brand",
    bullets: [
      "Earn verifiable B-BBEE points under SED / ESD pillars",
      "Fix leaks & potholes before contract terms are breached",
      "Prove community commitment in your next bid",
    ],
    cta: "Sponsor the Reward Pool",
    ctaClass:
      "bg-brand text-white shadow-[0_5px_0_oklch(0.475_0.094_162.9)]",
  },
  {
    icon: "B",
    iconBg: "bg-accent-warm",
    iconShadow: "shadow-[0_6px_0_oklch(0.616_0.144_47.6)]",
    label: "02 · Local Ward Businesses",
    labelColor: "text-accent-deep",
    cardBg: "bg-sky",
    title: "Drive hyper-local footfall",
    bulletColor: "text-accent-deep",
    bullets: [
      "Zero upfront fees — only pay when a customer arrives",
      "Become your suburb's Community Champion",
      "Ward-locked targeting keeps it hyper-local",
    ],
    cta: "List Your Business Free",
    ctaClass:
      "bg-accent-warm text-white shadow-[0_5px_0_oklch(0.616_0.144_47.6)]",
  },
  {
    icon: "A",
    iconBg: "bg-gold",
    iconShadow: "shadow-[0_6px_0_oklch(0.72_0.12_80)]",
    label: "03 · Corporate Advertisers",
    labelColor: "text-gold-deep",
    cardBg: "bg-mint",
    title: "Reach high-intent audiences",
    bulletColor: "text-gold-deep",
    bullets: [
      "Target by province, metro or high-density wards",
      "Prime context for solar, security & insurance",
      "Seamlessly hit your ESG & governance targets",
    ],
    cta: "Book Ad Inventory",
    ctaClass: "bg-gold text-ink shadow-[0_5px_0_oklch(0.72_0.12_80)]",
  },
];

const awards = [
  {
    n: "1",
    bg: "bg-mint",
    badgeBg: "bg-brand text-white",
    badgeShadow: "shadow-[0_4px_0_oklch(0.475_0.094_162.9)]",
    title: "The Active Citizen Award",
    text: "Members who log, track & mobilise neighbours to protect local infrastructure.",
  },
  {
    n: "2",
    bg: "bg-sky",
    badgeBg: "bg-accent-warm text-white",
    badgeShadow: "shadow-[0_4px_0_oklch(0.616_0.144_47.6)]",
    title: "Outstanding Service Provider",
    text: "The contractor with the fastest, highest-quality repair turnaround.",
  },
  {
    n: "3",
    bg: "bg-gold/30",
    badgeBg: "bg-gold text-ink",
    badgeShadow: "shadow-[0_4px_0_oklch(0.72_0.12_80)]",
    title: "Premier Ward & Region Awards",
    text: "The most responsive, civically engaged wards across Regions A–G.",
  },
];

const tiers = [
  {
    name: "Local Retailer",
    labelColor: "text-brand-deep",
    price: "Free",
    cardBg: "bg-white",
    features: ["Ward-locked discount listing", "Local leaderboard visibility"],
    cta: "Sign Up Free",
    ctaClass:
      "bg-white text-brand-deep outline-2 outline-brand hover:bg-brand hover:text-white",
    popular: false,
  },
  {
    name: "Ward Sponsor",
    labelColor: "text-accent-deep",
    price: "R2,500",
    suffix: "/mo",
    cardBg: "bg-sky",
    features: ["Premium banner in 1 ward", "1× local award sponsorship"],
    cta: "Choose Tier",
    ctaClass:
      "bg-accent-warm text-white shadow-[0_5px_0_oklch(0.616_0.144_47.6)]",
    popular: false,
  },
  {
    name: "Regional Supplier",
    labelColor: "text-brand-deep",
    price: "R15,000",
    suffix: "/mo",
    cardBg: "bg-mint ring-2 ring-brand/30",
    features: [
      "Live fault-data for 1 region",
      "SED certificate",
      "Award category naming rights",
    ],
    cta: "Choose Tier",
    ctaClass: "bg-brand text-white shadow-[0_5px_0_oklch(0.475_0.094_162.9)]",
    popular: true,
  },
  {
    name: "Metro Corporate",
    labelColor: "text-gold-deep",
    price: "Custom Quote",
    smallPrice: true,
    cardBg: "bg-gold/30",
    features: ["City-wide ad inventory", "Annual Awards headline sponsor"],
    cta: "Contact Us",
    ctaClass: "bg-ink text-white shadow-[0_5px_0_oklch(0.24_0.02_220.5)]",
    popular: false,
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      {/* Nav */}
      <header className="mx-auto max-w-6xl px-5 pt-6">
        <div className="flex items-center justify-between rounded-3xl bg-white/70 px-5 py-3 shadow-[0_10px_30px_-15px_rgba(42,50,56,0.4)]">
          <a href="#" className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-brand font-display text-2xl font-extrabold text-white shadow-[0_6px_0_oklch(0.475_0.094_162.9)]">
              C
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-extrabold text-brand-deep">
                CivicRewards
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
                Johannesburg
              </p>
            </div>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-ink/70 md:flex">
            <a href="#tracks" className="transition hover:text-brand-deep">
              Partners
            </a>
            <a href="#awards" className="transition hover:text-brand-deep">
              Awards
            </a>
            <a href="#tiers" className="transition hover:text-brand-deep">
              Tiers
            </a>
          </nav>
          <a
            href="#tiers"
            className="rounded-2xl bg-accent-warm px-4 py-2.5 text-sm font-bold text-white shadow-[0_5px_0_oklch(0.616_0.144_47.6)] transition active:translate-y-0.5 active:shadow-none"
          >
            Become a Partner
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-12 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-mint px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-deep">
              Rewarding active citizenship
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-ink md:text-6xl">
              Fix Joburg.
              <br />
              <span className="text-brand-deep">Reward Citizens.</span>
              <br />
              <span className="text-accent-warm">Grow Your Business.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
              Partner with CivicRewards Johannesburg — the platform turning
              active citizenship into local economic growth, one ward at a
              time.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#tiers"
                className="rounded-2xl bg-brand px-7 py-4 font-display text-base font-bold text-white shadow-[0_6px_0_oklch(0.475_0.094_162.9)] transition active:translate-y-1 active:shadow-none"
              >
                Become a Partner Today
              </a>
              <a
                href="#tracks"
                className="rounded-2xl bg-white px-6 py-4 text-base font-bold text-ink/80 shadow-[0_6px_0_rgba(42,50,56,0.12)] transition active:translate-y-1 active:shadow-none"
              >
                Choose Your Track
              </a>
            </div>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="font-display text-3xl font-extrabold text-brand-deep">
                  12,400+
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  Faults resolved
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold text-accent-warm">
                  340
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  Partner retailers
                </p>
              </div>
            </div>
          </div>

          {/* Clay hero object */}
          <div className="relative">
            <div className="relative rounded-[2.5rem] bg-sky p-6 shadow-[0_25px_50px_-20px_rgba(42,50,56,0.35)]">
              <img
                src={heroClay}
                alt="Clay illustration of Johannesburg city blocks with a water tower and checkmark pin"
                width={1024}
                height={820}
                className="aspect-[5/4] w-full rounded-[1.8rem] bg-mint object-cover"
              />
              <div className="absolute -left-5 top-10 rounded-2xl bg-white px-4 py-3 shadow-[0_10px_25px_-12px_rgba(42,50,56,0.5)]">
                <p className="font-display text-xl font-extrabold text-accent-warm">
                  +120 pts
                </p>
                <p className="text-[11px] font-semibold text-ink/60">
                  Pothole fixed · Ward 12
                </p>
              </div>
              <div className="absolute -bottom-5 -right-3 rounded-2xl bg-gold px-4 py-3 shadow-[0_10px_25px_-12px_rgba(42,50,56,0.5)]">
                <p className="font-display text-sm font-extrabold text-ink">
                  Community Champion
                </p>
                <p className="text-[11px] font-semibold text-ink/70">
                  Soweto · Bronze Tier
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why partner band */}
      <section className="mx-auto max-w-6xl px-5 pb-6">
        <div className="overflow-hidden rounded-[2.5rem] bg-brand-deep px-7 py-10 text-white shadow-[0_25px_50px_-25px_rgba(31,107,78,0.7)] md:px-12">
          <h2 className="font-display text-2xl font-bold leading-snug md:text-3xl">
            Johannesburg moves when its people and businesses move together.
          </h2>
          <p className="mt-3 max-w-2xl text-white/70">
            You aren't just sponsoring an app — you're investing in the
            infrastructure, safety and commercial vitality of your local
            municipal wards.
          </p>
        </div>
      </section>

      {/* Partner tracks */}
      <section id="tracks" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14">
        <h2 className="text-center font-display text-3xl font-extrabold text-ink md:text-4xl">
          Partner in the way that fits you
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-ink/60">
          Three tracks, one shared mission: a cleaner, safer, more connected
          city.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tracks.map((t) => (
            <div
              key={t.label}
              className={`flex flex-col rounded-[2rem] p-7 shadow-clay ${t.cardBg}`}
            >
              <div
                className={`grid size-14 place-items-center rounded-2xl font-display text-2xl font-extrabold text-white ${t.iconBg} ${t.iconShadow} ${t.iconBg === "bg-gold" ? "text-ink" : ""}`}
              >
                {t.icon}
              </div>
              <p
                className={`mt-5 text-xs font-bold uppercase tracking-wide ${t.labelColor}`}
              >
                {t.label}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-ink">
                {t.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-ink/70">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className={t.bulletColor}>•</span>
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href="#tiers"
                className={`mt-6 rounded-2xl px-5 py-3 text-center text-sm font-bold transition active:translate-y-1 active:shadow-none ${t.ctaClass}`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section id="awards" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-14">
        <div className="overflow-hidden rounded-[2.5rem] bg-white p-7 shadow-clay-lg md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="md:w-1/3">
              <span className="inline-block rounded-full bg-gold/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-gold-deep">
                Awards Night
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-ink">
                Celebrating the champions keeping Joburg alive
              </h2>
              <p className="mt-3 text-ink/70">
                Annual &amp; quarterly prizes honour the citizens, suppliers
                and regions making the biggest difference — fully open for
                corporate sponsorship.
              </p>
              <a
                href="#tiers"
                className="mt-6 inline-block rounded-2xl bg-brand px-6 py-3.5 font-display text-sm font-bold text-white shadow-[0_6px_0_oklch(0.475_0.094_162.9)] transition active:translate-y-1 active:shadow-none"
              >
                Sponsor an Award Category
              </a>
            </div>
            <div className="space-y-4 md:w-2/3">
              {awards.map((a) => (
                <div
                  key={a.title}
                  className={`flex items-center gap-4 rounded-2xl px-5 py-4 ${a.bg}`}
                >
                  <div
                    className={`grid size-11 shrink-0 place-items-center rounded-xl font-display text-lg font-bold ${a.badgeBg} ${a.badgeShadow}`}
                  >
                    {a.n}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-ink">{a.title}</p>
                    <p className="text-sm text-ink/60">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-16">
        <h2 className="text-center font-display text-3xl font-extrabold text-ink md:text-4xl">
          Secure your spot
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-ink/60">
          Pick a tier, upload your branding assets and settle your partnership
          via our secure gateway.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-[1.8rem] p-6 shadow-clay ${t.cardBg}`}
            >
              {t.popular && (
                <span className="w-fit rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}
              <p
                className={`${t.popular ? "mt-3" : ""} text-xs font-bold uppercase tracking-wide ${t.labelColor}`}
              >
                {t.name}
              </p>
              <p
                className={`mt-1 font-display font-extrabold text-ink ${t.smallPrice ? "text-2xl leading-tight" : "text-3xl"}`}
              >
                {t.price}
                {t.suffix && (
                  <span className="text-base font-bold text-ink/50">
                    {t.suffix}
                  </span>
                )}
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-ink/70">
                {t.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <a
                href="#"
                className={`mt-6 rounded-2xl px-4 py-3 text-center text-sm font-bold transition active:translate-y-1 active:shadow-none ${t.ctaClass}`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-5 pb-10">
        <div className="flex flex-col items-center justify-between gap-4 rounded-[2rem] bg-brand-deep px-8 py-8 text-white md:flex-row">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-white/15 font-display text-xl font-extrabold">
              C
            </div>
            <div>
              <p className="font-display text-lg font-extrabold">
                CivicRewards Johannesburg
              </p>
              <p className="text-xs text-white/60">
                Fix Joburg. Reward Citizens. Grow Your Business.
              </p>
            </div>
          </div>
          <a
            href="#tiers"
            className="rounded-2xl bg-gold px-6 py-3.5 font-display text-sm font-bold text-ink shadow-[0_5px_0_oklch(0.72_0.12_80)] transition active:translate-y-1 active:shadow-none"
          >
            Become a Partner Today
          </a>
        </div>
      </footer>
    </div>
  );
}
