import Link from "next/link";

import { createAnnouncementAction } from "@/app/admin/(protected)/announcements/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";

export default async function NewAnnouncementPage() {
  await requireAdmin();

  return (
    <>
      <AdminPageHeader
        title="Create announcement"
        description="Publish a concise update and optionally schedule when it appears or expires."
        action={
          <Button asChild variant="outline">
            <Link href="/admin/announcements">Back to announcements</Link>
          </Button>
        }
      />
      <AnnouncementForm action={createAnnouncementAction} />
    </>
  );
}
