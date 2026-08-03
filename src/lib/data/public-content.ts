import {
  events as staticEvents,
  galleryItems as staticGalleryItems,
  resources as staticResources,
  team as staticTeam,
} from "@/data/site";
import { sortAnnouncements } from "@/lib/announcements";
import { sortEventsForJourney } from "@/lib/events";
import {
  GALLERY_BUCKET,
  getSignedCmsFileUrl,
  RESOURCE_BUCKET,
} from "@/lib/storage/cms-files";
import { SUPABASE_CONFIGURATION_MESSAGE } from "@/lib/supabase/config";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import type {
  AnnouncementItem,
  EventItem,
  GalleryItem,
  ResourceItem,
  TeamMember,
} from "@/types";
import type {
  AnnouncementRow,
  EventRow,
  GalleryItemRow,
  PublicTeamMemberRow,
  ResourceRow,
} from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export interface PublicContentResult<T> {
  data: T;
  notice?: string;
  source: "database" | "fallback";
}

const EVENT_ACCENTS = [
  "from-[#163a62] via-[#234f7a] to-[#b18345]",
  "from-[#8a6940] to-[#cab48e]",
  "from-[#5076a6] to-[#9ab7d8]",
  "from-[#66755d] to-[#b8c8a9]",
];

const GALLERY_ACCENTS = [
  "from-[#163a62] via-[#234f7a] to-[#b18345]",
  "from-[#101d36] via-[#4f3a63] to-[#d4a15d]",
  "from-[#24364e] via-[#5d6f65] to-[#d4bd93]",
  "from-[#122f50] via-[#73516d] to-[#c99956]",
];

const databaseUnavailableMessage =
  "Live content is temporarily unavailable. Verified site content is shown instead.";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function formatEventDate(row: EventRow) {
  if (!row.start_at) {
    return "Upcoming";
  }

  const start = new Date(row.start_at);
  if (!row.end_at) {
    return formatDate(start);
  }

  const end = new Date(row.end_at);
  const startDate = formatDate(start);
  const endDate = formatDate(end);
  return startDate === endDate ? startDate : `${startDate} – ${endDate}`;
}

function formatEventTime(row: EventRow) {
  if (!row.start_at) {
    return "TBA";
  }

  const start = new Date(row.start_at);
  const end = row.end_at ? new Date(row.end_at) : null;
  const startsAtMidnight = formatTime(start) === "12:00 am";
  const endsAtDayEnd = end ? formatTime(end) === "11:59 pm" : false;

  if (startsAtMidnight && endsAtDayEnd) {
    return "All day";
  }

  return end
    ? `${formatTime(start)} – ${formatTime(end)}`
    : formatTime(start);
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return `${formatDate(date)}, ${formatTime(date)}`;
}

function mapEvent(row: EventRow, index: number): EventItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description || row.short_description,
    startAt: row.start_at ?? undefined,
    endAt: row.end_at ?? undefined,
    date: formatEventDate(row),
    time: formatEventTime(row),
    venue: row.venue || "TBA",
    category: row.category || "Event",
    status: row.status,
    featured: row.is_featured,
    published: row.is_published,
    posterUrl: row.poster_url ?? undefined,
    registrationUrl: row.registration_url ?? undefined,
    registrationDeadline: row.registration_deadline ?? undefined,
    registrationDeadlineLabel: row.registration_deadline
      ? formatDateTime(row.registration_deadline)
      : undefined,
    displayOrder: row.display_order,
    accent: EVENT_ACCENTS[index % EVENT_ACCENTS.length],
  };
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function mapTeamMember(row: PublicTeamMemberRow): TeamMember | null {
  if (!row.id || !row.full_name || !row.role || !row.member_group) {
    return null;
  }

  return {
    id: row.id,
    name: row.full_name,
    role: row.role,
    group: row.member_group,
    initials: getInitials(row.full_name),
    year: row.year ?? "",
    email: row.email ?? undefined,
    isEmailPublic: row.is_email_public ?? false,
    profileImageUrl: row.profile_image_url ?? undefined,
    linkedinUrl: row.linkedin_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
    displayOrder: row.display_order ?? 0,
  };
}

function mapAnnouncement(row: AnnouncementRow): AnnouncementItem {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    priority: row.priority,
    linkUrl: row.link_url ?? undefined,
    isPinned: row.is_pinned,
  };
}

async function mapGalleryItem(
  supabase: SupabaseClient<Database>,
  row: GalleryItemRow,
  index: number,
): Promise<GalleryItem> {
  const storedImageUrl = await getSignedCmsFileUrl(
    supabase,
    GALLERY_BUCKET,
    row.storage_path,
  );

  return {
    id: row.id,
    title: row.title,
    caption: row.caption,
    altText: row.alt_text,
    imageUrl: row.image_url ?? storedImageUrl,
    category: row.category,
    eventId: row.event_id ?? undefined,
    capturedAt: row.captured_at ?? undefined,
    featured: row.is_featured,
    displayOrder: row.display_order,
    gradient: GALLERY_ACCENTS[index % GALLERY_ACCENTS.length],
  };
}

async function mapResource(
  supabase: SupabaseClient<Database>,
  row: ResourceRow,
): Promise<ResourceItem> {
  const storedFileUrl = await getSignedCmsFileUrl(
    supabase,
    RESOURCE_BUCKET,
    row.storage_path,
  );
  const fileHref = row.file_url ?? storedFileUrl;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    resourceType: row.resource_type,
    href: row.external_url ?? fileHref,
    isFile: !row.external_url && Boolean(fileHref),
    audience: row.audience ?? undefined,
    academicYear: row.academic_year ?? undefined,
    featured: row.is_featured,
    displayOrder: row.display_order,
  };
}

function privateStaticTeam(): TeamMember[] {
  return staticTeam.map((member, index) => ({
    ...member,
    email: undefined,
    isEmailPublic: false,
    displayOrder: index + 1,
  }));
}

export async function getPublicEvents(): Promise<
  PublicContentResult<EventItem[]>
> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      data: sortEventsForJourney(
        staticEvents.map((event, index) => ({
          ...event,
          displayOrder: event.displayOrder ?? index + 1,
        })),
      ),
      notice: SUPABASE_CONFIGURATION_MESSAGE,
      source: "fallback",
    };
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("start_at", { ascending: true, nullsFirst: false });

  if (error) {
    return {
      data: sortEventsForJourney(
        staticEvents.map((event, index) => ({
          ...event,
          displayOrder: event.displayOrder ?? index + 1,
        })),
      ),
      notice: databaseUnavailableMessage,
      source: "fallback",
    };
  }

  return {
    data: sortEventsForJourney(data.map(mapEvent)),
    source: "database",
  };
}

export async function getPublicTeamMembers(): Promise<
  PublicContentResult<TeamMember[]>
> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      data: privateStaticTeam(),
      notice: SUPABASE_CONFIGURATION_MESSAGE,
      source: "fallback",
    };
  }

  const { data, error } = await supabase
    .from("team_members")
    .select(
      "id, full_name, role, member_group, year, email, is_email_public, profile_image_url, linkedin_url, github_url, display_order",
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    return {
      data: privateStaticTeam(),
      notice: databaseUnavailableMessage,
      source: "fallback",
    };
  }

  return {
    data: data
      .map(mapTeamMember)
      .filter((member): member is TeamMember => member !== null),
    source: "database",
  };
}

export async function getPublicAnnouncements(): Promise<
  PublicContentResult<AnnouncementItem[]>
> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      data: [],
      notice: SUPABASE_CONFIGURATION_MESSAGE,
      source: "fallback",
    };
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`);

  if (error) {
    return {
      data: [],
      notice: databaseUnavailableMessage,
      source: "fallback",
    };
  }

  const activeAnnouncements = data.filter((announcement) => {
    const hasStarted =
      !announcement.starts_at ||
      new Date(announcement.starts_at).getTime() <= now.getTime();
    const hasNotEnded =
      !announcement.ends_at ||
      new Date(announcement.ends_at).getTime() >= now.getTime();
    return hasStarted && hasNotEnded;
  });

  return {
    data: activeAnnouncements.sort(sortAnnouncements).map(mapAnnouncement),
    source: "database",
  };
}

export async function getPublicGalleryItems(): Promise<
  PublicContentResult<GalleryItem[]>
> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      data: staticGalleryItems,
      notice: SUPABASE_CONFIGURATION_MESSAGE,
      source: "fallback",
    };
  }

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true })
    .order("captured_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    return {
      data: staticGalleryItems,
      notice: databaseUnavailableMessage,
      source: "fallback",
    };
  }

  return {
    data: await Promise.all(
      data.map((item, index) => mapGalleryItem(supabase, item, index)),
    ),
    source: "database",
  };
}

export async function getPublicResources(): Promise<
  PublicContentResult<ResourceItem[]>
> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      data: staticResources,
      notice: SUPABASE_CONFIGURATION_MESSAGE,
      source: "fallback",
    };
  }

  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return {
      data: staticResources,
      notice: databaseUnavailableMessage,
      source: "fallback",
    };
  }

  return {
    data: await Promise.all(data.map((resource) => mapResource(supabase, resource))),
    source: "database",
  };
}
