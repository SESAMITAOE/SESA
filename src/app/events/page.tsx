import type { Metadata } from "next";
import { ContentNotice } from "@/components/content-notice";
import { EventsBrowser } from "@/components/pages/events-browser";
import { PageHero } from "@/components/pages/page-hero";
import { SiteShell } from "@/components/site-shell";
import { getPublicEvents } from "@/lib/data/public-content";

export const metadata: Metadata = { title: "Events" };
export default async function EventsPage() {
  const result = await getPublicEvents();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Events"
        title="Learn, compete and build with purpose."
        description="Explore upcoming workshops, hackathons, talks and showcases organised by SESA."
      />
      <section className="section-pad bg-ivory">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <ContentNotice message={result.notice} />
          <EventsBrowser events={result.data} />
        </div>
      </section>
    </SiteShell>
  );
}
