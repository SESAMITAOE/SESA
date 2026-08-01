import type { Metadata } from "next";
import { ContentNotice } from "@/components/content-notice";
import { EventDetails } from "@/components/pages/event-details";
import { EventJourney } from "@/components/pages/event-journey";
import { PageHero } from "@/components/pages/page-hero";
import { SectionHeading } from "@/components/section-heading";
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
      <section className="section-pad overflow-x-clip bg-ivory">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <ContentNotice message={result.notice} />
          <SectionHeading
            eyebrow="Event journey"
            title="Every event moves the community forward."
            description="Follow SESA's progression from completed chapters through today's activity and into what comes next."
          />
          <EventJourney events={result.data} />
        </div>
      </section>
      <section className="section-pad overflow-x-clip bg-[#efe6d8]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Event details"
            title="Everything you need before you participate."
            description="Review schedules, venues, registration information, and the full context for each published event."
          />
          <EventDetails events={result.data} />
        </div>
      </section>
    </SiteShell>
  );
}
