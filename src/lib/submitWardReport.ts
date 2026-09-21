import { createServerFn } from "@tanstack/react-start";

// Real categories accepted by signal-desk-v4's live intake — see
// app/api/ward/submit-report/route.ts VALID_CATEGORIES. There is no
// "streetlights" category in the real system; map it to "other" rather than
// invent one that would get silently rejected.
export const WARD_REPORT_CATEGORIES = [
  "water",
  "roads",
  "electricity",
  "city_power",
  "eskom",
  "refuse",
  "safety",
  "billing",
  "other",
] as const;
export type WardReportCategory = (typeof WARD_REPORT_CATEGORIES)[number];

export interface SubmitWardReportInput {
  name: string;
  address: string;
  suburb: string;
  category: WardReportCategory;
  description: string;
  reference?: string;
}

export interface SubmitWardReportResult {
  reference: string | null;
  escalated: boolean;
  noReferenceExpected: boolean;
}

function validateInput(data: unknown): SubmitWardReportInput {
  const d = data as Partial<SubmitWardReportInput> | null;
  if (
    !d ||
    typeof d.name !== "string" ||
    !d.name.trim() ||
    typeof d.address !== "string" ||
    !d.address.trim() ||
    typeof d.suburb !== "string" ||
    !d.suburb.trim() ||
    typeof d.description !== "string" ||
    !d.description.trim() ||
    typeof d.category !== "string" ||
    !WARD_REPORT_CATEGORIES.includes(d.category as WardReportCategory)
  ) {
    throw new Error("Please fill in all required fields");
  }
  return {
    name: d.name.trim(),
    address: d.address.trim(),
    suburb: d.suburb.trim(),
    category: d.category as WardReportCategory,
    description: d.description.trim(),
    ...(d.reference?.trim() ? { reference: d.reference.trim() } : {}),
  };
}

// Server-to-server call to the real Ward 115 intake (the same endpoint the
// Telegram bot uses) — proxied here rather than called from the browser
// because the endpoint has no CORS headers. Note: this endpoint's rate limit
// (5/min) is keyed by the calling IP, which from here is this server's
// egress IP, not the resident's — under real concurrent load from this site,
// residents could rate-limit each other. Known limitation, not fixed here.
export const submitWardReport = createServerFn({ method: "POST" })
  .validator(validateInput)
  .handler(async ({ data }): Promise<SubmitWardReportResult> => {
    const response = await fetch("https://signaldesk.co.za/api/ward/submit-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const payload = (await response.json()) as {
      success?: boolean;
      error?: string;
      reference?: string | null;
      escalated?: boolean;
      noReferenceExpected?: boolean;
    };

    if (!response.ok || !payload.success) {
      throw new Error(payload.error ?? "Report submission failed — please try again");
    }

    return {
      reference: payload.reference ?? null,
      escalated: payload.escalated ?? false,
      noReferenceExpected: payload.noReferenceExpected ?? false,
    };
  });
