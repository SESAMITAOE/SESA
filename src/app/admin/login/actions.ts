"use server";

import { redirect } from "next/navigation";

import { getServerSupabaseClient } from "@/lib/supabase/server";

export interface LoginState {
  message?: string;
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { message: "Enter both your administrator email and password." };
  }

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      message:
        "The administrator system is not configured. Follow docs/ADMIN_CMS_SETUP.md.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { message: "The email or password was not accepted." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    return { message: "This account is not approved for administration." };
  }

  redirect("/admin");
}
