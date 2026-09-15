import { createServerFn } from "@tanstack/react-start";

export interface PaystackVerifiedTransaction {
  reference: string;
  amountZar: number;
  status: string;
  paidAt: string | null;
  customerEmail: string;
  cardLast4: string;
  cardBrand: string;
}

interface PaystackVerifyPayload {
  status: boolean;
  message?: string;
  data?: {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    paid_at: string | null;
    customer?: { email?: string };
    authorization?: { last4?: string; card_type?: string };
  };
}

// Paystack amounts are always in the currency's lowest denomination (cents for ZAR).
export const verifyPaystackTransaction = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (
      typeof data !== "object" ||
      data === null ||
      typeof (data as { reference?: unknown }).reference !== "string" ||
      !(data as { reference: string }).reference
    ) {
      throw new Error("A transaction reference is required");
    }
    return { reference: (data as { reference: string }).reference };
  })
  .handler(async ({ data }): Promise<PaystackVerifiedTransaction> => {
    const secretKey = process.env["PAYSTACK_SECRET_KEY"];
    if (!secretKey) {
      throw new Error("Paystack is not configured on this server");
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(data.reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } },
    );

    const payload = (await response.json()) as PaystackVerifyPayload;

    if (!response.ok || !payload.status || !payload.data) {
      throw new Error(payload.message ?? "Could not verify payment with Paystack");
    }

    const tx = payload.data;
    if (tx.status !== "success") {
      throw new Error(`Payment was not successful (status: ${tx.status})`);
    }
    if (tx.currency !== "ZAR") {
      throw new Error(`Unexpected transaction currency: ${tx.currency}`);
    }

    const authorization = tx.authorization ?? {};
    const cardType = authorization.card_type ?? "";
    const firstWord = cardType.split(" ")[0];
    const cardBrand = firstWord ? firstWord.charAt(0).toUpperCase() + firstWord.slice(1) : "Card";

    return {
      reference: tx.reference,
      amountZar: tx.amount / 100,
      status: tx.status,
      paidAt: tx.paid_at,
      customerEmail: tx.customer?.email ?? "",
      cardLast4: authorization.last4 ?? "0000",
      cardBrand,
    };
  });
