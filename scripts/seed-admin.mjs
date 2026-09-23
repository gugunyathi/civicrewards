// One-off script: creates a CivicRewards admin login.
//
// Run this AFTER sql/2026-09-22-civicrewards-admins.sql has been applied in
// the Supabase SQL editor for project egzzgezgpwxgwmuipvmf — this script
// only inserts a row and creates an auth user, it doesn't create the table.
//
// There is no sign-up flow for admin access anywhere in the app, and there
// never should be — this script, run directly by Thami, is the only way a
// civicrewards_admins row ever gets created.
//
// Usage: node scripts/seed-admin.mjs your-real-email@example.com [password]
// Omit [password] to have one generated for you. Reads VITE_SUPABASE_URL
// and SUPABASE_SERVICE_ROLE_KEY from .env.local.

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

const email = process.argv[2];
const customPassword = process.argv[3];
if (!email || !email.includes("@")) {
  console.error("Usage: node scripts/seed-admin.mjs your-real-email@example.com [password]");
  process.exit(1);
}

const env = loadEnvLocal();
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const tempPassword = customPassword ?? randomBytes(12).toString("base64url");

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { role: "admin" },
  });

  if (createError) {
    console.error("Failed to create auth user:", createError.message);
    process.exit(1);
  }

  const userId = created.user.id;

  const { error: insertError } = await supabase.from("civicrewards_admins").insert({ user_id: userId });

  if (insertError) {
    console.error("Failed to insert admin row:", insertError.message);
    console.error("If this says the table doesn't exist, run sql/2026-09-22-civicrewards-admins.sql first.");
    process.exit(1);
  }

  console.log("Seeded admin account.");
  console.log("  email:   ", email);
  console.log("  password:", tempPassword);
  console.log("Sign in at /admin. Change this password via Supabase Auth once you're in, if you want to.");
}

main();
