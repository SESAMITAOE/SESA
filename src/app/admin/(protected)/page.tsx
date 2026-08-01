import {
  Bell,
  CalendarCheck,
  CalendarDays,
  Images,
  LibraryBig,
  Radio,
  Users,
} from "lucide-react";
import Link from "next/link";

import { AdminDataNotice } from "@/components/admin/admin-data-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminDashboardStats } from "@/lib/data/admin-content";

export default async function AdminDashboardPage() {
  const { profile, supabase } = await requireAdmin();
  const { data: stats, hasError } = await getAdminDashboardStats(supabase);
  const cards = [
    ["Total events", stats.totalEvents, CalendarDays],
    ["Published events", stats.publishedEvents, CalendarCheck],
    ["Live events", stats.liveEvents, Radio],
    ["Upcoming events", stats.upcomingEvents, CalendarDays],
    ["Active team members", stats.activeTeamMembers, Users],
    ["Published announcements", stats.publishedAnnouncements, Bell],
    ["Total gallery items", stats.totalGalleryItems, Images],
    ["Published gallery items", stats.publishedGalleryItems, Images],
    ["Total resources", stats.totalResources, LibraryBig],
    ["Published resources", stats.publishedResources, LibraryBig],
  ] as const;

  return (
    <>
      <AdminPageHeader
        title={`Welcome, ${profile.full_name}`}
        description="Review current content and move directly to the section that needs an update."
      />
      <AdminDataNotice show={hasError} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value, Icon]) => (
          <article
            key={label}
            className="rounded-2xl border border-navy-950/8 bg-white p-6 shadow-[0_16px_50px_rgba(17,38,71,0.08)]"
          >
            <Icon className="size-5 text-gold-dark" />
            <p className="mt-5 font-display text-4xl text-navy-950">{value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{label}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["/admin/events", "Manage events"],
          ["/admin/team", "Manage team"],
          ["/admin/announcements", "Manage announcements"],
          ["/admin/gallery", "Manage gallery"],
          ["/admin/resources", "Manage resources"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl bg-navy-950 px-6 py-5 font-semibold text-ivory transition hover:bg-navy-800"
          >
            {label}
          </Link>
        ))}
      </div>
    </>
  );
}
