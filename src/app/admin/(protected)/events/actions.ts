"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  getNonNegativeInteger,
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
  Database,
  DatabaseEventStatus,
  EventInsert,
} from "@/types/database";

const eventStatuses: DatabaseEventStatus[] = [
  "completed",
  "live",
  "upcoming",
  "planned",
];

function revalidateEventRoutes() {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
}

function validateEventForm(
  formData: FormData,
):
  | { payload: EventInsert }
  | { message: string } {
  const title = getRequiredText(formData, "title");
  const slug = getRequiredText(formData, "slug").toLowerCase();
  const shortDescription = getRequiredText(formData, "short_description");
  const description = getRequiredText(formData, "description");
  const venue = getRequiredText(formData, "venue");
  const category = getRequiredText(formData, "category");
  const statusValue = getRequiredText(formData, "status");
  const posterUrl = getOptionalText(formData, "poster_url");
  const registrationUrl = getOptionalText(formData, "registration_url");
  const startAtValue = getOptionalText(formData, "start_at");
  const endAtValue = getOptionalText(formData, "end_at");
  const deadlineValue = getOptionalText(formData, "registration_deadline");
  const startAt = parseIndiaDateTime(startAtValue);
  const endAt = parseIndiaDateTime(endAtValue);
  const registrationDeadline = parseIndiaDateTime(deadlineValue);

  if (!title || !shortDescription || !description) {
    return {
      message: "Title, short description, and description are required.",
    };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return {
      message:
        "Slug must contain lowercase letters, numbers, and single hyphens only.",
    };
  }

  if (!eventStatuses.includes(statusValue as DatabaseEventStatus)) {
    return { message: "Choose a valid event status." };
  }

  if (!isValidHttpUrl(posterUrl) || !isValidHttpUrl(registrationUrl)) {
    return { message: "Poster and registration links must be valid HTTP URLs." };
  }

  if (
    (startAtValue && !startAt) ||
    (endAtValue && !endAt) ||
    (deadlineValue && !registrationDeadline)
  ) {
    return { message: "Enter valid event dates and times." };
  }

  if (startAt && endAt && new Date(endAt) < new Date(startAt)) {
    return { message: "The event end cannot be before its start." };
  }

  if (registrationDeadline && !startAt) {
    return {
      message: "Set an event start before adding a registration deadline.",
    };
  }

  if (
    registrationDeadline &&
    startAt &&
    new Date(registrationDeadline) > new Date(startAt)
  ) {
    return {
      message: "The registration deadline cannot be after the event starts.",
    };
  }

  return {
    payload: {
      title,
      slug,
      short_description: shortDescription,
      description,
      start_at: startAt,
      end_at: endAt,
      venue,
      category,
      status: statusValue as DatabaseEventStatus,
      poster_url: posterUrl,
      registration_url: registrationUrl,
      registration_deadline: registrationDeadline,
      is_featured: isChecked(formData, "is_featured"),
      is_published: isChecked(formData, "is_published"),
      display_order: getNonNegativeInteger(formData, "display_order"),
    },
  };
}

async function slugIsTaken(
  supabase: SupabaseClient<Database>,
  slug: string,
  excludedId?: string,
) {
  let query = supabase.from("events").select("id").eq("slug", slug);
  if (excludedId) {
    query = query.neq("id", excludedId);
  }
  const { data, error } = await query.maybeSingle();
  return { isTaken: Boolean(data), hasError: Boolean(error) };
}

export async function createEventAction(
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const validation = validateEventForm(formData);
  if ("message" in validation) {
    return validation;
  }

  const { supabase, user } = await requireAdmin();
  const slugCheck = await slugIsTaken(supabase, validation.payload.slug);
  if (slugCheck.hasError) {
    return { message: "The event slug could not be checked safely." };
  }
  if (slugCheck.isTaken) {
    return { message: "That event slug is already in use." };
  }

  const { error } = await supabase.from("events").insert({
    ...validation.payload,
    created_by: user.id,
  });

  if (error) {
    return { message: "The event could not be created. Review the form." };
  }

  revalidateEventRoutes();
  redirect("/admin/events");
}

export async function updateEventAction(
  id: string,
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!isUuid(id)) {
    return { message: "The event identifier is invalid." };
  }

  const validation = validateEventForm(formData);
  if ("message" in validation) {
    return validation;
  }

  const { supabase } = await requireAdmin();
  const slugCheck = await slugIsTaken(supabase, validation.payload.slug, id);
  if (slugCheck.hasError) {
    return { message: "The event slug could not be checked safely." };
  }
  if (slugCheck.isTaken) {
    return { message: "That event slug is already in use." };
  }

  const { error } = await supabase
    .from("events")
    .update(validation.payload)
    .eq("id", id);

  if (error) {
    return { message: "The event could not be updated. Review the form." };
  }

  revalidateEventRoutes();
  redirect("/admin/events");
}

export async function toggleEventPublishedAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/events?error=invalid");
  }
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("events")
    .select("is_published")
    .eq("id", id)
    .maybeSingle();
  if (!data) {
    redirect("/admin/events?error=update");
  }
  const { error } = await supabase
    .from("events")
    .update({ is_published: !data.is_published })
    .eq("id", id);
  if (error) {
    redirect("/admin/events?error=update");
  }
  revalidateEventRoutes();
  redirect("/admin/events");
}

export async function toggleEventFeaturedAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/events?error=invalid");
  }
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("events")
    .select("is_featured")
    .eq("id", id)
    .maybeSingle();
  if (!data) {
    redirect("/admin/events?error=update");
  }
  const { error } = await supabase
    .from("events")
    .update({ is_featured: !data.is_featured })
    .eq("id", id);
  if (error) {
    redirect("/admin/events?error=update");
  }
  revalidateEventRoutes();
  redirect("/admin/events");
}

export async function setEventStatusAction(id: string, formData: FormData) {
  const status = getRequiredText(formData, "status") as DatabaseEventStatus;
  if (!isUuid(id) || !eventStatuses.includes(status)) {
    redirect("/admin/events?error=invalid");
  }
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("events")
    .update({ status })
    .eq("id", id);
  if (error) {
    redirect("/admin/events?error=update");
  }
  revalidateEventRoutes();
  redirect("/admin/events");
}

export async function deleteEventAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/events?error=invalid");
  }
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    redirect("/admin/events?error=update");
  }
  revalidateEventRoutes();
  redirect("/admin/events");
}
