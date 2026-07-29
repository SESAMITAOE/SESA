"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";

import { galleryItems } from "@/data/site";
import { cn } from "@/lib/utils";

const categories = ["All", ...Array.from(new Set(galleryItems.map((item) => item.category)))];

export function GalleryBrowser() {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<(typeof galleryItems)[number] | null>(null);
  const items = useMemo(() => galleryItems.filter((item) => category === "All" || item.category === category), [category]);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", category === item ? "bg-navy-950 text-ivory" : "bg-white text-slate-600 shadow-sm hover:bg-navy-950/5")}>{item}</button>
        ))}
      </div>

      <div className="mt-8 grid auto-rows-[260px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <button key={item.title} type="button" onClick={() => setSelected(item)} className={cn(`group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${item.gradient} p-6 text-left text-ivory shadow-[0_20px_65px_rgba(17,38,71,0.12)]`, index % 5 === 0 && "sm:row-span-2") }>
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,22,42,0.82),transparent_65%)]" />
            <div className="absolute right-6 top-6 size-24 rounded-full border border-white/20 transition duration-500 group-hover:scale-125" />
            <div className="relative flex h-full flex-col justify-end">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-light">{item.category}</p>
              <h2 className="mt-2 font-display text-3xl">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-200">{item.label}</p>
            </div>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-navy-950/92 p-5 backdrop-blur" role="dialog" aria-modal="true" aria-label={selected.title}>
          <button type="button" onClick={() => setSelected(null)} aria-label="Close preview" className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-white/15 bg-white/8 text-ivory"><X className="size-5" /></button>
          <div className={`relative flex min-h-[55vh] w-full max-w-4xl items-end overflow-hidden rounded-[2rem] bg-gradient-to-br ${selected.gradient} p-8 text-ivory shadow-2xl sm:p-12`}>
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,22,42,0.88),transparent_70%)]" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-light">{selected.category}</p>
              <h2 className="mt-3 font-display text-5xl sm:text-6xl">{selected.title}</h2>
              <p className="mt-3 text-lg text-slate-200">{selected.label}</p>
              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">Final photographs and captions will be managed through Supabase Storage and the SESA admin dashboard.</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
