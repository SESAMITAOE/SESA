import type { Metadata } from "next";
import { PageHero } from "@/components/pages/page-hero";
import { ResourcesBrowser } from "@/components/pages/resources-browser";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "Resources" };
export default function ResourcesPage() {
  return <SiteShell><PageHero eyebrow="Resource hub" title="Curated material that helps students move faster." description="Guides, standards, templates and learning collections designed for practical use and easy maintenance." /><section className="section-pad bg-ivory"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><ResourcesBrowser /></div></section></SiteShell>;
}
