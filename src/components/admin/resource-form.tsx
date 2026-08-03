"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  initialAdminFormState,
  type AdminFormState,
} from "@/lib/admin/form-utils";
import type { ResourceRow, ResourceType } from "@/types/database";

const inputClassName =
  "mt-2 w-full rounded-xl border border-navy-950/10 bg-white px-4 py-3 text-sm text-navy-950 outline-none ring-gold focus:ring-2";

const resourceTypes: Array<{ value: ResourceType; label: string }> = [
  { value: "document", label: "Document" },
  { value: "link", label: "External link" },
  { value: "video", label: "Video" },
  { value: "repository", label: "Repository" },
  { value: "guide", label: "Guide" },
  { value: "other", label: "Other" },
];

export function ResourceForm({
  action,
  resource,
  existingFileUrl,
  defaultDisplayOrder,
}: {
  action: (
    state: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  resource?: ResourceRow;
  existingFileUrl?: string;
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
            defaultValue={resource?.title ?? ""}
            className={inputClassName}
          />
        </label>
        <label className="text-sm font-semibold text-navy-950 lg:col-span-2">
          Description
          <textarea
            name="description"
            required
            rows={5}
            defaultValue={resource?.description ?? ""}
            className={inputClassName}
          />
        </label>
        <label className="text-sm font-semibold text-navy-950">
          Category
          <input
            name="category"
            required
            defaultValue={resource?.category ?? "General"}
            className={inputClassName}
          />
        </label>
        <label className="text-sm font-semibold text-navy-950">
          Resource type
          <select
            name="resource_type"
            defaultValue={resource?.resource_type ?? "guide"}
            className={inputClassName}
          >
            {resourceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-navy-950">
          Audience (optional)
          <input
            name="audience"
            defaultValue={resource?.audience ?? ""}
            className={inputClassName}
            placeholder="Students, organisers, project teams..."
          />
        </label>
        <label className="text-sm font-semibold text-navy-950">
          Academic year (optional)
          <input
            name="academic_year"
            defaultValue={resource?.academic_year ?? ""}
            className={inputClassName}
            placeholder="2026-27"
          />
        </label>
        <label className="text-sm font-semibold text-navy-950 lg:col-span-2">
          External URL (optional)
          <input
            type="url"
            name="external_url"
            defaultValue={resource?.external_url ?? ""}
            className={inputClassName}
            placeholder="https://..."
          />
          <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
            Use an external URL or an uploaded file. When replacing an uploaded
            file with a URL, the old stored file is removed after saving.
          </span>
        </label>
        <label className="text-sm font-semibold text-navy-950 lg:col-span-2">
          {resource ? "Replace uploaded file (optional)" : "Upload file (optional)"}
          <input
            type="file"
            name="file"
            accept=".pdf,.txt,.md,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
            className={`${inputClassName} file:mr-4 file:rounded-lg file:border-0 file:bg-navy-950 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-ivory`}
          />
          <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
            PDF, text, Markdown, Microsoft Office, or ZIP. Maximum 10 MB. Clear
            the external URL before choosing a file.
          </span>
        </label>
        <label className="text-sm font-semibold text-navy-950">
          Display order
          <input
            type="number"
            min={0}
            name="display_order"
            defaultValue={resource?.display_order ?? defaultDisplayOrder ?? 0}
            className={inputClassName}
          />
        </label>
      </div>

      {existingFileUrl ? (
        <p className="mt-6 text-sm text-slate-600">
          Current uploaded file: {" "}
          <a
            href={existingFileUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-navy-950 underline decoration-gold underline-offset-4"
          >
            Open file
          </a>
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={resource?.is_published}
          />
          Published on the public Resources page
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={resource?.is_featured}
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
        {pending ? "Saving..." : resource ? "Save resource" : "Create resource"}
      </Button>
    </form>
  );
}
