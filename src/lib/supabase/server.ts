import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getSupabaseConfiguration } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export async function getServerSupabaseClient(): Promise<SupabaseClient<Database> | null> {
  const configuration = getSupabaseConfiguration();

  if (!configuration) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    configuration.url,
    configuration.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot set cookies; middleware refreshes them.
          }
        },
      },
    },
  );
}
