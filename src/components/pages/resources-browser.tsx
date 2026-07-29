"use client";

import { ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { resources } from "@/data/site";

export function ResourcesBrowser() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return resources.filter((resource) => `${resource.title} ${resource.type} ${resource.description}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <div>
      <label className="flex max-w-xl items-center gap-3 rounded-full border border-navy-950/10 bg-white px-5 py-4 shadow-[0_14px_45px_rgba(17,38,71,0.07)]">
        <Search className="size-4 text-slate-500" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guides, templates and playbooks" className="min-w-0 flex-1 bg-transparent text-sm text-navy-950 outline-none placeholder:text-slate-400" />
      </label>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((resource) => (
          <article key={resource.id} className="group rounded-[1.65rem] border border-navy-950/8 bg-white p-6 shadow-[0_18px_60px_rgba(17,38,71,0.08)] transition hover:-translate-y-1 hover:border-gold/35">
            <div className="flex items-center justify-between gap-4"><span className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">{resource.type}</span><ArrowUpRight className="size-5 text-slate-400 transition group-hover:text-gold-dark" /></div>
            <h2 className="mt-7 font-display text-3xl leading-tight text-navy-950">{resource.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{resource.description}</p>
            <p className="mt-7 border-t border-navy-950/8 pt-4 text-xs font-semibold text-slate-500">{resource.meta}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
