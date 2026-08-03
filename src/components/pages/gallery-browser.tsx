"use client";

import { ImageIcon, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/types";

function GalleryImage({
  item,
  className,
}: {
  item: GalleryItem;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!item.imageUrl || failed) {
    return (
      <div
        className={cn(
          `grid h-full w-full place-items-center bg-gradient-to-br ${item.gradient}`,
          className,
        )}
        role="img"
        aria-label={`No image is currently available for ${item.title}`}
      >
        <div className="text-center text-ivory/85">
          <ImageIcon className="mx-auto size-7" />
          <p className="mt-2 text-xs font-semibold">Image coming soon</p>
        </div>
      </div>
    );
  }

  return (
    // Administrator-managed Storage URLs cannot be statically allowlisted.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.imageUrl}
      alt={item.altText}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function GalleryBrowser({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  );
  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) => category === "All" || item.category === category,
      ),
    [category, items],
  );

  useEffect(() => {
    if (!selected) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelected(null);
        window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
      }
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]);

  function closePreview() {
    setSelected(null);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }

  if (!items.length) {
    return (
      <p className="rounded-[1.5rem] border border-dashed border-navy-950/20 p-12 text-center text-slate-600">
        No published gallery items are available yet.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2" aria-label="Gallery categories">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
              category === item
                ? "bg-navy-950 text-ivory"
                : "bg-white text-slate-600 shadow-sm hover:bg-navy-950/5",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-8 grid auto-rows-[260px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={(event) => {
              lastTriggerRef.current = event.currentTarget;
              setSelected(item);
            }}
            className={cn(
              "group relative overflow-hidden rounded-[1.75rem] text-left text-ivory shadow-[0_20px_65px_rgba(17,38,71,0.12)] outline-none ring-gold focus-visible:ring-2",
              index % 5 === 0 && "sm:row-span-2",
            )}
            aria-label={`Open ${item.title} image preview`}
          >
            <GalleryImage item={item} />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,22,42,0.88),transparent_68%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-light">
                {item.category}
              </p>
              <h2 className="mt-2 font-display text-3xl">{item.title}</h2>
              {item.caption ? (
                <p className="mt-1 text-sm text-slate-200">{item.caption}</p>
              ) : null}
            </div>
          </button>
        ))}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-navy-950/92 p-5 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-preview-title"
          aria-describedby="gallery-preview-caption"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              closePreview();
            }
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closePreview}
            aria-label="Close image preview"
            className="absolute right-5 top-5 z-10 grid size-11 place-items-center rounded-full border border-white/20 bg-navy-950/80 text-ivory outline-none ring-gold focus-visible:ring-2"
          >
            <X className="size-5" />
          </button>
          <div className="relative grid max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-navy-950 shadow-2xl lg:grid-cols-[1.45fr_0.55fr]">
            <div className="min-h-[50vh] overflow-hidden">
              <GalleryImage item={selected} />
            </div>
            <div className="flex flex-col justify-end border-t border-white/10 p-7 text-ivory lg:border-l lg:border-t-0 lg:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-light">
                {selected.category}
              </p>
              <h2 id="gallery-preview-title" className="mt-3 font-display text-4xl">
                {selected.title}
              </h2>
              <p
                id="gallery-preview-caption"
                className="mt-4 text-sm leading-7 text-slate-300"
              >
                {selected.caption || "No caption has been added."}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
