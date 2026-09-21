import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { requireCouncillorProfile, validateAccessToken } from "./councillorAuth";

// Unambiguous charset — no 0/O/1/I, since a councillor has to read this
// off a screen and type it into a Telegram group.
const LINK_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateLinkCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += LINK_CODE_CHARS[Math.floor(Math.random() * LINK_CODE_CHARS.length)];
  }
  return code;
}

export interface TelegramLinkStatus {
  requested: boolean;
  verified: boolean;
  chatTitle: string | null;
  linkCode: string | null;
}

async function fetchLinkStatus(wardNumber: string): Promise<TelegramLinkStatus> {
  const admin = getSupabaseAdmin();
  const { data: row, error } = await admin
    .from("ward_telegram_links")
    .select("verified, chat_title, link_code")
    .eq("ward_number", wardNumber)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!row) return { requested: false, verified: false, chatTitle: null, linkCode: null };

  return {
    requested: true,
    verified: row.verified,
    chatTitle: row.chat_title,
    // Once verified, the code no longer does anything useful — don't keep
    // showing it.
    linkCode: row.verified ? null : row.link_code,
  };
}

// Councillor-authenticated. Creates a fresh link code the first time it's
// called for a ward. If a verified link already exists, returns that
// state instead of overwriting it — re-clicking "get code" should never
// silently unlink an already-working group.
export const requestTelegramLinkCode = createServerFn({ method: "POST" })
  .validator(validateAccessToken)
  .handler(async ({ data }): Promise<TelegramLinkStatus> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }

    const admin = getSupabaseAdmin();
    const existing = await fetchLinkStatus(profile.wardNumber);
    if (existing.requested) return existing;

    const linkCode = generateLinkCode();
    const { error } = await admin.from("ward_telegram_links").insert({
      ward_number: profile.wardNumber,
      link_code: linkCode,
      verified: false,
    });
    if (error) throw new Error(`Could not create link code: ${error.message}`);

    return { requested: true, verified: false, chatTitle: null, linkCode };
  });

export const getTelegramLinkStatus = createServerFn({ method: "POST" })
  .validator(validateAccessToken)
  .handler(async ({ data }): Promise<TelegramLinkStatus> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }
    return fetchLinkStatus(profile.wardNumber);
  });

export interface TelegramMessage {
  id: string;
  senderName: string | null;
  messageText: string | null;
  receivedAt: string;
}

const MESSAGE_FEED_LIMIT = 100;

// Councillor-authenticated. This is raw group chatter, not a filtered or
// PII-minimized view — anything here was already visible to every member
// of that public/semi-public group chat, but it's still gated behind the
// councillor's own auth like every other read in this codebase.
export const getWardTelegramMessages = createServerFn({ method: "POST" })
  .validator(validateAccessToken)
  .handler(async ({ data }): Promise<TelegramMessage[]> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }

    const admin = getSupabaseAdmin();
    const { data: rows, error } = await admin
      .from("ward_telegram_messages")
      .select("id, sender_name, message_text, received_at")
      .eq("ward_number", profile.wardNumber)
      .order("received_at", { ascending: false })
      .limit(MESSAGE_FEED_LIMIT);

    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => ({
      id: r.id,
      senderName: r.sender_name,
      messageText: r.message_text,
      receivedAt: r.received_at,
    }));
  });
