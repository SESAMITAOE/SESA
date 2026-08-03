"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  initialAdminFormState,
  type AdminFormState,
} from "@/lib/admin/form-utils";
import type { TeamMemberRow } from "@/types/database";

type TeamMemberFormAction = (
  state: AdminFormState,
  formData: FormData,
) => Promise<AdminFormState>;

const inputClassName =
  "h-12 rounded-xl border border-navy-950/10 bg-ivory px-4 font-normal outline-none transition focus:border-gold";
const labelClassName = "grid gap-2 text-sm font-semibold text-navy-950";

export function TeamMemberForm({
  action,
  member,
}: {
  action: TeamMemberFormAction;
  member?: TeamMemberRow;
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
          Full name
          <input
            required
            name="full_name"
            defaultValue={member?.full_name}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Role
          <input
            required
            name="role"
            defaultValue={member?.role}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Member group
          <input
            required
            name="member_group"
            defaultValue={member?.member_group}
            placeholder="Core Members"
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Year
          <input
            name="year"
            defaultValue={member?.year}
            placeholder="TY"
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Email
          <input
            type="email"
            name="email"
            defaultValue={member?.email ?? ""}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Display order
          <input
            type="number"
            min="0"
            name="display_order"
            defaultValue={member?.display_order ?? 0}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          Profile image URL
          <input
            type="url"
            name="profile_image_url"
            defaultValue={member?.profile_image_url ?? ""}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          LinkedIn URL
          <input
            type="url"
            name="linkedin_url"
            defaultValue={member?.linkedin_url ?? ""}
            className={inputClassName}
          />
        </label>
        <label className={labelClassName}>
          GitHub URL
          <input
            type="url"
            name="github_url"
            defaultValue={member?.github_url ?? ""}
            className={inputClassName}
          />
        </label>
      </div>
      <div className="mt-6 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={member?.is_active ?? true}
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <input
            type="checkbox"
            name="is_email_public"
            defaultChecked={member?.is_email_public}
          />
          Email approved for public display
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
          : member
            ? "Save team member"
            : "Add team member"}
      </Button>
    </form>
  );
}
