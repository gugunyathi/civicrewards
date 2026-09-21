// One-off script: creates the first (and for now, only) CivicRewards
// councillor login, seeded for Mark Van Der Merwe (Ward 115).
//
// Run this AFTER sql/2026-09-15-civicrewards-councillors.sql has been applied
// in the Supabase SQL editor for project egzzgezgpwxgwmuipvmf — this script
// only inserts a row and creates an auth user, it doesn't create the table.
//
// Usage: node scripts/seed-mark-councillor.mjs
// Reads VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.
//
// Uses a placeholder email per Thami's instruction (15 Sep 2026) — Mark resets
// his real email/password himself later, this is only for now/testing.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

function loadEnvLocal() {
  const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) env[match[1]] = match[2].replace(/^"|"$/g, "");
  }
  return env;
}

const env = loadEnvLocal();
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PLACEHOLDER_EMAIL = "mark.vandermerwe.ward115@civicrewards-placeholder.co.za";
const WARD_NUMBER = "115";
const FULL_NAME = "Mark Van Der Merwe";

async function main() {
  const tempPassword = randomBytes(12).toString("base64url");

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: PLACEHOLDER_EMAIL,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: FULL_NAME, seeded: true },
  });

  if (createError) {
    console.error("Failed to create auth user:", createError.message);
    process.exit(1);
  }

  const userId = created.user.id;

  const { error: insertError } = await supabase.from("civicrewards_councillors").insert({
    user_id: userId,
    full_name: FULL_NAME,
    ward_number: WARD_NUMBER,
    approved: true,
  });

  if (insertError) {
    console.error("Failed to insert councillor profile:", insertError.message);
    console.error(
      "If this says the table doesn't exist, run sql/2026-09-15-civicrewards-councillors.sql first.",
    );
    process.exit(1);
  }

  console.log("Seeded councillor account for", FULL_NAME);
  console.log("  email:   ", PLACEHOLDER_EMAIL);
  console.log("  password:", tempPassword);
  console.log(
    "This is a placeholder login for testing only — replace with Mark's real email before any real handoff.",
  );
}

main();
