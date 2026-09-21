-- Real Telegram group ingestion, per Thami's explicit go-ahead (18 Sep
-- session: WhatsApp groups aren't achievable via any compliant official
-- API, X is paid and needs separate cost sign-off, Facebook Groups API is
-- Meta-gated — Telegram is the one platform with a free, official,
-- ToS-compliant Bot API for reading group messages, so it's the only one
-- getting real ingestion this pass).
--
-- Messages ingested here NEVER touch ward_reports. That table is the real
-- production Ward 115 municipal report pipeline, shared with Mark Van Der
-- Merwe's live service, and CivicRewards is deliberately read-only against
-- it (see src/lib/councillorAuth.ts's getCouncillorWardReports). Telegram
-- messages land in ward_telegram_messages instead, and are shown to the
-- councillor as a distinct, clearly-labeled "Community Feed" of raw
-- unverified chatter, never presented as an official report.
--
-- Run once in the Supabase SQL editor for project egzzgezgpwxgwmuipvmf.

create table if not exists ward_telegram_links (
  id          uuid primary key default gen_random_uuid(),
  ward_number text not null unique,
  chat_id     bigint unique,
  chat_title  text,
  link_code   text not null,
  verified    boolean not null default false,
  created_at  timestamptz not null default now(),
  verified_at timestamptz
);

alter table ward_telegram_links enable row level security;

create policy "service_role_only"
  on ward_telegram_links for all
  using (false);

create table if not exists ward_telegram_messages (
  id                  uuid primary key default gen_random_uuid(),
  ward_number         text not null,
  chat_id             bigint not null,
  telegram_message_id bigint not null,
  sender_name         text,
  message_text        text,
  received_at         timestamptz not null default now(),
  unique (chat_id, telegram_message_id)
);

alter table ward_telegram_messages enable row level security;

create policy "service_role_only"
  on ward_telegram_messages for all
  using (false);
