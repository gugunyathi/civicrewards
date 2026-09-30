import { timingSafeEqual, randomBytes } from "node:crypto";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { normalizePhone, findOrCreateUser } from "./residentAuth";

// Server-to-server only — called directly by signal-desk-v4's Moja webhook
// when a resident taps "CivicRewards" in their WhatsApp menu. Moja already
// knows the real WhatsApp number from the live conversation, so this skips
// the OTP round-trip entirely and mints a short-lived, single-use sign-in
// code instead. Separate secret from TELEGRAM_WEBHOOK_SECRET/anything
// resident-facing — this is a trust boundary between two projects, not
// between CivicRewards and its own users.
const SECRET_HEADER = "x-moja-shared-secret";

function secretMatches(request: Request): boolean {
  const expected = process.env["MOJA_MAGIC_LINK_SECRET"];
  if (!expected) return false;

  const provided = request.headers.get(SECRET_HEADER);
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function generateMagicCode(): string {
  return randomBytes(24).toString("base64url");
}

export async function handleMojaMagicLinkRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  if (!secretMatches(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let body: { phoneNumber?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  if (typeof body.phoneNumber !== "string" || !body.phoneNumber.trim()) {
    return new Response(JSON.stringify({ error: "phoneNumber is required" }), { status: 400 });
  }

  try {
    const phoneNumber = normalizePhone(body.phoneNumber);
    const admin = getSupabaseAdmin();
    const user = await findOrCreateUser(admin, { phoneNumber });

    const code = generateMagicCode();
    const { error } = await admin.from("civicrewards_magic_links").insert({
      code,
      phone_number: phoneNumber,
      user_id: user.id,
    });
    if (error) {
      console.error("Failed to create magic link:", error.message);
      return new Response(JSON.stringify({ error: "Could not create sign-in link" }), { status: 500 });
    }

    const baseUrl = process.env["CIVICREWARDS_BASE_URL"] ?? "https://civicrewards.co.za";
    return new Response(
      JSON.stringify({ url: `${baseUrl}/ReportApp?magicToken=${code}` }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Moja magic link request failed:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}
