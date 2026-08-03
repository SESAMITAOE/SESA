"use client";

import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { GalleryItem } from "@/types";

export function HomeGalleryPreview({ items }: { items: GalleryItem[] }) {
  const [failedImages, setFailedImages] = useState<string[]>([]);

  if (!items.length) {
    return (
      <p className="mt-12 rounded-2xl border border-dashed border-navy-950/20 p-10 text-center text-slate-600">
        Gallery updates will appear here after they are published.
      </p>
    );
  }

  return (
    <div className="mt-12 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.slice(0, 5).map((item, index) => {
        const showImage =
          Boolean(item.imageUrl) && !failedImages.includes(item.id);

        return (
          <Link
            href="/gallery"
            key={item.id}
            className={`group relative overflow-hidden rounded-[1.75rem] text-ivory shadow-[0_20px_60px_rgba(17,38,71,0.12)] outline-none ring-gold focus-visible:ring-2 ${
              index === 0 ? "sm:row-span-2" : ""
            }`}
          >
            {showImage ? (
              // Administrator-managed Storage URLs cannot be statically allowlisted.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.altText}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                onError={() =>
                  setFailedImages((current) => [...current, item.id])
                }
              />
            ) : (
              <div
                className={`grid h-full w-full place-items-center bg-gradient-to-br ${item.gradient}`}
                role="img"
                aria-label={`No image is currently available for ${item.title}`}
              >
                <ImageIcon className="size-7 text-ivory/65" />
              </div>
            )}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,22,42,0.86),transparent_68%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-light">
                {item.category}
              </span>
              <h3 className="mt-2 font-display text-3xl">{item.title}</h3>
              {item.caption ? (
                <p className="mt-1 text-sm text-slate-200">{item.caption}</p>
              ) : null}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
