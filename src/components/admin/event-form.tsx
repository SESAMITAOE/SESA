"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  initialAdminFormState,
  toIndiaDateTimeInput,
  type AdminFormState,
} from "@/lib/admin/form-utils";
import type { EventRow } from "@/types/database";

type EventFormAction = (
  state: AdminFormState,
  formData: FormData,
) => Promise<AdminFormState>;

const inputClassName =
  "h-12 rounded-xl border border-navy-950/10 bg-ivory px-4 font-normal outline-none transition focus:border-gold";
const labelClassName = "grid gap-2 text-sm font-semibold text-navy-950";

export function EventForm({
  action,
  event,
}: {
  action: EventFormAction;
  event?: EventRow;
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
      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClassName}>
          Title
          <input
            required
            name="title"
            defaultValue={event?.title}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Slug
          <input
            required
            name="slug"
            defaultValue={event?.slug}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className={inputClassName}
          />
        </label>
      </div>
      <label className={`${labelClassName} mt-5`}>
        Short description
        <input
          required
          name="short_description"
          defaultValue={event?.short_description}
          className={inputClassName}
        />
      </label>
      <label className={`${labelClassName} mt-5`}>
        Full description
        <textarea
          required
          name="description"
          rows={7}
          defaultValue={event?.description}
          className="rounded-xl border border-navy-950/10 bg-ivory px-4 py-3 font-normal outline-none transition focus:border-gold"
        />
      </label>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <label className={labelClassName}>
          Category
          <input
            name="category"
            defaultValue={event?.category}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Venue
          <input
            name="venue"
            defaultValue={event?.venue}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Status
          <select
            required
            name="status"
            defaultValue={event?.status ?? "planned"}
            className={inputClassName}
          >
            <option value="planned">Planned</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <label className={labelClassName}>
          Starts at
          <input
            type="datetime-local"
            name="start_at"
            defaultValue={toIndiaDateTimeInput(event?.start_at ?? null)}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Ends at
          <input
            type="datetime-local"
            name="end_at"
            defaultValue={toIndiaDateTimeInput(event?.end_at ?? null)}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Registration deadline
          <input
            type="datetime-local"
            name="registration_deadline"
            defaultValue={toIndiaDateTimeInput(
              event?.registration_deadline ?? null,
            )}
            className={inputClassName}
          />
        </label>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className={labelClassName}>
          Poster URL
          <input
            type="url"
            name="poster_url"
            defaultValue={event?.poster_url ?? ""}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Registration URL
          <input
            type="url"
            name="registration_url"
            defaultValue={event?.registration_url ?? ""}
            className={inputClassName}
          />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={event?.is_published}
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={event?.is_featured}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          Display order
          <input
            type="number"
            min="0"
            name="display_order"
            defaultValue={event?.display_order ?? 0}
            className="h-10 w-24 rounded-lg border border-navy-950/10 bg-ivory px-3"
          />
        </label>
      </div>
      {state.message ? (
        <p
          className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="mt-7" disabled={pending}>
        {pending ? "Saving…" : event ? "Save event" : "Create event"}
      </Button>
    </form>
  );
}
