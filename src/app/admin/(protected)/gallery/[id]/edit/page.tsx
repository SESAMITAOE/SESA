import Link from "next/link";
import { notFound } from "next/navigation";

import { updateGalleryItemAction } from "@/app/admin/(protected)/gallery/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { GalleryItemForm } from "@/components/admin/gallery-item-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";
import {
  GALLERY_BUCKET,
  getSignedCmsFileUrl,
} from "@/lib/storage/cms-files";

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data: item }, { data: events }] = await Promise.all([
    supabase.from("gallery_items").select("*").eq("id", id).maybeSingle(),
    supabase.from("events").select("id,title").order("title", { ascending: true }),
  ]);

  if (!item) {
    notFound();
  }

  const existingImageUrl =
    item.image_url ??
    (await getSignedCmsFileUrl(supabase, GALLERY_BUCKET, item.storage_path));

  return (
    <>
      <AdminPageHeader
        title="Edit gallery item"
        description="Update the caption, accessible description, related event, order, and publishing state."
        action={
          <Button asChild variant="outline">
            <Link href="/admin/gallery">Back to gallery</Link>
          </Button>
        }
      />
      <GalleryItemForm
        action={updateGalleryItemAction.bind(null, id)}
        item={item}
        events={events ?? []}
        existingImageUrl={existingImageUrl}
      />
    </>
  );
}
