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
    }
  } catch (error) {
    console.error("Telegram webhook processing failed:", error);
  }

  return new Response("OK", { status: 200 });
}
