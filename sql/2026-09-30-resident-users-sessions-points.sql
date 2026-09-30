-- Real resident accounts for the RewardsApp: WhatsApp or Telegram sign-in,
-- persistent sessions, an activity log, and a real points ledger — replaces
-- ReportApp's client-only `credits` useState (mock, resets to 340 on every
-- page load, never persisted) with something real.
--
-- Deliberately not Supabase Auth: residents sign in with a phone number or
-- a Telegram account, not an email/password. Same OTP-session shape already
-- proven in sql/2026-09-22-report-otp-verification.sql, generalised to
-- cover both channels and to produce a persistent user + session instead of
-- a one-off report-verification flag.
--
-- Run once in the Supabase SQL editor for project egzzgezgpwxgwmuipvmf.

create table if not exists civicrewards_users (
  id               uuid primary key default gen_random_uuid(),
  phone_number     text unique,
  telegram_user_id bigint unique,
  telegram_username text,
  display_name     text,
  ward_number      text,
  municipality_id  text,
  points_balance   int not null default 0,
  created_at       timestamptz not null default now(),
  last_seen_at     timestamptz not null default now(),
  constraint civicrewards_users_has_identity check (phone_number is not null or telegram_user_id is not null)
);

alter table civicrewards_users enable row level security;
create policy "service_role_only" on civicrewards_users for all using (false);

-- One row per sign-in attempt, covers both channels. A separate table from
-- report_otp_sessions on purpose — that one is anonymous report
-- verification (no persistent identity), this one always resolves to a
-- real civicrewards_users row.
create table if not exists civicrewards_signin_otp_sessions (
  id               uuid primary key default gen_random_uuid(),
  session_token    text not null unique,
  channel          text not null check (channel in ('whatsapp', 'telegram')),
  phone_number     text,
  telegram_chat_id bigint,
  otp_code         text,
  otp_sent_at      timestamptz,
  attempt_count    int not null default 0,
  locked           boolean not null default false,
  verified         boolean not null default false,
  verified_at      timestamptz,
  user_id          uuid references civicrewards_users(id),
  created_at       timestamptz not null default now(),
  expires_at       timestamptz not null default (now() + interval '15 minutes'),
  constraint civicrewards_signin_otp_has_channel_identity check (
    (channel = 'whatsapp' and phone_number is not null) or
    (channel = 'telegram')
  )
);

alter table civicrewards_signin_otp_sessions enable row level security;
create policy "service_role_only" on civicrewards_signin_otp_sessions for all using (false);

-- Bearer-token sessions, same pattern as the OTP tables: a random token
-- handed to the client, validated server-side on every request. No
-- password, no email — reset by signing in again.
create table if not exists civicrewards_sessions (
  session_token text primary key,
  user_id       uuid not null references civicrewards_users(id) on delete cascade,
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null default (now() + interval '90 days'),
  last_seen_at  timestamptz not null default now()
);

alter table civicrewards_sessions enable row level security;
create policy "service_role_only" on civicrewards_sessions for all using (false);

-- Every real action a signed-in resident takes, for audit and for the
-- points ledger to reference. `points_delta` is denormalised onto the row
-- rather than a separate ledger table — one table, one source of truth, no
-- risk of the ledger and the activity log drifting apart on what happened.
create table if not exists civicrewards_activity_log (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references civicrewards_users(id) on delete cascade,
  activity_type text not null,
  points_delta  int not null default 0,
  metadata      jsonb,
  created_at    timestamptz not null default now()
);

alter table civicrewards_activity_log enable row level security;
create policy "service_role_only" on civicrewards_activity_log for all using (false);

create index if not exists civicrewards_activity_log_user_idx on civicrewards_activity_log(user_id, created_at desc);

-- Atomic points award/deduction — read-then-write from the app would race
-- under concurrent requests (two report rewards landing at once could
-- clobber each other's balance update). Returns the new balance so the
-- caller doesn't need a second round-trip.
create or replace function civicrewards_award_points(p_user_id uuid, p_delta int)
returns int
language plpgsql
security definer
as $$
declare
  new_balance int;
begin
  update civicrewards_users
  set points_balance = points_balance + p_delta,
      last_seen_at = now()
  where id = p_user_id
  returning points_balance into new_balance;

  if new_balance is null then
    raise exception 'civicrewards_users row % not found', p_user_id;
  end if;

  return new_balance;
end;
$$;
