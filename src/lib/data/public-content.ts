import { events as staticEvents, team as staticTeam } from "@/data/site";
import { SUPABASE_CONFIGURATION_MESSAGE } from "@/lib/supabase/config";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import type {
  AnnouncementItem,
  EventItem,
  TeamMember,
} from "@/types";
import type {
  AnnouncementRow,
  EventRow,
  PublicTeamMemberRow,
} from "@/types/database";

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

function mapEvent(row: EventRow, index: number): EventItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description || row.short_description,
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
      data: staticEvents,
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
      data: staticEvents,
      notice: databaseUnavailableMessage,
      source: "fallback",
    };
  }

  return {
    data: data.map(mapEvent),
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
    .from("public_team_members")
    .select("*")
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

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return {
      data: [],
      notice: databaseUnavailableMessage,
      source: "fallback",
    };
  }

  const now = Date.now();
  const activeAnnouncements = data.filter((announcement) => {
    const hasStarted =
      !announcement.starts_at ||
      new Date(announcement.starts_at).getTime() <= now;
    const hasNotEnded =
      !announcement.ends_at || new Date(announcement.ends_at).getTime() >= now;
    return hasStarted && hasNotEnded;
  });

  return {
    data: activeAnnouncements.map(mapAnnouncement),
    source: "database",
  };
}
