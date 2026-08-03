"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getNonNegativeInteger,
  getOptionalText,
  getRequiredText,
  isChecked,
  isUuid,
  isValidHttpUrl,
  type AdminFormState,
} from "@/lib/admin/form-utils";
import { requireAdmin } from "@/lib/auth/admin";
import type { TeamMemberInsert } from "@/types/database";

function revalidateTeamRoutes() {
  revalidatePath("/");
  revalidatePath("/team");
  revalidatePath("/admin");
  revalidatePath("/admin/team");
}

function isValidEmail(value: string | null) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateTeamMemberForm(
  formData: FormData,
): { payload: TeamMemberInsert } | { message: string } {
  const fullName = getRequiredText(formData, "full_name");
  const role = getRequiredText(formData, "role");
  const memberGroup = getRequiredText(formData, "member_group");
  const year = getRequiredText(formData, "year");
  const email = getOptionalText(formData, "email");
  const profileImageUrl = getOptionalText(formData, "profile_image_url");
  const linkedinUrl = getOptionalText(formData, "linkedin_url");
  const githubUrl = getOptionalText(formData, "github_url");
  const isEmailPublic = isChecked(formData, "is_email_public");

  if (!fullName || !role || !memberGroup) {
    return { message: "Name, role, and member group are required." };
  }

  if (!isValidEmail(email)) {
    return { message: "Enter a valid email address." };
  }

  if (isEmailPublic && !email) {
    return {
      message: "Add an email address before making it publicly visible.",
    };
  }

  if (
    !isValidHttpUrl(profileImageUrl) ||
    !isValidHttpUrl(linkedinUrl) ||
    !isValidHttpUrl(githubUrl)
  ) {
    return { message: "Profile and social links must be valid HTTP URLs." };
  }

  return {
    payload: {
      full_name: fullName,
      role,
      member_group: memberGroup,
      year,
      email,
      is_email_public: isEmailPublic,
      profile_image_url: profileImageUrl,
      linkedin_url: linkedinUrl,
      github_url: githubUrl,
      display_order: getNonNegativeInteger(formData, "display_order"),
      is_active: isChecked(formData, "is_active"),
    },
  };
}

export async function createTeamMemberAction(
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const validation = validateTeamMemberForm(formData);
  if ("message" in validation) {
    return validation;
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("team_members")
    .insert(validation.payload);

  if (error) {
    return { message: "The team member could not be created." };
  }

  revalidateTeamRoutes();
  redirect("/admin/team");
}

export async function updateTeamMemberAction(
  id: string,
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!isUuid(id)) {
    return { message: "The team-member identifier is invalid." };
  }

  const validation = validateTeamMemberForm(formData);
  if ("message" in validation) {
    return validation;
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("team_members")
    .update(validation.payload)
    .eq("id", id);

  if (error) {
    return { message: "The team member could not be updated." };
  }

  revalidateTeamRoutes();
  redirect("/admin/team");
}

export async function toggleTeamMemberActiveAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/team?error=invalid");
  }
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("team_members")
    .select("is_active")
    .eq("id", id)
    .maybeSingle();
  if (!data) {
    redirect("/admin/team?error=update");
  }
  const { error } = await supabase
    .from("team_members")
    .update({ is_active: !data.is_active })
    .eq("id", id);
  if (error) {
    redirect("/admin/team?error=update");
  }
  revalidateTeamRoutes();
  redirect("/admin/team");
}

export async function toggleTeamMemberEmailAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/team?error=invalid");
  }
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("team_members")
    .select("email,is_email_public")
    .eq("id", id)
    .maybeSingle();
  if (!data?.email) {
    redirect("/admin/team?error=email");
  }
  const { error } = await supabase
    .from("team_members")
    .update({ is_email_public: !data.is_email_public })
    .eq("id", id);
  if (error) {
    redirect("/admin/team?error=update");
  }
  revalidateTeamRoutes();
  redirect("/admin/team");
}

export async function moveTeamMemberAction(
  id: string,
  direction: "earlier" | "later",
) {
  if (!isUuid(id)) {
    redirect("/admin/team?error=invalid");
  }

  const { supabase } = await requireAdmin();
  const { data: members } = await supabase
    .from("team_members")
    .select("id,display_order")
    .order("display_order", { ascending: true })
    .order("full_name", { ascending: true });

  const currentIndex = members?.findIndex((member) => member.id === id) ?? -1;
  const neighbourIndex =
    direction === "earlier" ? currentIndex - 1 : currentIndex + 1;
  const current = members?.[currentIndex];
  const neighbour = members?.[neighbourIndex];

  if (!current || !neighbour) {
    redirect("/admin/team");
  }

  const { error } = await supabase.rpc("swap_team_member_order", {
    first_id: current.id,
    second_id: neighbour.id,
  });

  if (error) {
    redirect("/admin/team?error=update");
  }

  revalidateTeamRoutes();
  redirect("/admin/team");
}
