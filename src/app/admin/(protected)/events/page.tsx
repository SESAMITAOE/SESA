import Link from "next/link";

import {
  deleteEventAction,
  setEventStatusAction,
  toggleEventFeaturedAction,
  toggleEventPublishedAction,
} from "@/app/admin/(protected)/events/actions";
import { AdminDataNotice } from "@/components/admin/admin-data-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminEvents } from "@/lib/data/admin-content";
import type { DatabaseEventStatus } from "@/types/database";

const statuses: Array<"all" | DatabaseEventStatus> = [
  "all",
  "planned",
  "upcoming",
  "live",
  "completed",
];

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; error?: string }>;
}) {
  const { q = "", status = "all", error } = await searchParams;
  const { supabase } = await requireAdmin();
  const result = await getAdminEvents(supabase);
  const normalizedQuery = q.trim().toLowerCase();
  const safeStatus = statuses.includes(status as (typeof statuses)[number])
    ? status
    : "all";
  const events = result.data.filter((event) => {
    const matchesStatus =
      safeStatus === "all" || event.status === safeStatus;
    const searchable =
      `${event.title} ${event.category} ${event.venue}`.toLowerCase();
    return matchesStatus && searchable.includes(normalizedQuery);
  });

  return (
    <>
      <AdminPageHeader
        title="Events"
        description="Create, schedule, publish, feature, and retire public SESA events."
        action={
          <Button asChild>
            <Link href="/admin/events/new">Create event</Link>
          </Button>
        }
      />
      <AdminDataNotice show={result.hasError} />
      {error ? (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The requested event update could not be completed safely.
        </p>
      ) : null}
      <form
        method="get"
        className="mt-7 grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-[1fr_13rem_auto]"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Search title, category, or venue"
          className="h-11 rounded-xl border border-navy-950/10 bg-ivory px-4 text-sm outline-none focus:border-gold"
        />
        <select
          name="status"
          defaultValue={safeStatus}
          className="h-11 rounded-xl border border-navy-950/10 bg-ivory px-4 text-sm"
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item === "all"
                ? "All statuses"
                : item[0].toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
        <Button type="submit">Filter</Button>
      </form>
      <div className="mt-7 grid gap-5">
        {events.map((event) => (
          <article
            key={event.id}
            className="rounded-2xl border border-navy-950/8 bg-white p-5 shadow-[0_16px_50px_rgba(17,38,71,0.07)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                  <span className="rounded-full bg-navy-950/7 px-3 py-1 text-navy-950">
                    {event.status}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 ${
                      event.is_published
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {event.is_published ? "Published" : "Draft"}
                  </span>
                  {event.is_featured ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                      Featured
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-4 font-display text-3xl text-navy-950">
                  {event.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {event.category || "Uncategorised"} ·{" "}
                  {event.venue || "Venue TBA"} · /{event.slug}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href={`/admin/events/${event.id}/edit`}>Edit</Link>
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-navy-950/8 pt-5">
              <form action={toggleEventPublishedAction.bind(null, event.id)}>
                <Button type="submit" size="sm" variant="outline">
                  {event.is_published ? "Unpublish" : "Publish"}
                </Button>
              </form>
              <form action={toggleEventFeaturedAction.bind(null, event.id)}>
                <Button type="submit" size="sm" variant="outline">
                  {event.is_featured ? "Unfeature" : "Feature"}
                </Button>
              </form>
              <form
                action={setEventStatusAction.bind(null, event.id)}
                className="flex items-center gap-2"
              >
                <select
                  name="status"
                  defaultValue={event.status}
                  className="h-8 rounded-lg border border-navy-950/10 bg-ivory px-2 text-xs"
                >
                  {statuses.slice(1).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <Button type="submit" size="sm" variant="outline">
                  Change status
                </Button>
              </form>
              <ConfirmActionForm
                action={deleteEventAction.bind(null, event.id)}
                confirmation={`Delete “${event.title}”? This cannot be undone.`}
              >
                <Button type="submit" size="sm" variant="destructive">
                  Delete
                </Button>
              </ConfirmActionForm>
            </div>
          </article>
        ))}
      </div>
      {!events.length && !result.hasError ? (
        <p className="mt-7 rounded-2xl border border-dashed border-navy-950/20 p-10 text-center text-slate-600">
          No events match this search.
        </p>
      ) : null}
    </>
  );
}
