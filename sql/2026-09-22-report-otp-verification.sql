-- Telegram-based OTP verification for anonymous resident report
-- submission on /ReportApp. WhatsApp OTP is explicitly out of scope this
-- pass — pending Thami's decision on which production WhatsApp number to
-- send from and confirming the real per-message cost. Telegram's Bot API
-- is free, so this table only ever gets a Telegram chat_id, never a phone
-- number.
--
-- Telegram can't message an arbitrary user who hasn't started a chat with
-- the bot first, so the flow is: resident opens a t.me deep link with a
-- session token, hits Start, the webhook (src/lib/telegramWebhookHandler.ts)
-- receives /start <token> in a private chat, generates the OTP, DMs it,
-- and this row tracks the rest.
--
-- attempt_count exists specifically so a 6-digit code isn't trivially
-- brute-forceable — src/lib/reportOtp.ts locks the session after 5 wrong
-- tries rather than leaving verifyOtpCode uncapped.
--
-- Run once in the Supabase SQL editor for project egzzgezgpwxgwmuipvmf.

create table if not exists report_otp_sessions (
  id               uuid primary key default gen_random_uuid(),
  session_token    text not null unique,
  telegram_chat_id bigint,
  otp_code         text,
  otp_sent_at      timestamptz,
  attempt_count    int not null default 0,
  locked           boolean not null default false,
  verified         boolean not null default false,
  verified_at      timestamptz,
  created_at       timestamptz not null default now(),
  expires_at       timestamptz not null default (now() + interval '15 minutes')
);

alter table report_otp_sessions enable row level security;

create policy "service_role_only"
  on report_otp_sessions for all
  using (false);
