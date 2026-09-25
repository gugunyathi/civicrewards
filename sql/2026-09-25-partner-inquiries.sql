-- Fixes the partner-inquiry modal data-loss bug found 23 Sep 2026: the
-- submit handler only ever called setModalSubmitted(true), never persisted
-- anywhere, so every real partner lead was silently discarded. This table
-- is the destination. Service-role only (admin panel reads it, no anon
-- access needed, same posture as report_otp_sessions/civicrewards_admins).
--
-- Run once in the Supabase SQL editor for project egzzgezgpwxgwmuipvmf.

create table if not exists partner_inquiries (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  email        text not null,
  company      text,
  metro        text not null,
  track        text not null,
  notes        text,
  created_at   timestamptz not null default now()
);

alter table partner_inquiries enable row level security;

create policy "service_role_only"
  on partner_inquiries for all
  using (false);
