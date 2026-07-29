import type { Metadata } from "next";
import { EventsBrowser } from "@/components/pages/events-browser";
import { PageHero } from "@/components/pages/page-hero";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "Events" };
export default function EventsPage() {
  return <SiteShell><PageHero eyebrow="Events" title="Learn, compete and build with purpose." description="Explore upcoming workshops, hackathons, talks and showcases. Event data is currently mocked and ready to be connected to a backend." /><section className="section-pad bg-ivory"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><EventsBrowser /></div></section></SiteShell>;
}
