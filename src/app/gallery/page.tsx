import type { Metadata } from "next";

import { ContentNotice } from "@/components/content-notice";
import { GalleryBrowser } from "@/components/pages/gallery-browser";
import { PageHero } from "@/components/pages/page-hero";
import { SiteShell } from "@/components/site-shell";
import { getPublicGalleryItems } from "@/lib/data/public-content";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const result = await getPublicGalleryItems();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Gallery"
        title="The work, people and energy behind every event."
        description="A growing visual record of SESA workshops, competitions, showcases, and community moments."
      />
      <section className="section-pad bg-[#efe6d8]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <ContentNotice message={result.notice} />
          <GalleryBrowser items={result.data} />
        </div>
      </section>
    </SiteShell>
  );
}
