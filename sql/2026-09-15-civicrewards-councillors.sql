-- CivicRewards councillor web login (civicrewards.co.za).
--
-- Separate identity from moja_councillors (WhatsApp/phone-based console access,
-- see signal-desk-v4/migrations/2026-07-07-moja-councillors.sql) — that table
-- has no auth.users link and isn't reusable for a browser session. This is a
-- new, minimal identity: one row per councillor, keyed to a real Supabase Auth
-- user, scoped to one ward.
--
-- Sign-up creates a pending (approved = false) row. Nothing in the app can set
-- approved = true — that's a deliberate gap, flip it by hand in the Supabase
-- table editor or SQL editor after verifying the person is a real councillor
-- for that ward. Run this once in the Supabase SQL editor for project
-- egzzgezgpwxgwmuipvmf, then run scripts/seed-mark-councillor.mjs to create
-- the first (and for now, only) approved account.

create table if not exists civicrewards_councillors (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  ward_number text not null,
  municipality text,
  phone       text,
  approved    boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table civicrewards_councillors enable row level security;

-- Defense in depth only — the app's own dashboard/report reads always go
-- through the service-role key server-side (ward_reports itself blocks anon
-- and authenticated entirely as of 2026-08-14, see signal-desk-v4/migrations/
-- 2026-08-14-lock-ward-reports-activity-messages-rls.sql). These policies
-- just stop a signed-in councillor's own browser session from reading or
-- writing anyone else's profile row directly.
create policy "Councillors read own profile"
  on civicrewards_councillors for select
  using (auth.uid() = user_id);

create policy "Councillors insert own pending profile"
  on civicrewards_councillors for insert
  with check (auth.uid() = user_id and approved = false);
