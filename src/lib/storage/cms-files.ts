import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export const GALLERY_BUCKET = "gallery-images";
export const RESOURCE_BUCKET = "resource-files";

export const GALLERY_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;
export const GALLERY_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"] as const;

export const RESOURCE_FILE_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
] as const;
export const RESOURCE_FILE_EXTENSIONS = [
  "pdf",
  "txt",
  "md",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "zip",
] as const;

export const GALLERY_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const RESOURCE_FILE_MAX_BYTES = 10 * 1024 * 1024;

export function getUploadedFile(formData: FormData, field: string) {
  const value = formData.get(field);
  return value instanceof File && value.size > 0 ? value : null;
}

export function validateUploadedFile(
  file: File | null,
  allowedTypes: readonly string[],
  allowedExtensions: readonly string[],
  maximumBytes: number,
) {
  if (!file) {
    return null;
  }

  if (!allowedTypes.includes(file.type)) {
    return "Choose a supported file format.";
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!allowedExtensions.includes(extension)) {
    return "The file extension does not match a supported format.";
  }

  if (file.size > maximumBytes) {
    return `The file must be no larger than ${Math.round(
      maximumBytes / 1024 / 1024,
    )} MB.`;
  }

  return null;
}

function safeExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension?.replace(/[^a-z0-9]/g, "") || "bin";
}

export async function uploadCmsFile(
  supabase: SupabaseClient<Database>,
  bucket: string,
  userId: string,
  file: File,
): Promise<{ path: string } | { message: string }> {
  const path = `${userId}/${crypto.randomUUID()}.${safeExtension(file)}`;
  const { error } = await supabase.storage.from(bucket).upload(
    path,
    await file.arrayBuffer(),
    {
      contentType: file.type,
      upsert: false,
    },
  );

  return error
    ? { message: "The file could not be uploaded. Check its format and size." }
    : { path };
}

export async function removeCmsFile(
  supabase: SupabaseClient<Database>,
  bucket: string,
  path: string | null,
) {
  if (!path) {
    return;
  }

  await supabase.storage.from(bucket).remove([path]);
}

export async function getSignedCmsFileUrl(
  supabase: SupabaseClient<Database>,
  bucket: string,
  path: string | null,
) {
  if (!path) {
    return undefined;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60);

  return error ? undefined : data.signedUrl;
}
