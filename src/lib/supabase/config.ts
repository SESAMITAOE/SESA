export interface SupabaseConfiguration {
  url: string;
  anonKey: string;
}

export const SUPABASE_CONFIGURATION_MESSAGE =
  "Supabase is not configured. Add the public project URL and anonymous key described in docs/ADMIN_CMS_SETUP.md.";

export function getSupabaseConfiguration(): SupabaseConfiguration | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured() {
  return getSupabaseConfiguration() !== null;
}
