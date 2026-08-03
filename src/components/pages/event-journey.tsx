"use client";

import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Layers3,
  MapPin,
  Radio,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useEffect, type CSSProperties } from "react";

import { getNextFutureEventId } from "@/lib/events";
import { cn } from "@/lib/utils";
import type { EventItem, EventStatus } from "@/types";

const DESKTOP_STEP_HEIGHT = 336;
const MILESTONE_CENTER_Y = 56;

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
    markerClassName:
      "border-slate-300/40 bg-[#13243b] text-slate-200 shadow-[0_0_0_6px_rgba(184,194,207,0.06)]",
    labelClassName: "border-white/10 bg-white/5 text-slate-200",
  },
  live: {
    label: "Live",
    description: "Happening now.",
    markerClassName:
      "border-gold-light bg-[#173b63] text-gold-light shadow-[0_0_0_7px_rgba(177,131,69,0.12),0_0_28px_rgba(73,135,196,0.32)]",
    labelClassName: "border-gold/45 bg-gold/10 text-gold-light",
  },
  upcoming: {
    label: "Upcoming",
    description: "Confirmed and approaching.",
    markerClassName:
      "border-[#79a9d5] bg-[#102b4b] text-[#b9d8f2] shadow-[0_0_0_6px_rgba(79,135,187,0.1)]",
    labelClassName: "border-[#79a9d5]/30 bg-[#4e83b5]/10 text-[#c9e3f8]",
  },
  planned: {
    label: "Planned",
    description: "On the horizon. Details may change.",
    markerClassName:
      "border-white/20 bg-[#10213a] text-slate-300 shadow-[0_0_0_6px_rgba(255,255,255,0.04)]",
    labelClassName: "border-white/10 bg-white/[0.04] text-slate-300",
  },
};

type MilestoneStyle = CSSProperties & {
  "--milestone-position": string;
};

function StatusIcon({
  status,
  className = "size-4",
}: {
  status: EventStatus;
  className?: string;
}) {
  if (status === "completed") return <Check className={className} />;
  if (status === "live") return <Radio className={className} />;
  if (status === "upcoming") return <CalendarDays className={className} />;
  return <Layers3 className={className} />;
}

function getMilestoneX(index: number) {
  return index % 2 === 0 ? 43 : 57;
}

function createDesktopJourneyPath(eventCount: number) {
  if (eventCount < 2) {
    return "";
  }

  const points = Array.from({ length: eventCount }, (_, index) => ({
    x: getMilestoneX(index) * 10,
    y: index * DESKTOP_STEP_HEIGHT + MILESTONE_CENTER_Y,
  }));

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const midpointY = (previous.y + point.y) / 2;
    return `${path} C ${previous.x} ${midpointY}, ${point.x} ${midpointY}, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
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

function EventTooltip({
  event,
  id,
  isLeft,
}: {
  event: EventItem;
  id: string;
  isLeft: boolean;
}) {
  const presentation = statusPresentation[event.status];
  const hasTime = Boolean(event.time && event.time !== "TBA");
  const hasVenue = Boolean(event.venue && event.venue !== "TBA");

  return (
    <div
      id={id}
      role="tooltip"
      className={cn(
        "pointer-events-none invisible absolute left-full top-1/2 z-40 ml-3 w-[min(17rem,calc(100vw-6rem))] -translate-y-1/2 translate-x-1 rounded-2xl border border-white/12 bg-[#0b1c33]/98 p-4 text-left opacity-0 shadow-[0_22px_65px_rgba(0,0,0,0.38)] backdrop-blur-md transition duration-200 group-hover/milestone:visible group-hover/milestone:translate-x-0 group-hover/milestone:opacity-100 group-focus-within/milestone:visible group-focus-within/milestone:translate-x-0 group-focus-within/milestone:opacity-100",
        isLeft
          ? "lg:left-full lg:right-auto lg:ml-4 lg:mr-0"
          : "lg:left-auto lg:right-full lg:ml-0 lg:mr-4",
      )}
    >
      <div className="flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-gold-light">
        <StatusIcon status={event.status} className="size-3.5" />
        {presentation.label}
      </div>
      <p className="mt-2 break-words font-display text-xl leading-tight text-ivory">
        {event.title}
      </p>
      <div className="mt-3 grid gap-1.5 text-xs leading-5 text-slate-300">
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="size-3.5 text-gold-light" /> {event.date}
        </span>
        {hasTime ? (
          <span className="inline-flex items-center gap-2">
            <Clock3 className="size-3.5 text-gold-light" /> {event.time}
          </span>
        ) : null}
        {hasVenue ? (
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-3.5 text-gold-light" /> {event.venue}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function JourneyPath({ eventCount }: { eventCount: number }) {
  const path = createDesktopJourneyPath(eventCount);
  if (!path) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      viewBox={`0 0 1000 ${eventCount * DESKTOP_STEP_HEIGHT}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sesaJourneyLine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6f9fca" />
          <stop offset="48%" stopColor="#e0bd7d" />
          <stop offset="100%" stopColor="#416f9d" />
        </linearGradient>
        <filter id="sesaJourneyGlow" x="-30%" y="-10%" width="160%" height="120%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="#6f9fca"
        strokeOpacity="0.2"
        strokeWidth="12"
        vectorEffect="non-scaling-stroke"
        filter="url(#sesaJourneyGlow)"
      />
      <path
        d={path}
        fill="none"
        stroke="url(#sesaJourneyLine)"
        strokeOpacity="0.88"
        strokeWidth="2.25"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function EventJourney({
  events,
  referenceTime,
}: {
  events: EventItem[];
  referenceTime: string;
}) {
  const reduceMotion = useReducedMotion();
  const nextEventId = getNextFutureEventId(events, referenceTime);

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

  function openEvent(targetId: string) {
    const hash = `#${targetId}`;
    if (window.location.hash === hash) {
      focusEventCard(targetId, reduceMotion);
      return;
    }

    window.location.hash = targetId;
  }

  if (!events.length) {
    return (
      <p className="mt-12 rounded-[1.5rem] border border-dashed border-white/18 bg-white/[0.035] p-12 text-center text-slate-300">
        No published events are available yet.
      </p>
    );
  }

  return (
    <div className="relative mt-14 lg:mt-20">
      {events.length > 1 ? (
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-8 top-8 w-px bg-gradient-to-b from-[#6f9fca]/55 via-gold/65 to-[#416f9d]/45 shadow-[0_0_12px_rgba(111,159,202,0.28)] lg:hidden"
        />
      ) : null}
      <ol className="relative" aria-label="SESA event journey">
        <JourneyPath eventCount={events.length} />
        {events.map((event, index) => {
          const presentation = statusPresentation[event.status];
          const isNext = event.id === nextEventId;
          const isLeft = index % 2 === 0;
          const targetId = `event-${event.slug}`;
          const tooltipId = `event-tooltip-${event.slug}`;
          const summary =
            event.status === "planned"
              ? "This event is being prepared; its schedule and participation details may change."
              : event.shortDescription || event.description;
          const markerStyle: MilestoneStyle = {
            "--milestone-position": `${getMilestoneX(index)}%`,
          };

          return (
            <li
              key={event.id}
              className="relative grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] gap-4 pb-12 last:pb-0 lg:block lg:h-[21rem] lg:pb-0"
            >
              <div
                className="group/milestone relative z-30 col-start-1 row-start-1 justify-self-center lg:absolute lg:left-[var(--milestone-position)] lg:top-6 lg:-translate-x-1/2"
                style={markerStyle}
              >
                {event.status === "live" ? (
                  <span
                    aria-hidden="true"
                    className="absolute -inset-1 rounded-full border border-gold-light/45 opacity-50 motion-safe:animate-pulse"
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => openEvent(targetId)}
                  aria-label={`Open ${event.title} event details. ${presentation.label}. ${event.date}.`}
                  aria-describedby={tooltipId}
                  className={cn(
                    "relative grid size-14 touch-manipulation place-items-center rounded-full border outline-none transition duration-200 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-4 focus-visible:ring-offset-navy-950 sm:size-16",
                    presentation.markerClassName,
                    isNext && "ring-2 ring-gold ring-offset-4 ring-offset-navy-950",
                  )}
                >
                  <StatusIcon status={event.status} className="-translate-y-0.5 size-5" />
                  <span className="absolute bottom-1.5 text-[0.56rem] font-black tracking-[0.12em] opacity-75">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
                <EventTooltip event={event} id={tooltipId} isLeft={isLeft} />
              </div>

              <article
                className={cn(
                  "relative z-10 col-start-2 row-start-1 min-w-0 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d2038]/88 p-5 text-left shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:p-6 lg:absolute lg:top-0 lg:w-[38%] lg:rounded-[1.75rem] lg:p-7",
                  isLeft ? "lg:left-0" : "lg:right-0",
                  event.status === "live" &&
                    "border-gold/30 shadow-[0_24px_90px_rgba(48,100,151,0.2)]",
                )}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6f9fca]/55 to-transparent",
                    event.status === "live" && "via-gold-light/80",
                  )}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.12em]",
                      presentation.labelClassName,
                    )}
                  >
                    <StatusIcon status={event.status} className="size-3.5" />
                    {presentation.label}
                  </span>
                  {isNext ? (
                    <span className="rounded-full border border-gold/45 bg-gold/10 px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-gold-light">
                      Next
                    </span>
                  ) : null}
                  {event.status === "planned" ? (
                    <span className="text-xs font-semibold text-slate-400">
                      Details may change
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-gold-light">
                  <CalendarDays className="size-3.5" /> {event.date}
                </p>
                <h3 className="mt-3 line-clamp-2 break-words font-display text-2xl leading-tight text-ivory sm:text-3xl">
                  {event.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
                  {summary}
                </p>
                {event.venue ? (
                  <p className="mt-4 inline-flex max-w-full items-center gap-2 text-xs font-semibold text-slate-400">
                    <MapPin className="size-3.5 shrink-0 text-gold-light" />
                    <span className="truncate">{event.venue}</span>
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/8 pt-4">
                  <button
                    type="button"
                    onClick={() => openEvent(targetId)}
                    className="inline-flex items-center gap-2 rounded-md text-sm font-bold text-ivory outline-none transition hover:text-gold-light focus-visible:ring-2 focus-visible:ring-gold-light"
                  >
                    View details <ArrowDown className="size-4" />
                  </button>
                  {event.status === "upcoming" && event.registrationUrl ? (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md text-sm font-bold text-gold-light outline-none transition hover:text-ivory focus-visible:ring-2 focus-visible:ring-gold-light"
                    >
                      Register <ArrowUpRight className="size-4" />
                    </a>
                  ) : null}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
