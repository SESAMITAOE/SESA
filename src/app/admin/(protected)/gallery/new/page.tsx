import Link from "next/link";

import { createGalleryItemAction } from "@/app/admin/(protected)/gallery/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { GalleryItemForm } from "@/components/admin/gallery-item-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";

export default async function NewGalleryItemPage() {
  const { supabase } = await requireAdmin();
  const [{ data: events }, { data: latestItems }] = await Promise.all([
    supabase.from("events").select("id,title").order("title", { ascending: true }),
    supabase
      .from("gallery_items")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1),
  ]);
  const defaultDisplayOrder = (latestItems?.[0]?.display_order ?? -1) + 1;

  return (
    <>
      <AdminPageHeader
        title="Add gallery item"
        description="Upload one genuine SESA image, describe it accessibly, and publish it only when ready."
        action={
          <Button asChild variant="outline">
            <Link href="/admin/gallery">Back to gallery</Link>
          </Button>
        }
      />
      <GalleryItemForm
        action={createGalleryItemAction}
        events={events ?? []}
        defaultDisplayOrder={defaultDisplayOrder}
      />
    </>
  );
}
