import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "./supabaseAdmin";

function validateInquiry(data: unknown) {
  const d = data as {
    fullName?: unknown;
    email?: unknown;
    company?: unknown;
    metro?: unknown;
    track?: unknown;
    notes?: unknown;
    website?: unknown;
  };

  if (typeof d?.website === "string" && d.website.length > 0) {
    // Honeypot tripped — report success without writing anything, same
    // silent-reject behavior the form already had.
    return { honeypot: true as const };
  }

  const fullName = typeof d?.fullName === "string" ? d.fullName.trim() : "";
  const email = typeof d?.email === "string" ? d.email.trim() : "";
  if (!fullName || !email) {
    throw new Error("Full name and email are required");
  }

  return {
    honeypot: false as const,
    fullName,
    email,
    company: typeof d?.company === "string" ? d.company.trim() : "",
    metro: typeof d?.metro === "string" ? d.metro.trim() : "",
    track: typeof d?.track === "string" ? d.track.trim() : "",
    notes: typeof d?.notes === "string" ? d.notes.trim() : "",
  };
}

export const submitPartnerInquiry = createServerFn({ method: "POST" })
  .validator(validateInquiry)
  .handler(async ({ data }): Promise<{ submitted: true }> => {
    if (data.honeypot) return { submitted: true };

    const admin = getSupabaseAdmin();
    const { error } = await admin.from("partner_inquiries").insert({
      full_name: data.fullName,
      email: data.email,
      company: data.company || null,
      metro: data.metro,
      track: data.track,
      notes: data.notes || null,
    });

    if (error) {
      throw new Error(`Could not submit application: ${error.message}`);
    }
    return { submitted: true };
  });
