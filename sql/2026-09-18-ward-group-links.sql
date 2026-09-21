-- Escalation contact directory: one WhatsApp number per service category per
-- ward, used by the councillor dashboard's "Escalation Contacts" tab.
--
-- This table does not exist yet in production (confirmed 18 Sep 2026 —
-- signal-desk-municipal-councillor's Escalation Contacts page queries this
-- exact table/project and currently gets "Could not find the table" too, so
-- this gap predates CivicRewards). Creating it here is additive only: it adds
-- a brand-new empty table, touches no existing rows, and both apps share the
-- same shape (lib/supabase.ts's WardGroupLink type in
-- signal-desk-municipal-councillor).
--
-- This table stores contact info only — it never sends a message by itself.
-- The actual broadcast/escalate send path is a separate, still-disabled
-- feature in CivicRewards (see BroadcastTab in
-- src/components/councillor/CouncillorDashboardV2.tsx).
--
-- Run once in the Supabase SQL editor for project egzzgezgpwxgwmuipvmf.

create table if not exists ward_group_links (
  id          uuid primary key default gen_random_uuid(),
  ward_number text not null,
  category    text not null,
  label       text,
  link_type   text not null default 'whatsapp_number',
  link_value  text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (ward_number, category)
);

alter table ward_group_links enable row level security;

-- Same lockdown pattern as ward_reports: service-role only. CivicRewards'
-- server functions read/write this via supabaseAdmin.ts after verifying the
-- councillor's session token and approved status server-side — never a
-- direct client-side query.
create policy "service_role_only"
  on ward_group_links for all
  using (false);
