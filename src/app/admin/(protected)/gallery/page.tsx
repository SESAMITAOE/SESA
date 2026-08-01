import { ArrowDown, ArrowUp, ImageIcon, Search } from "lucide-react";
import Link from "next/link";

import {
  deleteGalleryItemAction,
  moveGalleryItemAction,
  toggleGalleryFeaturedAction,
  toggleGalleryPublishedAction,
} from "@/app/admin/(protected)/gallery/actions";
import { AdminDataNotice } from "@/components/admin/admin-data-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminGalleryItems } from "@/lib/data/admin-content";
import {
  GALLERY_BUCKET,
  getSignedCmsFileUrl,
} from "@/lib/storage/cms-files";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    status?: string;
    error?: string;
  }>;
}) {
  const filters = await searchParams;
  const { supabase } = await requireAdmin();
  const result = await getAdminGalleryItems(supabase);
  const { data: events } = await supabase.from("events").select("id,title");
  const eventTitles = new Map(
    (events ?? []).map((event) => [event.id, event.title]),
  );
  const query = filters.query?.trim().toLowerCase() ?? "";
  const categories = Array.from(
    new Set(result.data.map((item) => item.category)),
  ).sort();
  const itemsWithImages = await Promise.all(
    result.data.map(async (item, originalIndex) => ({
      item,
      originalIndex,
      previewUrl:
        item.image_url ??
        (await getSignedCmsFileUrl(
          supabase,
          GALLERY_BUCKET,
          item.storage_path,
        )),
    })),
  );
  const filteredItems = itemsWithImages.filter(({ item }) => {
    const matchesQuery = `${item.title} ${item.caption} ${item.alt_text}`
      .toLowerCase()
      .includes(query);
    const matchesCategory =
      !filters.category || item.category === filters.category;
    const matchesStatus =
      !filters.status ||
      (filters.status === "published" && item.is_published) ||
      (filters.status === "draft" && !item.is_published) ||
      (filters.status === "featured" && item.is_featured);
    return matchesQuery && matchesCategory && matchesStatus;
  });

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Upload, describe, publish, feature, and order the photographs shown publicly."
        action={
          <Button asChild>
            <Link href="/admin/gallery/new">Add gallery item</Link>
          </Button>
        }
      />
      <AdminDataNotice show={result.hasError} />
      {filters.error ? (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {filters.error === "image"
            ? "Upload an image before publishing this gallery item."
            : "The requested gallery update could not be completed safely."}
        </p>
      ) : null}
      <form className="mt-6 grid gap-3 rounded-2xl border border-navy-950/8 bg-white p-4 md:grid-cols-[1fr_0.7fr_0.7fr_auto]">
        <label className="flex items-center gap-2 rounded-xl border border-navy-950/10 px-3">
          <Search className="size-4 text-slate-400" />
          <span className="sr-only">Search gallery items</span>
          <input
            name="query"
            defaultValue={filters.query ?? ""}
            placeholder="Search title, caption, or alt text"
            className="min-w-0 flex-1 py-3 text-sm outline-none"
          />
        </label>
        <select
          name="category"
          defaultValue={filters.category ?? ""}
          className="rounded-xl border border-navy-950/10 bg-white px-3 py-3 text-sm"
          aria-label="Filter gallery category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={filters.status ?? ""}
          className="rounded-xl border border-navy-950/10 bg-white px-3 py-3 text-sm"
          aria-label="Filter gallery status"
        >
          <option value="">All states</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="featured">Featured</option>
        </select>
        <Button type="submit">Apply filters</Button>
      </form>

      <div className="mt-7 grid gap-4">
        {filteredItems.map(({ item, originalIndex, previewUrl }) => (
          <article
            key={item.id}
            className="rounded-2xl border border-navy-950/8 bg-white p-5 shadow-[0_16px_50px_rgba(17,38,71,0.07)]"
          >
            <div className="grid gap-5 sm:grid-cols-[9rem_1fr] lg:grid-cols-[9rem_1fr_auto] lg:items-center">
              <div className="overflow-hidden rounded-xl bg-slate-100">
                {previewUrl ? (
                  // Administrator-managed Storage URLs cannot be statically allowlisted.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt=""
                    className="aspect-[4/3] h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center text-slate-400">
                    <ImageIcon className="size-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                  <span className={item.is_published ? "rounded-full bg-emerald-100 px-3 py-1 text-emerald-800" : "rounded-full bg-slate-100 px-3 py-1 text-slate-600"}>
                    {item.is_published ? "Published" : "Draft"}
                  </span>
                  {item.is_featured ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                      Featured
                    </span>
                  ) : null}
                  <span className="rounded-full bg-navy-950/7 px-3 py-1 text-navy-950">
                    {item.category}
                  </span>
                </div>
                <h2 className="mt-3 break-words font-display text-3xl text-navy-950">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Order {item.display_order}
                  {item.event_id
                    ? ` • ${eventTitles.get(item.event_id) ?? "Related event"}`
                    : ""}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {item.caption || item.alt_text}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-1 lg:justify-end">
                <form action={moveGalleryItemAction.bind(null, item.id, "earlier")}>
                  <Button type="submit" size="icon" variant="outline" disabled={originalIndex === 0} aria-label={`Move ${item.title} earlier`}>
                    <ArrowUp className="size-4" />
                  </Button>
                </form>
                <form action={moveGalleryItemAction.bind(null, item.id, "later")}>
                  <Button type="submit" size="icon" variant="outline" disabled={originalIndex === result.data.length - 1} aria-label={`Move ${item.title} later`}>
                    <ArrowDown className="size-4" />
                  </Button>
                </form>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/gallery/${item.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-navy-950/8 pt-5">
              <form action={toggleGalleryPublishedAction.bind(null, item.id)}>
                <Button type="submit" size="sm" variant="outline">
                  {item.is_published ? "Unpublish" : "Publish"}
                </Button>
              </form>
              <form action={toggleGalleryFeaturedAction.bind(null, item.id)}>
                <Button type="submit" size="sm" variant="outline">
                  {item.is_featured ? "Unfeature" : "Feature"}
                </Button>
              </form>
              <ConfirmActionForm
                action={deleteGalleryItemAction.bind(null, item.id)}
                confirmation={`Delete "${item.title}" and its stored image? This cannot be undone.`}
              >
                <Button type="submit" size="sm" variant="destructive">
                  Delete
                </Button>
              </ConfirmActionForm>
            </div>
          </article>
        ))}
      </div>
      {!filteredItems.length && !result.hasError ? (
        <p className="mt-7 rounded-2xl border border-dashed border-navy-950/20 p-10 text-center text-slate-600">
          No gallery items match these filters.
        </p>
      ) : null}
    </>
  );
}
