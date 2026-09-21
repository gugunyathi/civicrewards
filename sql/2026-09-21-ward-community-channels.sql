-- Community channel directory: one link per platform (Telegram, WhatsApp,
-- X, Facebook) per ward, used by the councillor dashboard's "Community
-- Channels" tab and shown publicly on that ward's /councillor/:wardNumber
-- profile page.
--
-- This is link storage only. Saving a URL here does not connect to, poll,
-- or ingest anything from that platform — there is no bot, webhook, or
-- scraper behind this table. "Automated cross-platform reporting" (pulling
-- messages out of these groups automatically) is explicitly out of scope
-- for this table and was not built.
--
-- Reads of this table are effectively public (residents see these links
-- without signing in), but that still only ever happens through a
-- server-side function using the service-role key (see
-- src/lib/wardDirectory.ts's getWardCommunityChannels) — never a direct
-- client-side Supabase query. The RLS lockdown below is defense in depth,
-- consistent with ward_reports and ward_group_links, not the actual access
-- control.
--
-- Run once in the Supabase SQL editor for project egzzgezgpwxgwmuipvmf.

create table if not exists ward_community_channels (
  id          uuid primary key default gen_random_uuid(),
  ward_number text not null,
  platform    text not null check (platform in ('telegram', 'whatsapp', 'x', 'facebook')),
  label       text,
  url         text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (ward_number, platform)
);

alter table ward_community_channels enable row level security;

create policy "service_role_only"
  on ward_community_channels for all
  using (false);
