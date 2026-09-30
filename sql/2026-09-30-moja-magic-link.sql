-- Seamless sign-in from Moja's WhatsApp menu ("CivicRewards" tap): Moja
-- already knows the resident's real WhatsApp number from the live
-- conversation, so making them do a second OTP round-trip would be
-- redundant. Instead signal-desk-v4 calls a server-to-server endpoint
-- (shared secret, not the resident-facing OTP flow) to mint a short-lived,
-- single-use code; the resident's link redeems it for a real session.
--
-- Deliberately a short-lived CODE, not the real session bearer token
-- embedded directly in the URL — if the WhatsApp message gets forwarded
-- before it's opened, the code is single-use and expires in 5 minutes; if
-- forwarded after, it's already dead. Same reasoning as the OTP codes
-- elsewhere in this app expiring and locking after reuse.
--
-- Run once in the Supabase SQL editor for project egzzgezgpwxgwmuipvmf.

create table if not exists civicrewards_magic_links (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,
  phone_number text not null,
  user_id      uuid not null references civicrewards_users(id),
  used         boolean not null default false,
  used_at      timestamptz,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null default (now() + interval '5 minutes')
);

alter table civicrewards_magic_links enable row level security;
create policy "service_role_only" on civicrewards_magic_links for all using (false);
