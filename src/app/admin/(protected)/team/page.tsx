import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";

import {
  moveTeamMemberAction,
  toggleTeamMemberActiveAction,
  toggleTeamMemberEmailAction,
} from "@/app/admin/(protected)/team/actions";
import { AdminDataNotice } from "@/components/admin/admin-data-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminTeamMembers } from "@/lib/data/admin-content";

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { supabase } = await requireAdmin();
  const result = await getAdminTeamMembers(supabase);

  return (
    <>
      <AdminPageHeader
        title="Team members"
        description="Manage SESA committee records, ordering, active status, and email privacy."
        action={
          <Button asChild>
            <Link href="/admin/team/new">Add team member</Link>
          </Button>
        }
      />
      <AdminDataNotice show={result.hasError} />
      {error ? (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error === "email"
            ? "Add an email address before enabling public email."
            : "The requested team update could not be completed safely."}
        </p>
      ) : null}
      <div className="mt-7 grid gap-4">
        {result.data.map((member, index) => (
          <article
            key={member.id}
            className="rounded-2xl border border-navy-950/8 bg-white p-5 shadow-[0_16px_50px_rgba(17,38,71,0.07)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                  <span
                    className={`rounded-full px-3 py-1 ${
                      member.is_active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {member.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="rounded-full bg-navy-950/7 px-3 py-1 text-navy-950">
                    {member.member_group}
                  </span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                    Email {member.is_email_public ? "public" : "private"}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-3xl text-navy-950">
                  {member.full_name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {member.role} · {member.year || "Year not set"} · order{" "}
                  {member.display_order}
                </p>
                {member.email ? (
                  <p className="mt-1 text-sm text-slate-500">{member.email}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <form
                  action={moveTeamMemberAction.bind(
                    null,
                    member.id,
                    "earlier",
                  )}
                >
                  <Button
                    type="submit"
                    size="icon"
                    variant="outline"
                    disabled={index === 0}
                    aria-label={`Move ${member.full_name} earlier`}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                </form>
                <form
                  action={moveTeamMemberAction.bind(
                    null,
                    member.id,
                    "later",
                  )}
                >
                  <Button
                    type="submit"
                    size="icon"
                    variant="outline"
                    disabled={index === result.data.length - 1}
                    aria-label={`Move ${member.full_name} later`}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                </form>
                <form
                  action={toggleTeamMemberActiveAction.bind(null, member.id)}
                >
                  <Button type="submit" size="sm" variant="outline">
                    {member.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </form>
                <form
                  action={toggleTeamMemberEmailAction.bind(null, member.id)}
                >
                  <Button type="submit" size="sm" variant="outline">
                    {member.is_email_public
                      ? "Make email private"
                      : "Make email public"}
                  </Button>
                </form>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/team/${member.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!result.data.length && !result.hasError ? (
        <p className="mt-7 rounded-2xl border border-dashed border-navy-950/20 p-10 text-center text-slate-600">
          No team members have been added.
        </p>
      ) : null}
    </>
  );
}
