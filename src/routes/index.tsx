import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Menu,
  X,
  Search,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Building2,
  Trophy,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  Scale,
  UserCheck,
  HardHat,
  SearchCheck,
  Cpu,
  Lock,
  Sliders,
  FileCheck2,
  Globe2,
} from "lucide-react";

import heroClay from "@/assets/hero-clay.jpg";
import joburgSkyline from "@/assets/joburg-skyline.jpg";
import saProvincesMap from "@/assets/images/sa_3d_clay_map_isolated_1789141534835.jpg";
import repairCrew from "@/assets/repair-crew.jpg";
import multilingualCivicUnity from "@/assets/images/multilingual_civic_unity_1789144566953.jpg";

const steps = [
  {
    n: "01",
    title: "Citizens report",
    text: "Residents log potholes, leaks, outages and illegal dumping straight from their phone, geo-tagged to their ward.",
  },
  {
    n: "02",
    title: "Suppliers respond",
    text: "Verified municipal contractors pick up the fault, resolve it and upload proof of repair within SLA.",
  },
  {
    n: "03",
    title: "Points are issued",
    text: "Reporters, verifiers and mobilisers earn CivicPoints the moment a repair is confirmed closed.",
  },
  {
    n: "04",
    title: "Local business wins",
    text: "Points are redeemed at partner retailers in the same ward, so every fix pushes money back into the suburb.",
  },
];

const culturalConcepts = [
  {
    languages: "Sesotho / Setswana / Sepedi",
    word: "Letsema",
    translation: "Let's volunteer together for the common good.",
    badgeBg: "bg-mint text-brand-deep",
    borderColor: "border-brand/20",
  },
  {
    languages: "isiZulu / isiXhosa",
    word: "iLima",
    translation: "Let's form a community work party to fix our area.",
    badgeBg: "bg-sky text-brand-deep",
    borderColor: "border-sky/40",
  },
  {
    languages: "Xitsonga",
    word: "Ndzima",
    translation: "Let's clear and work this piece of land together.",
    badgeBg: "bg-gold/40 text-ink",
    borderColor: "border-gold/50",
  },
  {
    languages: "Tshivenda",
    word: "Davha",
    translation: "Let's gather as a village to get the job done.",
    badgeBg: "bg-accent-warm/20 text-accent-deep",
    borderColor: "border-accent-warm/30",
  },
  {
    languages: "Afrikaans",
    word: "Saamtrek",
    translation: "Let's pull together as a neighborhood.",
    badgeBg: "bg-cream text-ink",
    borderColor: "border-ink/15",
  },
];

const regions = [
  {
    name: "City of Johannesburg",
    province: "Gauteng",
    area: "Gauteng · 187 Wards",
    wards: 187,
    live: true,
  },
  {
    name: "City of Cape Town",
    province: "Western Cape",
    area: "Western Cape · 116 Wards",
    wards: 116,
    live: true,
  },
  {
    name: "eThekwini Municipality",
    province: "KwaZulu-Natal",
    area: "KwaZulu-Natal · 111 Wards",
    wards: 111,
    live: true,
  },
  {
    name: "City of Tshwane",
    province: "Gauteng",
    area: "Gauteng · 107 Wards",
    wards: 107,
    live: true,
  },
  {
    name: "Ekurhuleni",
    province: "Gauteng",
    area: "Gauteng · 112 Wards",
    wards: 112,
    live: true,
  },
  {
    name: "Nelson Mandela Bay",
    province: "Eastern Cape",
    area: "Eastern Cape · 60 Wards",
    wards: 60,
    live: false,
  },
  {
    name: "Mangaung Municipality",
    province: "Free State",
    area: "Free State · 51 Wards",
    wards: 51,
    live: false,
  },
];

const impact = [
  { value: "48,200+", label: "Faults resolved", note: "Across South African metros" },
  { value: "R18.5m", label: "Spent at partner stores", note: "CivicPoints redeemed locally" },
  { value: "5.4 days", label: "Average repair time", note: "Down from 28 days" },
  { value: "91%", label: "Repeat active citizens", note: "Residents logging & verifying" },
];

const voices = [
  {
    quote:
      "Our SED spend finally has verifiable impact. We sponsored municipal ward reward pools and watched infrastructure turnaround drop dramatically.",
    name: "Thandi Mokoena",
    role: "Transformation Lead, national infrastructure supplier",
    bg: "bg-mint",
  },
  {
    quote:
      "Winning the Municipal Service Provider Excellence Award validated our engineering team's commitment to quality and timely municipal repairs.",
    name: "Sipho Khumalo",
    role: "Managing Director, Civics Engineering Group",
    bg: "bg-sky",
  },
  {
    quote:
      "Recognizing dedicated Ward Councillors for outstanding community representation bridges the trust gap between residents and local government.",
    name: "Cllr. Nomusa Dlamini",
    role: "Ward Councillor, eThekwini Municipality",
    bg: "bg-gold/30",
  },
];

const faqs = [
  {
    q: "Do partner payments go to the municipality?",
    a: "No. Partner and sponsor contributions fund the citizen reward pool, verification and platform operations. CivicRewards is an independent programme working alongside municipal channels across South Africa.",
  },
  {
    q: "How is a repair verified before points are paid?",
    a: "Every closed fault requires a before-and-after photo, GPS match, and a second resident confirmation in the same ward before CivicPoints are released.",
  },
  {
    q: "How are Municipal Service Providers evaluated for awards?",
    a: "Contractors are scored on repair speed within SLA, quality compliance, and resident satisfaction ratings logged directly through the platform.",
  },
  {
    q: "What do Ward Councillors receive recognition for?",
    a: "Ward councillors are nominated by residents and evaluated on community responsiveness, active fault mobilization, transparency, and collaborative problem-solving.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "CivicRewards South Africa — Fix South Africa. Reward Citizens. Grow Your Business.",
      },
      {
        name: "description",
        content:
          "Partner with CivicRewards South Africa — the national public service delivery rewards program turning active citizenship and municipal excellence into local economic growth across South Africa.",
      },
      {
        property: "og:title",
        content: "CivicRewards South Africa — Public Service Delivery Rewards",
      },
      {
        property: "og:description",
        content:
          "Reward active citizens, honour outstanding municipal service providers and exceptional ward councillors, and grow your business across South African municipalities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tracks = [
  {
    id: "suppliers",
    icon: "S",
    iconBg: "bg-brand",
    iconShadow: "shadow-[0_6px_0_oklch(0.475_0.094_162.9)]",
    label: "01 · Municipal Suppliers",
    labelColor: "text-brand-deep",
    cardBg: "bg-white",
    title: "Secure tenders & win service excellence awards",
    bulletColor: "text-brand",
    bullets: [
      "Earn B-BBEE points under SED / ESD pillars",
      "Qualify for the annual Service Provider Excellence Awards",
      "Fix infrastructure before contract terms are breached",
    ],
    cta: "Sponsor the Reward Pool",
    ctaClass: "bg-brand text-white shadow-[0_5px_0_oklch(0.475_0.094_162.9)] hover:bg-brand-deep",
  },
  {
    id: "businesses",
    icon: "B",
    iconBg: "bg-accent-warm",
    iconShadow: "shadow-[0_6px_0_oklch(0.616_0.144_47.6)]",
    label: "02 · Local Ward Businesses",
    labelColor: "text-accent-deep",
    cardBg: "bg-sky",
    title: "Drive hyper-local footfall",
    bulletColor: "text-accent-deep",
    bullets: [
      "Zero upfront fees — only pay when customers redeem",
      "Become your suburb's recognized Community Champion",
      "Ward-locked targeting keeps marketing local",
    ],
    cta: "List Your Business Free",
    ctaClass:
      "bg-accent-warm text-white shadow-[0_5px_0_oklch(0.616_0.144_47.6)] hover:bg-accent-deep",
  },
  {
    id: "corporate",
    icon: "A",
    iconBg: "bg-gold",
    iconShadow: "shadow-[0_6px_0_oklch(0.72_0.12_80)]",
    label: "03 · Corporate Advertisers",
    labelColor: "text-gold-deep",
    cardBg: "bg-mint",
    title: "Reach high-intent audiences nationwide",
    bulletColor: "text-gold-deep",
    bullets: [
      "Target by province, metro or high-density wards",
      "Prime context for solar, security & banking",
      "Seamlessly hit your ESG & governance targets",
    ],
    cta: "Book Ad Inventory",
    ctaClass:
      "bg-gold text-ink shadow-[0_5px_0_oklch(0.72_0.12_80)] hover:bg-gold-deep hover:text-white",
  },
];

const awards = [
  {
    id: "citizen",
    n: "1",
    bg: "bg-mint",
    badgeBg: "bg-brand text-white",
    badgeShadow: "shadow-[0_4px_0_oklch(0.475_0.094_162.9)]",
    title: "The Active Citizen Award",
    text: "Honouring residents who log, track & mobilise neighbours to protect local infrastructure and hold leaders accountable.",
  },
  {
    id: "contractor",
    n: "2",
    bg: "bg-sky",
    badgeBg: "bg-accent-warm text-white",
    badgeShadow: "shadow-[0_4px_0_oklch(0.616_0.144_47.6)]",
    title: "Municipal Service Provider Excellence Award",
    text: "Recognising top municipal contractors and engineering companies delivering quality, timely infrastructure repairs within SLA.",
  },
  {
    id: "councillor",
    n: "3",
    bg: "bg-gold/30",
    badgeBg: "bg-gold text-ink",
    badgeShadow: "shadow-[0_4px_0_oklch(0.72_0.12_80)]",
    title: "Outstanding Ward Councillor Award",
    text: "Celebrating exceptional ward councillors for outstanding community leadership, responsive representation, and citizen engagement.",
  },
  {
    id: "municipality",
    n: "4",
    bg: "bg-mint",
    badgeBg: "bg-brand-deep text-white",
    badgeShadow: "shadow-[0_4px_0_oklch(0.475_0.094_162.9)]",
    title: "Premier Municipality & Ward Awards",
    text: "Honouring the most transparent, responsive municipalities and wards across South Africa.",
  },
];

const adjudicationInputs = [
  {
    title: "Citizen Reports",
    desc: "Ground-level service delivery reviews, feedback, and issue-resolution data submitted by the public.",
    icon: Users,
    color: "bg-brand text-white shadow-[0_4px_0_oklch(0.475_0.094_162.9)]",
  },
  {
    title: "Ward Councillors",
    desc: "Local leadership verification regarding completed infrastructure, community projects, and localized impact.",
    icon: UserCheck,
    color: "bg-gold text-ink shadow-[0_4px_0_oklch(0.72_0.12_80)]",
  },
  {
    title: "Municipalities & Departments",
    desc: "Official service level agreements (SLAs), turnaround times, and statutory performance data.",
    icon: Building2,
    color: "bg-brand-deep text-white shadow-[0_4px_0_oklch(0.32_0.08_160)]",
  },
  {
    title: "Independent Service Providers",
    desc: "Audited project completions, technical metrics, and utility performance statistics.",
    icon: HardHat,
    color: "bg-accent-warm text-white shadow-[0_4px_0_oklch(0.616_0.144_47.6)]",
  },
];

const adjudicationPipeline = [
  {
    step: "01",
    subtitle: "Data Gathering",
    title: "Submission & Tracking",
    text: "Performance logs, public ratings, and delivery metrics are constantly uploaded to the central ledger.",
    badge: "Community & Institutional Metrics",
  },
  {
    step: "02",
    subtitle: "Civic Fact-Checking",
    title: "Fact-Check Verification",
    text: "The platform cross-references the data across all stakeholder groups (e.g., if a municipality reports an upgrade, local citizens and councillors must verify its completion).",
    badge: "Cross-Referenced Consensus",
  },
  {
    step: "03",
    subtitle: "AI Adjudication",
    title: "Algorithmic Scoring",
    text: "The AI Judging System processes only the 100% verified, fact-checked datasets. It ranks and evaluates nominees using strict, unbiased impact algorithms—completely free from human bias or political favoritism.",
    badge: "Bias-Free Impact Scoring",
  },
];

const trustBadges = [
  {
    icon: ShieldCheck,
    title: "100% Human-Verified Data",
    desc: "AI processing only applies to community-verified datasets.",
    bg: "bg-mint",
  },
  {
    icon: Scale,
    title: "Bias-Free Evaluation",
    desc: "Algorithmic scoring eliminates political and personal bias in public recognition.",
    bg: "bg-sky",
  },
  {
    icon: SearchCheck,
    title: "Auditable Decisions",
    desc: "Every AI-calculated award score can be traced back to its factual, public data sources.",
    bg: "bg-gold/30",
  },
];

const adjudicationFaqs = [
  {
    q: "Can an AI award score be manipulated by fake reports or automated bots?",
    a: "No. The AI system processes only datasets that pass multi-party human verification. Every reported fault or project repair requires GPS location validation, before/after photos, and consensus from local ward residents and councillors before entering the score ledger.",
  },
  {
    q: "How does the AI prevent political or regional favoritism?",
    a: "The scoring algorithm relies strictly on objective mathematical metrics—such as average repair speed against statutory SLAs, verified resident satisfaction, and audited project quality. Political affiliations and subjective opinions carry zero weight in the evaluation model.",
  },
  {
    q: "Is the AI adjudication process transparent and auditable?",
    a: "Yes! Every single award score generated by the AI is attached to an open audit log. Any citizen, journalist, or municipal official can inspect the exact verified data points and SLA metrics that produced the final score.",
  },
  {
    q: "What happens if a municipal contractor or councillor disputes an AI score?",
    a: "Nominees can request a formal data audit. An independent review committee will inspect the raw verification logs, but score adjustments only occur if additional verified data is validated on the public ledger.",
  },
];

const tiers = [
  {
    name: "Local Retailer",
    labelColor: "text-brand-deep",
    monthlyPrice: 0,
    priceLabel: "Free",
    cardBg: "bg-white",
    features: [
      "Ward-locked discount listing",
      "Local leaderboard visibility",
      "Basic analytics dashboard",
    ],
    cta: "Sign Up Free",
    ctaClass: "bg-white text-brand-deep outline-2 outline-brand hover:bg-brand hover:text-white",
    popular: false,
  },
  {
    name: "Ward Sponsor",
    labelColor: "text-accent-deep",
    monthlyPrice: 2500,
    suffix: "/mo",
    cardBg: "bg-sky",
    features: [
      "Premium banner in 1 ward",
      "1× local award sponsorship",
      "Dedicated ward reporting",
    ],
    cta: "Choose Tier",
    ctaClass:
      "bg-accent-warm text-white shadow-[0_5px_0_oklch(0.616_0.144_47.6)] hover:bg-accent-deep",
    popular: false,
  },
  {
    name: "Regional Supplier",
    labelColor: "text-brand-deep",
    monthlyPrice: 15000,
    suffix: "/mo",
    cardBg: "bg-mint ring-2 ring-brand/30",
    features: [
      "Live fault-data for 1 region",
      "SED / ESD certificate",
      "Award category naming rights",
      "Priority SLA verification",
    ],
    cta: "Choose Tier",
    ctaClass: "bg-brand text-white shadow-[0_5px_0_oklch(0.475_0.094_162.9)] hover:bg-brand-deep",
    popular: true,
  },
  {
    name: "Metro Corporate",
    labelColor: "text-gold-deep",
    monthlyPrice: null,
    priceLabel: "Custom Quote",
    smallPrice: true,
    cardBg: "bg-gold/30",
    features: [
      "City-wide ad inventory",
      "Annual Awards headline sponsor",
      "Custom ESG reporting",
      "API & ERP integration",
    ],
    cta: "Contact Us",
    ctaClass: "bg-ink text-white shadow-[0_5px_0_oklch(0.24_0.02_220.5)] hover:bg-black",
    popular: false,
  },
];

function Index() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedMetro, setSelectedMetro] = useState<string>("All");
  const [searchWard, setSearchWard] = useState<string>("");
  const [activeAwardFilter, setActiveAwardFilter] = useState<string>("all");
  const [activeTrackTab, setActiveTrackTab] = useState<string>("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [openAdjFaqIndex, setOpenAdjFaqIndex] = useState<number | null>(0);

  // AI Score Simulator State
  const [simType, setSimType] = useState<"contractor" | "councillor" | "citizen">("contractor");
  const [simSatisfaction, setSimSatisfaction] = useState<number>(94);
  const [simSlaSpeed, setSimSlaSpeed] = useState<number>(88);
  const [simVerification, setSimVerification] = useState<number>(98);

  const calculatedAiScore = Math.round(
    simSatisfaction * 0.4 + simSlaSpeed * 0.35 + simVerification * 0.25,
  );

  // Modal State
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Become a CivicRewards Partner");
  const [modalTrack, setModalTrack] = useState("Regional Supplier");
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    metro: "City of Johannesburg",
    notes: "",
  });

  const handleOpenModal = (
    title = "Become a CivicRewards Partner",
    track = "Regional Supplier",
  ) => {
    setModalTitle(title);
    setModalTrack(track);
    setModalSubmitted(false);
    setPartnerModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setModalSubmitted(true);
  };

  const filteredRegions = regions.filter((r) => {
    const matchesMetro = selectedMetro === "All" || r.province === selectedMetro;
    const matchesSearch =
      r.name.toLowerCase().includes(searchWard.toLowerCase()) ||
      r.area.toLowerCase().includes(searchWard.toLowerCase()) ||
      r.province.toLowerCase().includes(searchWard.toLowerCase());
    return matchesMetro && matchesSearch;
  });

  const filteredAwards = awards.filter((a) => {
    if (activeAwardFilter === "all") return true;
    return a.id === activeAwardFilter;
  });

  const filteredTracks = tracks.filter((t) => {
    if (activeTrackTab === "all") return true;
    return t.id === activeTrackTab;
  });

  return (
    <div className="min-h-screen bg-cream font-body text-ink overflow-x-hidden selection:bg-brand selection:text-white">
      {/* Sticky Responsive Nav */}
      <header className="sticky top-3 z-50 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between rounded-2xl sm:rounded-3xl bg-white/85 backdrop-blur-md px-4 sm:px-6 py-3 shadow-[0_10px_30px_-15px_rgba(42,50,56,0.3)] border border-white/40">
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="grid size-10 sm:size-11 place-items-center rounded-xl sm:rounded-2xl bg-brand font-display text-xl sm:text-2xl font-extrabold text-white shadow-[0_5px_0_oklch(0.475_0.094_162.9)] transition group-hover:scale-105">
              C
            </div>
            <div className="leading-tight">
              <p className="font-display text-base sm:text-lg font-extrabold text-brand-deep">
                CivicRewards
              </p>
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
                South Africa
              </p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-4 lg:gap-6 text-sm font-bold text-ink/70 md:flex">
            <a href="#how" className="transition hover:text-brand-deep">
              How it works
            </a>
            <a href="#unity" className="transition hover:text-brand-deep">
              Civic Unity
            </a>
            <a href="#tracks" className="transition hover:text-brand-deep">
              Partners
            </a>
            <a href="#coverage" className="transition hover:text-brand-deep">
              Coverage
            </a>
            <a href="#awards" className="transition hover:text-brand-deep">
              Awards
            </a>
            <a
              href="#adjudication"
              className="flex items-center gap-1 text-brand-deep transition hover:text-brand font-extrabold"
            >
              <Cpu className="size-3.5 text-accent-warm" />
              Adjudication
            </a>
            <a href="#tiers" className="transition hover:text-brand-deep">
              Tiers
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenModal("Partner Inquiry", "General Partnership")}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl sm:rounded-2xl bg-accent-warm px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_0_oklch(0.616_0.144_47.6)] transition hover:bg-accent-deep active:translate-y-0.5 active:shadow-none"
            >
              <Sparkles className="size-4" />
              Become a Partner
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="grid size-10 place-items-center rounded-xl bg-cream text-ink md:hidden transition hover:bg-mint"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="mt-2 rounded-2xl bg-white p-5 shadow-clay border border-ink/10 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-3 font-display font-bold text-base text-ink">
              <a
                href="#how"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 hover:bg-cream transition"
              >
                How it works
              </a>
              <a
                href="#unity"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 hover:bg-cream transition"
              >
                Civic Unity
              </a>
              <a
                href="#tracks"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 hover:bg-cream transition"
              >
                Partner Tracks
              </a>
              <a
                href="#coverage"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 hover:bg-cream transition"
              >
                Municipal Coverage
              </a>
              <a
                href="#awards"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 hover:bg-cream transition"
              >
                Awards Night
              </a>
              <a
                href="#adjudication"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 bg-mint text-brand-deep font-extrabold transition"
              >
                <Cpu className="size-4 text-accent-warm" />
                AI Adjudication
              </a>
              <a
                href="#tiers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 hover:bg-cream transition"
              >
                Sponsorship Tiers
              </a>
            </nav>
            <div className="mt-4 pt-3 border-t border-ink/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleOpenModal("Partner Inquiry", "Mobile Partner Call");
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-3 font-display text-sm font-bold text-white shadow-[0_4px_0_oklch(0.475_0.094_162.9)]"
              >
                <Sparkles className="size-4" />
                Become a Partner Today
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10 pt-8 sm:pt-12 md:pt-16">
        <div className="grid items-center gap-8 sm:gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-mint px-3.5 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-deep shadow-sm">
              <ShieldCheck className="size-4" />
              Rewarding active citizenship &amp; public service
            </span>
            <h1 className="mt-4 sm:mt-5 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] text-ink">
              Fix South Africa.
              <br />
              <span className="text-brand-deep">Reward Citizens.</span>
              <br />
              <span className="text-accent-warm">Grow Your Business.</span>
            </h1>
            <p className="mt-4 sm:mt-6 max-w-md text-base sm:text-lg leading-relaxed text-ink/75">
              Partner with CivicRewards South Africa — the national platform turning active
              citizenship and municipal service excellence into local economic growth, one ward at a
              time.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => handleOpenModal("Partner Application", "Hero Call to Action")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 sm:px-7 py-3.5 sm:py-4 font-display text-base font-bold text-white shadow-[0_6px_0_oklch(0.475_0.094_162.9)] transition hover:bg-brand-deep active:translate-y-1 active:shadow-none"
              >
                Become a Partner Today
                <ArrowRight className="size-5" />
              </button>
              <a
                href="#tracks"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 sm:py-4 text-base font-bold text-ink/80 shadow-[0_6px_0_rgba(42,50,56,0.12)] transition hover:bg-cream active:translate-y-1 active:shadow-none"
              >
                Choose Your Track
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:flex sm:gap-8 border-t border-ink/10 pt-6">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-brand-deep">
                  48,200+
                </p>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-ink/55">
                  Faults resolved
                </p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-accent-warm">
                  584 Wards
                </p>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-ink/55">
                  Across 7 Metros
                </p>
              </div>
            </div>
          </div>

          {/* Clay Hero Visual Object */}
          <div className="relative mt-2 md:mt-0">
            <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-sky p-4 sm:p-6 shadow-[0_25px_50px_-20px_rgba(42,50,56,0.35)]">
              <img
                src={saProvincesMap}
                alt="3D clay map model of South Africa with provinces and metro pins"
                width={1024}
                height={820}
                referrerPolicy="no-referrer"
                className="aspect-[5/4] w-full rounded-[1.5rem] sm:rounded-[1.8rem] bg-mint object-cover"
              />

              {/* Floating Points Badge */}
              <div className="absolute left-2 sm:-left-5 top-4 sm:top-10 rounded-xl sm:rounded-2xl bg-white px-3 sm:px-4 py-2 sm:py-3 shadow-[0_10px_25px_-12px_rgba(42,50,56,0.5)] border border-sky">
                <p className="font-display text-base sm:text-xl font-extrabold text-accent-warm">
                  +120 pts
                </p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-ink/60">
                  Pothole fixed · Ward 12
                </p>
              </div>

              {/* Floating Champion Badge */}
              <div className="absolute bottom-2 right-2 sm:-bottom-5 sm:-right-3 rounded-xl sm:rounded-2xl bg-gold px-3 sm:px-4 py-2 sm:py-3 shadow-[0_10px_25px_-12px_rgba(42,50,56,0.5)] border border-white">
                <p className="font-display text-xs sm:text-sm font-extrabold text-ink">
                  Community Champion
                </p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-ink/70">
                  Soweto · Bronze Tier
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner Banner */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-brand-deep px-6 sm:px-10 lg:px-12 py-8 sm:py-10 text-white shadow-clay-lg">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
            South Africa moves when its people, councillors, contractors and businesses move
            together.
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/75 leading-relaxed">
            You aren't just sponsoring an app — you're investing in the infrastructure, safety and
            commercial vitality of municipal wards across South Africa.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
      >
        <div className="grid items-center gap-8 lg:gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <span className="inline-block rounded-full bg-sky px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-ink/70">
              The Loop
            </span>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">
              One reported fault, four wins for the ward
            </h2>
            <div className="mt-6 sm:mt-7 space-y-4 sm:space-y-5">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="flex gap-4 p-3.5 sm:p-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm transition hover:bg-white"
                >
                  <div className="grid size-10 sm:size-11 shrink-0 place-items-center rounded-xl sm:rounded-2xl bg-white font-display text-sm font-extrabold text-brand-deep shadow-clay">
                    {s.n}
                  </div>
                  <div>
                    <p className="font-display text-base sm:text-lg font-bold text-ink">
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-ink/70">
                      {s.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={repairCrew}
              alt="Clay illustration of a municipal repair crew fixing infrastructure across a South African municipality"
              width={1200}
              height={912}
              loading="lazy"
              className="w-full rounded-[2rem] sm:rounded-[2.5rem] object-cover shadow-clay-lg"
            />
          </div>
        </div>
      </section>

      {/* Multilingual Civic Unity Section */}
      <section
        id="unity"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
      >
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-cream to-mint/20 p-6 sm:p-10 lg:p-12 shadow-clay-lg border border-brand/10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-ink shadow-sm">
              <Globe2 className="size-4 text-accent-warm" />
              United Across South African Languages
            </span>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink">
              One Shared Spirit of Active Citizenship
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-ink/75 leading-relaxed">
              Every major language block in South Africa carries a rich traditional concept for
              community work parties, volunteer cleanups, and collective civic responsibility.
            </p>
          </div>

          {/* 3D Claymation Multilingual Image */}
          <div className="mt-8 relative overflow-hidden rounded-[2rem] border border-ink/10 shadow-clay bg-cream">
            <img
              src={multilingualCivicUnity}
              alt="3D claymation illustration of diverse South Africans in traditional attire uniting with speech blurbs: Letsema, iLima, Ndzima, Davha, Saamtrek"
              width={1600}
              height={900}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full object-cover"
            />
          </div>

          {/* Cultural Words Grid */}
          <div className="mt-8 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {culturalConcepts.map((item) => (
              <div
                key={item.word}
                className={`flex flex-col justify-between rounded-2xl bg-white p-4 shadow-clay border ${item.borderColor} transition hover:shadow-md hover:-translate-y-0.5`}
              >
                <div>
                  <span
                    className={`inline-block rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${item.badgeBg}`}
                  >
                    {item.languages}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-extrabold text-ink">
                    "{item.word}"
                  </h3>
                </div>
                <p className="mt-2 text-xs text-ink/75 leading-relaxed border-t border-ink/5 pt-2">
                  {item.translation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Tracks Section */}
      <section
        id="tracks"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
      >
        <h2 className="text-center font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">
          Partner in the way that fits you
        </h2>
        <p className="mx-auto mt-2 sm:mt-3 max-w-xl text-center text-xs sm:text-sm text-ink/65">
          Three tracks, one shared mission: a cleaner, safer, more connected country.
        </p>

        {/* Responsive Track Filter Tabs for Mobile */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 md:hidden">
          <button
            onClick={() => setActiveTrackTab("all")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTrackTab === "all" ? "bg-brand text-white shadow-sm" : "bg-white text-ink/70"
            }`}
          >
            All Tracks
          </button>
          <button
            onClick={() => setActiveTrackTab("suppliers")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTrackTab === "suppliers"
                ? "bg-brand text-white shadow-sm"
                : "bg-white text-ink/70"
            }`}
          >
            Municipal Suppliers
          </button>
          <button
            onClick={() => setActiveTrackTab("businesses")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTrackTab === "businesses"
                ? "bg-accent-warm text-white shadow-sm"
                : "bg-white text-ink/70"
            }`}
          >
            Ward Businesses
          </button>
          <button
            onClick={() => setActiveTrackTab("corporate")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTrackTab === "corporate" ? "bg-gold text-ink shadow-sm" : "bg-white text-ink/70"
            }`}
          >
            Corporate
          </button>
        </div>

        <div className="mt-8 sm:mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTracks.map((t) => (
            <div
              key={t.label}
              className={`flex flex-col justify-between rounded-[2rem] p-6 sm:p-7 shadow-clay border border-white/50 transition hover:-translate-y-1 ${t.cardBg}`}
            >
              <div>
                <div
                  className={`grid size-12 sm:size-14 place-items-center rounded-2xl font-display text-xl sm:text-2xl font-extrabold text-white ${t.iconBg} ${t.iconShadow} ${t.iconBg === "bg-gold" ? "text-ink" : ""}`}
                >
                  {t.icon}
                </div>
                <p
                  className={`mt-4 sm:mt-5 text-xs font-bold uppercase tracking-wide ${t.labelColor}`}
                >
                  {t.label}
                </p>
                <h3 className="mt-2 font-display text-lg sm:text-xl font-bold text-ink">
                  {t.title}
                </h3>
                <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-ink/75">
                  {t.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className={t.bulletColor}>•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleOpenModal(`Partner via ${t.title}`, t.label)}
                className={`mt-6 w-full rounded-2xl px-5 py-3 text-center text-xs sm:text-sm font-bold transition active:translate-y-0.5 active:shadow-none ${t.ctaClass}`}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Awards Section */}
      <section
        id="awards"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14"
      >
        <div className="overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-white p-6 sm:p-8 lg:p-12 shadow-clay-lg border border-ink/5">
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start">
            <div className="lg:w-5/12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/40 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-gold-deep">
                <Trophy className="size-4" />
                Awards Night
              </span>
              <h2 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-ink">
                Celebrating the champions keeping South Africa running
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink/75">
                Annual &amp; quarterly prizes honour active citizens, municipal service providers,
                exceptional ward councillors and municipalities making the biggest difference.
              </p>

              {/* Award Filter Chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveAwardFilter("all")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeAwardFilter === "all"
                      ? "bg-brand text-white"
                      : "bg-cream text-ink/70 hover:bg-mint"
                  }`}
                >
                  All Categories
                </button>
                <button
                  onClick={() => setActiveAwardFilter("citizen")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeAwardFilter === "citizen"
                      ? "bg-brand text-white"
                      : "bg-cream text-ink/70 hover:bg-mint"
                  }`}
                >
                  Citizens
                </button>
                <button
                  onClick={() => setActiveAwardFilter("contractor")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeAwardFilter === "contractor"
                      ? "bg-accent-warm text-white"
                      : "bg-cream text-ink/70 hover:bg-sky"
                  }`}
                >
                  Suppliers
                </button>
                <button
                  onClick={() => setActiveAwardFilter("councillor")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeAwardFilter === "councillor"
                      ? "bg-gold text-ink"
                      : "bg-cream text-ink/70 hover:bg-gold/40"
                  }`}
                >
                  Councillors
                </button>
              </div>

              <button
                onClick={() =>
                  handleOpenModal("Award Category Sponsorship", "Annual Awards Sponsor")
                }
                className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 font-display text-xs sm:text-sm font-bold text-white shadow-[0_5px_0_oklch(0.475_0.094_162.9)] transition hover:bg-brand-deep active:translate-y-0.5 active:shadow-none"
              >
                <Trophy className="size-4" />
                Sponsor an Award Category
              </button>
            </div>

            <div className="space-y-3.5 sm:space-y-4 lg:w-7/12">
              {filteredAwards.map((a) => (
                <div
                  key={a.title}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 rounded-2xl p-4 sm:p-5 border border-white/80 transition hover:shadow-md ${a.bg}`}
                >
                  <div
                    className={`grid size-10 sm:size-11 shrink-0 place-items-center rounded-xl font-display text-base sm:text-lg font-bold ${a.badgeBg} ${a.badgeShadow}`}
                  >
                    {a.n}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm sm:text-base text-ink">
                      {a.title}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-ink/70 leading-relaxed">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI CIVIC ADJUDICATION SYSTEM SECTION */}
      <section
        id="adjudication"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16"
      >
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-cream to-mint/30 p-6 sm:p-10 lg:p-14 shadow-clay-lg border border-brand/10">
          {/* Header & High-Level Summary */}
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-deep px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm">
              <Cpu className="size-4 text-gold" />
              Transparent AI Civic Adjudication System
            </span>
            <h2 className="mt-4 font-display text-2xl sm:text-4xl font-extrabold leading-tight text-ink">
              Objective, AI-Driven Recognition Built on Verified Citizen Input
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink/80">
              To ensure absolute fairness and transparency, our public service awards are decided by
              an advanced AI Judging System. Instead of subjective opinions, the AI evaluates
              factual data points, public service metrics, and direct community feedback. Every
              piece of data is cross-verified and fact-checked by a network of citizens, local
              councillors, municipal offices, and service providers before entering the system.
            </p>
          </div>

          {/* Section 2: The Verification Ecosystem (The "Inputs" List) */}
          <div className="mt-10 pt-8 border-t border-ink/10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-deep">
                  Ecosystem Feeds
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-ink">
                  The Multi-Stakeholder Verification Input Ledger
                </h3>
              </div>
              <p className="text-xs text-ink/60">
                Zero hallucinated data — 100% anchored in cross-checked community evidence.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {adjudicationInputs.map((input) => {
                const IconComp = input.icon;
                return (
                  <div
                    key={input.title}
                    className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-clay border border-white/80 transition hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`grid size-11 place-items-center rounded-xl font-bold ${input.color}`}
                        >
                          <IconComp className="size-5" />
                        </div>
                        <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink/60">
                          Verified Input
                        </span>
                      </div>
                      <h4 className="font-display text-base font-extrabold text-ink mb-1.5">
                        {input.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-ink/70">{input.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Step-by-Step Visual Flow (How the AI Decides) */}
          <div className="mt-12 rounded-[2rem] bg-brand-deep p-6 sm:p-8 lg:p-10 text-white shadow-clay">
            <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
              <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-gold">
                Data Pipeline
              </span>
              <h3 className="mt-2 font-display text-xl sm:text-3xl font-extrabold">
                How the AI Judging Pipeline Operates
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-white/75">
                From raw fault logging to unbiased algorithmic scoring in 3 transparent steps.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 relative">
              {adjudicationPipeline.map((pipe, idx) => (
                <div
                  key={pipe.step}
                  className="relative flex flex-col justify-between rounded-2xl bg-white/10 p-5 sm:p-6 backdrop-blur-md border border-white/15"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-display text-2xl font-extrabold text-gold">
                        Step {pipe.step}
                      </span>
                      <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                        {pipe.subtitle}
                      </span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-white mb-2">{pipe.title}</h4>
                    <p className="text-xs leading-relaxed text-white/80">{pipe.text}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-[11px] font-semibold text-mint flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" />
                      {pipe.badge}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: UI Trust Anchors & Badges */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {trustBadges.map((badge) => {
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={badge.title}
                  className={`flex items-start gap-3.5 rounded-2xl p-4 sm:p-5 shadow-clay border border-white/80 ${badge.bg}`}
                >
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-brand-deep shadow-sm">
                    <BadgeIcon className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm sm:text-base font-extrabold text-ink">
                      {badge.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-ink/75 leading-relaxed">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 5: Interactive AI Score Simulator & FAQ */}
          <div className="mt-12 grid gap-8 lg:grid-cols-12 items-start pt-8 border-t border-ink/10">
            {/* Interactive Simulator */}
            <div className="lg:col-span-6 rounded-2xl bg-white p-6 shadow-clay border border-white/80">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-deep">
                  <Sliders className="size-4" />
                  AI Score Simulator
                </span>
                <span className="rounded-full bg-mint px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-deep">
                  Interactive Preview
                </span>
              </div>
              <h4 className="font-display text-lg font-extrabold text-ink">
                Test the Algorithmic Rating Engine
              </h4>
              <p className="text-xs text-ink/60 mt-1 mb-5">
                Adjust input parameters to observe how verified citizen feedback and SLA speed
                calculate the AI award ranking.
              </p>

              {/* Nominee Type Selection */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-ink mb-1.5">Nominee Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSimType("contractor")}
                    className={`rounded-xl py-2 text-xs font-bold transition ${
                      simType === "contractor"
                        ? "bg-brand text-white shadow-sm"
                        : "bg-cream text-ink/70 hover:bg-mint"
                    }`}
                  >
                    Contractor
                  </button>
                  <button
                    onClick={() => setSimType("councillor")}
                    className={`rounded-xl py-2 text-xs font-bold transition ${
                      simType === "councillor"
                        ? "bg-accent-warm text-white shadow-sm"
                        : "bg-cream text-ink/70 hover:bg-sky"
                    }`}
                  >
                    Councillor
                  </button>
                  <button
                    onClick={() => setSimType("citizen")}
                    className={`rounded-xl py-2 text-xs font-bold transition ${
                      simType === "citizen"
                        ? "bg-gold text-ink shadow-sm"
                        : "bg-cream text-ink/70 hover:bg-gold/30"
                    }`}
                  >
                    Citizen
                  </button>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-ink mb-1">
                    <span>Verified Resident Satisfaction</span>
                    <span className="text-brand-deep">{simSatisfaction}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={simSatisfaction}
                    onChange={(e) => setSimSatisfaction(Number(e.target.value))}
                    className="w-full accent-brand cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-ink mb-1">
                    <span>SLA Turnaround Speed</span>
                    <span className="text-accent-warm">{simSlaSpeed}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={simSlaSpeed}
                    onChange={(e) => setSimSlaSpeed(Number(e.target.value))}
                    className="w-full accent-accent-warm cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-ink mb-1">
                    <span>Multi-Party Verification Rate</span>
                    <span className="text-gold-deep">{simVerification}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={simVerification}
                    onChange={(e) => setSimVerification(Number(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                </div>
              </div>

              {/* Live Score Display */}
              <div className="mt-6 rounded-2xl bg-mint/50 p-4 border border-brand/20 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
                    Calculated AI Index Score
                  </p>
                  <p className="font-display text-3xl font-extrabold text-brand-deep">
                    {calculatedAiScore}{" "}
                    <span className="text-xs text-ink/50 font-normal">/ 100</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                    <FileCheck2 className="size-3" />
                    100% Auditable
                  </span>
                  <p className="text-[10px] font-semibold text-ink/60 mt-1">
                    Status: Award Contender
                  </p>
                </div>
              </div>
            </div>

            {/* Adjudication Specific FAQs */}
            <div className="lg:col-span-6 space-y-3">
              <h4 className="font-display text-lg font-extrabold text-ink mb-3 flex items-center gap-2">
                <Lock className="size-5 text-brand" />
                Frequently Asked Questions on AI Adjudication
              </h4>

              {adjudicationFaqs.map((faq, index) => {
                const isOpen = openAdjFaqIndex === index;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl bg-white p-4 shadow-clay border border-ink/5 transition"
                  >
                    <button
                      onClick={() => setOpenAdjFaqIndex(isOpen ? null : index)}
                      className="flex w-full cursor-pointer items-center justify-between gap-3 text-left font-display text-xs sm:text-sm font-bold text-ink"
                    >
                      <span>{faq.q}</span>
                      <div
                        className={`grid size-6 shrink-0 place-items-center rounded-full bg-mint text-brand-deep transition-transform duration-200 ${
                          isOpen ? "rotate-180 bg-brand text-white" : ""
                        }`}
                      >
                        <ChevronDown className="size-3.5" />
                      </div>
                    </button>
                    {isOpen && (
                      <p className="mt-2.5 text-xs leading-relaxed text-ink/75 border-t border-ink/5 pt-2.5 animate-in fade-in duration-150">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers Section */}
      <section
        id="tiers"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16"
      >
        <h2 className="text-center font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">
          Secure your spot
        </h2>
        <p className="mx-auto mt-2 sm:mt-3 max-w-xl text-center text-xs sm:text-sm text-ink/65">
          Pick a tier, upload your branding assets and settle your partnership via our secure
          gateway.
        </p>

        {/* Dynamic Billing Cycle Switcher */}
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3">
          <span
            className={`text-xs sm:text-sm font-bold cursor-pointer ${
              billingCycle === "monthly" ? "text-ink" : "text-ink/50"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            className="relative h-7 w-12 rounded-full bg-brand/30 p-1 transition"
            aria-label="Toggle Billing Cycle"
          >
            <div
              className={`size-5 rounded-full bg-brand shadow-md transition-transform ${
                billingCycle === "annual" ? "translate-x-5 bg-brand-deep" : "translate-x-0"
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs sm:text-sm font-bold cursor-pointer ${
                billingCycle === "annual" ? "text-ink" : "text-ink/50"
              }`}
              onClick={() => setBillingCycle("annual")}
            >
              Annual Billing
            </span>
            <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold text-ink uppercase tracking-wider">
              Save 15%
            </span>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => {
            let displayedPrice = t.priceLabel;
            if (t.monthlyPrice !== null && t.monthlyPrice > 0) {
              const price =
                billingCycle === "annual" ? Math.round(t.monthlyPrice * 0.85) : t.monthlyPrice;
              displayedPrice = `R${price.toLocaleString()}`;
            }

            return (
              <div
                key={t.name}
                className={`flex flex-col justify-between rounded-[1.8rem] p-5 sm:p-6 shadow-clay border border-white/60 transition hover:-translate-y-1 ${t.cardBg}`}
              >
                <div>
                  {t.popular && (
                    <span className="mb-2 inline-block rounded-full bg-brand px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Most popular
                    </span>
                  )}
                  <p className="text-xs font-bold uppercase tracking-wide text-ink/60">{t.name}</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <p
                      className={`font-display font-extrabold text-ink ${t.smallPrice ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}
                    >
                      {displayedPrice}
                    </p>
                    {t.suffix && (
                      <span className="text-xs sm:text-sm font-bold text-ink/50">
                        {billingCycle === "annual" ? "/mo (billed annually)" : t.suffix}
                      </span>
                    )}
                  </div>
                  <ul className="mt-4 space-y-2 text-xs sm:text-sm text-ink/75">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-brand shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleOpenModal(`Tier: ${t.name}`, t.name)}
                  className={`mt-6 w-full rounded-2xl px-4 py-3 text-center text-xs sm:text-sm font-bold transition active:translate-y-0.5 active:shadow-none ${t.ctaClass}`}
                >
                  {t.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ward Coverage & Interactive Metro Search */}
      <section
        id="coverage"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16"
      >
        <div className="grid items-center gap-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white p-6 sm:p-8 lg:p-12 shadow-clay-lg border border-ink/5 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-deep">
              <MapPin className="size-4" />
              Ward Coverage
            </span>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink">
              Live across South African Metros
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-ink/70 leading-relaxed">
              Sponsorship, banners and rewards are locked to real municipal ward boundaries — pick
              the suburbs your business actually trades in.
            </p>

            {/* Real-time Search and Filter Bar */}
            <div className="mt-5 space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 size-4 text-ink/40" />
                <input
                  type="text"
                  placeholder="Search municipality or province..."
                  value={searchWard}
                  onChange={(e) => setSearchWard(e.target.value)}
                  className="w-full rounded-xl bg-cream pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50 border border-ink/10"
                />
              </div>

              {/* Metro Pills */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  "All",
                  "Gauteng",
                  "Western Cape",
                  "KwaZulu-Natal",
                  "Eastern Cape",
                  "Free State",
                ].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMetro(m)}
                    className={`rounded-lg px-2.5 py-1 font-bold transition ${
                      selectedMetro === m
                        ? "bg-brand text-white"
                        : "bg-cream text-ink/65 hover:bg-mint"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered Regions List */}
            <div className="mt-5 max-h-60 overflow-y-auto pr-1 space-y-2">
              {filteredRegions.length === 0 ? (
                <p className="py-4 text-center text-xs text-ink/50 italic">
                  No municipalities match your search query.
                </p>
              ) : (
                filteredRegions.map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-2.5 text-xs sm:text-sm transition hover:bg-mint/40"
                  >
                    <div className="min-w-0">
                      <p className="font-display font-bold text-ink">{r.name}</p>
                      <p className="truncate text-[11px] text-ink/55">{r.area}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        r.live ? "bg-brand text-white" : "bg-gold text-ink"
                      }`}
                    >
                      {r.live ? `${r.wards} wards live` : "Q4 rollout"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="relative mt-4 lg:mt-0">
            <img
              src={saProvincesMap}
              alt="3D clay map of South Africa demarcated by provinces and major municipalities with location markers"
              width={1200}
              height={1008}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full rounded-[1.8rem] sm:rounded-[2rem] bg-cream object-cover shadow-clay"
            />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-md px-3.5 sm:px-4 py-2.5 sm:py-3 shadow-md border border-white">
              <p className="font-display text-base sm:text-lg font-extrabold text-brand-deep">
                {filteredRegions.reduce((sum, r) => sum + r.wards, 0)} Wards
              </p>
              <p className="text-[10px] sm:text-[11px] font-semibold text-ink/60">
                Mapped &amp; Active Nationwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16">
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] shadow-clay-lg">
          <img
            src={joburgSkyline}
            alt="Clay illustration of South African metropolitan skylines and infrastructure"
            width={1536}
            height={864}
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="relative bg-brand-deep/85 px-6 sm:px-10 lg:px-12 py-10 sm:py-12 text-white">
            <h2 className="max-w-xl font-display text-2xl sm:text-3xl md:text-4xl font-extrabold">
              The numbers your board will ask about
            </h2>
            <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm text-white/80 leading-relaxed">
              Every rand of sponsorship is traceable to a closed fault and a till slip in the same
              ward.
            </p>
            <div className="mt-8 grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
              {impact.map((i) => (
                <div
                  key={i.label}
                  className="rounded-2xl bg-white/10 p-4 sm:p-5 backdrop-blur-sm border border-white/10"
                >
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-gold">
                    {i.value}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-white">{i.label}</p>
                  <p className="mt-0.5 text-[11px] text-white/60">{i.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voices / Testimonials Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16">
        <h2 className="text-center font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">
          Partners already in the programme
        </h2>
        <div className="mt-8 sm:mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {voices.map((v) => (
            <figure
              key={v.name}
              className={`flex flex-col justify-between rounded-[2rem] p-6 sm:p-7 shadow-clay border border-white/50 ${v.bg}`}
            >
              <div>
                <span className="font-display text-3xl sm:text-4xl leading-none text-brand-deep/40">
                  &ldquo;
                </span>
                <blockquote className="mt-1 text-xs sm:text-sm leading-relaxed text-ink/80">
                  {v.quote}
                </blockquote>
              </div>
              <figcaption className="mt-5 border-t border-ink/10 pt-3">
                <p className="font-display font-bold text-sm sm:text-base text-ink">{v.name}</p>
                <p className="text-[11px] sm:text-xs text-ink/60">{v.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16">
        <h2 className="text-center font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">
          Questions partners ask first
        </h2>
        <div className="mt-6 sm:mt-8 space-y-3">
          {faqs.map((f, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={f.q}
                className="rounded-2xl bg-white p-4 sm:p-5 shadow-clay border border-ink/5 transition hover:bg-cream/40"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 text-left font-display text-sm sm:text-base font-bold text-ink"
                >
                  <span>{f.q}</span>
                  <div
                    className={`grid size-7 shrink-0 place-items-center rounded-full bg-mint text-brand-deep transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-brand text-white" : ""
                    }`}
                  >
                    <ChevronDown className="size-4" />
                  </div>
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink/70 border-t border-ink/5 pt-3 animate-in fade-in duration-150">
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="rounded-[2rem] sm:rounded-[2.5rem] bg-gold/40 px-6 sm:px-10 lg:px-12 py-10 sm:py-12 text-center shadow-clay border border-gold/30">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">
            Put your brand where South Africa gets fixed
          </h2>
          <p className="mx-auto mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm text-ink/70 leading-relaxed">
            Tell us which wards matter to you and we'll come back with a sponsorship pack, expected
            reach and reporting format.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={() => handleOpenModal("Final CTA Application", "Footer Partner Call")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-7 py-3.5 sm:py-4 font-display text-sm sm:text-base font-bold text-white shadow-[0_5px_0_oklch(0.475_0.094_162.9)] transition hover:bg-brand-deep active:translate-y-0.5 active:shadow-none"
            >
              <Sparkles className="size-4" />
              Become a Partner Today
            </button>
            <a
              href="mailto:partners@civicrewards.co.za"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-ink/80 shadow-[0_5px_0_rgba(42,50,56,0.12)] transition hover:bg-cream active:translate-y-0.5 active:shadow-none"
            >
              Talk to the team
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex flex-col items-center justify-between gap-4 rounded-[2rem] bg-brand-deep px-6 sm:px-8 py-8 text-white md:flex-row text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-white/15 font-display text-xl font-extrabold">
              C
            </div>
            <div>
              <p className="font-display text-base sm:text-lg font-extrabold">
                CivicRewards South Africa
              </p>
              <p className="text-xs text-white/60">
                Fix South Africa. Reward Citizens. Grow Your Business.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal("Footer Partner Inquiry", "Footer CTA")}
            className="rounded-2xl bg-gold px-6 py-3 font-display text-xs sm:text-sm font-bold text-ink shadow-[0_4px_0_oklch(0.72_0.12_80)] transition hover:bg-gold-deep hover:text-white active:translate-y-0.5 active:shadow-none"
          >
            Become a Partner Today
          </button>
        </div>
      </footer>

      {/* Interactive Partner Inquiry Modal */}
      {partnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-[2rem] bg-white p-6 sm:p-8 shadow-clay-lg border border-white/80 overflow-hidden">
            <button
              onClick={() => setPartnerModalOpen(false)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-cream text-ink hover:bg-mint transition"
            >
              <X className="size-4" />
            </button>

            {modalSubmitted ? (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-mint text-brand-deep">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="font-display text-2xl font-extrabold text-ink">
                  Application Received!
                </h3>
                <p className="text-sm text-ink/70 max-w-sm mx-auto">
                  Thank you, <span className="font-bold text-brand-deep">{formData.fullName}</span>.
                  Our partnership director for{" "}
                  <span className="font-bold text-brand-deep">{formData.metro}</span> will send your
                  custom sponsorship pack within 24 hours.
                </p>
                <button
                  onClick={() => setPartnerModalOpen(false)}
                  className="mt-4 rounded-xl bg-brand px-6 py-3 font-display text-sm font-bold text-white shadow-md"
                >
                  Back to Website
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-deep bg-mint px-2.5 py-1 rounded-full">
                    {modalTrack}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-extrabold text-ink">
                    {modalTitle}
                  </h3>
                  <p className="text-xs text-ink/60">
                    Fill in your details to get custom ward metrics and tier pricing.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Thandi Mokoena"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full rounded-xl bg-cream px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand border border-ink/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="thandi@company.co.za"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl bg-cream px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand border border-ink/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Civics Group"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full rounded-xl bg-cream px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand border border-ink/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">
                      Target Metro / Municipality
                    </label>
                    <select
                      value={formData.metro}
                      onChange={(e) => setFormData({ ...formData, metro: e.target.value })}
                      className="w-full rounded-xl bg-cream px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand border border-ink/10"
                    >
                      {regions.map((r) => (
                        <option key={r.name} value={r.name}>
                          {r.name} ({r.province})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">
                      Optional Message
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tell us about your target wards or SED goals..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full rounded-xl bg-cream px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand border border-ink/10"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPartnerModalOpen(false)}
                    className="rounded-xl px-4 py-2.5 text-xs font-bold text-ink/60 hover:bg-cream"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-brand px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-deep transition"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
