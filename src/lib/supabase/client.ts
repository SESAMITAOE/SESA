"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseConfiguration } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

let browserClient: SupabaseClient<Database> | null = null;

export function getBrowserSupabaseClient(): SupabaseClient<Database> | null {
  const configuration = getSupabaseConfiguration();

  if (!configuration) {
    return null;
  }

  browserClient ??= createBrowserClient<Database>(
    configuration.url,
    configuration.anonKey,
  );

  return browserClient;
}
