import { ArrowRight, Pin } from "lucide-react";

import type { AnnouncementItem } from "@/types";

const priorityStyles = {
  urgent: "border-red-200 bg-red-50 text-red-950",
  important: "border-gold/35 bg-[#fff8ea] text-navy-950",
  normal: "border-navy-950/10 bg-[#fffaf1] text-navy-950",
} as const;

export function AnnouncementList({
  announcements,
}: {
  announcements: AnnouncementItem[];
}) {
  if (!announcements.length) {
    return null;
  }

  return (
    <div className="grid gap-3" aria-label="SESA announcements">
      {announcements.map((announcement) => (
        <article
          key={announcement.id}
          className={`min-w-0 rounded-[1.5rem] border px-5 py-5 shadow-[0_18px_50px_rgba(17,38,71,0.1)] sm:px-7 ${
            priorityStyles[announcement.priority]
          }`}
        >
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-dark">
                <span>{announcement.priority} announcement</span>
                {announcement.isPinned ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-navy-950 px-2.5 py-1 text-ivory">
                    <Pin className="size-3" /> Pinned
                  </span>
                ) : null}
              </div>
              <h2 className="mt-2 break-words font-display text-2xl leading-tight sm:text-3xl">
                {announcement.title}
              </h2>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                {announcement.message}
              </p>
            </div>
            {announcement.linkUrl ? (
              <a
                href={announcement.linkUrl}
                className="inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-navy-950 outline-none ring-gold transition hover:bg-white/60 focus-visible:ring-2"
              >
                View details <ArrowRight className="size-4" />
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
