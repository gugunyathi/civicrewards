-- CivicRewards admin role.
--
-- Deliberately NOT self-service, unlike councillor sign-up. There is no
-- "request admin access" flow anywhere in the app, and there never should
-- be — this table only ever gets a row via a direct SQL insert run by
-- Thami himself (see scripts/seed-admin.mjs), the same way Mark's
-- councillor account was seeded. An admin can see every councillor's
-- personal info (name, ward, municipality, phone) across every ward, and
-- can approve or revoke any councillor account, so the bar for getting a
-- row in this table is "Thami personally ran the SQL," nothing softer.
--
-- Run once in the Supabase SQL editor for project egzzgezgpwxgwmuipvmf.

create table if not exists civicrewards_admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table civicrewards_admins enable row level security;

-- Same lockdown pattern as every other table in this project: service-role
-- only. The app's own admin server functions verify the caller's session
-- token and admin-table membership server-side before returning or
-- changing anything — never a direct client-side query.
create policy "service_role_only"
  on civicrewards_admins for all
  using (false);
