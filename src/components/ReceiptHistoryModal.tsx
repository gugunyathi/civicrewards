import React from "react";
import { X, Receipt, Download, ShieldCheck, CheckCircle2, FileText, Calendar } from "lucide-react";
import { ReceiptData } from "./CardPaymentModal";

interface ReceiptHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: ReceiptData[];
  onSelectReceipt: (receipt: ReceiptData) => void;
}

export const ReceiptHistoryModal: React.FC<ReceiptHistoryModalProps> = ({
  isOpen,
  onClose,
  receipts,
  onSelectReceipt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2.2rem] bg-white shadow-2xl border border-ink/10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 bg-gradient-to-r from-cream to-mint/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-brand text-white shadow-sm font-display font-extrabold text-lg">
              <Receipt className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-extrabold text-ink leading-tight">
                Billing & Tax Invoices
              </h3>
              <p className="text-xs text-ink/60 font-semibold">
                View paid partner tier receipts & tax compliance docs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ink/60 hover:bg-black/5 hover:text-ink transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {receipts.length === 0 ? (
            <div className="py-12 text-center text-ink/60">
              <FileText className="mx-auto size-12 text-ink/20 mb-3" />
              <p className="font-display font-bold text-base text-ink">No Payment History Yet</p>
              <p className="text-xs max-w-xs mx-auto mt-1">
                Select a sponsorship tier to complete card payment and generate your first
                SARS-compliant Tax Invoice.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {receipts.map((r) => (
                <div
                  key={r.transactionId}
                  className="flex items-center justify-between rounded-2xl bg-cream p-4 border border-ink/10 hover:border-brand/40 transition cursor-pointer"
                  onClick={() => onSelectReceipt(r)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-sm text-brand-deep">
                        {r.tierName} Tier
                      </span>
                      <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-extrabold text-brand-deep uppercase">
                        PAID
                      </span>
                    </div>
                    <p className="text-xs text-ink/60 font-mono">Invoice: {r.invoiceNumber}</p>
                    <p className="text-[11px] text-ink/50 flex items-center gap-1">
                      <Calendar className="size-3" /> {r.date} · {r.cardBrand} •••• {r.cardLast4}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-extrabold text-base text-ink">
                      R {r.totalAmount.toLocaleString()}
                    </p>
                    <span className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1 mt-1">
                      View Invoice →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
