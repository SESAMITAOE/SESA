import Link from "next/link";

import { createEventAction } from "@/app/admin/(protected)/events/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EventForm } from "@/components/admin/event-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";

export default async function NewEventPage() {
  await requireAdmin();

  return (
    <>
      <AdminPageHeader
        title="Create event"
        description="Add event details, then publish only when the information is ready for the public site."
        action={
          <Button asChild variant="outline">
            <Link href="/admin/events">Back to events</Link>
          </Button>
        }
      />
      <EventForm action={createEventAction} />
    </>
  );
}
