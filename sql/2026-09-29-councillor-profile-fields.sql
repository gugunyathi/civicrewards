-- Extends civicrewards_councillors with the richer profile-card fields
-- (photo, personal contact, personal social accounts) requested 29 Sep
-- 2026. These are self-fill only, on purpose: a councillor's own entered
-- photo/social handles are the one source that's actually trustworthy at
-- scale (599+ real people) without the misattribution risk of trying to
-- research/scrape a stranger's face or personal social accounts from the
-- open web. Party affiliation is the exception — that's backfilled from
-- the same government election-result sources already used for
-- wardDirectory.ts, not self-reported, since it's public-record fact, not
-- personal contact info.
--
-- Run once in the Supabase SQL editor for project egzzgezgpwxgwmuipvmf.

alter table civicrewards_councillors
  add column if not exists photo_url         text,
  add column if not exists email             text,
  add column if not exists whatsapp_number   text,
  add column if not exists telegram_username text,
  add column if not exists twitter_handle    text,
  add column if not exists facebook_url      text,
  add column if not exists instagram_handle  text,
  add column if not exists linkedin_url      text;
