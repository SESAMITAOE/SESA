import type { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { getServerSupabaseClient } from "@/lib/supabase/server";
import type { Database, ProfileRow } from "@/types/database";

export interface AdminContext {
  profile: ProfileRow;
  supabase: SupabaseClient<Database>;
  user: User;
}

export async function requireAdmin(): Promise<AdminContext> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    redirect("/admin/login?error=configuration");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=access-denied");
  }

  return { profile, supabase, user };
}
