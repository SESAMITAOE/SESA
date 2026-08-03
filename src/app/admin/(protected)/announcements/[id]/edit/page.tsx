import Link from "next/link";
import { notFound } from "next/navigation";

import { updateAnnouncementAction } from "@/app/admin/(protected)/announcements/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data: announcement } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!announcement) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        title="Edit announcement"
        description="Update the message, visibility, priority, and active schedule."
        action={
          <Button asChild variant="outline">
            <Link href="/admin/announcements">Back to announcements</Link>
          </Button>
        }
      />
      <AnnouncementForm
        action={updateAnnouncementAction.bind(null, id)}
        announcement={announcement}
      />
    </>
  );
}
