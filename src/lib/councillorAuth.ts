import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "./supabaseAdmin";

export interface CouncillorProfile {
  fullName: string;
  wardNumber: string;
  municipality: string | null;
  approved: boolean;
}

async function requireCouncillorProfile(accessToken: string): Promise<{
  userId: string;
  profile: CouncillorProfile | null;
}> {
  const admin = getSupabaseAdmin();
  const { data: userData, error: userError } = await admin.auth.getUser(accessToken);
  if (userError || !userData.user) {
    throw new Error("Your session has expired — please sign in again");
  }

  const { data: row, error: profileError } = await admin
    .from("civicrewards_councillors")
    .select("full_name, ward_number, municipality, approved")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error("Could not load your councillor profile");
  }

  return {
    userId: userData.user.id,
    profile: row
      ? {
          fullName: row.full_name,
          wardNumber: row.ward_number,
          municipality: row.municipality,
          approved: row.approved,
        }
      : null,
  };
}

function validateAccessToken(data: unknown): { accessToken: string } {
  if (
    typeof data !== "object" ||
    data === null ||
    typeof (data as { accessToken?: unknown }).accessToken !== "string" ||
    !(data as { accessToken: string }).accessToken
  ) {
    throw new Error("Not signed in");
  }
  return { accessToken: (data as { accessToken: string }).accessToken };
}

// Called on every app load with a session, and right after sign-up/sign-in.
// If no profile row exists yet, creates one (pending approval) from the
// full_name/ward_number stashed in user_metadata at sign-up time — this
// covers both "session available immediately after signUp" and "email
// confirmation required, profile created on first real sign-in" without
// needing to know which mode this Supabase project is configured for.
export const syncCouncillorProfile = createServerFn({ method: "POST" })
  .validator(validateAccessToken)
  .handler(async ({ data }): Promise<CouncillorProfile | null> => {
    const admin = getSupabaseAdmin();
    const { data: userData, error: userError } = await admin.auth.getUser(data.accessToken);
    if (userError || !userData.user) {
      throw new Error("Your session has expired — please sign in again");
    }

    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (profile) return profile;

    const meta = userData.user.user_metadata as { full_name?: string; ward_number?: string };
    if (!meta.full_name || !meta.ward_number) return null;

    const { error: insertError } = await admin.from("civicrewards_councillors").insert({
      user_id: userData.user.id,
      full_name: meta.full_name,
      ward_number: meta.ward_number,
      approved: false,
    });
    if (insertError) {
      throw new Error("Could not create your councillor profile");
    }

    return {
      fullName: meta.full_name,
      wardNumber: meta.ward_number,
      municipality: null,
      approved: false,
    };
  });

export interface WardReportSummary {
  id: string;
  referenceNumber: string | null;
  category: string;
  description: string;
  location: string;
  status: string;
  severity: string;
  reporterName: string | null;
  reporterPhone: string | null;
  reporterSuburb: string | null;
  reporterAccountMeter: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  dismissedAt: string | null;
  forwarded: boolean | null;
  sourceStatus: string | null;
  lat: number | null;
  lng: number | null;
}

// v4's dashboard-generated placeholder refs look like "W115-2026-1615" —
// internal, not a real municipal system reference. Anything else non-empty
// (JWAPP-*, CSDFMC*, JHB*, plain department ticket numbers) is real.
export function hasRealReference(ref: string | null): boolean {
  if (!ref || !ref.trim()) return false;
  return !/^W\d+-\d{4}-\d+$/i.test(ref.trim());
}

// Ward 115's real report volume is well over 1000 (confirmed live 18 Sep
// 2026 — Analytics showed "1000 total reports" exactly, the tell for
// PostgREST's default max-rows setting silently overriding any .limit()
// bigger than it). A single .limit(N) call can never get past that
// server-side cap no matter how high N is set, so this pages through with
// .range() until a page comes back short, the only way to get the true
// total — same undercounting failure mode the source dashboard's lib/data.ts
// comments warned about (a 500-row cap once undercounted a 1,183-row ward).
const PAGE_SIZE = 1000;

interface WardReportRow {
  id: string;
  reference_number: string | null;
  category: string;
  description: string;
  location: string;
  status: string;
  severity: string;
  reporter_name: string | null;
  reporter_phone: string | null;
  reporter_suburb: string | null;
  reporter_account_meter: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  dismissed_at: string | null;
  forwarded: boolean | null;
  source_status: string | null;
  lat: number | null;
  lng: number | null;
}

async function fetchAllWardReports(
  admin: ReturnType<typeof getSupabaseAdmin>,
  wardNumber: string,
): Promise<WardReportRow[]> {
  const all: WardReportRow[] = [];
  for (let page = 0; ; page++) {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await admin
      .from("ward_reports")
      .select(
        "id, reference_number, category, description, location, status, severity, reporter_name, reporter_phone, reporter_suburb, reporter_account_meter, created_at, updated_at, resolved_at, dismissed_at, forwarded, source_status, lat, lng",
      )
      .eq("ward_number", wardNumber)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    all.push(...((data ?? []) as WardReportRow[]));
    if (!data || data.length < PAGE_SIZE) break;
  }
  return all;
}

export const getCouncillorWardReports = createServerFn({ method: "POST" })
  .validator(validateAccessToken)
  .handler(async ({ data }): Promise<WardReportSummary[]> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }

    const admin = getSupabaseAdmin();
    let reports: WardReportRow[];
    try {
      reports = await fetchAllWardReports(admin, profile.wardNumber);
    } catch {
      throw new Error("Could not load ward reports");
    }

    return reports.map((r) => ({
      id: r.id,
      referenceNumber: r.reference_number,
      category: r.category,
      description: r.description,
      location: r.location,
      status: r.status,
      severity: r.severity,
      reporterName: r.reporter_name,
      reporterPhone: r.reporter_phone,
      reporterSuburb: r.reporter_suburb,
      reporterAccountMeter: r.reporter_account_meter,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      resolvedAt: r.resolved_at,
      dismissedAt: r.dismissed_at,
      forwarded: r.forwarded,
      sourceStatus: r.source_status,
      lat: r.lat,
      lng: r.lng,
    }));
  });

export interface WardGroupLink {
  id: string;
  category: string;
  label: string | null;
  linkValue: string;
  createdAt: string;
}

// Contact directory only — storing a label + WhatsApp number here never
// sends a message by itself. The actual send path (broadcast/escalate) is a
// separate, still-disabled feature (see BroadcastTab). Requires
// sql/2026-09-18-ward-group-links.sql to have been run in the Supabase SQL
// editor first — until then this throws a clear "table not found" error
// rather than silently returning an empty list.
export const getWardGroupLinks = createServerFn({ method: "POST" })
  .validator(validateAccessToken)
  .handler(async ({ data }): Promise<WardGroupLink[]> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }

    const admin = getSupabaseAdmin();
    const { data: links, error } = await admin
      .from("ward_group_links")
      .select("id, category, label, link_value, created_at")
      .eq("ward_number", profile.wardNumber)
      .eq("active", true)
      .order("category");

    if (error) {
      throw new Error(`Could not load escalation contacts: ${error.message}`);
    }

    return (links ?? []).map((l) => ({
      id: l.id,
      category: l.category,
      label: l.label,
      linkValue: l.link_value,
      createdAt: l.created_at,
    }));
  });

function validateSaveGroupLink(data: unknown): {
  accessToken: string;
  category: string;
  label: string;
  linkValue: string;
} {
  const { accessToken } = validateAccessToken(data);
  const d = data as { category?: unknown; label?: unknown; linkValue?: unknown };
  if (typeof d.category !== "string" || !d.category.trim()) {
    throw new Error("Category is required");
  }
  if (typeof d.label !== "string" || !d.label.trim() || d.label.trim().length > 50) {
    throw new Error("Label is required and must be 50 characters or fewer");
  }
  if (typeof d.linkValue !== "string" || !/^27\d{9}$/.test(d.linkValue.trim())) {
    throw new Error("WhatsApp number must start with 27 and be 11 digits (e.g. 27821234567)");
  }
  return { accessToken, category: d.category.trim(), label: d.label.trim(), linkValue: d.linkValue.trim() };
}

export const saveWardGroupLink = createServerFn({ method: "POST" })
  .validator(validateSaveGroupLink)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }

    const admin = getSupabaseAdmin();
    const { error } = await admin.from("ward_group_links").upsert(
      {
        ward_number: profile.wardNumber,
        category: data.category,
        label: data.label,
        link_type: "whatsapp_number",
        link_value: data.linkValue,
        active: true,
      },
      { onConflict: "ward_number,category" },
    );

    if (error) {
      throw new Error(`Could not save contact: ${error.message}`);
    }
    return { ok: true };
  });

function validateGroupLinkId(data: unknown): { accessToken: string; id: string } {
  const { accessToken } = validateAccessToken(data);
  const id = (data as { id?: unknown }).id;
  if (typeof id !== "string" || !id) {
    throw new Error("Missing contact id");
  }
  return { accessToken, id };
}

export const deactivateWardGroupLink = createServerFn({ method: "POST" })
  .validator(validateGroupLinkId)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }

    const admin = getSupabaseAdmin();
    // Soft delete, scoped to this councillor's own ward — an id from
    // another ward can never be deactivated even if guessed, since the
    // update is filtered by ward_number as well as id.
    const { error } = await admin
      .from("ward_group_links")
      .update({ active: false })
      .eq("id", data.id)
      .eq("ward_number", profile.wardNumber);

    if (error) {
      throw new Error(`Could not remove contact: ${error.message}`);
    }
    return { ok: true };
  });
