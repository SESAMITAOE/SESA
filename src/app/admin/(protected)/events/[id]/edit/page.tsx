import Link from "next/link";
import { notFound } from "next/navigation";

import { updateEventAction } from "@/app/admin/(protected)/events/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EventForm } from "@/components/admin/event-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!event) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        title="Edit event"
        description="Update the public content, publishing state, schedule, and registration details."
        action={
          <Button asChild variant="outline">
            <Link href="/admin/events">Back to events</Link>
          </Button>
        }
      />
      <EventForm action={updateEventAction.bind(null, id)} event={event} />
    </>
  );
}
