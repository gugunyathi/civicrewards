import { timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin } from "./supabaseAdmin";

// Telegram's documented mechanism for authenticating inbound webhook
// calls: the secret_token passed to setWebhook comes back on every real
// call as this header. Anyone without it gets rejected before we look at
// the body at all.
const SECRET_HEADER = "x-telegram-bot-api-secret-token";

function secretMatches(request: Request): boolean {
  const expected = process.env["TELEGRAM_WEBHOOK_SECRET"];
  if (!expected) return false;

  const provided = request.headers.get(SECRET_HEADER);
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

interface TelegramUpdate {
  message?: {
    message_id: number;
    text?: string;
    chat: { id: number; type: string; title?: string };
    from?: { first_name?: string; username?: string };
  };
}

const LINK_COMMAND = /^\s*\/link\s+([A-Za-z0-9]+)\s*$/i;
const START_COMMAND = /^\s*\/start\s+(\S+)\s*$/i;

function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Telegram's sendMessage — a plain, free Bot API call. TELEGRAM_BOT_TOKEN
// is read server-side only and never logged; a failure here (e.g. token
// not configured yet) is caught by the caller and just means the OTP
// never arrives, not a crash.
async function sendTelegramMessage(chatId: number, text: string): Promise<void> {
  const token = process.env["TELEGRAM_BOT_TOKEN"];
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!response.ok) {
    throw new Error(`Telegram sendMessage failed: ${response.status}`);
  }
}

// Private-chat /start <session_token> — the OTP verification flow for
// anonymous resident report submission (src/lib/reportOtp.ts,
// ReportApp.tsx). Distinct from handleLinkCommand's /link <CODE>, which
// only ever runs in group/supergroup chats for the councillor
// ward-linking feature.
async function handleStartCommand(sessionToken: string, chatId: number): Promise<void> {
  const admin = getSupabaseAdmin();
  const { data: row } = await admin
    .from("report_otp_sessions")
    .select("id, verified, locked, expires_at")
    .eq("session_token", sessionToken)
    .maybeSingle();

  // Unknown/expired/already-resolved session — say nothing back, same
  // "don't leak which case it was" posture as handleLinkCommand.
  if (!row || row.verified || row.locked) return;
  if (new Date(row.expires_at).getTime() < Date.now()) return;

  const otpCode = generateOtpCode();
  const { error } = await admin
    .from("report_otp_sessions")
    .update({ telegram_chat_id: chatId, otp_code: otpCode, otp_sent_at: new Date().toISOString() })
    .eq("id", row.id);
  if (error) {
    console.error("Failed to store OTP:", error.message);
    return;
  }

  try {
    await sendTelegramMessage(
      chatId,
      `Your CivicRewards verification code is ${otpCode}. It expires in 15 minutes. Never share this code with anyone.`,
    );
  } catch (error) {
    // The row is already updated with this code even though the send
    // failed (e.g. bot token not configured yet) — a repeat /start just
    // generates and stores a fresh code and tries again, that's fine and
    // shouldn't crash the webhook either way.
    console.error("Failed to send OTP via Telegram:", error);
  }
}

async function handleLinkCommand(code: string, chatId: number, chatTitle: string | null): Promise<void> {
  const admin = getSupabaseAdmin();
  const { data: row } = await admin
    .from("ward_telegram_links")
    .select("id, verified")
    .eq("link_code", code.toUpperCase())
    .maybeSingle();

  // Wrong code, or that ward is already verified with a different chat —
  // do nothing. This is a public chat, so we never reply with which case
  // it was.
  if (!row || row.verified) return;

  await admin
    .from("ward_telegram_links")
    .update({ chat_id: chatId, chat_title: chatTitle, verified: true, verified_at: new Date().toISOString() })
    .eq("id", row.id);
}

async function storeGroupMessage(update: NonNullable<TelegramUpdate["message"]>): Promise<void> {
  const admin = getSupabaseAdmin();
  const { data: link } = await admin
    .from("ward_telegram_links")
    .select("ward_number")
    .eq("chat_id", update.chat.id)
    .eq("verified", true)
    .maybeSingle();

  // Bot is in this group, but nobody's claimed/linked it yet — ignore.
  if (!link) return;

  const senderName = update.from?.first_name ?? update.from?.username ?? null;
  await admin.from("ward_telegram_messages").insert({
    ward_number: link.ward_number,
    chat_id: update.chat.id,
    telegram_message_id: update.message_id,
    sender_name: senderName,
    message_text: update.text ?? null,
  });
  // A duplicate (chat_id, telegram_message_id) from a Telegram retry hits
  // the unique constraint and errors — that's fine, we don't need to
  // surface it, Telegram already got its 200 either way.
}

// Handles a raw Telegram webhook POST. Always resolves to a Response;
// never throws, since an unhandled error surfacing as a 500 would make
// Telegram retry the same update indefinitely.
export async function handleTelegramWebhook(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!secretMatches(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const update = (await request.json()) as TelegramUpdate;
    const message = update.message;

    if (message && (message.chat.type === "group" || message.chat.type === "supergroup")) {
      const linkMatch = message.text?.match(LINK_COMMAND);
      const code = linkMatch?.[1];
      if (code) {
        await handleLinkCommand(code, message.chat.id, message.chat.title ?? null);
      } else {
        await storeGroupMessage(message);
      }
    } else if (message && message.chat.type === "private") {
      const startMatch = message.text?.match(START_COMMAND);
      const sessionToken = startMatch?.[1];
      if (sessionToken) {
        await handleStartCommand(sessionToken, message.chat.id);
      }
    }
  } catch (error) {
    console.error("Telegram webhook processing failed:", error);
  }

  return new Response("OK", { status: 200 });
}
