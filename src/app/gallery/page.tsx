import type { Metadata } from "next";
import { GalleryBrowser } from "@/components/pages/gallery-browser";
import { PageHero } from "@/components/pages/page-hero";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "Gallery" };
export default function GalleryPage() {
  return <SiteShell><PageHero eyebrow="Gallery" title="The work, people and energy behind every event." description="This interactive gallery is ready for real photographs, albums and captions once the storage backend is connected." /><section className="section-pad bg-[#efe6d8]"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><GalleryBrowser /></div></section></SiteShell>;
}
