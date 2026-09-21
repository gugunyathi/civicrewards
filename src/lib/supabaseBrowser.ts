import { createClient } from "@supabase/supabase-js";

// Browser-only. Anon key — safe to expose. Used for sign-in/sign-up only;
// ward_reports itself is locked to service-role reads, so no data query in
// this app ever goes through this client, only auth.signIn/signUp/getSession.
const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;

export const supabaseBrowser = url && anonKey ? createClient(url, anonKey) : null;
