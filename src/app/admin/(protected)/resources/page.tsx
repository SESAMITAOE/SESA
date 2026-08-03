import { ArrowDown, ArrowUp, FileText, Search } from "lucide-react";
import Link from "next/link";

import {
  deleteResourceAction,
  moveResourceAction,
  toggleResourceFeaturedAction,
  toggleResourcePublishedAction,
} from "@/app/admin/(protected)/resources/actions";
import { AdminDataNotice } from "@/components/admin/admin-data-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminResources } from "@/lib/data/admin-content";

const resourceTypes = [
  "document",
  "link",
  "video",
  "repository",
  "guide",
  "other",
];

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    type?: string;
    status?: string;
    error?: string;
  }>;
}) {
  const filters = await searchParams;
  const { supabase } = await requireAdmin();
  const result = await getAdminResources(supabase);
  const query = filters.query?.trim().toLowerCase() ?? "";
  const categories = Array.from(
    new Set(result.data.map((resource) => resource.category)),
  ).sort();
  const filteredResources = result.data
    .map((resource, originalIndex) => ({ resource, originalIndex }))
    .filter(({ resource }) => {
      const matchesQuery = `${resource.title} ${resource.description}`
        .toLowerCase()
        .includes(query);
      const matchesCategory =
        !filters.category || resource.category === filters.category;
      const matchesType =
        !filters.type || resource.resource_type === filters.type;
      const matchesStatus =
        !filters.status ||
        (filters.status === "published" && resource.is_published) ||
        (filters.status === "draft" && !resource.is_published) ||
        (filters.status === "featured" && resource.is_featured);
      return matchesQuery && matchesCategory && matchesType && matchesStatus;
    });

  return (
    <>
      <AdminPageHeader
        title="Resources"
        description="Manage public guides, files, links, videos, repositories, and their display order."
        action={
          <Button asChild>
            <Link href="/admin/resources/new">Add resource</Link>
          </Button>
        }
      />
      <AdminDataNotice show={result.hasError} />
      {filters.error ? (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {filters.error === "destination"
            ? "Add a valid external URL or uploaded file before publishing."
            : "The requested resource update could not be completed safely."}
        </p>
      ) : null}
      <form className="mt-6 grid gap-3 rounded-2xl border border-navy-950/8 bg-white p-4 lg:grid-cols-[1fr_0.65fr_0.55fr_0.55fr_auto]">
        <label className="flex items-center gap-2 rounded-xl border border-navy-950/10 px-3">
          <Search className="size-4 text-slate-400" />
          <span className="sr-only">Search resources</span>
          <input
            name="query"
            defaultValue={filters.query ?? ""}
            placeholder="Search title or description"
            className="min-w-0 flex-1 py-3 text-sm outline-none"
          />
        </label>
        <select
          name="category"
          defaultValue={filters.category ?? ""}
          className="rounded-xl border border-navy-950/10 bg-white px-3 py-3 text-sm"
          aria-label="Filter resource category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <select
          name="type"
          defaultValue={filters.type ?? ""}
          className="rounded-xl border border-navy-950/10 bg-white px-3 py-3 text-sm"
          aria-label="Filter resource type"
        >
          <option value="">All types</option>
          {resourceTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={filters.status ?? ""}
          className="rounded-xl border border-navy-950/10 bg-white px-3 py-3 text-sm"
          aria-label="Filter resource status"
        >
          <option value="">All states</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="featured">Featured</option>
        </select>
        <Button type="submit">Apply filters</Button>
      </form>

      <div className="mt-7 grid gap-4">
        {filteredResources.map(({ resource, originalIndex }) => (
          <article
            key={resource.id}
            className="rounded-2xl border border-navy-950/8 bg-white p-5 shadow-[0_16px_50px_rgba(17,38,71,0.07)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                  <span className={resource.is_published ? "rounded-full bg-emerald-100 px-3 py-1 text-emerald-800" : "rounded-full bg-slate-100 px-3 py-1 text-slate-600"}>
                    {resource.is_published ? "Published" : "Draft"}
                  </span>
                  {resource.is_featured ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                      Featured
                    </span>
                  ) : null}
                  <span className="rounded-full bg-navy-950/7 px-3 py-1 text-navy-950">
                    {resource.resource_type}
                  </span>
                </div>
                <h2 className="mt-3 break-words font-display text-3xl text-navy-950">
                  {resource.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {resource.category} • order {resource.display_order} • {resource.external_url ? "external URL" : resource.storage_path || resource.file_url ? "uploaded file" : "no destination"}
                </p>
                <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
                  {resource.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <form action={moveResourceAction.bind(null, resource.id, "earlier")}>
                  <Button type="submit" size="icon" variant="outline" disabled={originalIndex === 0} aria-label={`Move ${resource.title} earlier`}>
                    <ArrowUp className="size-4" />
                  </Button>
                </form>
                <form action={moveResourceAction.bind(null, resource.id, "later")}>
                  <Button type="submit" size="icon" variant="outline" disabled={originalIndex === result.data.length - 1} aria-label={`Move ${resource.title} later`}>
                    <ArrowDown className="size-4" />
                  </Button>
                </form>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/resources/${resource.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-navy-950/8 pt-5">
              <form action={toggleResourcePublishedAction.bind(null, resource.id)}>
                <Button type="submit" size="sm" variant="outline">
                  {resource.is_published ? "Unpublish" : "Publish"}
                </Button>
              </form>
              <form action={toggleResourceFeaturedAction.bind(null, resource.id)}>
                <Button type="submit" size="sm" variant="outline">
                  {resource.is_featured ? "Unfeature" : "Feature"}
                </Button>
              </form>
              <ConfirmActionForm
                action={deleteResourceAction.bind(null, resource.id)}
                confirmation={`Delete "${resource.title}" and its stored file? This cannot be undone.`}
              >
                <Button type="submit" size="sm" variant="destructive">
                  Delete
                </Button>
              </ConfirmActionForm>
              {!resource.external_url && !resource.storage_path && !resource.file_url ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800">
                  <FileText className="size-3.5" /> Destination required before publishing
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      {!filteredResources.length && !result.hasError ? (
        <p className="mt-7 rounded-2xl border border-dashed border-navy-950/20 p-10 text-center text-slate-600">
          No resources match these filters.
        </p>
      ) : null}
    </>
  );
}
