import { createClient } from "@supabase/supabase-js";

// Server-only. Uses the service-role key, which bypasses RLS entirely —
// never import this file from client code, and never return its client
// instance from a server function (only return the data you've already
// filtered).
export function getSupabaseAdmin() {
  const url = process.env["VITE_SUPABASE_URL"];
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase is not configured on this server");
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
