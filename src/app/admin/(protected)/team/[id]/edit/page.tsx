import Link from "next/link";
import { notFound } from "next/navigation";

import { updateTeamMemberAction } from "@/app/admin/(protected)/team/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TeamMemberForm } from "@/components/admin/team-member-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data: member } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!member) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        title="Edit team member"
        description="Update committee information, public visibility, and ordering."
        action={
          <Button asChild variant="outline">
            <Link href="/admin/team">Back to team</Link>
          </Button>
        }
      />
      <TeamMemberForm
        action={updateTeamMemberAction.bind(null, id)}
        member={member}
      />
    </>
  );
}
