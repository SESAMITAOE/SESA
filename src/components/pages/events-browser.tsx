"use client";

import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { events } from "@/data/site";
import { cn } from "@/lib/utils";

const filters = ["All", "Upcoming", "Open", "Completed"];

export function EventsBrowser() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filteredEvents = useMemo(() => events.filter((event) => {
    const matchesFilter = filter === "All" || event.status === filter.toLowerCase();
    const searchable = `${event.title} ${event.category} ${event.venue} ${event.description}`.toLowerCase();
    return matchesFilter && searchable.includes(query.trim().toLowerCase());
  }), [filter, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-navy-950/8 bg-white p-4 shadow-[0_18px_55px_rgba(17,38,71,0.08)] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", filter === item ? "bg-navy-950 text-ivory" : "bg-navy-950/5 text-slate-600 hover:bg-navy-950/9")}>{item}</button>
          ))}
        </div>
        <label className="flex min-w-0 items-center gap-3 rounded-full border border-navy-950/10 bg-ivory px-4 py-3 lg:w-80">
          <Search className="size-4 shrink-0 text-slate-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events" className="min-w-0 flex-1 bg-transparent text-sm text-navy-950 outline-none placeholder:text-slate-400" />
        </label>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {filteredEvents.map((event) => (
          <article key={event.id} className="overflow-hidden rounded-[1.75rem] border border-navy-950/8 bg-white shadow-[0_20px_65px_rgba(17,38,71,0.08)]">
            <div className={`h-2 bg-gradient-to-r ${event.accent}`} />
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge className="text-gold-dark">{event.category}</Badge>
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]", event.status === "open" && "bg-emerald-100 text-emerald-800", event.status === "upcoming" && "bg-blue-100 text-blue-800", event.status === "completed" && "bg-slate-100 text-slate-600")}>{event.status}</span>
              </div>
              <h2 className="mt-6 font-display text-3xl tracking-[-0.025em] text-navy-950 sm:text-4xl">{event.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{event.description}</p>
              <div className="mt-6 grid gap-3 border-y border-navy-950/8 py-5 text-sm text-slate-600 sm:grid-cols-2">
                <span className="flex items-center gap-2"><CalendarDays className="size-4 text-gold-dark" /> {event.date}</span>
                <span className="flex items-center gap-2"><MapPin className="size-4 text-gold-dark" /> {event.venue}</span>
                <span className="flex items-center gap-2"><Users className="size-4 text-gold-dark" /> {event.seats ? `${event.seats} seats` : "Open audience"}</span>
                <span className="font-semibold text-navy-950">{event.time}</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button disabled={event.status === "completed"}>{event.status === "open" ? "Register now" : event.status === "completed" ? "Event completed" : "Notify me"}</Button>
                <Button variant="outline">View details</Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredEvents.length === 0 ? <div className="mt-8 rounded-[1.5rem] border border-dashed border-navy-950/15 p-12 text-center text-slate-600">No events match your current search.</div> : null}
    </div>
  );
}
