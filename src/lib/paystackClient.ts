export interface PaystackCheckoutOptions {
  email: string;
  amountZar: number;
  reference: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
}

interface PaystackPopHandler {
  openIframe: () => void;
}

interface PaystackPop {
  setup: (config: Record<string, unknown>) => PaystackPopHandler;
}

declare global {
  interface Window {
    PaystackPop?: PaystackPop;
  }
}

const PAYSTACK_SCRIPT_SRC = "https://js.paystack.co/v1/inline.js";

let scriptLoadPromise: Promise<void> | null = null;

function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Paystack checkout can only run in the browser"));
  }
  if (window.PaystackPop) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${PAYSTACK_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Paystack checkout")));
      return;
    }
    const script = document.createElement("script");
    script.src = PAYSTACK_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack checkout"));
    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

export function generatePaystackReference(): string {
  return `CIVIC-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function openPaystackCheckout(options: PaystackCheckoutOptions): Promise<void> {
  const publicKey = import.meta.env["VITE_PAYSTACK_PUBLIC_KEY"] as string | undefined;
  if (!publicKey) {
    throw new Error("Paystack public key is not configured (VITE_PAYSTACK_PUBLIC_KEY)");
  }

  await loadPaystackScript();
  if (!window.PaystackPop) {
    throw new Error("Paystack failed to load");
  }

  const handler = window.PaystackPop.setup({
    key: publicKey,
    email: options.email,
    amount: Math.round(options.amountZar * 100),
    currency: "ZAR",
    ref: options.reference,
    metadata: options.metadata,
    callback: (response: { reference: string }) => options.onSuccess(response.reference),
    onClose: options.onCancel,
  });

  handler.openIframe();
}
