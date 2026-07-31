import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  AnnouncementRow,
  Database,
  EventRow,
  TeamMemberRow,
} from "@/types/database";

export interface AdminDashboardStats {
  totalEvents: number;
  publishedEvents: number;
  liveEvents: number;
  upcomingEvents: number;
  activeTeamMembers: number;
  publishedAnnouncements: number;
}

export async function getAdminDashboardStats(
  supabase: SupabaseClient<Database>,
): Promise<{ data: AdminDashboardStats; hasError: boolean }> {
  const [eventsResult, teamResult, announcementsResult] = await Promise.all([
    supabase.from("events").select("id,status,is_published"),
    supabase.from("team_members").select("id,is_active"),
    supabase.from("announcements").select("id,is_published"),
  ]);

  const events = eventsResult.data ?? [];
  const teamMembers = teamResult.data ?? [];
  const announcements = announcementsResult.data ?? [];

  return {
    data: {
      totalEvents: events.length,
      publishedEvents: events.filter((event) => event.is_published).length,
      liveEvents: events.filter((event) => event.status === "live").length,
      upcomingEvents: events.filter((event) => event.status === "upcoming")
        .length,
      activeTeamMembers: teamMembers.filter((member) => member.is_active)
        .length,
      publishedAnnouncements: announcements.filter(
        (announcement) => announcement.is_published,
      ).length,
    },
    hasError: Boolean(
      eventsResult.error || teamResult.error || announcementsResult.error,
    ),
  };
}

export async function getAdminEvents(
  supabase: SupabaseClient<Database>,
): Promise<{ data: EventRow[]; hasError: boolean }> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("display_order", { ascending: true })
    .order("start_at", { ascending: false, nullsFirst: false });

  return { data: data ?? [], hasError: Boolean(error) };
}

export async function getAdminTeamMembers(
  supabase: SupabaseClient<Database>,
): Promise<{ data: TeamMemberRow[]; hasError: boolean }> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true })
    .order("full_name", { ascending: true });

  return { data: data ?? [], hasError: Boolean(error) };
}

export async function getAdminAnnouncements(
  supabase: SupabaseClient<Database>,
): Promise<{ data: AnnouncementRow[]; hasError: boolean }> {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  return { data: data ?? [], hasError: Boolean(error) };
}
