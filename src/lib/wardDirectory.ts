import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { requireCouncillorProfile, validateAccessToken } from "./councillorAuth";

export interface Municipality {
  id: string;
  name: string;
  abbreviation: string;
  connected: boolean;
}

// The 8 metros plus the largest local municipality, per Thami's spec. Only
// "coj" has any real ward/councillor data behind it — see
// WARDS_BY_MUNICIPALITY below. "connected" here is informational only
// (used for the left-panel list); the actual "do we have real data" gate
// is always the ward list being non-empty, since a municipality could one
// day have some real wards and some not.
export const TOP_MUNICIPALITIES: Municipality[] = [
  { id: "coj", name: "City of Johannesburg", abbreviation: "CoJ", connected: true },
  { id: "coct", name: "City of Cape Town", abbreviation: "CoCT", connected: false },
  { id: "ethekwini", name: "eThekwini Metropolitan Municipality (Durban)", abbreviation: "eThekwini", connected: false },
  { id: "tshwane", name: "City of Tshwane (Pretoria)", abbreviation: "CoT", connected: false },
  { id: "ekurhuleni", name: "Ekurhuleni Metropolitan Municipality (East Rand)", abbreviation: "EMM", connected: false },
  { id: "nelson-mandela-bay", name: "Nelson Mandela Bay Metropolitan Municipality (Gqeberha)", abbreviation: "NMBM", connected: false },
  { id: "buffalo-city", name: "Buffalo City Metropolitan Municipality (East London)", abbreviation: "BCMM", connected: false },
  { id: "mangaung", name: "Mangaung Metropolitan Municipality (Bloemfontein)", abbreviation: "MMM", connected: false },
  { id: "msunduzi", name: "Msunduzi Local Municipality (Pietermaritzburg)", abbreviation: "Msunduzi", connected: false },
];

export interface WardListing {
  wardNumber: string;
  municipalityId: string;
  regionName: string;
  councillorName: string | null;
  approved: boolean;
  residentEstimate: string | null;
}

// Real data for Ward 115 only (City of Johannesburg, Mark Van Der Merwe,
// same facts already used elsewhere in this codebase). Every other
// municipality maps to an empty array on purpose — that's what drives the
// honest "not yet connected" empty state on the directory page. Do not add
// plausible-looking placeholder wards/councillors here; that's exactly the
// fabricated-civic-data pattern this product has already had to remove
// twice this session.
export const WARDS_BY_MUNICIPALITY: Record<string, WardListing[]> = {
  coj: [
    {
      wardNumber: "115",
      municipalityId: "coj",
      regionName: "Fourways / Bloubosrand",
      councillorName: "Mark Van Der Merwe",
      approved: true,
      residentEstimate: "~6,500 residents",
    },
  ],
  coct: [],
  ethekwini: [],
  tshwane: [],
  ekurhuleni: [],
  "nelson-mandela-bay": [],
  "buffalo-city": [],
  mangaung: [],
  msunduzi: [],
};

function findWard(wardNumber: string): WardListing | null {
  for (const municipalityId of Object.keys(WARDS_BY_MUNICIPALITY)) {
    const match = WARDS_BY_MUNICIPALITY[municipalityId]?.find((w) => w.wardNumber === wardNumber);
    if (match) return match;
  }
  return null;
}

function municipalityName(municipalityId: string): string {
  return TOP_MUNICIPALITIES.find((m) => m.id === municipalityId)?.name ?? municipalityId;
}

export interface PublicWardSummary {
  wardNumber: string;
  regionName: string;
  municipalityName: string;
  councillorName: string | null;
  approved: boolean;
  residentEstimate: string | null;
  openReportCount: number | null;
}

function validateWardNumber(data: unknown): { wardNumber: string } {
  const wardNumber = (data as { wardNumber?: unknown })?.wardNumber;
  if (typeof wardNumber !== "string" || !wardNumber.trim()) {
    throw new Error("Ward number is required");
  }
  return { wardNumber: wardNumber.trim() };
}

// Public, no auth required — this is the directory/profile page's data
// source. Aggregate-only: never returns a raw ward_reports row or any
// reporter personal information, only a count, so it's safe to expose to
// unauthenticated visitors.
export const getPublicWardSummary = createServerFn({ method: "POST" })
  .validator(validateWardNumber)
  .handler(async ({ data }): Promise<PublicWardSummary | null> => {
    const ward = findWard(data.wardNumber);
    if (!ward) return null;

    let openReportCount: number | null = null;
    if (ward.approved) {
      const admin = getSupabaseAdmin();
      const { data: rows, error } = await admin
        .from("ward_reports")
        .select("status, dismissed_at")
        .eq("ward_number", ward.wardNumber);
      if (!error && rows) {
        openReportCount = rows.filter(
          (r) => !["resolved", "closed", "ignored"].includes(r.status) && r.dismissed_at == null,
        ).length;
      }
    }

    return {
      wardNumber: ward.wardNumber,
      regionName: ward.regionName,
      municipalityName: municipalityName(ward.municipalityId),
      councillorName: ward.councillorName,
      approved: ward.approved,
      residentEstimate: ward.residentEstimate,
      openReportCount,
    };
  });

export interface WardCommunityChannel {
  id: string;
  platform: "telegram" | "whatsapp" | "x" | "facebook";
  label: string | null;
  url: string;
}

async function fetchWardCommunityChannels(wardNumber: string): Promise<WardCommunityChannel[]> {
  const admin = getSupabaseAdmin();
  const { data: rows, error } = await admin
    .from("ward_community_channels")
    .select("id, platform, label, url")
    .eq("ward_number", wardNumber)
    .eq("active", true)
    .order("platform");

  if (error) throw new Error(error.message);
  return (rows ?? []) as WardCommunityChannel[];
}

// Public, no auth required — residents see these links on the ward profile
// page. Link storage only, see sql/2026-09-21-ward-community-channels.sql.
// Swallows errors (returns []) since an unauthenticated visitor shouldn't
// see a raw "table not found" message — the dashboard-side read below
// surfaces that to the councillor instead, where it's actionable.
export const getWardCommunityChannels = createServerFn({ method: "POST" })
  .validator(validateWardNumber)
  .handler(async ({ data }): Promise<WardCommunityChannel[]> => {
    try {
      return await fetchWardCommunityChannels(data.wardNumber);
    } catch {
      return [];
    }
  });

// Councillor-authenticated read for the dashboard's Community Channels
// tab — resolves the ward from the signed-in councillor's own approved
// profile, same pattern as getWardGroupLinks, rather than trusting a
// client-supplied ward number.
export const getMyWardCommunityChannels = createServerFn({ method: "POST" })
  .validator(validateAccessToken)
  .handler(async ({ data }): Promise<WardCommunityChannel[]> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }
    return fetchWardCommunityChannels(profile.wardNumber);
  });

const VALID_PLATFORMS = ["telegram", "whatsapp", "x", "facebook"] as const;

function validateSaveChannel(data: unknown): {
  accessToken: string;
  platform: (typeof VALID_PLATFORMS)[number];
  label: string;
  url: string;
} {
  const { accessToken } = validateAccessToken(data);
  const d = data as { platform?: unknown; label?: unknown; url?: unknown };
  if (typeof d.platform !== "string" || !VALID_PLATFORMS.includes(d.platform as never)) {
    throw new Error("Platform must be one of telegram, whatsapp, x, facebook");
  }
  if (typeof d.label !== "string" || !d.label.trim() || d.label.trim().length > 50) {
    throw new Error("Label is required and must be 50 characters or fewer");
  }
  if (typeof d.url !== "string" || !d.url.trim().startsWith("https://")) {
    throw new Error("Link must be a full https:// URL");
  }
  return {
    accessToken,
    platform: d.platform as (typeof VALID_PLATFORMS)[number],
    label: d.label.trim(),
    url: d.url.trim(),
  };
}

// Councillor-only write, same approval-gated pattern as saveWardGroupLink.
// Saving a link here never sends anything anywhere — see the migration
// file's header comment.
export const saveWardCommunityChannel = createServerFn({ method: "POST" })
  .validator(validateSaveChannel)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }

    const admin = getSupabaseAdmin();
    const { error } = await admin.from("ward_community_channels").upsert(
      {
        ward_number: profile.wardNumber,
        platform: data.platform,
        label: data.label,
        url: data.url,
        active: true,
      },
      { onConflict: "ward_number,platform" },
    );

    if (error) {
      throw new Error(`Could not save channel: ${error.message}`);
    }
    return { ok: true };
  });

function validateChannelId(data: unknown): { accessToken: string; id: string } {
  const { accessToken } = validateAccessToken(data);
  const id = (data as { id?: unknown })?.id;
  if (typeof id !== "string" || !id) {
    throw new Error("Missing channel id");
  }
  return { accessToken, id };
}

export const deactivateWardCommunityChannel = createServerFn({ method: "POST" })
  .validator(validateChannelId)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }

    const admin = getSupabaseAdmin();
    const { error } = await admin
      .from("ward_community_channels")
      .update({ active: false })
      .eq("id", data.id)
      .eq("ward_number", profile.wardNumber);

    if (error) {
      throw new Error(`Could not remove channel: ${error.message}`);
    }
    return { ok: true };
  });
