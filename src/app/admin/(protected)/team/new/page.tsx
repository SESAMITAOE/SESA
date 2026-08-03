import Link from "next/link";

import { createTeamMemberAction } from "@/app/admin/(protected)/team/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TeamMemberForm } from "@/components/admin/team-member-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";

export default async function NewTeamMemberPage() {
  await requireAdmin();

  return (
    <>
      <AdminPageHeader
        title="Add team member"
        description="Add only approved SESA committee information. Email remains private unless explicitly enabled."
        action={
          <Button asChild variant="outline">
            <Link href="/admin/team">Back to team</Link>
          </Button>
        }
      />
      <TeamMemberForm action={createTeamMemberAction} />
    </>
  );
}
