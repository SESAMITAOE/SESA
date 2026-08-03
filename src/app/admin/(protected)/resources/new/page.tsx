import Link from "next/link";

import { createResourceAction } from "@/app/admin/(protected)/resources/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ResourceForm } from "@/components/admin/resource-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";

export default async function NewResourcePage() {
  const { supabase } = await requireAdmin();
  const { data: latestResources } = await supabase
    .from("resources")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);
  const defaultDisplayOrder =
    (latestResources?.[0]?.display_order ?? -1) + 1;

  return (
    <>
      <AdminPageHeader
        title="Add resource"
        description="Add a verified external destination or upload the file students should receive."
        action={
          <Button asChild variant="outline">
            <Link href="/admin/resources">Back to resources</Link>
          </Button>
        }
      />
      <ResourceForm
        action={createResourceAction}
        defaultDisplayOrder={defaultDisplayOrder}
      />
    </>
  );
}
