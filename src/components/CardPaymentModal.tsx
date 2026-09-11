import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Printer,
  Sparkles,
  Building2,
  FileText,
  Calendar,
  Check,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

export interface TierInfo {
  name: string;
  monthlyPrice: number | null; // null for custom quote
  features: string[];
  popular?: boolean;
}

export interface ReceiptData {
  invoiceNumber: string;
  transactionId: string;
  date: string;
  companyName: string;
  email: string;
  vatNumber?: string;
  tierName: string;
  billingCycle: "monthly" | "annual";
  subtotal: number;
  vatAmount: number; // 15% SA VAT
  totalAmount: number;
  cardLast4: string;
  cardBrand: string;
}

interface CardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: TierInfo | null;
  initialBillingCycle?: "monthly" | "annual";
  onPaymentSuccess?: (receipt: ReceiptData) => void;
}

export const CardPaymentModal: React.FC<CardPaymentModalProps> = ({
  isOpen,
  onClose,
  selectedTier,
  initialBillingCycle = "monthly",
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<"checkout" | "processing" | "receipt">("checkout");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(initialBillingCycle);

  // Form Fields
  const [cardName, setCardName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Receipt data after payment
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  // Sync billing cycle when modal opens
  useEffect(() => {
    setBillingCycle(initialBillingCycle);
  }, [initialBillingCycle, isOpen]);

  // Reset state on close
  const handleCloseModal = () => {
    setStep("checkout");
    onClose();
  };

  if (!isOpen || !selectedTier) return null;

  // Calculate pricing (ZAR)
  const isCustomQuote = selectedTier.monthlyPrice === null;
  const baseMonthly = selectedTier.monthlyPrice || 0;

  // Price before VAT
  const rawPrice = billingCycle === "annual" ? Math.round(baseMonthly * 12 * 0.85) : baseMonthly;
  const vatRate = 0.15;
  const subtotal = rawPrice;
  const vatAmount = Math.round(subtotal * vatRate);
  const totalAmount = subtotal + vatAmount;

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  // Determine Card Brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, "");
    if (clean.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return "Mastercard";
    if (/^3[47]/.test(clean)) return "Amex";
    return "Visa";
  };

  const cardBrand = getCardBrand(cardNumber);

  // Submit Payment Handler
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !email || (!isCustomQuote && (!cardNumber || !expiry || !cvv))) return;

    setStep("processing");

    // Simulate 3D Secure / Payment Gateway Authorization delay
    setTimeout(() => {
      const cleanNum = cardNumber.replace(/\s/g, "");
      const last4 = cleanNum.length >= 4 ? cleanNum.slice(-4) : "4242";
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const newReceipt: ReceiptData = {
        invoiceNumber: `INV-ZA-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        transactionId: `TXN-CIVIC-${Math.floor(100000 + Math.random() * 900000)}`,
        date: dateStr,
        companyName: companyName || cardName,
        email,
        vatNumber: vatNumber || undefined,
        tierName: selectedTier.name,
        billingCycle,
        subtotal,
        vatAmount,
        totalAmount,
        cardLast4: last4,
        cardBrand,
      };

      setReceipt(newReceipt);
      setStep("receipt");
      if (onPaymentSuccess) {
        onPaymentSuccess(newReceipt);
      }
    }, 2200);
  };

  // Printable Invoice function
  const handlePrintReceipt = () => {
    window.print();
  };

  // Download Invoice as HTML file
  const handleDownloadInvoice = () => {
    if (!receipt) return;
    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Invoice - ${receipt.invoiceNumber}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #2A3238; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #285A48; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #285A48; }
          .badge { background: #E8F5EE; color: #285A48; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { text-align: left; padding: 12px; border-bottom: 1px solid #E5E7EB; }
          th { background: #F8FAF9; color: #4B5563; text-transform: uppercase; font-size: 11px; }
          .total-row { font-size: 18px; font-weight: bold; color: #285A48; }
          .footer { margin-top: 40px; font-size: 12px; color: #6B7280; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">CivicRewards South Africa</div>
            <p style="margin:4px 0; font-size:12px; color:#6B7280;">CivicRewards SA (Pty) Ltd | Reg: 2024/981244/07 | VAT: 4980291482</p>
          </div>
          <div style="text-align:right;">
            <div class="badge">PAID TAX INVOICE</div>
            <p style="margin:6px 0 0; font-size:14px; font-weight:bold;">${receipt.invoiceNumber}</p>
            <p style="margin:2px 0; font-size:12px; color:#6B7280;">Date: ${receipt.date}</p>
          </div>
        </div>
        <div class="grid">
          <div>
            <strong>Billed To:</strong><br/>
            ${receipt.companyName}<br/>
            ${receipt.email}<br/>
            ${receipt.vatNumber ? `VAT Reg: ${receipt.vatNumber}` : ""}
          </div>
          <div>
            <strong>Payment Method:</strong><br/>
            ${receipt.cardBrand} ending in •••• ${receipt.cardLast4}<br/>
            Ref: ${receipt.transactionId}<br/>
            Status: Approved
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Billing Cycle</th>
              <th>Amount (ZAR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${receipt.tierName} Sponsorship Tier</strong><br/><span style="font-size:12px; color:#6B7280;">Municipal Ward & Partner Placement</span></td>
              <td>${receipt.billingCycle === "annual" ? "Annual (15% Discounted)" : "Monthly"}</td>
              <td>R ${receipt.subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align:right;">Subtotal (excl. VAT):</td>
              <td>R ${receipt.subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align:right;">15% South African VAT:</td>
              <td>R ${receipt.vatAmount.toLocaleString()}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2" style="text-align:right;">Total Paid:</td>
              <td>R ${receipt.totalAmount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        <div class="footer">
          <p>Thank you for supporting active citizenship & local community growth across South Africa.</p>
          <p>CivicRewards SA (Pty) Ltd · 150 Sandton Drive, Johannesburg, Gauteng</p>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([invoiceHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tax-Invoice-${receipt.invoiceNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.2rem] bg-white shadow-2xl border border-ink/10 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-ink/10 bg-gradient-to-r from-cream to-mint/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-brand text-white shadow-sm font-display font-extrabold text-lg">
              C
            </div>
            <div>
              <h3 className="font-display text-lg font-extrabold text-ink leading-tight">
                {step === "receipt"
                  ? "Payment Receipt & Tax Invoice"
                  : `Subscribe to ${selectedTier.name}`}
              </h3>
              <p className="text-xs text-ink/60 font-semibold">
                {step === "receipt"
                  ? "Instant Activation & Confirmation"
                  : "Secure Credit / Debit Card Gateway (ZAR)"}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="rounded-full p-2 text-ink/60 hover:bg-black/5 hover:text-ink transition"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {/* STEP 1: CHECKOUT FORM */}
          {step === "checkout" && (
            <form onSubmit={handleSubmitPayment} className="space-y-6">
              {/* Billing Cycle Switcher */}
              {!isCustomQuote && (
                <div className="flex items-center justify-between rounded-2xl bg-cream p-3 border border-ink/10">
                  <span className="text-xs font-bold text-ink">Billing Frequency:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBillingCycle("monthly")}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        billingCycle === "monthly"
                          ? "bg-brand text-white shadow-sm"
                          : "text-ink/60 hover:bg-white"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle("annual")}
                      className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        billingCycle === "annual"
                          ? "bg-brand text-white shadow-sm"
                          : "text-ink/60 hover:bg-white"
                      }`}
                    >
                      Annual
                      <span className="rounded-full bg-gold px-1.5 py-0.2 text-[9px] font-extrabold text-ink uppercase">
                        Save 15%
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3D Visual Card Preview */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-deep via-brand to-accent-deep p-5 text-white shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-6 text-gold" />
                    <span className="font-display font-extrabold tracking-widest text-xs uppercase text-gold">
                      CivicRewards Pay
                    </span>
                  </div>
                  <span className="font-display font-extrabold italic text-sm text-white/90">
                    {cardBrand}
                  </span>
                </div>

                <div className="my-6">
                  <p className="font-mono text-lg sm:text-xl font-bold tracking-widest text-white/90">
                    {cardNumber || "•••• •••• •••• 4242"}
                  </p>
                </div>

                <div className="flex items-end justify-between text-xs">
                  <div>
                    <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">
                      Cardholder
                    </p>
                    <p className="font-display font-bold truncate max-w-[180px]">
                      {cardName ? cardName.toUpperCase() : "YOUR NAME / COMPANY"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">
                      Expires
                    </p>
                    <p className="font-mono font-bold">{expiry || "MM/YY"}</p>
                  </div>
                </div>
              </div>

              {/* Personal & Business Details */}
              <div className="space-y-4">
                <h4 className="font-display text-sm font-extrabold text-ink flex items-center gap-2">
                  <Building2 className="size-4 text-brand" />
                  1. Business & Contact Information
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-ink/70 mb-1">
                      Full Name / Representative *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sipho Ndlovu"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm font-semibold focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink/70 mb-1">
                      Email Address (for Tax Invoice) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sipho@company.co.za"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm font-semibold focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-ink/70 mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Randburg Hardware (Pty) Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm font-semibold focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink/70 mb-1">
                      VAT Registration Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4980291482"
                      value={vatNumber}
                      onChange={(e) => setVatNumber(e.target.value)}
                      className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm font-semibold focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card Details */}
              {!isCustomQuote && (
                <div className="space-y-4 border-t border-ink/10 pt-4">
                  <h4 className="font-display text-sm font-extrabold text-ink flex items-center gap-2">
                    <Lock className="size-4 text-brand" />
                    2. Payment Card Details
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-ink/70 mb-1">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="4532 1234 5678 9012"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 pl-10 text-sm font-mono font-semibold focus:border-brand focus:outline-none"
                      />
                      <CreditCard className="absolute left-3 top-3 size-4 text-ink/40" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-ink/70 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm font-mono font-semibold focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink/70 mb-1">
                        CVV / CVC *
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm font-mono font-semibold focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Price Calculation Summary Box */}
              <div className="rounded-2xl bg-mint/30 p-4 border border-brand/20 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-ink/75">
                  <span>
                    {selectedTier.name} Subscription ({billingCycle})
                  </span>
                  <span>R {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-ink/75">
                  <span>15% South African VAT</span>
                  <span>R {vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-brand-deep pt-2 border-t border-brand/20">
                  <span>Total Due Now (ZAR):</span>
                  <span className="font-display text-base">R {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Security guarantee */}
              <div className="flex items-center gap-2 text-[11px] font-semibold text-ink/60">
                <ShieldCheck className="size-4 text-brand shrink-0" />
                <span>
                  Protected by 256-bit SSL encryption. Tax Invoices automatically emailed in
                  compliance with SARS guidelines.
                </span>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 font-display text-sm font-extrabold text-white shadow-[0_5px_0_oklch(0.475_0.094_162.9)] transition hover:bg-brand-deep active:translate-y-0.5 active:shadow-none"
              >
                <Lock className="size-4" />
                {isCustomQuote
                  ? "Submit Custom Quote Request"
                  : `Pay R ${totalAmount.toLocaleString()} via Card`}
              </button>
            </form>
          )}

          {/* STEP 2: PROCESSING STATE */}
          {step === "processing" && (
            <div className="py-12 text-center space-y-4">
              <div className="relative mx-auto size-16">
                <div className="absolute inset-0 rounded-full border-4 border-brand/20" />
                <div className="absolute inset-0 rounded-full border-4 border-brand border-t-transparent animate-spin" />
              </div>
              <div>
                <h4 className="font-display text-lg font-extrabold text-ink">
                  Authorizing Payment...
                </h4>
                <p className="mt-1 text-xs text-ink/65 font-semibold max-w-xs mx-auto">
                  Connecting to South African 3D Secure 2.0 gateway and generating your official Tax
                  Invoice.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: RECEIPT & INVOICE DISPLAY */}
          {step === "receipt" && receipt && (
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="flex items-center gap-3 rounded-2xl bg-mint p-4 border border-brand/20 text-brand-deep">
                <div className="grid size-10 place-items-center rounded-xl bg-brand text-white shrink-0">
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-extrabold">
                    Payment Successful & Tier Activated!
                  </h4>
                  <p className="text-xs text-ink/75 font-semibold">
                    A copy of Tax Invoice <span className="font-bold">{receipt.invoiceNumber}</span>{" "}
                    has been sent to {receipt.email}.
                  </p>
                </div>
              </div>

              {/* Formal Tax Invoice Printable Card */}
              <div
                id="printable-tax-invoice"
                className="rounded-2xl border border-ink/15 bg-white p-6 shadow-sm space-y-4 text-ink"
              >
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b border-ink/10 pb-4">
                  <div>
                    <h5 className="font-display text-base font-extrabold text-brand-deep">
                      CivicRewards SA (Pty) Ltd
                    </h5>
                    <p className="text-[11px] text-ink/60">Reg: 2024/981244/07 | VAT: 4980291482</p>
                    <p className="text-[11px] text-ink/60">
                      150 Sandton Drive, Johannesburg, Gauteng
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-lg bg-mint px-2.5 py-1 text-[10px] font-extrabold uppercase text-brand-deep">
                      TAX INVOICE · PAID
                    </span>
                    <p className="mt-1.5 font-mono text-xs font-bold text-ink">
                      {receipt.invoiceNumber}
                    </p>
                    <p className="text-[11px] text-ink/60">{receipt.date}</p>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-4 text-xs border-b border-ink/10 pb-4">
                  <div>
                    <p className="font-bold text-ink/50 uppercase text-[10px]">Billed To</p>
                    <p className="font-bold text-ink">{receipt.companyName}</p>
                    <p className="text-ink/70">{receipt.email}</p>
                    {receipt.vatNumber && (
                      <p className="text-ink/70">VAT Reg: {receipt.vatNumber}</p>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-ink/50 uppercase text-[10px]">Payment Details</p>
                    <p className="font-bold text-ink">
                      {receipt.cardBrand} ending in •••• {receipt.cardLast4}
                    </p>
                    <p className="text-ink/70">Ref: {receipt.transactionId}</p>
                    <p className="text-brand font-bold text-[11px]">Status: Approved</p>
                  </div>
                </div>

                {/* Line Items Table */}
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-ink/10 text-ink/50 uppercase text-[10px]">
                      <th className="py-2">Description</th>
                      <th className="py-2">Cycle</th>
                      <th className="py-2 text-right">Amount (ZAR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5 font-semibold">
                    <tr>
                      <td className="py-2.5">
                        <p className="font-bold text-ink">{receipt.tierName} Sponsorship</p>
                        <p className="text-[11px] text-ink/60">
                          Ward Partner Listing & Local Ad Placement
                        </p>
                      </td>
                      <td className="py-2.5 capitalize">{receipt.billingCycle}</td>
                      <td className="py-2.5 text-right font-mono">
                        R {receipt.subtotal.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Totals Breakdown */}
                <div className="border-t border-ink/10 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-ink/70">
                    <span>Subtotal (excl. VAT)</span>
                    <span className="font-mono">R {receipt.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-ink/70">
                    <span>15% South African VAT</span>
                    <span className="font-mono">R {receipt.vatAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-display text-sm font-extrabold text-brand-deep pt-2 border-t border-ink/10">
                    <span>Total Amount Paid</span>
                    <span className="font-mono">R {receipt.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownloadInvoice}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3 font-display text-xs font-bold text-white shadow-[0_4px_0_oklch(0.475_0.094_162.9)] transition hover:bg-brand-deep"
                >
                  <Download className="size-4" />
                  Download Tax Invoice (HTML)
                </button>
                <button
                  onClick={handlePrintReceipt}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-cream px-4 py-3 font-display text-xs font-bold text-ink border border-ink/15 hover:bg-white transition"
                >
                  <Printer className="size-4" />
                  Print Receipt
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gold px-4 py-3 font-display text-xs font-bold text-ink shadow-[0_4px_0_oklch(0.72_0.12_80)] hover:bg-gold-deep transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
