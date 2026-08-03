import Link from "next/link";

import {
  deleteAnnouncementAction,
  toggleAnnouncementPinnedAction,
  toggleAnnouncementPublishedAction,
} from "@/app/admin/(protected)/announcements/actions";
import { AdminDataNotice } from "@/components/admin/admin-data-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { Button } from "@/components/ui/button";
import { getAnnouncementLifecycle } from "@/lib/announcements";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminAnnouncements } from "@/lib/data/admin-content";

const lifecycleStyles = {
  draft: "bg-slate-100 text-slate-700",
  scheduled: "bg-blue-100 text-blue-800",
  active: "bg-emerald-100 text-emerald-800",
  expired: "bg-red-100 text-red-800",
} as const;

function formatScheduleDate(value: string | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

export default async function AdminAnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { supabase } = await requireAdmin();
  const result = await getAdminAnnouncements(supabase);

  return (
    <>
      <AdminPageHeader
        title="Announcements"
        description="Publish time-sensitive homepage updates without changing source code."
        action={
          <Button asChild>
            <Link href="/admin/announcements/new">Create announcement</Link>
          </Button>
        }
      />
      <AdminDataNotice show={result.hasError} />
      {error ? (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The requested announcement update could not be completed safely.
        </p>
      ) : null}
      <div className="mt-7 grid gap-4">
        {result.data.map((announcement) => {
          const lifecycle = getAnnouncementLifecycle(announcement);

          return (
          <article
            key={announcement.id}
            className="rounded-2xl border border-navy-950/8 bg-white p-5 shadow-[0_16px_50px_rgba(17,38,71,0.07)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                  <span className={`rounded-full px-3 py-1 ${lifecycleStyles[lifecycle]}`}>
                    {lifecycle}
                  </span>
                  <span className="rounded-full bg-navy-950/7 px-3 py-1 text-navy-950">
                    {announcement.is_published ? "Published" : "Unpublished"}
                  </span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                    {announcement.priority}
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                    {announcement.is_pinned ? "Pinned" : "Not pinned"}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-3xl text-navy-950">
                  {announcement.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {announcement.message}
                </p>
                <dl className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                  <div>
                    <dt className="font-bold uppercase tracking-[0.1em]">Starts</dt>
                    <dd className="mt-1">
                      {formatScheduleDate(announcement.starts_at, "Immediately")}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase tracking-[0.1em]">Ends</dt>
                    <dd className="mt-1">
                      {formatScheduleDate(announcement.ends_at, "No expiry")}
                    </dd>
                  </div>
                </dl>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link
                  href={`/admin/announcements/${announcement.id}/edit`}
                >
                  Edit
                </Link>
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-navy-950/8 pt-5">
              <form
                action={toggleAnnouncementPublishedAction.bind(
                  null,
                  announcement.id,
                )}
              >
                <Button type="submit" size="sm" variant="outline">
                  {announcement.is_published ? "Unpublish" : "Publish"}
                </Button>
              </form>
              <form
                action={toggleAnnouncementPinnedAction.bind(
                  null,
                  announcement.id,
                )}
              >
                <Button type="submit" size="sm" variant="outline">
                  {announcement.is_pinned ? "Unpin" : "Pin"}
                </Button>
              </form>
              <ConfirmActionForm
                action={deleteAnnouncementAction.bind(null, announcement.id)}
                confirmation={`Delete “${announcement.title}”? This cannot be undone.`}
              >
                <Button type="submit" size="sm" variant="destructive">
                  Delete
                </Button>
              </ConfirmActionForm>
            </div>
          </article>
          );
        })}
      </div>
      {!result.data.length && !result.hasError ? (
        <p className="mt-7 rounded-2xl border border-dashed border-navy-950/20 p-10 text-center text-slate-600">
          No announcements have been created.
        </p>
      ) : null}
    </>
  );
}
