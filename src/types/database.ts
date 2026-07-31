export type AdminRole = "admin";
export type AnnouncementPriority = "normal" | "important" | "urgent";
export type DatabaseEventStatus = "completed" | "live" | "upcoming" | "planned";

export type ProfileRow = {
  id: string;
  full_name: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  start_at: string | null;
  end_at: string | null;
  venue: string;
  category: string;
  status: DatabaseEventStatus;
  poster_url: string | null;
  registration_url: string | null;
  registration_deadline: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type TeamMemberRow = {
  id: string;
  full_name: string;
  role: string;
  member_group: string;
  year: string;
  email: string | null;
  is_email_public: boolean;
  profile_image_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PublicTeamMemberRow = {
  id: string | null;
  full_name: string | null;
  role: string | null;
  member_group: string | null;
  year: string | null;
  email: string | null;
  is_email_public: boolean | null;
  profile_image_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  display_order: number | null;
};

export type AnnouncementRow = {
  id: string;
  title: string;
  message: string;
  priority: AnnouncementPriority;
  link_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_published: boolean;
  is_pinned: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileInsert = {
  id: string;
  full_name: string;
  role?: AdminRole;
  created_at?: string;
  updated_at?: string;
};

export type EventInsert = {
  id?: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  start_at?: string | null;
  end_at?: string | null;
  venue?: string;
  category?: string;
  status?: DatabaseEventStatus;
  poster_url?: string | null;
  registration_url?: string | null;
  registration_deadline?: string | null;
  is_featured?: boolean;
  is_published?: boolean;
  display_order?: number;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type TeamMemberInsert = {
  id?: string;
  full_name: string;
  role: string;
  member_group: string;
  year?: string;
  email?: string | null;
  is_email_public?: boolean;
  profile_image_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AnnouncementInsert = {
  id?: string;
  title: string;
  message: string;
  priority?: AnnouncementPriority;
  link_url?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_published?: boolean;
  is_pinned?: boolean;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: EventInsert;
        Update: Partial<EventInsert>;
        Relationships: [];
      };
      team_members: {
        Row: TeamMemberRow;
        Insert: TeamMemberInsert;
        Update: Partial<TeamMemberInsert>;
        Relationships: [];
      };
      announcements: {
        Row: AnnouncementRow;
        Insert: AnnouncementInsert;
        Update: Partial<AnnouncementInsert>;
        Relationships: [];
      };
    };
    Views: {
      public_team_members: {
        Row: PublicTeamMemberRow;
        Relationships: [];
      };
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      swap_team_member_order: {
        Args: {
          first_id: string;
          second_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: Record<PropertyKey, never>;
    CompositeTypes: Record<PropertyKey, never>;
  };
};
