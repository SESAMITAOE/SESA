import Link from "next/link";
import { notFound } from "next/navigation";

import { updateResourceAction } from "@/app/admin/(protected)/resources/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ResourceForm } from "@/components/admin/resource-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";
import {
  getSignedCmsFileUrl,
  RESOURCE_BUCKET,
} from "@/lib/storage/cms-files";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data: resource } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!resource) {
    notFound();
  }

  const existingFileUrl =
    resource.file_url ??
    (await getSignedCmsFileUrl(
      supabase,
      RESOURCE_BUCKET,
      resource.storage_path,
    ));

  return (
    <>
      <AdminPageHeader
        title="Edit resource"
        description="Update its destination, classification, order, and public publishing state."
        action={
          <Button asChild variant="outline">
            <Link href="/admin/resources">Back to resources</Link>
          </Button>
        }
      />
      <ResourceForm
        action={updateResourceAction.bind(null, id)}
        resource={resource}
        existingFileUrl={existingFileUrl}
      />
    </>
  );
}
