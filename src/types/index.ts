export type EventStatus = "completed" | "live" | "upcoming" | "planned";

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  status: EventStatus;
  featured?: boolean;
  published?: boolean;
  seats?: number;
  posterUrl?: string;
  registrationUrl?: string;
  registrationDeadline?: string;
  accent: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  group: string;
  initials: string;
  year: string;
  email?: string;
  isEmailPublic?: boolean;
  profileImageUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  displayOrder?: number;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: string;
  description: string;
  meta: string;
}

export type AnnouncementPriority = "normal" | "important" | "urgent";

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  priority: AnnouncementPriority;
  linkUrl?: string;
  isPinned: boolean;
}
