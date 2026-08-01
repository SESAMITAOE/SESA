"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  initialAdminFormState,
  toIndiaDateTimeInput,
  type AdminFormState,
} from "@/lib/admin/form-utils";
import type { AnnouncementRow } from "@/types/database";

type AnnouncementFormAction = (
  state: AdminFormState,
  formData: FormData,
) => Promise<AdminFormState>;

const inputClassName =
  "h-12 rounded-xl border border-navy-950/10 bg-ivory px-4 font-normal outline-none transition focus:border-gold";
const labelClassName = "grid gap-2 text-sm font-semibold text-navy-950";

export function AnnouncementForm({
  action,
  announcement,
}: {
  action: AnnouncementFormAction;
  announcement?: AnnouncementRow;
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
      <div className="grid gap-5 md:grid-cols-[1fr_14rem]">
        <label className={labelClassName}>
          Title
          <input
            required
            name="title"
            defaultValue={announcement?.title}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Priority
          <select
            name="priority"
            defaultValue={announcement?.priority ?? "normal"}
            className={inputClassName}
          >
            <option value="normal">Normal</option>
            <option value="important">Important</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
      </div>
      <label className={`${labelClassName} mt-5`}>
        Message
        <textarea
          required
          name="message"
          rows={5}
          defaultValue={announcement?.message}
          className="rounded-xl border border-navy-950/10 bg-ivory px-4 py-3 font-normal outline-none transition focus:border-gold"
        />
      </label>
      <label className={`${labelClassName} mt-5`}>
        Optional link
        <input
          type="url"
          name="link_url"
          defaultValue={announcement?.link_url ?? ""}
          className={inputClassName}
        />
      </label>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className={labelClassName}>
          Starts at
          <input
            type="datetime-local"
            name="starts_at"
            defaultValue={toIndiaDateTimeInput(
              announcement?.starts_at ?? null,
            )}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Expires at
          <input
            type="datetime-local"
            name="ends_at"
            defaultValue={toIndiaDateTimeInput(
              announcement?.ends_at ?? null,
            )}
            className={inputClassName}
          />
        </label>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Announcement scheduling uses India Standard Time. Leave both dates
        empty to keep a published announcement active until it is unpublished.
      </p>
      <div className="mt-6 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={announcement?.is_published}
          />
          Published on the public homepage
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <input
            type="checkbox"
            name="is_pinned"
            defaultChecked={announcement?.is_pinned}
          />
          Pinned above other announcements
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
        {pending
          ? "Saving…"
          : announcement
            ? "Save announcement"
            : "Create announcement"}
      </Button>
    </form>
  );
}
