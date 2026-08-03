import type {
  AnnouncementPriority,
  AnnouncementRow,
} from "@/types/database";

export type AnnouncementLifecycle =
  | "draft"
  | "scheduled"
  | "active"
  | "expired";

const priorityOrder: Record<AnnouncementPriority, number> = {
  urgent: 0,
  important: 1,
  normal: 2,
};

export function getAnnouncementLifecycle(
  announcement: Pick<
    AnnouncementRow,
    "is_published" | "starts_at" | "ends_at"
  >,
  now = new Date(),
): AnnouncementLifecycle {
  if (!announcement.is_published) {
    return "draft";
  }

  const currentTime = now.getTime();
  if (
    announcement.starts_at &&
    new Date(announcement.starts_at).getTime() > currentTime
  ) {
    return "scheduled";
  }

  if (
    announcement.ends_at &&
    new Date(announcement.ends_at).getTime() < currentTime
  ) {
    return "expired";
  }

  return "active";
}

export function sortAnnouncements(
  first: AnnouncementRow,
  second: AnnouncementRow,
) {
  if (first.is_pinned !== second.is_pinned) {
    return first.is_pinned ? -1 : 1;
  }

  const priorityDifference =
    priorityOrder[first.priority] - priorityOrder[second.priority];
  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return (
    new Date(second.created_at).getTime() -
    new Date(first.created_at).getTime()
  );
}
