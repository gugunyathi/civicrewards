import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "./supabaseAdmin";

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

// There is no sign-up path that can produce a row in civicrewards_admins —
// see sql/2026-09-22-civicrewards-admins.sql. This just checks whether the
// signed-in user already has one.
async function requireAdminUserId(accessToken: string): Promise<string> {
  const admin = getSupabaseAdmin();
  const { data: userData, error: userError } = await admin.auth.getUser(accessToken);
  if (userError || !userData.user) {
    throw new Error("Your session has expired — please sign in again");
  }

  const { data: row, error } = await admin
    .from("civicrewards_admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Could not verify admin access");
  }
  if (!row) {
    throw new Error("This account does not have admin access");
  }
  return userData.user.id;
}

export const checkAdminAccess = createServerFn({ method: "POST" })
  .validator(validateAccessToken)
  .handler(async ({ data }): Promise<{ isAdmin: boolean }> => {
    try {
      await requireAdminUserId(data.accessToken);
      return { isAdmin: true };
    } catch {
      return { isAdmin: false };
    }
  });

export interface AdminCouncillorRow {
  userId: string;
  fullName: string;
  wardNumber: string;
  municipality: string | null;
  phone: string | null;
  approved: boolean;
  createdAt: string;
}

// Every councillor account across every ward, not scoped to one ward like
// getCouncillorWardReports is — this is the whole point of the admin role.
export const getAllCouncillorAccounts = createServerFn({ method: "POST" })
  .validator(validateAccessToken)
  .handler(async ({ data }): Promise<AdminCouncillorRow[]> => {
    await requireAdminUserId(data.accessToken);

    const admin = getSupabaseAdmin();
    const { data: rows, error } = await admin
      .from("civicrewards_councillors")
      .select("user_id, full_name, ward_number, municipality, phone, approved, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Could not load councillor accounts");
    }

    return (rows ?? []).map((r) => ({
      userId: r.user_id,
      fullName: r.full_name,
      wardNumber: r.ward_number,
      municipality: r.municipality,
      phone: r.phone,
      approved: r.approved,
      createdAt: r.created_at,
    }));
  });

function validateSetApproval(data: unknown): { accessToken: string; councillorUserId: string; approved: boolean } {
  const { accessToken } = validateAccessToken(data);
  const d = data as { councillorUserId?: unknown; approved?: unknown };
  if (typeof d.councillorUserId !== "string" || !d.councillorUserId) {
    throw new Error("Missing councillor id");
  }
  if (typeof d.approved !== "boolean") {
    throw new Error("Missing approval state");
  }
  return { accessToken, councillorUserId: d.councillorUserId, approved: d.approved };
}

// The whole reason this admin role exists: closes the gap the councillor
// seed script's own comment flagged — "Nothing in the app can set
// approved = true... flip it by hand in the Supabase table editor." Now an
// actual admin can, without touching SQL, while still requiring a real
// admin-table row to do it.
export const setCouncillorApproval = createServerFn({ method: "POST" })
  .validator(validateSetApproval)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await requireAdminUserId(data.accessToken);

    const admin = getSupabaseAdmin();
    const { error } = await admin
      .from("civicrewards_councillors")
      .update({ approved: data.approved })
      .eq("user_id", data.councillorUserId);

    if (error) {
      throw new Error("Could not update approval status");
    }
    return { ok: true };
  });
