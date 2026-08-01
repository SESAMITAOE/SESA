import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  ImageIcon,
  MapPin,
  Radio,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EventItem, EventStatus } from "@/types";

const statusStyles: Record<EventStatus, string> = {
  completed: "bg-slate-100 text-slate-700",
  live: "bg-emerald-100 text-emerald-800",
  upcoming: "bg-blue-100 text-blue-800",
  planned: "bg-amber-100 text-amber-900",
};

function EventPoster({ event }: { event: EventItem }) {
  if (event.posterUrl) {
    return (
      <div className="overflow-hidden rounded-[1.4rem] bg-navy-950">
        {/* Poster hosts are administrator-managed and cannot be statically allowlisted. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.posterUrl}
          alt={`${event.title} event poster`}
          className="aspect-[4/3] h-full w-full object-cover lg:aspect-[4/5]"
        />
      </div>
    );
  }

  return (
    <div
      className={`grid aspect-[4/3] place-items-center rounded-[1.4rem] bg-gradient-to-br ${event.accent} text-center text-ivory lg:aspect-[4/5]`}
      role="img"
      aria-label={`No poster is currently available for ${event.title}`}
    >
      <div className="px-6">
        <ImageIcon className="mx-auto size-8 text-gold-light" />
        <p className="mt-3 text-sm font-semibold">Poster coming soon</p>
      </div>
    </div>
  );
}

function StatusLabel({ status }: { status: EventStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]",
        statusStyles[status],
        status === "live" && "motion-safe:animate-pulse",
      )}
    >
      {status === "completed" ? (
        <CheckCircle2 className="size-3.5" />
      ) : status === "live" ? (
        <Radio className="size-3.5" />
      ) : null}
      {status}
    </span>
  );
}

export function EventDetails({ events }: { events: EventItem[] }) {
  if (!events.length) {
    return null;
  }

  return (
    <div className="mt-12 grid gap-8">
      {events.map((event) => {
        const titleId = `event-title-${event.slug}`;

        return (
          <article
            key={event.id}
            id={`event-${event.slug}`}
            tabIndex={-1}
            aria-labelledby={titleId}
            className="scroll-mt-28 rounded-[2rem] border border-navy-950/8 bg-white p-5 shadow-[0_24px_75px_rgba(17,38,71,0.1)] outline-none ring-gold focus-visible:ring-2 sm:p-7 lg:scroll-mt-32"
          >
            <div className="grid min-w-0 gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
              <EventPoster event={event} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusLabel status={event.status} />
                  <span className="rounded-full bg-navy-950/6 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-gold-dark">
                    {event.category}
                  </span>
                </div>
                <h3
                  id={titleId}
                  className="mt-5 break-words font-display text-4xl leading-tight text-navy-950 sm:text-5xl"
                >
                  {event.title}
                </h3>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600 sm:text-base">
                  {event.description}
                </p>
                {event.status === "planned" ? (
                  <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                    This event is planned. Its date, venue, and registration
                    details may change.
                  </p>
                ) : null}
                <dl className="mt-6 grid gap-4 border-y border-navy-950/8 py-5 text-sm sm:grid-cols-2">
                  <div className="flex min-w-0 items-start gap-3">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-gold-dark" />
                    <div>
                      <dt className="font-bold text-navy-950">Date</dt>
                      <dd className="mt-1 text-slate-600">{event.date}</dd>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-start gap-3">
                    <Clock3 className="mt-0.5 size-4 shrink-0 text-gold-dark" />
                    <div>
                      <dt className="font-bold text-navy-950">Time</dt>
                      <dd className="mt-1 text-slate-600">{event.time}</dd>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-gold-dark" />
                    <div>
                      <dt className="font-bold text-navy-950">Venue</dt>
                      <dd className="mt-1 break-words text-slate-600">
                        {event.venue || "Venue to be announced"}
                      </dd>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-start gap-3">
                    <Tag className="mt-0.5 size-4 shrink-0 text-gold-dark" />
                    <div>
                      <dt className="font-bold text-navy-950">Category</dt>
                      <dd className="mt-1 text-slate-600">{event.category}</dd>
                    </div>
                  </div>
                  {event.registrationDeadlineLabel ? (
                    <div className="flex min-w-0 items-start gap-3 sm:col-span-2">
                      <CalendarDays className="mt-0.5 size-4 shrink-0 text-gold-dark" />
                      <div>
                        <dt className="font-bold text-navy-950">
                          Registration deadline
                        </dt>
                        <dd className="mt-1 text-slate-600">
                          {event.registrationDeadlineLabel}
                        </dd>
                      </div>
                    </div>
                  ) : null}
                </dl>
                {event.registrationUrl ? (
                  <Button asChild size="lg" className="mt-6">
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {event.status === "completed"
                        ? "View registration information"
                        : "Open registration"}
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                ) : (
                  <p className="mt-6 text-sm font-semibold text-slate-500">
                    {event.status === "completed"
                      ? "Registration is closed."
                      : "Registration is not open yet."}
                  </p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
