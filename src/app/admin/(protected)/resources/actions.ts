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
import {
  getUploadedFile,
  removeCmsFile,
  RESOURCE_BUCKET,
  RESOURCE_FILE_EXTENSIONS,
  RESOURCE_FILE_MAX_BYTES,
  RESOURCE_FILE_TYPES,
  uploadCmsFile,
  validateUploadedFile,
} from "@/lib/storage/cms-files";
import type { ResourceInsert, ResourceType } from "@/types/database";

const resourceTypes: ResourceType[] = [
  "document",
  "link",
  "video",
  "repository",
  "guide",
  "other",
];

function revalidateResourceRoutes() {
  revalidatePath("/");
  revalidatePath("/resources");
  revalidatePath("/admin");
  revalidatePath("/admin/resources");
}

function validateResourceForm(formData: FormData, hasExistingFile: boolean) {
  const title = getRequiredText(formData, "title");
  const description = getRequiredText(formData, "description");
  const category = getRequiredText(formData, "category");
  const resourceType = getRequiredText(formData, "resource_type");
  const externalUrl = getOptionalText(formData, "external_url");
  const file = getUploadedFile(formData, "file");
  const isPublished = isChecked(formData, "is_published");
  const fileError = validateUploadedFile(
    file,
    RESOURCE_FILE_TYPES,
    RESOURCE_FILE_EXTENSIONS,
    RESOURCE_FILE_MAX_BYTES,
  );

  if (!title || !description || !category) {
    return { message: "Title, description, and category are required." };
  }

  if (!resourceTypes.includes(resourceType as ResourceType)) {
    return { message: "Choose a valid resource type." };
  }

  if (!isValidHttpUrl(externalUrl)) {
    return { message: "The external link must be a valid HTTP URL." };
  }

  if (fileError) {
    return { message: fileError };
  }

  if (externalUrl && file) {
    return { message: "Use either an external URL or an uploaded file, not both." };
  }

  if (isPublished && !externalUrl && !file && !hasExistingFile) {
    return {
      message: "Add an external URL or upload a file before publishing.",
    };
  }

  const payload: ResourceInsert = {
    title,
    description,
    category,
    resource_type: resourceType as ResourceType,
    external_url: externalUrl,
    audience: getOptionalText(formData, "audience"),
    academic_year: getOptionalText(formData, "academic_year"),
    is_featured: isChecked(formData, "is_featured"),
    is_published: isPublished,
    display_order: getNonNegativeInteger(formData, "display_order"),
  };

  return { payload, file, switchesToExternal: Boolean(externalUrl) };
}

export async function createResourceAction(
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const validation = validateResourceForm(formData, false);
  if ("message" in validation) {
    return validation;
  }

  const { supabase, user } = await requireAdmin();
  let uploadedPath: string | null = null;
  if (validation.file) {
    const upload = await uploadCmsFile(
      supabase,
      RESOURCE_BUCKET,
      user.id,
      validation.file,
    );
    if ("message" in upload) {
      return upload;
    }
    uploadedPath = upload.path;
  }

  const { error } = await supabase.from("resources").insert({
    ...validation.payload,
    storage_path: uploadedPath,
    created_by: user.id,
  });

  if (error) {
    await removeCmsFile(supabase, RESOURCE_BUCKET, uploadedPath);
    return { message: "The resource could not be created." };
  }

  revalidateResourceRoutes();
  redirect("/admin/resources");
}

export async function updateResourceAction(
  id: string,
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!isUuid(id)) {
    return { message: "The resource identifier is invalid." };
  }

  const { supabase, user } = await requireAdmin();
  const { data: existing } = await supabase
    .from("resources")
    .select("file_url,storage_path")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { message: "The resource could not be found." };
  }

  const validation = validateResourceForm(
    formData,
    Boolean(existing.file_url || existing.storage_path),
  );
  if ("message" in validation) {
    return validation;
  }

  let uploadedPath: string | null = null;
  if (validation.file) {
    const upload = await uploadCmsFile(
      supabase,
      RESOURCE_BUCKET,
      user.id,
      validation.file,
    );
    if ("message" in upload) {
      return upload;
    }
    uploadedPath = upload.path;
  }

  const replaceStoredFile = Boolean(uploadedPath || validation.switchesToExternal);
  const { error } = await supabase
    .from("resources")
    .update({
      ...validation.payload,
      ...(replaceStoredFile
        ? { file_url: null, storage_path: uploadedPath }
        : {}),
    })
    .eq("id", id);

  if (error) {
    await removeCmsFile(supabase, RESOURCE_BUCKET, uploadedPath);
    return { message: "The resource could not be updated." };
  }

  if (replaceStoredFile) {
    await removeCmsFile(supabase, RESOURCE_BUCKET, existing.storage_path);
  }

  revalidateResourceRoutes();
  redirect("/admin/resources");
}

export async function toggleResourcePublishedAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/resources?error=invalid");
  }

  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("resources")
    .select("is_published,external_url,file_url,storage_path")
    .eq("id", id)
    .maybeSingle();
  if (!data) {
    redirect("/admin/resources?error=update");
  }
  if (
    !data.is_published &&
    !data.external_url &&
    !data.file_url &&
    !data.storage_path
  ) {
    redirect("/admin/resources?error=destination");
  }

  const { error } = await supabase
    .from("resources")
    .update({ is_published: !data.is_published })
    .eq("id", id);
  if (error) {
    redirect("/admin/resources?error=update");
  }

  revalidateResourceRoutes();
  redirect("/admin/resources");
}

export async function toggleResourceFeaturedAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/resources?error=invalid");
  }

  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("resources")
    .select("is_featured")
    .eq("id", id)
    .maybeSingle();
  if (!data) {
    redirect("/admin/resources?error=update");
  }

  const { error } = await supabase
    .from("resources")
    .update({ is_featured: !data.is_featured })
    .eq("id", id);
  if (error) {
    redirect("/admin/resources?error=update");
  }

  revalidateResourceRoutes();
  redirect("/admin/resources");
}

export async function moveResourceAction(
  id: string,
  direction: "earlier" | "later",
) {
  if (!isUuid(id)) {
    redirect("/admin/resources?error=invalid");
  }

  const { supabase } = await requireAdmin();
  const { data: resources } = await supabase
    .from("resources")
    .select("id,display_order")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  const currentIndex =
    resources?.findIndex((resource) => resource.id === id) ?? -1;
  const neighbourIndex =
    direction === "earlier" ? currentIndex - 1 : currentIndex + 1;
  const current = resources?.[currentIndex];
  const neighbour = resources?.[neighbourIndex];

  if (!current || !neighbour) {
    redirect("/admin/resources");
  }

  const { error } = await supabase.rpc("swap_resource_order", {
    first_id: current.id,
    second_id: neighbour.id,
  });
  if (error) {
    redirect("/admin/resources?error=update");
  }

  revalidateResourceRoutes();
  redirect("/admin/resources");
}

export async function deleteResourceAction(id: string) {
  if (!isUuid(id)) {
    redirect("/admin/resources?error=invalid");
  }

  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("resources")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  if (!data) {
    redirect("/admin/resources?error=update");
  }

  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) {
    redirect("/admin/resources?error=update");
  }

  await removeCmsFile(supabase, RESOURCE_BUCKET, data.storage_path);
  revalidateResourceRoutes();
  redirect("/admin/resources");
}
