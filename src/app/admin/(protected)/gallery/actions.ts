"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getNonNegativeInteger,
  getOptionalText,
  getRequiredText,
  isChecked,
  isUuid,
  parseIndiaDateTime,
  type AdminFormState,
} from "@/lib/admin/form-utils";
import { requireAdmin } from "@/lib/auth/admin";
import {
  GALLERY_BUCKET,
  GALLERY_IMAGE_EXTENSIONS,
  GALLERY_IMAGE_MAX_BYTES,
  GALLERY_IMAGE_TYPES,
  getUploadedFile,
  removeCmsFile,
  uploadCmsFile,
  validateUploadedFile,
} from "@/lib/storage/cms-files";
import type { GalleryItemInsert } from "@/types/database";

function revalidateGalleryRoutes() {
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin");
  revalidatePath("/admin/gallery");
}

function validateGalleryForm(formData: FormData, hasExistingImage: boolean) {
  const title = getRequiredText(formData, "title");
  const caption = getRequiredText(formData, "caption");
  const altText = getRequiredText(formData, "alt_text");
  const category = getRequiredText(formData, "category");
  const eventId = getOptionalText(formData, "event_id");
  const capturedAtValue = getOptionalText(formData, "captured_at");
  const capturedAt = parseIndiaDateTime(capturedAtValue);
  const image = getUploadedFile(formData, "image");
  const isPublished = isChecked(formData, "is_published");
  const fileError = validateUploadedFile(
    image,
    GALLERY_IMAGE_TYPES,
    GALLERY_IMAGE_EXTENSIONS,
    GALLERY_IMAGE_MAX_BYTES,
  );

  if (!title || !altText || !category) {
    return { message: "Title, alt text, and category are required." };
  }

  if (eventId && !isUuid(eventId)) {
    return { message: "Choose a valid related event." };
  }

  if (capturedAtValue && !capturedAt) {
    return { message: "Enter a valid capture date and time." };
  }

  if (fileError) {
    return { message: fileError };
  }

  if (isPublished && !hasExistingImage && !image) {
    return { message: "Upload an image before publishing this gallery item." };
  }

  const payload: GalleryItemInsert = {
    title,
    caption,
    alt_text: altText,
    category,
    event_id: eventId,
    captured_at: capturedAt,
    display_order: getNonNegativeInteger(formData, "display_order"),
    is_featured: isChecked(formData, "is_featured"),
    is_published: isPublished,
  };

  return { payload, image };
}

export async function createGalleryItemAction(
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const validation = validateGalleryForm(formData, false);
  if ("message" in validation) {
    return validation;
  }

  const { supabase, user } = await requireAdmin();
  let uploadedPath: string | null = null;
  if (validation.image) {
    const upload = await uploadCmsFile(
      supabase,
      GALLERY_BUCKET,
      user.id,
      validation.image,
    );
    if ("message" in upload) {
      return upload;
    }
    uploadedPath = upload.path;
  }

  const { error } = await supabase.from("gallery_items").insert({
    ...validation.payload,
    storage_path: uploadedPath,
    created_by: user.id,
  });

  if (error) {
    await removeCmsFile(supabase, GALLERY_BUCKET, uploadedPath);
    return { message: "The gallery item could not be created." };
  }

  revalidateGalleryRoutes();
  redirect("/admin/gallery");
}

export async function updateGalleryItemAction(
  id: string,
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!isUuid(id)) {
    return { message: "The gallery item identifier is invalid." };
  }

  const { supabase, user } = await requireAdmin();
  const { data: existing } = await supabase
    .from("gallery_items")
    .select("image_url,storage_path")
    .eq("id", id)
    .maybeSingle();

  if (!existing) {
    return { message: "The gallery item could not be found." };
  }

  const validation = validateGalleryForm(
    formData,
    Boolean(existing.image_url || existing.storage_path),
  );
  if ("message" in validation) {
    return validation;
  }

  let uploadedPath: string | null = null;
  if (validation.image) {
    const upload = await uploadCmsFile(
      supabase,
      GALLERY_BUCKET,
      user.id,
      validation.image,
    );
    if ("message" in upload) {
      return upload;
    }
    uploadedPath = upload.path;
  }

  const { error } = await supabase
    .from("gallery_items")
    .update({
      ...validation.payload,
      ...(uploadedPath
        ? { image_url: null, storage_path: uploadedPath }
        : {}),
    })
    .eq("id", id);

  if (error) {
    await removeCmsFile(supabase, GALLERY_BUCKET, uploadedPath);
    return { message: "The gallery item could not be updated." };
  }

  if (uploadedPath) {
    await removeCmsFile(supabase, GALLERY_BUCKET, existing.storage_path);
  }

  revalidateGalleryRoutes();
  redirect("/admin/gallery");
}

export async function toggleGalleryPublishedAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/gallery?error=invalid");
  }

  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("gallery_items")
    .select("is_published,image_url,storage_path")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    redirect("/admin/gallery?error=update");
  }
  if (!data.is_published && !data.image_url && !data.storage_path) {
    redirect("/admin/gallery?error=image");
  }

  const { error } = await supabase
    .from("gallery_items")
    .update({ is_published: !data.is_published })
    .eq("id", id);
  if (error) {
    redirect("/admin/gallery?error=update");
  }

  revalidateGalleryRoutes();
  redirect("/admin/gallery");
}

export async function toggleGalleryFeaturedAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/gallery?error=invalid");
  }

  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("gallery_items")
    .select("is_featured")
    .eq("id", id)
    .maybeSingle();
  if (!data) {
    redirect("/admin/gallery?error=update");
  }

  const { error } = await supabase
    .from("gallery_items")
    .update({ is_featured: !data.is_featured })
    .eq("id", id);
  if (error) {
    redirect("/admin/gallery?error=update");
  }

  revalidateGalleryRoutes();
  redirect("/admin/gallery");
}

export async function moveGalleryItemAction(
  id: string,
  direction: "earlier" | "later",
) {
  if (!isUuid(id)) {
    redirect("/admin/gallery?error=invalid");
  }

  const { supabase } = await requireAdmin();
  const { data: items } = await supabase
    .from("gallery_items")
    .select("id,display_order")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  const currentIndex = items?.findIndex((item) => item.id === id) ?? -1;
  const neighbourIndex =
    direction === "earlier" ? currentIndex - 1 : currentIndex + 1;
  const current = items?.[currentIndex];
  const neighbour = items?.[neighbourIndex];

  if (!current || !neighbour) {
    redirect("/admin/gallery");
  }

  const { error } = await supabase.rpc("swap_gallery_item_order", {
    first_id: current.id,
    second_id: neighbour.id,
  });
  if (error) {
    redirect("/admin/gallery?error=update");
  }

  revalidateGalleryRoutes();
  redirect("/admin/gallery");
}

export async function deleteGalleryItemAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/gallery?error=invalid");
  }

  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("gallery_items")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  if (!data) {
    redirect("/admin/gallery?error=update");
  }

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) {
    redirect("/admin/gallery?error=update");
  }

  await removeCmsFile(supabase, GALLERY_BUCKET, data.storage_path);
  revalidateGalleryRoutes();
  redirect("/admin/gallery");
}
