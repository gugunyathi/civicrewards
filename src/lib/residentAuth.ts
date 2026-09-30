import { randomBytes } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "./supabaseAdmin";

const MAX_ATTEMPTS = 5;

// Stored bare in civicrewards_signin_otp_sessions.session_token — the
// "signin_" prefix (see telegramWebhookHandler.ts's SIGNIN_TOKEN_PREFIX)
// is added only when ReportApp.tsx builds the actual Telegram deep link
// (so the webhook can route /start payloads to this table vs.
// report_otp_sessions without a second lookup), and stripped back off by
// the webhook handler before it queries here. Do not prepend it here too
// — a double-prefixed token looked up after single-stripping never
// matches its own row, found live during testing.
function generateSessionToken(): string {
  return randomBytes(24).toString("base64url");
}

function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateBearerToken(): string {
  return randomBytes(32).toString("base64url");
}

// Plain Bot API call, same shape as telegramWebhookHandler.ts's own
// sendTelegramMessage — duplicated rather than imported since that one is
// deliberately not exported (keeps the webhook handler's send path
// independent of anything else that might change).
async function sendTelegramMessage(chatId: number, text: string): Promise<void> {
  const token = process.env["TELEGRAM_BOT_TOKEN"];
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!response.ok) throw new Error(`Telegram sendMessage failed: ${response.status}`);
}

// Reuses Moja's live WhatsApp number via 360dialog — same provider/number
// Moja's own webhook sends from (signal-desk-v4/app/api/webhook/moja,
// MOJA_360DIALOG_API_KEY). CivicRewards holds its own copy of that key
// value under this name rather than calling into signal-desk-v4, so the
// two apps stay independently deployable. Not configured until Thami
// copies the key into this project's Vercel env — throws a clear error
// until then rather than silently pretending to send.
async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const key = process.env["MOJA_WHATSAPP_API_KEY"];
  if (!key) throw new Error("MOJA_WHATSAPP_API_KEY is not configured");

  const response = await fetch("https://waba-v2.360dialog.io/messages", {
    method: "POST",
    headers: { "D360-API-KEY": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`360dialog send failed: ${response.status} ${body.slice(0, 200)}`);
  }
}

export function normalizePhone(raw: string): string {
  // Accept whatever a human types (spaces, dashes, a leading 0 or +27) —
  // Postel's Law, per this project's own UX standard — and normalise to
  // the digits-only, country-code-prefixed form 360dialog/WhatsApp expects.
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("27")) return digits;
  if (digits.startsWith("0")) return "27" + digits.slice(1);
  return digits;
}

export interface SignInUserRow {
  id: string;
  points_balance: number;
  display_name: string | null;
  ward_number: string | null;
  municipality_id: string | null;
}

export async function findOrCreateUser(
  admin: ReturnType<typeof getSupabaseAdmin>,
  identity: { phoneNumber?: string; telegramUserId?: number },
): Promise<SignInUserRow> {
  const SELECT_COLS = "id, points_balance, display_name, ward_number, municipality_id";
  const existing = identity.phoneNumber
    ? (await admin.from("civicrewards_users").select(SELECT_COLS).eq("phone_number", identity.phoneNumber).maybeSingle()).data
    : (await admin.from("civicrewards_users").select(SELECT_COLS).eq("telegram_user_id", identity.telegramUserId!).maybeSingle()).data;

  if (existing) {
    await admin.from("civicrewards_users").update({ last_seen_at: new Date().toISOString() }).eq("id", existing.id);
    return existing;
  }

  const { data: created, error } = identity.phoneNumber
    ? await admin.from("civicrewards_users").insert({ phone_number: identity.phoneNumber }).select(SELECT_COLS).single()
    : await admin.from("civicrewards_users").insert({ telegram_user_id: identity.telegramUserId! }).select(SELECT_COLS).single();
  if (error || !created) {
    throw new Error(`Could not create resident account: ${error?.message}`);
  }
  return created;
}

export async function createSession(
  admin: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
): Promise<string> {
  const token = generateBearerToken();
  const { error } = await admin.from("civicrewards_sessions").insert({ session_token: token, user_id: userId });
  if (error) throw new Error(`Could not start session: ${error.message}`);
  return token;
}

// ── Telegram sign-in ─────────────────────────────────────────────────────

export const requestTelegramSignIn = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ sessionToken: string }> => {
    const admin = getSupabaseAdmin();
    const sessionToken = generateSessionToken();
    const { error } = await admin
      .from("civicrewards_signin_otp_sessions")
      .insert({ session_token: sessionToken, channel: "telegram" });
    if (error) throw new Error(`Could not start sign-in: ${error.message}`);
    return { sessionToken };
  },
);

// ── WhatsApp sign-in ─────────────────────────────────────────────────────

function validatePhoneRequest(data: unknown): { phoneNumber: string } {
  const phoneNumber = (data as { phoneNumber?: unknown })?.phoneNumber;
  if (typeof phoneNumber !== "string" || !phoneNumber.trim()) {
    throw new Error("Phone number is required");
  }
  return { phoneNumber: normalizePhone(phoneNumber) };
}

export const requestWhatsAppSignIn = createServerFn({ method: "POST" })
  .validator(validatePhoneRequest)
  .handler(async ({ data }): Promise<{ sessionToken: string }> => {
    const admin = getSupabaseAdmin();
    const sessionToken = generateSessionToken();
    const otpCode = generateOtpCode();

    const { error } = await admin.from("civicrewards_signin_otp_sessions").insert({
      session_token: sessionToken,
      channel: "whatsapp",
      phone_number: data.phoneNumber,
      otp_code: otpCode,
      otp_sent_at: new Date().toISOString(),
    });
    if (error) throw new Error(`Could not start sign-in: ${error.message}`);

    // Sent inline (not via a webhook round-trip like Telegram) since
    // there's nothing to wait for — the number is already known at
    // request time. A send failure still leaves the code stored, so a
    // retried request just needs a fresh OTP, not a fresh session.
    await sendWhatsAppMessage(
      data.phoneNumber,
      `Your CivicRewards sign-in code is ${otpCode}. It expires in 15 minutes. Never share this code with anyone.`,
    );

    return { sessionToken };
  });

// ── Shared status/verify, both channels ─────────────────────────────────

function validateSessionToken(data: unknown): { sessionToken: string } {
  const token = (data as { sessionToken?: unknown })?.sessionToken;
  if (typeof token !== "string" || !token) throw new Error("Missing sign-in session");
  return { sessionToken: token };
}

export interface SignInStatus {
  otpSent: boolean;
  verified: boolean;
  locked: boolean;
  expired: boolean;
}

export const getSignInStatus = createServerFn({ method: "POST" })
  .validator(validateSessionToken)
  .handler(async ({ data }): Promise<SignInStatus> => {
    const admin = getSupabaseAdmin();
    const { data: row, error } = await admin
      .from("civicrewards_signin_otp_sessions")
      .select("otp_sent_at, verified, locked, expires_at")
      .eq("session_token", data.sessionToken)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) return { otpSent: false, verified: false, locked: false, expired: true };

    return {
      otpSent: row.otp_sent_at != null,
      verified: row.verified,
      locked: row.locked,
      expired: new Date(row.expires_at).getTime() < Date.now(),
    };
  });

function validateVerifyCode(data: unknown): { sessionToken: string; code: string } {
  const { sessionToken } = validateSessionToken(data);
  const code = (data as { code?: unknown })?.code;
  if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
    throw new Error("Enter the 6-digit code");
  }
  return { sessionToken, code };
}

export interface VerifiedSession {
  bearerToken: string;
  userId: string;
  pointsBalance: number;
  displayName: string | null;
}

export const verifySignInCode = createServerFn({ method: "POST" })
  .validator(validateVerifyCode)
  .handler(async ({ data }): Promise<VerifiedSession> => {
    const admin = getSupabaseAdmin();
    const { data: row, error } = await admin
      .from("civicrewards_signin_otp_sessions")
      .select("id, channel, phone_number, telegram_chat_id, otp_code, attempt_count, locked, verified, expires_at, user_id")
      .eq("session_token", data.sessionToken)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) throw new Error("Sign-in session not found — please start again");
    if (row.locked) throw new Error("Too many wrong attempts — please start sign-in again");
    if (new Date(row.expires_at).getTime() < Date.now()) {
      throw new Error("This code has expired — please start sign-in again");
    }
    if (!row.otp_code) {
      throw new Error(
        row.channel === "telegram"
          ? "No code has been sent yet — open Telegram and hit Start first"
          : "No code has been sent yet",
      );
    }

    if (row.otp_code !== data.code) {
      const nextAttemptCount = row.attempt_count + 1;
      await admin
        .from("civicrewards_signin_otp_sessions")
        .update({ attempt_count: nextAttemptCount, locked: nextAttemptCount >= MAX_ATTEMPTS })
        .eq("id", row.id);
      throw new Error(
        nextAttemptCount >= MAX_ATTEMPTS
          ? "Too many wrong attempts — please start sign-in again"
          : "That code isn't right — please try again",
      );
    }

    // Already verified (e.g. a retried request after the client missed
    // the first response) — resolve to the same user again rather than
    // erroring, but don't mint a second session for a no-op replay.
    if (row.verified && row.user_id) {
      const { data: existingUser } = await admin
        .from("civicrewards_users")
        .select("id, points_balance, display_name")
        .eq("id", row.user_id)
        .maybeSingle();
      if (existingUser) {
        const bearerToken = await createSession(admin, existingUser.id);
        return {
          bearerToken,
          userId: existingUser.id,
          pointsBalance: existingUser.points_balance,
          displayName: existingUser.display_name,
        };
      }
    }

    const user = await findOrCreateUser(
      admin,
      row.channel === "whatsapp"
        ? { phoneNumber: row.phone_number! }
        : { telegramUserId: row.telegram_chat_id! },
    );

    await admin
      .from("civicrewards_signin_otp_sessions")
      .update({ verified: true, verified_at: new Date().toISOString(), user_id: user.id })
      .eq("id", row.id);

    await admin.from("civicrewards_activity_log").insert({
      user_id: user.id,
      activity_type: "sign_in",
      metadata: { channel: row.channel },
    });

    const bearerToken = await createSession(admin, user.id);

    return {
      bearerToken,
      userId: user.id,
      pointsBalance: user.points_balance,
      displayName: user.display_name,
    };
  });

// ── Session-scoped reads/writes used by the rest of ReportApp ───────────

function validateBearerToken(data: unknown): { bearerToken: string } {
  const token = (data as { bearerToken?: unknown })?.bearerToken;
  if (typeof token !== "string" || !token) throw new Error("Not signed in");
  return { bearerToken: token };
}

async function requireSession(
  admin: ReturnType<typeof getSupabaseAdmin>,
  bearerToken: string,
): Promise<{ userId: string }> {
  const { data: row } = await admin
    .from("civicrewards_sessions")
    .select("user_id, expires_at")
    .eq("session_token", bearerToken)
    .maybeSingle();
  if (!row || new Date(row.expires_at).getTime() < Date.now()) {
    throw new Error("Your session has expired — please sign in again");
  }
  await admin
    .from("civicrewards_sessions")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("session_token", bearerToken);
  return { userId: row.user_id };
}

function validateMagicToken(data: unknown): { magicToken: string } {
  const magicToken = (data as { magicToken?: unknown })?.magicToken;
  if (typeof magicToken !== "string" || !magicToken) throw new Error("Missing sign-in link");
  return { magicToken };
}

// Redeems a one-time code minted by /api/moja-magic-link (server-to-server,
// called from signal-desk-v4's Moja webhook when a resident taps
// "CivicRewards" in their WhatsApp menu — see that route for why this is a
// short-lived code and not the real session token embedded in the URL).
// Single-use: marks the row used immediately, so a forwarded/reopened link
// fails cleanly on the second attempt.
export const redeemMagicLink = createServerFn({ method: "POST" })
  .validator(validateMagicToken)
  .handler(async ({ data }): Promise<VerifiedSession> => {
    const admin = getSupabaseAdmin();
    const { data: row, error } = await admin
      .from("civicrewards_magic_links")
      .select("id, user_id, used, expires_at")
      .eq("code", data.magicToken)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) throw new Error("This sign-in link isn't valid — it may have already been used.");
    if (row.used) throw new Error("This sign-in link has already been used — go back to Moja on WhatsApp for a new one.");
    if (new Date(row.expires_at).getTime() < Date.now()) {
      throw new Error("This sign-in link has expired — go back to Moja on WhatsApp for a new one.");
    }

    await admin
      .from("civicrewards_magic_links")
      .update({ used: true, used_at: new Date().toISOString() })
      .eq("id", row.id);

    const { data: user, error: userError } = await admin
      .from("civicrewards_users")
      .select("id, points_balance, display_name")
      .eq("id", row.user_id)
      .single();
    if (userError || !user) throw new Error("Could not load your account");

    await admin.from("civicrewards_activity_log").insert({
      user_id: user.id,
      activity_type: "sign_in",
      metadata: { channel: "moja_magic_link" },
    });

    const bearerToken = await createSession(admin, user.id);
    return {
      bearerToken,
      userId: user.id,
      pointsBalance: user.points_balance,
      displayName: user.display_name,
    };
  });

export interface ResidentProfile {
  userId: string;
  pointsBalance: number;
  displayName: string | null;
  wardNumber: string | null;
  municipalityId: string | null;
}

export const getResidentProfile = createServerFn({ method: "POST" })
  .validator(validateBearerToken)
  .handler(async ({ data }): Promise<ResidentProfile> => {
    const admin = getSupabaseAdmin();
    const { userId } = await requireSession(admin, data.bearerToken);
    const { data: row, error } = await admin
      .from("civicrewards_users")
      .select("points_balance, display_name, ward_number, municipality_id")
      .eq("id", userId)
      .single();
    if (error || !row) throw new Error("Could not load your profile");
    return {
      userId,
      pointsBalance: row.points_balance,
      displayName: row.display_name,
      wardNumber: row.ward_number,
      municipalityId: row.municipality_id,
    };
  });

export const signOutResident = createServerFn({ method: "POST" })
  .validator(validateBearerToken)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const admin = getSupabaseAdmin();
    await admin.from("civicrewards_sessions").delete().eq("session_token", data.bearerToken);
    return { ok: true };
  });

// Shared by any real earning/spending action (report submitted, reward
// claimed, etc.) — one place that writes both the audit row and the
// atomic balance update, so nothing can log an activity without the
// points actually moving, or move points without a record of why.
export async function recordActivityAndAwardPoints(
  bearerToken: string,
  activityType: string,
  pointsDelta: number,
  metadata?: Record<string, unknown>,
): Promise<{ pointsBalance: number }> {
  const admin = getSupabaseAdmin();
  const { userId } = await requireSession(admin, bearerToken);

  const { data: newBalance, error: rpcError } = await admin.rpc("civicrewards_award_points", {
    p_user_id: userId,
    p_delta: pointsDelta,
  });
  if (rpcError) throw new Error(`Could not update points: ${rpcError.message}`);

  await admin.from("civicrewards_activity_log").insert({
    user_id: userId,
    activity_type: activityType,
    points_delta: pointsDelta,
    metadata: metadata ?? null,
  });

  return { pointsBalance: newBalance as number };
}

function validateActivityRequest(data: unknown): {
  bearerToken: string;
  activityType: string;
  pointsDelta: number;
  metadata?: Record<string, unknown>;
} {
  const { bearerToken } = validateBearerToken(data);
  const d = data as { activityType?: unknown; pointsDelta?: unknown; metadata?: unknown };
  if (typeof d.activityType !== "string" || !d.activityType.trim()) {
    throw new Error("Missing activity type");
  }
  if (typeof d.pointsDelta !== "number" || !Number.isFinite(d.pointsDelta)) {
    throw new Error("Missing points amount");
  }
  const metadata = d.metadata as Record<string, unknown> | undefined;
  return {
    bearerToken,
    activityType: d.activityType,
    pointsDelta: d.pointsDelta,
    ...(metadata !== undefined ? { metadata } : {}),
  };
}

// Client-callable wrapper around recordActivityAndAwardPoints — used by
// the advert-claim button and (once wired in) the report-submission
// reward, anywhere a signed-in resident's balance needs to move from the
// browser rather than from another server function that already has the
// bearer token in scope.
export const recordResidentActivity = createServerFn({ method: "POST" })
  .validator(validateActivityRequest)
  .handler(async ({ data }): Promise<{ pointsBalance: number }> => {
    return recordActivityAndAwardPoints(data.bearerToken, data.activityType, data.pointsDelta, data.metadata);
  });

export const getResidentActivity = createServerFn({ method: "POST" })
  .validator(validateBearerToken)
  .handler(
    async ({
      data,
    }): Promise<Array<{ id: string; activityType: string; pointsDelta: number; createdAt: string }>> => {
      const admin = getSupabaseAdmin();
      const { userId } = await requireSession(admin, data.bearerToken);
      const { data: rows, error } = await admin
        .from("civicrewards_activity_log")
        .select("id, activity_type, points_delta, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw new Error(error.message);
      return (rows ?? []).map((r) => ({
        id: r.id,
        activityType: r.activity_type,
        pointsDelta: r.points_delta,
        createdAt: r.created_at,
      }));
    },
  );
