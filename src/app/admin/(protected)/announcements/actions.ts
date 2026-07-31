"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getOptionalText,
  getRequiredText,
  isChecked,
  isUuid,
  isValidHttpUrl,
  parseIndiaDateTime,
  type AdminFormState,
} from "@/lib/admin/form-utils";
import { requireAdmin } from "@/lib/auth/admin";
import type {
  AnnouncementInsert,
  AnnouncementPriority,
} from "@/types/database";

const priorities: AnnouncementPriority[] = [
  "normal",
  "important",
  "urgent",
];

function revalidateAnnouncementRoutes() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/announcements");
}

function validateAnnouncementForm(
  formData: FormData,
): { payload: AnnouncementInsert } | { message: string } {
  const title = getRequiredText(formData, "title");
  const message = getRequiredText(formData, "message");
  const priorityValue = getRequiredText(formData, "priority");
  const linkUrl = getOptionalText(formData, "link_url");
  const startsAtValue = getOptionalText(formData, "starts_at");
  const endsAtValue = getOptionalText(formData, "ends_at");
  const startsAt = parseIndiaDateTime(startsAtValue);
  const endsAt = parseIndiaDateTime(endsAtValue);

  if (!title || !message) {
    return { message: "Title and message are required." };
  }

  if (!priorities.includes(priorityValue as AnnouncementPriority)) {
    return { message: "Choose a valid announcement priority." };
  }

  if (!isValidHttpUrl(linkUrl)) {
    return { message: "The announcement link must be a valid HTTP URL." };
  }

  if ((startsAtValue && !startsAt) || (endsAtValue && !endsAt)) {
    return { message: "Enter valid announcement dates and times." };
  }

  if (startsAt && endsAt && new Date(endsAt) < new Date(startsAt)) {
    return { message: "The expiry cannot be before the start." };
  }

  return {
    payload: {
      title,
      message,
      priority: priorityValue as AnnouncementPriority,
      link_url: linkUrl,
      starts_at: startsAt,
      ends_at: endsAt,
      is_published: isChecked(formData, "is_published"),
      is_pinned: isChecked(formData, "is_pinned"),
    },
  };
}

export async function createAnnouncementAction(
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const validation = validateAnnouncementForm(formData);
  if ("message" in validation) {
    return validation;
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("announcements").insert({
    ...validation.payload,
    created_by: user.id,
  });

  if (error) {
    return { message: "The announcement could not be created." };
  }

  revalidateAnnouncementRoutes();
  redirect("/admin/announcements");
}

export async function updateAnnouncementAction(
  id: string,
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!isUuid(id)) {
    return { message: "The announcement identifier is invalid." };
  }

  const validation = validateAnnouncementForm(formData);
  if ("message" in validation) {
    return validation;
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("announcements")
    .update(validation.payload)
    .eq("id", id);

  if (error) {
    return { message: "The announcement could not be updated." };
  }

  revalidateAnnouncementRoutes();
  redirect("/admin/announcements");
}

export async function toggleAnnouncementPublishedAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/announcements?error=invalid");
  }
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("announcements")
    .select("is_published")
    .eq("id", id)
    .maybeSingle();
  if (!data) {
    redirect("/admin/announcements?error=update");
  }
  const { error } = await supabase
    .from("announcements")
    .update({ is_published: !data.is_published })
    .eq("id", id);
  if (error) {
    redirect("/admin/announcements?error=update");
  }
  revalidateAnnouncementRoutes();
  redirect("/admin/announcements");
}

export async function toggleAnnouncementPinnedAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/announcements?error=invalid");
  }
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("announcements")
    .select("is_pinned")
    .eq("id", id)
    .maybeSingle();
  if (!data) {
    redirect("/admin/announcements?error=update");
  }
  const { error } = await supabase
    .from("announcements")
    .update({ is_pinned: !data.is_pinned })
    .eq("id", id);
  if (error) {
    redirect("/admin/announcements?error=update");
  }
  revalidateAnnouncementRoutes();
  redirect("/admin/announcements");
}

export async function deleteAnnouncementAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/announcements?error=invalid");
  }
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id);
  if (error) {
    redirect("/admin/announcements?error=update");
  }
  revalidateAnnouncementRoutes();
  redirect("/admin/announcements");
}
