"use client";

import {
  ArrowUpRight,
  BookOpen,
  Download,
  FileText,
  Github,
  Link2,
  Play,
  Search,
  Shapes,
} from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import type { ResourceItem } from "@/types";

function ResourceTypeIcon({ type }: { type: ResourceItem["resourceType"] }) {
  if (type === "document") return <FileText className="size-5" />;
  if (type === "link") return <Link2 className="size-5" />;
  if (type === "video") return <Play className="size-5" />;
  if (type === "repository") return <Github className="size-5" />;
  if (type === "guide") return <BookOpen className="size-5" />;
  return <Shapes className="size-5" />;
}

function ResourceCard({ resource }: { resource: ResourceItem }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">
          <ResourceTypeIcon type={resource.resourceType} />
          {resource.resourceType}
        </span>
        {resource.href ? (
          resource.isFile ? (
            <Download className="size-5 text-slate-400 transition group-hover:text-gold-dark" />
          ) : (
            <ArrowUpRight className="size-5 text-slate-400 transition group-hover:text-gold-dark" />
          )
        ) : null}
      </div>
      <h2 className="mt-7 break-words font-display text-3xl leading-tight text-navy-950">
        {resource.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {resource.description}
      </p>
      <div className="mt-7 flex flex-wrap gap-2 border-t border-navy-950/8 pt-4 text-xs font-semibold text-slate-500">
        <span>{resource.category}</span>
        {resource.audience ? <span>• {resource.audience}</span> : null}
        {resource.academicYear ? <span>• {resource.academicYear}</span> : null}
        {resource.meta ? <span>• {resource.meta}</span> : null}
      </div>
      {!resource.href ? (
        <p className="mt-4 text-xs font-semibold text-amber-800">
          Access details are being verified.
        </p>
      ) : null}
    </>
  );
  const className =
    "group block rounded-[1.65rem] border border-navy-950/8 bg-white p-6 shadow-[0_18px_60px_rgba(17,38,71,0.08)] outline-none ring-gold transition hover:-translate-y-1 hover:border-gold/35 focus-visible:ring-2";

  return resource.href ? (
    <a
      href={resource.href}
      target="_blank"
      rel="noreferrer"
      className={className}
      aria-label={`${resource.isFile ? "Open file" : "Open resource"}: ${resource.title}`}
    >
      {content}
    </a>
  ) : (
    <article className={cn(className, "hover:translate-y-0")}>{content}</article>
  );
}

export function ResourcesBrowser({ resources }: { resources: ResourceItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(resources.map((item) => item.category)))],
    [resources],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesCategory =
        category === "All" || resource.category === category;
      const searchable = `${resource.title} ${resource.resourceType} ${resource.category} ${resource.description}`.toLowerCase();
      return matchesCategory && searchable.includes(normalized);
    });
  }, [category, query, resources]);

  return (
    <div>
      <label className="flex max-w-xl items-center gap-3 rounded-full border border-navy-950/10 bg-white px-5 py-4 shadow-[0_14px_45px_rgba(17,38,71,0.07)]">
        <Search className="size-4 text-slate-500" />
        <span className="sr-only">Search resources</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search guides, files, links, and repositories"
          className="min-w-0 flex-1 bg-transparent text-sm text-navy-950 outline-none placeholder:text-slate-400"
        />
      </label>
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Resource categories">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold outline-none ring-gold transition focus-visible:ring-2",
              category === item
                ? "bg-navy-950 text-ivory"
                : "bg-white text-slate-600 hover:bg-navy-950/5",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
      {!filtered.length ? (
        <p className="mt-8 rounded-[1.5rem] border border-dashed border-navy-950/20 p-12 text-center text-slate-600 sm:col-span-2 lg:col-span-3">
          {resources.length
            ? "No resources match this search and category."
            : "No published resources are available yet."}
        </p>
      ) : null}
    </div>
  );
}
