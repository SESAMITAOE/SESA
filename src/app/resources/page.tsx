import type { Metadata } from "next";

import { ContentNotice } from "@/components/content-notice";
import { PageHero } from "@/components/pages/page-hero";
import { ResourcesBrowser } from "@/components/pages/resources-browser";
import { SiteShell } from "@/components/site-shell";
import { getPublicResources } from "@/lib/data/public-content";

export const metadata: Metadata = { title: "Resources" };

export default async function ResourcesPage() {
  const result = await getPublicResources();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Resource hub"
        title="Curated material that helps students move faster."
        description="Guides, standards, files, and learning collections selected for practical use and clear handover."
      />
      <section className="section-pad bg-ivory">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <ContentNotice message={result.notice} />
          <ResourcesBrowser resources={result.data} />
        </div>
      </section>
    </SiteShell>
  );
}
