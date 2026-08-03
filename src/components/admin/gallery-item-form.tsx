"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  initialAdminFormState,
  toIndiaDateTimeInput,
  type AdminFormState,
} from "@/lib/admin/form-utils";
import type { GalleryItemRow } from "@/types/database";

const inputClassName =
  "mt-2 w-full rounded-xl border border-navy-950/10 bg-white px-4 py-3 text-sm text-navy-950 outline-none ring-gold focus:ring-2";

export function GalleryItemForm({
  action,
  item,
  events,
  existingImageUrl,
  defaultDisplayOrder,
}: {
  action: (
    state: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  item?: GalleryItemRow;
  events: Array<{ id: string; title: string }>;
  existingImageUrl?: string;
  defaultDisplayOrder?: number;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    initialAdminFormState,
  );

  return (
    <form
      action={formAction}
      className="mt-8 rounded-2xl border border-navy-950/8 bg-white p-6 shadow-[0_16px_50px_rgba(17,38,71,0.08)] sm:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="text-sm font-semibold text-navy-950 lg:col-span-2">
          Title
          <input
            name="title"
            required
            defaultValue={item?.title ?? ""}
            className={inputClassName}
          />
        </label>
        <label className="text-sm font-semibold text-navy-950 lg:col-span-2">
          Caption
          <textarea
            name="caption"
            rows={4}
            defaultValue={item?.caption ?? ""}
            className={inputClassName}
          />
        </label>
        <label className="text-sm font-semibold text-navy-950 lg:col-span-2">
          Meaningful alt text
          <input
            name="alt_text"
            required
            defaultValue={item?.alt_text ?? ""}
            className={inputClassName}
            placeholder="Describe the visible people, activity, and setting"
          />
        </label>
        <label className="text-sm font-semibold text-navy-950">
          Category
          <input
            name="category"
            required
            defaultValue={item?.category ?? "Community"}
            className={inputClassName}
          />
        </label>
        <label className="text-sm font-semibold text-navy-950">
          Related event (optional)
          <select
            name="event_id"
            defaultValue={item?.event_id ?? ""}
            className={inputClassName}
          >
            <option value="">No related event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-navy-950">
          Captured at (IST, optional)
          <input
            type="datetime-local"
            name="captured_at"
            defaultValue={toIndiaDateTimeInput(item?.captured_at ?? null)}
            className={inputClassName}
          />
        </label>
        <label className="text-sm font-semibold text-navy-950">
          Display order
          <input
            type="number"
            min={0}
            name="display_order"
            defaultValue={item?.display_order ?? defaultDisplayOrder ?? 0}
            className={inputClassName}
          />
        </label>
        <label className="text-sm font-semibold text-navy-950 lg:col-span-2">
          {item ? "Replace image (optional)" : "Gallery image"}
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className={`${inputClassName} file:mr-4 file:rounded-lg file:border-0 file:bg-navy-950 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-ivory`}
          />
          <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
            JPEG, PNG, WebP, or AVIF. Maximum 5 MB. A new upload replaces the
            current stored image after the record saves successfully.
          </span>
        </label>
      </div>

      {existingImageUrl ? (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Current image
          </p>
          {/* Administrator-managed Storage URLs cannot be statically allowlisted. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={existingImageUrl}
            alt="Current gallery item preview"
            className="mt-3 h-40 w-full max-w-sm rounded-xl object-cover"
          />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={item?.is_published}
          />
          Published on the public Gallery page
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={item?.is_featured}
          />
          Featured in homepage previews
        </label>
      </div>

      {state.message ? (
        <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900" role="alert">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" className="mt-6" disabled={pending}>
        {pending ? "Saving..." : item ? "Save gallery item" : "Create gallery item"}
      </Button>
    </form>
  );
}
