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
  const journeyReferenceTime = new Date().toISOString();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Events"
        title="Learn, compete and build with purpose."
        description="Explore upcoming workshops, hackathons, talks and showcases organised by SESA."
      />
      <section className="relative overflow-x-clip bg-[#071426] py-20 text-ivory sm:py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="event-journey-grid absolute inset-0 opacity-45" />
          <div className="event-journey-particles absolute inset-0 opacity-30" />
          <div className="absolute -left-52 top-24 size-[30rem] rounded-full bg-[#2c6597]/18 blur-3xl" />
          <div className="absolute -right-52 top-[34%] size-[32rem] rounded-full bg-gold/12 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b1b31] to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <ContentNotice message={result.notice} />
          <SectionHeading
            eyebrow="SESA Event Journey"
            title="Progress, mapped through every shared milestone."
            description="Follow SESA's progression from completed chapters through today's activity and into what comes next."
            inverse
          />
          <EventJourney
            events={result.data}
            referenceTime={journeyReferenceTime}
          />
        </div>
      </section>
      <section className="section-pad relative overflow-x-clip border-t border-gold/20 bg-[#efe6d8]">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy-950/7 to-transparent"
        />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Event details"
            title="Explore Every Event."
            description="Review schedules, venues, registration information, and the full context for each published event."
          />
          <EventDetails events={result.data} />
        </div>
      </section>
    </SiteShell>
  );
}
