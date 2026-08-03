export type EventStatus = "completed" | "live" | "upcoming" | "planned";

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  description: string;
  startAt?: string;
  endAt?: string;
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
  registrationDeadlineLabel?: string;
  displayOrder?: number;
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
  description: string;
  category: string;
  resourceType:
    | "document"
    | "link"
    | "video"
    | "repository"
    | "guide"
    | "other";
  href?: string;
  isFile: boolean;
  audience?: string;
  academicYear?: string;
  featured: boolean;
  displayOrder: number;
  meta?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  altText: string;
  imageUrl?: string;
  category: string;
  eventId?: string;
  capturedAt?: string;
  featured: boolean;
  displayOrder: number;
  gradient: string;
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
