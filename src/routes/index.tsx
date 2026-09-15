import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Menu,
  X,
  Search,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Building2,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  HardHat,
  Lock,
  Sliders,
  FileCheck2,
  Globe2,
  CreditCard,
  Receipt,
  Handshake,
  Coins,
  Droplets,
  Sun,
  TrendingUp,
  Wallet,
  Store,
  Gift,
  Tag,
  ShoppingBag,
  Ticket,
  Copy,
  Check,
  Smartphone,
  LayoutDashboard,
} from "lucide-react";

import heroClay from "@/assets/hero-clay.jpg";
import joburgSkyline from "@/assets/joburg-skyline.jpg";
import saProvincesMap from "@/assets/images/sa_3d_clay_map_isolated_1789141534835.jpg";
import repairCrew from "@/assets/repair-crew.jpg";
import multilingualCivicUnity from "@/assets/images/multilingual_civic_unity_1789144566953.jpg";
import { CardPaymentModal, TierInfo, ReceiptData } from "@/components/CardPaymentModal";
import { ReceiptHistoryModal } from "@/components/ReceiptHistoryModal";

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

const stakeholderValues = [
  {
    stakeholder: "Residents",
    valueReceived: "Faster visibility, useful rewards, property-value protection",
    proofMetric: "Resolution time · Rewards issued",
    icon: Users,
    bg: "bg-mint",
    badgeBg: "bg-brand text-white",
  },
  {
    stakeholder: "Municipalities",
    valueReceived: "Prioritised demand, closure evidence, ward analytics",
    proofMetric: "Backlog reduction · SLA compliance",
    icon: Building2,
    bg: "bg-sky",
    badgeBg: "bg-brand-deep text-white",
  },
  {
    stakeholder: "Insurers",
    valueReceived: "Earlier risk signals and mitigation targeting",
    proofMetric: "Alerts acted on · Claims avoided",
    icon: ShieldCheck,
    bg: "bg-gold/30",
    badgeBg: "bg-gold-deep text-white",
  },
  {
    stakeholder: "Contractors",
    valueReceived: "Clearer work queues and independent job verification",
    proofMetric: "Verified closures · Rework rate",
    icon: HardHat,
    bg: "bg-cream",
    badgeBg: "bg-accent-warm text-white",
  },
  {
    stakeholder: "Merchants",
    valueReceived: "Attributed, hyper-local acquisition",
    proofMetric: "Basket value · Redemption rate",
    icon: Sparkles,
    bg: "bg-mint/40",
    badgeBg: "bg-accent-deep text-white",
  },
  {
    stakeholder: "Financial Partners",
    valueReceived: "Compliant retail origination and micro-investment flows",
    proofMetric: "KYC wallets · Funded accounts",
    icon: CreditCard,
    bg: "bg-sky/40",
    badgeBg: "bg-brand text-white",
  },
];

const redemptionCards = [
  {
    id: "local-merchants",
    iconSymbol: "🏪",
    LucideIcon: Store,
    title: "Local Merchants, Discounts & Giveaways",
    assetType: "Retail Discounts, Giveaways & Promotional Items",
    personalWealthBenefit:
      "Redeem points for discounts, giveaways, and promotional paraphernalia at neighborhood merchants.",
    communityImpact:
      "Keeps spending local, accelerates high-street SME sales, and boosts retail economy in wards.",
    estYield: "Instant 5% - 25% Off",
    minPoints: "50 Points",
    badgeBg: "bg-purple-600 text-white",
    cardBg: "bg-gradient-to-br from-purple-100/80 via-purple-50/60 to-emerald-100/80",
    borderColor: "border-purple-300/80 hover:border-emerald-400",
    shadowColor: "shadow-purple-900/5",
    accentColor: "text-purple-800",
  },
  {
    id: "utility-bonds",
    iconSymbol: "⚡",
    LucideIcon: Zap,
    title: "Tokenised Utility & Sovereign Bonds",
    assetType: "Fractional State-Owned Debt (e.g., Eskom)",
    personalWealthBenefit:
      "Earn regular yield (interest payments) directly into your digital wallet.",
    communityImpact:
      "Directly funds national power grid maintenance, network upgrades, and energy stability.",
    estYield: "7.8% - 9.2% p.a.",
    minPoints: "250 Points",
    comingSoon: true,
    badgeBg: "bg-slate-500 text-white",
    cardBg: "bg-gradient-to-br from-slate-100/95 via-gray-100/70 to-slate-200/60",
    borderColor: "border-slate-300/80",
    shadowColor: "shadow-slate-900/5",
    accentColor: "text-slate-600",
  },
  {
    id: "muni-bonds",
    iconSymbol: "🏛️",
    LucideIcon: Building2,
    title: "Tokenized Fractional Municipality Bonds",
    assetType: "Micro-Bonds & Municipal Debt (e.g., Jozibonds)",
    personalWealthBenefit:
      "Earn predictable interest coupon payouts backed by city revenues directly into your digital wallet.",
    communityImpact:
      "Directly finances municipal infrastructure projects (e.g., Jozibonds for City of Johannesburg), upgrading local ward service delivery and municipal assets.",
    estYield: "8.2% - 10.5% p.a.",
    minPoints: "150 Points",
    comingSoon: true,
    badgeBg: "bg-slate-500 text-white",
    cardBg: "bg-gradient-to-br from-slate-100/95 via-gray-100/70 to-slate-200/60",
    borderColor: "border-slate-300/80",
    shadowColor: "shadow-slate-900/5",
    accentColor: "text-slate-600",
  },
  {
    id: "clean-energy",
    iconSymbol: "☀️",
    LucideIcon: Sun,
    title: "Clean Energy Micro-Assets",
    assetType: "Independent Power Producer (IPP) Micro-Equity",
    personalWealthBenefit:
      "Earn a monthly share of revenue generated from solar/wind electricity generation.",
    communityImpact:
      "Accelerates local green energy transitions, powers schools, and reduces grid strain.",
    estYield: "9.5% - 11.4% p.a.",
    minPoints: "500 Points",
    comingSoon: true,
    badgeBg: "bg-slate-500 text-white",
    cardBg: "bg-gradient-to-br from-slate-100/95 via-gray-100/70 to-slate-200/60",
    borderColor: "border-slate-300/80",
    shadowColor: "shadow-slate-900/5",
    accentColor: "text-slate-600",
  },
];

const merchantDeals = [
  {
    id: "m1",
    category: "discounts",
    merchant: "SPAR Braamfontein",
    badge: "15% OFF",
    title: "15% Off Whole Grocery Basket",
    pointsCost: 75,
    location: "Ward 67, JHB Central",
    desc: "Valid on fresh produce, bakery, and essential groceries at checkout.",
    imageIcon: "🛒",
    code: "SPAR-CIVIC-15",
  },
  {
    id: "m2",
    category: "discounts",
    merchant: "BuildIt Soweto",
    badge: "10% OFF",
    title: "10% Off Hardware, Paint & DIY Tools",
    pointsCost: 100,
    location: "Ward 34, Soweto",
    desc: "Upgrade home or community garden repairs with discounted building materials.",
    imageIcon: "🔨",
    code: "BUILD-SOW-10",
  },
  {
    id: "m3",
    category: "discounts",
    merchant: "Maboneng Craft Roastery",
    badge: "20% OFF",
    title: "20% Off Coffee & Artisanal Breakfasts",
    pointsCost: 50,
    location: "Ward 123, Maboneng",
    desc: "Handcrafted espresso drinks and fresh breakfast plates in Johannesburg art district.",
    imageIcon: "☕",
    code: "MABO-ROAST-20",
  },
  {
    id: "m4",
    category: "discounts",
    merchant: "Cape Union Mart Rosebank",
    badge: "12% OFF",
    title: "12% Off Outdoor & Safety Gear",
    pointsCost: 90,
    location: "Ward 117, Rosebank",
    desc: "Redeemable on high-vis jackets, work boots, and outdoor work equipment.",
    imageIcon: "🥾",
    code: "CUM-OUTDOOR-12",
  },
  {
    id: "m5",
    category: "giveaways",
    merchant: "Mama K's Bakery",
    badge: "FREE ITEM",
    title: "Free Freshly Baked Artisan Loaf",
    pointsCost: 60,
    location: "Ward 45, Alexandra",
    desc: "Claim a warm, freshly baked sourdough or white farmhouse loaf daily.",
    imageIcon: "🍞",
    code: "MAMA-BREAD-FREE",
  },
  {
    id: "m6",
    category: "giveaways",
    merchant: "EcoAqua Water Station",
    badge: "FREE REFILL",
    title: "Free 10L Pure Mineral Water Refill",
    pointsCost: 40,
    location: "Ward 88, Randburg",
    desc: "Refill home dispensers with purified, UV-filtered mineral spring water.",
    imageIcon: "💧",
    code: "ECO-AQUA-10L",
  },
  {
    id: "m7",
    category: "giveaways",
    merchant: "Metro Express Wash",
    badge: "FREE SERVICE",
    title: "Free Executive Car Wash & Tyre Shine",
    pointsCost: 120,
    location: "Ward 102, Sandton",
    desc: "Full exterior eco-wash, interior vacuum, and tyre glaze by local youth team.",
    imageIcon: "🚗",
    code: "WASH-EXPRESS-100",
  },
  {
    id: "m8",
    category: "promotional",
    merchant: "CivicRewards Store",
    badge: "OFFICIAL GEAR",
    title: "Civic Champion 100% Organic Cotton Tote Bag",
    pointsCost: 150,
    location: "Ward Pickup / Delivery",
    desc: "Heavy-duty canvas tote featuring your ward number and civic pride emblem.",
    imageIcon: "👜",
    code: "CIVIC-TOTE-SA",
  },
  {
    id: "m9",
    category: "promotional",
    merchant: "CivicRewards Store",
    badge: "OFFICIAL GEAR",
    title: "Official Ward Hero Embroidered Cap",
    pointsCost: 200,
    location: "Ward Pickup / Delivery",
    desc: "Breathable cotton cap with embroidered South African flag accent and ward badge.",
    imageIcon: "🧢",
    code: "HERO-CAP-2026",
  },
  {
    id: "m10",
    category: "promotional",
    merchant: "CivicRewards Store",
    badge: "OFFICIAL GEAR",
    title: "Insulated Stainless Steel Water Bottle (750ml)",
    pointsCost: 250,
    location: "Ward Pickup / Delivery",
    desc: "Keeps drinks ice-cold for 24 hours while supporting plastic-free ward cleanups.",
    imageIcon: "🧴",
    code: "BOTTLE-STAINLESS-750",
  },
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
      "The ward reporting dashboard gave our engineering team real visibility into repair turnaround for the first time.",
    name: "Sipho Khumalo",
    role: "Managing Director, Civics Engineering Group",
    bg: "bg-sky",
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
    title: "Gain a competitive edge",
    bulletColor: "text-brand",
    bullets: [
      "Real-time outage tracking, advanced analytics, and quality of work ratings to optimize your operations.",
      "Drive Service Excellence: Win municipal tenders and qualify for the annual Service Provider Excellence Awards.",
      "Boost Compliance: Earn vital B-BBEE points under the SED (Socio-Economic Development) and ESD (Enterprise and Supplier Development) pillars.",
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
    features: ["Premium banner in 1 ward", "Dedicated ward reporting"],
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
    features: ["City-wide ad inventory", "Custom ESG reporting", "API & ERP integration"],
    cta: "Contact Us",
    ctaClass: "bg-ink text-white shadow-[0_5px_0_oklch(0.24_0.02_220.5)] hover:bg-black",
    popular: false,
  },
];

function AnimatedSAFlag({ className = "h-5 sm:h-6 w-8 sm:w-10" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md shadow-xs border border-ink/15 animate-flag-wave shrink-0 transition-transform ${className}`}
      title="South Africa"
    >
      <svg
        viewBox="0 0 900 600"
        className="h-full w-full object-cover"
        aria-label="Flag of South Africa"
      >
        <path d="M0 0h900v300H0z" fill="#E03C31" />
        <path d="M0 300h900v300H0z" fill="#002395" />
        <path d="M0 0l450 300L0 600h120l330-220H900V220H450L120 0H0z" fill="#FFFFFF" />
        <path d="M0 30l405 270L0 570h90l315-210H900V240H395L90 30H0z" fill="#007A4D" />
        <path d="M0 60l360 240L0 540z" fill="#FFB612" />
        <path d="M0 90l315 210L0 510z" fill="#000000" />
      </svg>
    </div>
  );
}

function Index() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedMetro, setSelectedMetro] = useState<string>("All");
  const [searchWard, setSearchWard] = useState<string>("");
  const [activeTrackTab, setActiveTrackTab] = useState<string>("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

  // Card Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentTier, setSelectedPaymentTier] = useState<TierInfo | null>(null);
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [receiptHistoryOpen, setReceiptHistoryOpen] = useState(false);

  // Points Redemption Modal State
  const [redemptionModalOpen, setRedemptionModalOpen] = useState(false);
  const [selectedRedemptionCard, setSelectedRedemptionCard] = useState<
    (typeof redemptionCards)[0] | null
  >(null);
  const [simulatedPoints, setSimulatedPoints] = useState(1500);

  // Local Merchant Claims Modal State
  const [merchantModalOpen, setMerchantModalOpen] = useState(false);
  const [merchantCategory, setMerchantCategory] = useState<
    "all" | "discounts" | "giveaways" | "promotional"
  >("all");
  const [claimedCodes, setClaimedCodes] = useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleOpenPayment = (tier: TierInfo) => {
    setSelectedPaymentTier(tier);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (newReceipt: ReceiptData) => {
    setReceipts((prev) => [newReceipt, ...prev]);
  };

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

  const filteredTracks = tracks.filter((t) => {
    if (activeTrackTab === "all") return true;
    return t.id === activeTrackTab;
  });

  return (
    <div className="min-h-screen bg-cream font-body text-ink overflow-x-hidden selection:bg-brand selection:text-white">
      {/* Sticky Responsive Nav Header */}
      <header className="sticky top-3 z-50 mx-auto max-w-6xl px-4 sm:px-6 space-y-2">
        {/* Top Banner: Logo & Primary Action */}
        <div className="flex items-center justify-between rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-md px-4 sm:px-6 py-2.5 sm:py-3 shadow-[0_10px_25px_-10px_rgba(42,50,56,0.25)] border border-white/60">
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="grid size-10 sm:size-11 place-items-center rounded-xl sm:rounded-2xl bg-brand font-display text-xl sm:text-2xl font-extrabold text-white shadow-[0_5px_0_oklch(0.475_0.094_162.9)] transition group-hover:scale-105">
              C
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <p className="font-display text-base sm:text-lg font-extrabold text-brand-deep">
                  CivicRewards
                </p>
                <AnimatedSAFlag />
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
                South Africa
              </p>
            </div>
          </a>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Reporting App Button requested by user */}
            <Link
              to="/ReportApp"
              className="inline-flex items-center gap-1.5 rounded-xl sm:rounded-2xl bg-brand px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_0_oklch(0.475_0.094_162.9)] transition hover:bg-brand-deep active:translate-y-0.5 active:shadow-none"
            >
              <Smartphone className="size-3.5 sm:size-4" />
              <span>Reporting App</span>
            </Link>

            {/* Councillor Button requested by user with identical button style */}
            <Link
              to="/councillor"
              className="inline-flex items-center gap-1.5 rounded-xl sm:rounded-2xl bg-brand px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_0_oklch(0.475_0.094_162.9)] transition hover:bg-brand-deep active:translate-y-0.5 active:shadow-none"
            >
              <Building2 className="size-3.5 sm:size-4" />
              <span>Councillor Page</span>
            </Link>

            {/* Become a Partner */}
            <button
              onClick={() => handleOpenModal("Partner Inquiry", "General Partnership")}
              className="inline-flex items-center gap-1.5 rounded-xl sm:rounded-2xl bg-accent-warm px-3 sm:px-4.5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_0_oklch(0.616_0.144_47.6)] transition hover:bg-accent-deep active:translate-y-0.5 active:shadow-none"
            >
              <Sparkles className="size-3.5 sm:size-4" />
              <span>Become a Partner</span>
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

        {/* Lower Banner: Menu Navigation Items */}
        <div className="hidden md:flex items-center rounded-2xl sm:rounded-3xl bg-white/85 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-sm border border-white/50">
          <nav className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-ink/75">
            <a href="#how" className="transition hover:text-brand-deep">
              How it works
            </a>
            <a href="#stakeholders" className="transition hover:text-brand-deep">
              Stakeholders
            </a>
            <a
              href="#redemption"
              className="inline-flex items-center gap-1.5 rounded-full bg-gold/30 px-2.5 py-1 text-brand-deep font-extrabold hover:bg-gold/50 transition border border-gold/40 shadow-2xs"
            >
              <Coins className="size-3.5 text-accent-warm" />
              Redeem Points
            </a>
            <a href="#intelligence" className="transition hover:text-brand-deep">
              Network
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
            <a href="#tiers" className="transition hover:text-brand-deep">
              Tiers
            </a>
          </nav>
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
                href="#stakeholders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 hover:bg-cream transition"
              >
                Stakeholder Value
              </a>
              <a
                href="#redemption"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 bg-mint/40 font-extrabold text-brand-deep hover:bg-mint transition border border-brand/20"
              >
                <span className="flex items-center gap-2">
                  <Coins className="size-4 text-accent-warm" />
                  Redeem Points
                </span>
                <span className="text-[10px] bg-brand text-white px-2 py-0.5 rounded-full font-bold">
                  Wealth
                </span>
              </a>
              <a
                href="#intelligence"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 hover:bg-cream transition"
              >
                Civic Intelligence Network
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
                href="#tiers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 hover:bg-cream transition"
              >
                Sponsorship Tiers
              </a>
            </nav>
            <div className="mt-4 pt-3 border-t border-ink/10 flex flex-col gap-2.5">
              <Link
                to="/ReportApp"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-3 font-display text-sm font-bold text-white shadow-[0_4px_0_oklch(0.475_0.094_162.9)]"
              >
                <Smartphone className="size-4" />
                Open Resident Reporting App
              </Link>

              <Link
                to="/councillor"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-3 font-display text-sm font-bold text-white shadow-[0_4px_0_oklch(0.475_0.094_162.9)]"
              >
                <Building2 className="size-4" />
                Councillor Page
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleOpenModal("Partner Inquiry", "Mobile Partner Call");
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent-warm py-3 font-display text-sm font-bold text-white shadow-[0_4px_0_oklch(0.616_0.144_47.6)]"
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
        <div className="text-center max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-mint px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wide text-brand-deep shadow-sm">
            <ShieldCheck className="size-4.5 sm:size-5 text-brand-deep" />A Public Service Delivery
            Loyalty Platform
          </span>
          <h1 className="mt-4 sm:mt-5 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-ink tracking-tight">
            <span>Fix South Africa.</span> <span className="text-brand-deep">Reward Citizens.</span>{" "}
            <span className="text-accent-warm">Grow Your Business.</span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-ink/80 font-medium">
            CivicRewards is an institutional-grade public service delivery loyalty platform and
            Smart City Intelligence platform that transforms verified public service outage
            reporting and civic action into a catalyst for resilient infrastructure, efficient
            public service delivery, and thriving local economies and municipalities.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
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

          <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs">
            <span className="text-ink/60 font-semibold">Live Applications:</span>
            <Link
              to="/ReportApp"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 font-bold text-brand-deep hover:bg-mint transition border border-brand/20 shadow-2xs"
            >
              <Smartphone className="size-3.5 text-brand" />
              <span>Resident Reporting App (Ward 115)</span>
            </Link>
            <Link
              to="/councillor"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 font-bold text-ink hover:bg-cream transition border border-ink/15 shadow-2xs"
            >
              <Building2 className="size-3.5 text-accent-warm" />
              <span>Councillor Signal Desk</span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 border-t border-ink/10 pt-6">
            <div>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-brand-deep">
                48,200+
              </p>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-ink/55">
                Faults resolved
              </p>
            </div>
            <div className="h-8 w-px bg-ink/10 hidden sm:block" />
            <div>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-accent-warm">
                584 Wards
              </p>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-ink/55">
                Across 7 Metros
              </p>
            </div>
            <div className="h-8 w-px bg-ink/10 hidden sm:block" />
            <div>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-brand">
                9 Provinces
              </p>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-ink/55">
                Nationwide Impact
              </p>
            </div>
          </div>
        </div>

        {/* Clay Hero Visual Object */}
        <div className="relative mt-10 sm:mt-12 max-w-4xl mx-auto">
          <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-sky p-4 sm:p-6 shadow-[0_25px_50px_-20px_rgba(42,50,56,0.35)]">
            <img
              src={saProvincesMap}
              alt="3D clay map model of South Africa with provinces and metro pins"
              width={1024}
              height={820}
              referrerPolicy="no-referrer"
              className="aspect-[16/10] sm:aspect-[2/1] w-full rounded-[1.5rem] sm:rounded-[1.8rem] bg-mint object-cover"
            />

            {/* Floating Points Badge */}
            <div className="absolute left-2 sm:left-6 top-4 sm:top-8 rounded-xl sm:rounded-2xl bg-white px-3 sm:px-4 py-2 sm:py-3 shadow-[0_10px_25px_-12px_rgba(42,50,56,0.5)] border border-sky">
              <p className="font-display text-base sm:text-xl font-extrabold text-accent-warm">
                +120 pts
              </p>
              <p className="text-[10px] sm:text-[11px] font-semibold text-ink/60">
                Pothole fixed · Ward 12
              </p>
            </div>

            {/* Floating Champion Badge */}
            <div className="absolute bottom-2 right-2 sm:bottom-6 sm:right-6 rounded-xl sm:rounded-2xl bg-gold px-3 sm:px-4 py-2 sm:py-3 shadow-[0_10px_25px_-12px_rgba(42,50,56,0.5)] border border-white">
              <p className="font-display text-xs sm:text-sm font-extrabold text-ink">
                Community Champion
              </p>
              <p className="text-[10px] sm:text-[11px] font-semibold text-ink/70">
                Soweto · Bronze Tier
              </p>
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

      {/* Stakeholder Value Matrix Section */}
      <section
        id="stakeholders"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
      >
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-deep shadow-sm">
            <Users className="size-4" />
            Multi-Stakeholder Ecosystem
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-4xl font-extrabold text-ink">
            Value by Stakeholder
          </h2>
          <p className="mt-2 text-sm sm:text-base text-ink/75 leading-relaxed">
            CivicRewards turns everyday civic action into verifiable operational, economic, and
            infrastructure value for every participant.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stakeholderValues.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.stakeholder}
                className={`relative overflow-hidden rounded-[2rem] p-6 shadow-clay border border-white/60 transition-all hover:-translate-y-1 hover:shadow-clay-lg flex flex-col justify-between ${item.bg}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`grid size-12 place-items-center rounded-2xl ${item.badgeBg} shadow-sm`}
                    >
                      <IconComponent className="size-6" />
                    </div>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ink/70 border border-ink/10">
                      Stakeholder
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-extrabold text-ink">
                    {item.stakeholder}
                  </h3>

                  <div className="mt-3 space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-ink/50">
                      Value Received
                    </p>
                    <p className="text-sm font-semibold text-ink leading-snug">
                      {item.valueReceived}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-ink/10">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand-deep flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="size-3.5 text-brand" />
                    Proof Metric
                  </p>
                  <p className="font-mono text-xs font-extrabold text-ink/80 bg-white/80 rounded-xl px-3 py-2 border border-ink/5">
                    {item.proofMetric}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* National Civic Intelligence Network Section */}
      <section
        id="intelligence"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
      >
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-deep via-brand to-accent-deep p-6 sm:p-10 lg:p-14 text-white shadow-2xl relative">
          <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-gold border border-gold/30">
                <Globe2 className="size-4" />
                Interoperable Data &amp; Reward Rails
              </span>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                National Civic Intelligence Network
              </h2>

              <p className="text-base sm:text-lg text-white/95 leading-relaxed font-semibold">
                When residents{" "}
                <strong className="text-gold">Report. Verify. Resolve. Earn Rewards</strong>, this
                civic action creates a National civic intelligence network.
              </p>

              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                The aggregated operational intelligence helps delivery partners prioritise timely
                work which keeps businesses in these communities operating at full capacity without
                downtime, thereby improving economic output, and business investment or relocation
                to the most efficient areas with more public services uptime.
              </p>

              {/* Step Process Pipeline */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="rounded-xl bg-white/10 p-3 text-center border border-white/15">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gold">
                    Step 1
                  </span>
                  <span className="font-display font-extrabold text-sm text-white">Report</span>
                </div>
                <div className="rounded-xl bg-white/10 p-3 text-center border border-white/15">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gold">
                    Step 2
                  </span>
                  <span className="font-display font-extrabold text-sm text-white">Verify</span>
                </div>
                <div className="rounded-xl bg-white/10 p-3 text-center border border-white/15">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gold">
                    Step 3
                  </span>
                  <span className="font-display font-extrabold text-sm text-white">Resolve</span>
                </div>
                <div className="rounded-xl bg-white/10 p-3 text-center border border-white/15">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gold">
                    Step 4
                  </span>
                  <span className="font-display font-extrabold text-sm text-white">
                    Earn Rewards
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3.5">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 sm:p-5 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-gold text-ink font-bold shrink-0">
                    <Zap className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">
                      Zero Infrastructure Downtime
                    </h4>
                    <p className="text-xs text-white/80">
                      Keeps local suburb businesses operating at 100% capacity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 sm:p-5 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-mint text-brand-deep font-bold shrink-0">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">
                      Economic Output &amp; Relocation
                    </h4>
                    <p className="text-xs text-white/80">
                      Attracts business investments to high public service uptime areas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 sm:p-5 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-sky text-brand-deep font-bold shrink-0">
                    <CreditCard className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">
                      Interoperable Data &amp; Reward Rails
                    </h4>
                    <p className="text-xs text-white/80">
                      Unified API connecting municipal SLA data with merchant points.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Component: REWARD_REDEMPTION_CARDS */}
      <section
        id="redemption"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
      >
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/30 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-deep shadow-sm border border-gold/40">
            <Coins className="size-4 text-accent-warm" />
            Civic Wealth Engine
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-ink leading-tight">
            Transform Active Citizenship into Wealth Portfolios
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-ink/80 leading-relaxed font-medium">
            Redeem your civic points via Local Merchants, Municipality Bonds, Public Utilities &amp;
            Infrastructure ETFs so that every civic effort has compound returns in efficient quality
            public service delivery and shared benefit in the wealth of our cities.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mt-10 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {redemptionCards.map((card) => {
            const IconComp = card.LucideIcon;
            return (
              <div
                key={card.id}
                className={`group relative overflow-hidden rounded-[2.2rem] p-6 sm:p-7 border ${card.borderColor} ${card.cardBg} ${card.shadowColor} shadow-clay transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between`}
              >
                <div>
                  {/* Top Bar with Icon & Asset Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid size-12 sm:size-14 place-items-center rounded-2xl bg-white shadow-sm border border-ink/5 text-2xl sm:text-3xl shrink-0 group-hover:scale-110 transition-transform">
                      {card.iconSymbol}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {card.comingSoon && (
                        <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm border border-red-700 animate-pulse">
                          Coming Soon
                        </span>
                      )}
                      <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-ink/70 border border-ink/10 shadow-xs">
                        Min {card.minPoints}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-5 font-display text-xl sm:text-2xl font-extrabold text-ink leading-snug">
                    {card.title}
                  </h3>

                  {/* Asset Type pill */}
                  <div className="mt-2.5 inline-block">
                    <span className="font-mono text-[11px] font-bold text-brand-deep bg-white/80 rounded-lg px-2.5 py-1 border border-ink/10">
                      {card.assetType}
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* Personal Wealth Benefit */}
                    <div className="rounded-2xl bg-white/85 p-4 border border-ink/5 shadow-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-deep">
                        <TrendingUp className="size-3.5 text-brand" />
                        Personal Wealth Benefit
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-ink/90 leading-relaxed">
                        {card.personalWealthBenefit}
                      </p>
                    </div>

                    {/* Community Impact */}
                    <div className="rounded-2xl bg-white/85 p-4 border border-ink/5 shadow-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-accent-deep">
                        <ShieldCheck className="size-3.5 text-accent-warm" />
                        Community Impact
                      </div>
                      <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
                        {card.communityImpact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-6 pt-4 border-t border-ink/10">
                  {card.id === "local-merchants" ? (
                    <button
                      onClick={() => setMerchantModalOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-emerald-700 px-4 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md transition hover:from-purple-800 hover:to-emerald-800 active:scale-[0.99]"
                    >
                      <Store className="size-4" />
                      CLAIM Discounts &amp; Giveaways
                      <ArrowRight className="size-4" />
                    </button>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-ink/50">
                          Est. Annual Yield
                        </span>
                        <span
                          className={`font-display text-base font-extrabold ${card.accentColor}`}
                        >
                          {card.estYield}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRedemptionCard(card);
                          setRedemptionModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-deep"
                      >
                        Simulate Yield
                        <ArrowRight className="size-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
                  {t.bullets.map((b) => {
                    const colonIndex = b.indexOf(":");
                    if (colonIndex !== -1 && colonIndex < 35) {
                      const prefix = b.slice(0, colonIndex + 1);
                      const rest = b.slice(colonIndex + 1);
                      return (
                        <li key={b} className="flex items-start gap-2">
                          <span className={`${t.bulletColor} font-bold mt-0.5`}>•</span>
                          <span>
                            <strong className="font-bold text-ink">{prefix}</strong>
                            {rest}
                          </span>
                        </li>
                      );
                    }
                    return (
                      <li key={b} className="flex items-start gap-2">
                        <span className={`${t.bulletColor} font-bold mt-0.5`}>•</span>
                        <span>{b}</span>
                      </li>
                    );
                  })}
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
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-3">
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

          <button
            onClick={() => setReceiptHistoryOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-mint px-3.5 py-1 text-xs font-extrabold text-brand-deep border border-brand/20 hover:bg-mint/80 transition"
          >
            <Receipt className="size-3.5" />
            View My Invoices & Receipts ({receipts.length})
          </button>
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
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => handleOpenPayment(t)}
                    className={`w-full flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3 text-center text-xs sm:text-sm font-bold transition active:translate-y-0.5 active:shadow-none ${t.ctaClass}`}
                  >
                    <CreditCard className="size-4" />
                    {t.monthlyPrice === null ? "Request Quote" : "Pay by Card & Activate"}
                  </button>
                  <button
                    onClick={() => handleOpenModal(`Tier: ${t.name}`, t.name)}
                    className="w-full text-center text-[11px] font-bold text-ink/50 hover:text-ink hover:underline py-0.5"
                  >
                    Or submit inquiry
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Household Value & Point Economics Banner */}
        <div className="mt-12 rounded-[2rem] bg-gradient-to-r from-cream via-mint/40 to-sky/40 p-6 sm:p-8 border border-brand/20 shadow-clay flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-deep px-3 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm">
              <Sparkles className="size-3.5 text-gold" />
              Inclusive Benefit &amp; Household Economics
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-ink">
              Everyday civic effort producing direct household value.
            </h3>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
              Points begin as non-financial loyalty units. With explicit user choice and regulated
              partners, future redemption will tie into public service delivery investment, subject
              to legal clearance and partner capability.
            </p>
          </div>
          <div className="shrink-0 w-full lg:w-auto">
            <button
              onClick={() => handleOpenModal("Household Loyalty Inquiry", "Household Value Call")}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 font-display text-xs sm:text-sm font-bold text-white shadow-[0_4px_0_oklch(0.475_0.094_162.9)] transition hover:bg-brand-deep"
            >
              Explore Redemption Roadmap
              <ArrowRight className="size-4" />
            </button>
          </div>
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
        <div className="rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-gold/30 via-cream to-mint/30 px-6 sm:px-10 lg:px-12 py-10 sm:py-14 text-center shadow-clay border border-gold/40">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm mb-3">
            <Handshake className="size-4 text-gold" />
            Build The Trust Layer
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">
            Partner with CivicRewards
          </h2>
          <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base font-semibold text-brand-deep leading-relaxed">
            Help build the trust layer between active citizens and responsive cities.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-ink/70 leading-relaxed">
            Tell us which municipal wards matter to your business and we'll deliver a tailored
            partnership pack, ward analytics, and verifiable SLA reporting.
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

      {/* Card Payment Modal */}
      <CardPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        selectedTier={selectedPaymentTier}
        initialBillingCycle={billingCycle}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Payment Receipt History Modal */}
      <ReceiptHistoryModal
        isOpen={receiptHistoryOpen}
        onClose={() => setReceiptHistoryOpen(false)}
        receipts={receipts}
        onSelectReceipt={(receiptData) => {
          setSelectedPaymentTier({
            name: receiptData.tierName,
            monthlyPrice: receiptData.subtotal,
            features: ["Ward Partner Listing", "Tax Invoice Delivered"],
          });
          setPaymentModalOpen(true);
        }}
      />

      {/* Points Redemption Simulation Modal */}
      {redemptionModalOpen && selectedRedemptionCard && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-2xl border border-white/60">
            <button
              onClick={() => setRedemptionModalOpen(false)}
              className="absolute top-5 right-5 grid size-9 place-items-center rounded-full bg-cream text-ink hover:bg-mint transition"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-cream border border-ink/10 text-2xl shadow-xs">
                {selectedRedemptionCard.iconSymbol}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-deep">
                    Infrastructure Portfolio Redemption
                  </span>
                  {selectedRedemptionCard.comingSoon && (
                    <span className="rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-xs">
                      Coming Soon
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-extrabold text-ink leading-tight">
                  {selectedRedemptionCard.title}
                </h3>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-cream/70 p-4 border border-ink/5 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-ink">
                  <span>Simulated Civic Points Balance:</span>
                  <span className="font-mono text-sm font-extrabold text-brand-deep">
                    {simulatedPoints.toLocaleString()} Points
                  </span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="10000"
                  step="250"
                  value={simulatedPoints}
                  onChange={(e) => setSimulatedPoints(Number(e.target.value))}
                  className="w-full accent-brand cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-extrabold text-ink/50 uppercase">
                  <span>250 Points</span>
                  <span>5,000 Points</span>
                  <span>10,000 Points</span>
                </div>
              </div>

              {/* Yield & Equity Calculation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-mint/30 p-4 border border-mint/50">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-deep">
                    Estimated Asset Value
                  </span>
                  <span className="font-display text-xl font-extrabold text-brand-deep">
                    R{(simulatedPoints * 1.8).toFixed(0)}
                  </span>
                  <span className="block text-[10px] text-ink/60 mt-0.5">
                    Micro-token allocation
                  </span>
                </div>

                <div className="rounded-2xl bg-gold/30 p-4 border border-gold/50">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-deep">
                    Est. Monthly Yield
                  </span>
                  <span className="font-display text-xl font-extrabold text-accent-deep">
                    R{(simulatedPoints * 0.014).toFixed(1)}/mo
                  </span>
                  <span className="block text-[10px] text-ink/60 mt-0.5">
                    {selectedRedemptionCard.estYield} return
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-cream p-4 text-xs space-y-1.5 text-ink/80 border border-ink/5">
                <p className="font-bold text-ink flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-brand" />
                  {selectedRedemptionCard.assetType}
                </p>
                <p>
                  • <strong>Personal Benefit:</strong>{" "}
                  {selectedRedemptionCard.personalWealthBenefit}
                </p>
                <p>
                  • <strong>Community Impact:</strong> {selectedRedemptionCard.communityImpact}
                </p>
              </div>

              <button
                onClick={() => {
                  alert(
                    `Redemption interest registered for ${simulatedPoints.toLocaleString()} Civic Points in ${selectedRedemptionCard.title}! Wallet integration launching in Phase 2 with regulated partners.`,
                  );
                  setRedemptionModalOpen(false);
                }}
                className="w-full py-3.5 rounded-2xl bg-brand text-white font-display text-sm font-bold shadow-md hover:bg-brand-deep transition flex items-center justify-center gap-2"
              >
                <Wallet className="size-4" />
                Reserve Micro-Infrastructure Tokens
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local Merchant Partners & Claim Modal */}
      {merchantModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-2xl border border-white/60 my-8">
            <button
              onClick={() => setMerchantModalOpen(false)}
              className="absolute top-5 right-5 grid size-9 place-items-center rounded-full bg-cream text-ink hover:bg-rose-100 hover:text-rose-700 transition"
            >
              <X className="size-5" />
            </button>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5 pr-10">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-rose-50 border border-rose-200 text-2xl shadow-xs text-rose-600">
                  🏪
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                    High-Street Ward Partner Network
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-ink leading-tight">
                    Local Merchants, Discounts &amp; Giveaways
                  </h3>
                </div>
              </div>

              {/* Points Balance Badge */}
              <div className="rounded-2xl bg-cream px-4 py-2 border border-ink/10 flex items-center gap-2">
                <Coins className="size-4 text-accent-warm" />
                <div>
                  <span className="block text-[9px] font-extrabold uppercase text-ink/50">
                    Your Civic Balance
                  </span>
                  <span className="font-mono text-sm font-extrabold text-brand-deep">
                    {simulatedPoints.toLocaleString()} Points
                  </span>
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <p className="mt-4 text-xs sm:text-sm text-ink/75 leading-relaxed font-medium">
              Every civic effort directly empowers local ward SMEs. Redeem your civic points for
              local merchant discounts, free daily items, or official promotional paraphernalia.
            </p>

            {/* Category Filter Tabs */}
            <div className="mt-6 flex flex-wrap gap-2 border-b border-ink/10 pb-3">
              {[
                { id: "all", label: "All Offers", icon: Store, count: merchantDeals.length },
                {
                  id: "discounts",
                  label: "Discounts",
                  icon: Tag,
                  count: merchantDeals.filter((d) => d.category === "discounts").length,
                },
                {
                  id: "giveaways",
                  label: "Giveaways",
                  icon: Gift,
                  count: merchantDeals.filter((d) => d.category === "giveaways").length,
                },
                {
                  id: "promotional",
                  label: "Promotional Items",
                  icon: ShoppingBag,
                  count: merchantDeals.filter((d) => d.category === "promotional").length,
                },
              ].map((tab) => {
                const IconC = tab.icon;
                const isActive = merchantCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setMerchantCategory(
                        tab.id as "all" | "discounts" | "giveaways" | "promotional",
                      )
                    }
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      isActive
                        ? "bg-rose-600 text-white shadow-sm"
                        : "bg-cream text-ink/70 hover:bg-rose-50 hover:text-rose-700 border border-ink/5"
                    }`}
                  >
                    <IconC className="size-3.5" />
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white text-ink/60 border border-ink/10"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Deals Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 max-h-[55vh] overflow-y-auto pr-1">
              {merchantDeals
                .filter((deal) => merchantCategory === "all" || deal.category === merchantCategory)
                .map((deal) => {
                  const isClaimed = Boolean(claimedCodes[deal.id]);
                  const canAfford = simulatedPoints >= deal.pointsCost;

                  return (
                    <div
                      key={deal.id}
                      className={`relative flex flex-col justify-between rounded-2xl p-5 border transition-all ${
                        isClaimed
                          ? "bg-emerald-50/70 border-emerald-300 shadow-xs"
                          : "bg-white border-ink/10 hover:border-rose-300 shadow-xs hover:shadow-md"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{deal.imageIcon}</span>
                            <div>
                              <span className="text-[10px] font-bold text-ink/50 block">
                                {deal.merchant}
                              </span>
                              <span className="text-[10px] text-brand-deep font-semibold flex items-center gap-1">
                                <MapPin className="size-3 text-brand" />
                                {deal.location}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                              deal.category === "discounts"
                                ? "bg-rose-100 text-rose-700 border border-rose-200"
                                : deal.category === "giveaways"
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {deal.badge}
                          </span>
                        </div>

                        <h4 className="mt-3 font-display text-base font-extrabold text-ink leading-snug">
                          {deal.title}
                        </h4>
                        <p className="mt-1.5 text-xs text-ink/75 leading-relaxed">{deal.desc}</p>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-extrabold text-brand-deep flex items-center gap-1">
                          <Coins className="size-3.5 text-accent-warm" />
                          {deal.pointsCost} Points
                        </span>

                        {isClaimed ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-300">
                              {claimedCodes[deal.id]}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(claimedCodes[deal.id]);
                                setCopiedCode(deal.id);
                                setTimeout(() => setCopiedCode(null), 2000);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-800 transition"
                            >
                              {copiedCode === deal.id ? (
                                <>
                                  <Check className="size-3" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="size-3" /> Copy
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={!canAfford}
                            onClick={() => {
                              if (!canAfford) return;
                              setSimulatedPoints((prev) => prev - deal.pointsCost);
                              setClaimedCodes((prev) => ({ ...prev, [deal.id]: deal.code }));
                            }}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold shadow-xs transition ${
                              canAfford
                                ? "bg-rose-600 text-white hover:bg-rose-700 active:scale-95"
                                : "bg-ink/10 text-ink/40 cursor-not-allowed"
                            }`}
                          >
                            <Ticket className="size-3.5" />
                            {canAfford ? "CLAIM Offer" : "Need Points"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-ink/10 flex flex-wrap items-center justify-between gap-3 text-xs text-ink/60">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="size-4 text-brand" />
                Vouchers verified instantly at point-of-sale or local ward distribution centers.
              </span>
              <button
                onClick={() => setMerchantModalOpen(false)}
                className="rounded-xl bg-cream px-5 py-2 font-bold text-ink hover:bg-ink/10 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
