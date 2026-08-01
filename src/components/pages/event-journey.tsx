"use client";

import {
  ArrowDown,
  ArrowUpRight,
  CalendarClock,
  Check,
  MapPin,
  Radio,
  Sparkles,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import type { EventItem, EventStatus } from "@/types";

const statusPresentation: Record<
  EventStatus,
  {
    label: string;
    description: string;
    markerClassName: string;
    labelClassName: string;
  }
> = {
  completed: {
    label: "Completed",
    description: "A completed chapter in the SESA programme.",
    markerClassName: "border-slate-300 bg-ivory text-slate-600",
    labelClassName: "border-slate-200 bg-slate-100 text-slate-700",
  },
  live: {
    label: "Live",
    description: "Happening now.",
    markerClassName: "border-emerald-500 bg-emerald-50 text-emerald-800",
    labelClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  upcoming: {
    label: "Upcoming",
    description: "Confirmed and approaching.",
    markerClassName: "border-gold bg-ivory text-gold-dark",
    labelClassName: "border-gold/35 bg-[#fffaf1] text-gold-dark",
  },
  planned: {
    label: "Planned",
    description: "On the horizon.",
    markerClassName: "border-navy-950/25 bg-ivory text-navy-950",
    labelClassName: "border-navy-950/10 bg-navy-950/5 text-navy-950",
  },
};

function StatusIcon({ status }: { status: EventStatus }) {
  if (status === "completed") return <Check className="size-3.5" />;
  if (status === "live") return <Radio className="size-3.5" />;
  if (status === "upcoming") return <CalendarClock className="size-3.5" />;
  return <Sparkles className="size-3.5" />;
}

function focusEventCard(eventId: string, reduceMotion: boolean | null) {
  const target = document.getElementById(eventId);
  if (!target) return;

  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
  target.focus({ preventScroll: true });
}

export function EventJourney({ events }: { events: EventItem[] }) {
  const reduceMotion = useReducedMotion();
  const hasLiveEvent = events.some((event) => event.status === "live");
  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const nearestDatedUpcoming = upcomingEvents
    .filter((event) => event.startAt)
    .sort(
      (first, second) =>
        new Date(first.startAt ?? 0).getTime() -
        new Date(second.startAt ?? 0).getTime(),
    )[0];
  const nextEventId = hasLiveEvent
    ? undefined
    : (nearestDatedUpcoming ?? upcomingEvents[0])?.id;

  useEffect(() => {
    function focusHashTarget() {
      const eventId = window.location.hash.slice(1);
      if (eventId.startsWith("event-")) {
        window.requestAnimationFrame(() => {
          focusEventCard(eventId, reduceMotion);
        });
      }
    }

    focusHashTarget();
    window.addEventListener("hashchange", focusHashTarget);
    return () => window.removeEventListener("hashchange", focusHashTarget);
  }, [reduceMotion]);

  if (!events.length) {
    return (
      <p className="mt-10 rounded-[1.5rem] border border-dashed border-navy-950/20 p-12 text-center text-slate-600">
        No published events are available yet.
      </p>
    );
  }

  return (
    <div className="relative mt-14">
      <div
        aria-hidden="true"
        className="absolute bottom-4 left-[0.8rem] top-4 w-px bg-navy-950/15 md:left-1/2"
      />
      <ol aria-label="SESA event progression">
        {events.map((event, index) => {
          const presentation = statusPresentation[event.status];
          const isNext = event.id === nextEventId;
          const isLeft = index % 2 === 0;
          const targetId = `event-${event.slug}`;

          return (
            <li
              key={event.id}
              className="relative grid min-w-0 grid-cols-[1.65rem_minmax(0,1fr)] gap-5 pb-16 last:pb-0 md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] md:gap-8 md:pb-20"
            >
              <div
                className={cn(
                  "relative z-10 col-start-1 row-start-1 grid size-7 place-items-center self-start rounded-full border bg-ivory md:col-start-2 md:justify-self-center",
                  presentation.markerClassName,
                  event.status === "live" && "motion-safe:animate-pulse",
                )}
                aria-hidden="true"
              >
                <StatusIcon status={event.status} />
              </div>
              <article
                className={cn(
                  "col-start-2 row-start-1 min-w-0 border-t border-navy-950/12 pt-5 md:col-span-1",
                  isLeft
                    ? "md:col-start-1 md:text-right"
                    : "md:col-start-3",
                  event.status === "live" &&
                    "rounded-2xl border border-emerald-200 bg-emerald-50/55 p-6 text-left",
                )}
              >
                <a
                  href={`#${targetId}`}
                  onClick={() => {
                    window.setTimeout(
                      () => focusEventCard(targetId, reduceMotion),
                      0,
                    );
                  }}
                  className="group block rounded-lg outline-none ring-gold focus-visible:ring-2"
                  aria-label={`${event.title}, ${presentation.label}. View detailed event information.`}
                >
                  <div
                    className={cn(
                      "flex flex-wrap items-center gap-2",
                      isLeft && event.status !== "live" && "md:justify-end",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em]",
                        presentation.labelClassName,
                      )}
                    >
                      <StatusIcon status={event.status} />
                      {presentation.label}
                    </span>
                    {isNext ? (
                      <span className="rounded-full border border-gold/35 bg-transparent px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-gold-dark">
                        Next
                      </span>
                    ) : null}
                    {event.status === "planned" ? (
                      <span className="text-xs font-semibold text-slate-500">
                        Details may change
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 break-words font-display text-3xl leading-tight text-navy-950 decoration-gold/60 underline-offset-4 group-hover:underline sm:text-4xl">
                    {event.title}
                  </h3>
                  <div
                    className={cn(
                      "mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm",
                      isLeft && event.status !== "live" && "md:justify-end",
                    )}
                  >
                    <span className="font-semibold text-gold-dark">
                      {event.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <MapPin className="size-3.5" /> {event.venue || "Venue TBA"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {event.status === "planned"
                      ? "This event is being prepared; its schedule and participation details may change."
                      : event.shortDescription || presentation.description}
                  </p>
                  <span
                    className={cn(
                      "mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy-950",
                      isLeft && event.status !== "live" && "md:flex-row-reverse",
                    )}
                  >
                    View full event <ArrowDown className="size-4" />
                  </span>
                </a>
                {event.status === "upcoming" && event.registrationUrl ? (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "mt-4 inline-flex items-center gap-2 rounded-full border border-gold/35 px-4 py-2 text-sm font-semibold text-navy-950 outline-none ring-gold transition hover:bg-white focus-visible:ring-2",
                      isLeft && "md:ml-auto",
                    )}
                  >
                    Register <ArrowUpRight className="size-4" />
                  </a>
                ) : null}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
