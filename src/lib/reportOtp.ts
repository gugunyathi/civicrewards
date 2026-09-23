import { createServerFn } from "@tanstack/react-start";
import { randomBytes } from "node:crypto";
import { getSupabaseAdmin } from "./supabaseAdmin";

const MAX_ATTEMPTS = 5;

function generateSessionToken(): string {
  return randomBytes(24).toString("base64url");
}

// Anonymous — this is for a resident who isn't signed in at all, that's
// the whole point of report submission on /ReportApp. No auth check here
// is deliberate, not an oversight.
export const createOtpSession = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ sessionToken: string }> => {
    const admin = getSupabaseAdmin();
    const sessionToken = generateSessionToken();

    const { error } = await admin.from("report_otp_sessions").insert({ session_token: sessionToken });
    if (error) {
      throw new Error(`Could not start verification: ${error.message}`);
    }
    return { sessionToken };
  },
);

function validateSessionToken(data: unknown): { sessionToken: string } {
  const token = (data as { sessionToken?: unknown })?.sessionToken;
  if (typeof token !== "string" || !token) {
    throw new Error("Missing verification session");
  }
  return { sessionToken: token };
}

export interface OtpSessionStatus {
  otpSent: boolean;
  verified: boolean;
  locked: boolean;
  expired: boolean;
}

export const getOtpSessionStatus = createServerFn({ method: "POST" })
  .validator(validateSessionToken)
  .handler(async ({ data }): Promise<OtpSessionStatus> => {
    const admin = getSupabaseAdmin();
    const { data: row, error } = await admin
      .from("report_otp_sessions")
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

// Deliberately capped at MAX_ATTEMPTS — a 6-digit code with unlimited
// guesses is a real weakness (1 in a million odds get a lot better with
// unlimited tries), so the session locks permanently after 5 wrong
// attempts rather than just rate-limiting by time.
export const verifyOtpCode = createServerFn({ method: "POST" })
  .validator(validateVerifyCode)
  .handler(async ({ data }): Promise<{ verified: true }> => {
    const admin = getSupabaseAdmin();
    const { data: row, error } = await admin
      .from("report_otp_sessions")
      .select("id, otp_code, attempt_count, locked, verified, expires_at")
      .eq("session_token", data.sessionToken)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) throw new Error("Verification session not found — please start again");
    if (row.verified) return { verified: true };
    if (row.locked) throw new Error("Too many wrong attempts — please start verification again");
    if (new Date(row.expires_at).getTime() < Date.now()) {
      throw new Error("This code has expired — please start verification again");
    }
    if (!row.otp_code) {
      throw new Error("No code has been sent yet — open Telegram and hit Start first");
    }

    if (row.otp_code !== data.code) {
      const nextAttemptCount = row.attempt_count + 1;
      await admin
        .from("report_otp_sessions")
        .update({ attempt_count: nextAttemptCount, locked: nextAttemptCount >= MAX_ATTEMPTS })
        .eq("id", row.id);
      throw new Error(
        nextAttemptCount >= MAX_ATTEMPTS
          ? "Too many wrong attempts — please start verification again"
          : "That code isn't right — please try again",
      );
    }

    await admin
      .from("report_otp_sessions")
      .update({ verified: true, verified_at: new Date().toISOString() })
      .eq("id", row.id);

    return { verified: true };
  });
