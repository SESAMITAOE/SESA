import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Code2,
  Lightbulb,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ContentNotice } from "@/components/content-notice";
import { AnnouncementList } from "@/components/home/announcement-list";
import { HomeGalleryPreview } from "@/components/home/gallery-preview";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getPublicAnnouncements,
  getPublicEvents,
  getPublicGalleryItems,
  getPublicResources,
  getPublicTeamMembers,
} from "@/lib/data/public-content";

export async function HomePage() {
  const [
    eventResult,
    teamResult,
    announcementResult,
    galleryResult,
    resourceResult,
  ] = await Promise.all([
    getPublicEvents(),
    getPublicTeamMembers(),
    getPublicAnnouncements(),
    getPublicGalleryItems(),
    getPublicResources(),
  ]);
  const events = eventResult.data;
  const team = teamResult.data;
  const announcements = announcementResult.data;
  const galleryItems = galleryResult.data;
  const resources = resourceResult.data;
  const contentNotice =
    eventResult.notice ??
    teamResult.notice ??
    announcementResult.notice ??
    galleryResult.notice ??
    resourceResult.notice;
  const upcomingEvents = events
    .filter((event) => event.status !== "completed")
    .slice(0, 3);

  return (
    <div className="overflow-hidden bg-ivory">
      <section className="relative min-h-[860px] bg-navy-950 pb-24 pt-32 text-ivory sm:pt-36 lg:min-h-screen lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-48 top-32 size-[32rem] rounded-full bg-[#1f4b78]/28 blur-3xl" />
          <div className="absolute -right-52 top-10 size-[34rem] rounded-full bg-gold/16 blur-3xl" />
          <div className="hero-grid absolute inset-0 opacity-30" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#08162a] to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10">
          <div className="max-w-3xl">
            <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/7 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-light backdrop-blur">
              <Sparkles className="size-4" /> Department student association
            </div>
            <h1 className="animate-rise animation-delay-100 mt-7 font-display text-5xl leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-[5.6rem]">
              Where software engineers
              <span className="block text-gold-light">
                build what&apos;s next.
              </span>
            </h1>
            <p className="animate-rise animation-delay-200 mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              SESA is the student-led platform for practical learning, technical
              collaboration, stronger projects and a more connected Software
              Engineering community at MITAOE.
            </p>
            <div className="animate-rise animation-delay-300 mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/events">
                  Explore upcoming events <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="animate-rise animation-delay-400 mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-7">
              {[
                ["30+", "Activities"],
                ["500+", "Students reached"],
                ["12", "Active initiatives"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl text-ivory sm:text-3xl">
                    {value}
                  </p>
                  <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[570px] lg:mx-0 lg:justify-self-end">
            <div className="absolute inset-8 rounded-full bg-gold/16 blur-3xl" />
            <div className="relative rounded-[2.4rem] border border-white/12 bg-white/[0.055] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8">
              <div className="relative rounded-[1.9rem] border border-white/10 bg-[linear-gradient(145deg,#fdf6eb_0%,#efe4d0_100%)] px-6 py-8 sm:px-10 sm:py-10">
                <div className="absolute -right-12 -top-12 size-40 rounded-full border border-gold/20" />
                <div className="absolute -bottom-16 -left-14 size-48 rounded-full border border-navy-950/10" />
                <Image
                  src="/sesa_logo_white.png"
                  alt="SESA official crest"
                  width={520}
                  height={520}
                  priority
                  className="relative mx-auto h-auto w-full max-w-[390px] drop-shadow-[0_28px_45px_rgba(17,38,71,0.18)]"
                  style={{
                    width: "300px",
                    height: "300px",
                    objectFit: "cover",
                    mixBlendMode: "multiply",
                    borderRadius: "24px",
                    // Sharp 2rem radius center circle, then smoothly fades out to the edges
                    maskImage:
                      "radial-gradient(circle, black 0px, black 8rem, transparent 100%)",
                    WebkitMaskImage:
                      "radial-gradient(circle, black 0px, black 8rem, transparent 100%)",
                  }}
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-navy-900/65 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-light">
                    Our motto
                  </p>
                  <p className="mt-1 font-display text-xl tracking-[0.07em] text-ivory">
                    Dream • Build • Achieve
                  </p>
                </div>
                <div className="hidden size-11 place-items-center rounded-full border border-white/12 text-gold-light sm:grid">
                  <Lightbulb className="size-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {contentNotice || announcements.length ? (
        <section className="relative z-10 -mt-10 px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <ContentNotice message={contentNotice} />
            <AnnouncementList announcements={announcements} />
          </div>
        </section>
      ) : null}

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Upcoming events"
              title="Worth showing up for."
              description="Focused experiences designed around learning, building and meeting people who take engineering seriously."
            />
            <Button asChild variant="outline">
              <Link href="/events">
                View all events <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {upcomingEvents.map((event, index) => (
              <Card
                key={event.id}
                className="group overflow-hidden bg-white/78 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(17,38,71,0.13)]"
              >
                <div className={`h-2 bg-gradient-to-r ${event.accent}`} />
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <Badge className="text-gold-dark">{event.category}</Badge>
                    <span className="font-display text-4xl text-navy-950/10">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-3xl leading-tight tracking-[-0.025em] text-navy-950">
                    {event.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {event.description}
                  </p>
                  <div className="mt-6 grid gap-3 border-t border-navy-900/8 pt-5 text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="size-4 text-gold-dark" />{" "}
                      {event.date}
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="size-4 text-gold-dark" /> {event.venue}
                    </div>
                  </div>
                  <Link
                    href={`/events#event-${event.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy-950"
                  >
                    Event details{" "}
                    <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </Card>
            ))}
            {!upcomingEvents.length ? (
              <p className="rounded-2xl border border-dashed border-navy-950/20 p-10 text-center text-slate-600 lg:col-span-3">
                New events will be announced soon.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[#efe6d8]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-10">
          <div className="relative overflow-hidden rounded-[2.25rem] bg-navy-950 p-7 text-ivory shadow-[0_30px_90px_rgba(17,38,71,0.17)] sm:p-10">
            <div className="absolute right-0 top-0 size-52 rounded-full bg-gold/16 blur-3xl" />
            <div className="relative">
              <Badge className="text-gold-light">What SESA stands for</Badge>
              <div className="mt-8 grid gap-4">
                {[
                  [
                    "Dream",
                    "Think beyond assignments and identify meaningful problems.",
                  ],
                  [
                    "Build",
                    "Turn ideas into working systems through disciplined collaboration.",
                  ],
                  [
                    "Achieve",
                    "Create outcomes that are useful, explainable and worth continuing.",
                  ],
                ].map(([title, text], index) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/[0.055] p-5"
                  >
                    <div className="flex items-start gap-4">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold text-sm font-black text-navy-950">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-display text-2xl text-ivory">
                          {title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="About the association"
              title="A practical bridge between classrooms and real engineering."
              description="SESA exists to make technical participation easier, more consistent and more useful. It brings students together through events, peer learning, projects, documentation and opportunities to take responsibility."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                [
                  Code2,
                  "Build together",
                  "Cross-year technical teams working on useful, maintainable projects.",
                ],
                [
                  Users,
                  "Learn from peers",
                  "Student-led sessions that turn individual knowledge into community strength.",
                ],
                [
                  BookOpen,
                  "Document clearly",
                  "Resources and handover standards that prevent each batch from starting again.",
                ],
                [
                  Lightbulb,
                  "Create opportunities",
                  "Workshops, challenges and conversations connected to real practice.",
                ],
              ].map(([Icon, title, text]) => {
                const FeatureIcon = Icon as typeof Code2;
                return (
                  <div
                    key={title as string}
                    className="rounded-2xl border border-navy-950/8 bg-white/60 p-5"
                  >
                    <FeatureIcon className="size-5 text-gold-dark" />
                    <h3 className="mt-4 font-display text-xl text-navy-950">
                      {title as string}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {text as string}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Gallery"
            title="Moments where participation became progress."
            description="A visual record of workshops, competitions, project showcases and the people who make them happen."
          />
          <HomeGalleryPreview items={galleryItems} />
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/gallery">
                Open full gallery <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad bg-[#efe6d8]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="People behind SESA"
              title="Student-led. Faculty-guided. Built as one team."
              description="Meet the committee members who organise SESA activities and maintain continuity between student batches."
            />
            <Button asChild variant="outline">
              <Link href="/team">
                Meet the team <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.slice(0, 4).map((member) => (
              <article
                key={member.id}
                className="rounded-[1.5rem] border border-navy-950/8 bg-white/65 p-5"
              >
                <div className="grid aspect-square place-items-center rounded-[1.2rem] bg-[linear-gradient(145deg,#122c4e,#234f78)] text-4xl font-display text-gold-light">
                  {member.initials}
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">
                  {member.group}
                </p>
                <h3 className="mt-2 font-display text-2xl text-navy-950">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-10">
          <div>
            <SectionHeading
              eyebrow="Resource hub"
              title="Useful material, not a dumping ground."
              description="Curated guides, templates and playbooks that students can apply immediately."
            />
            <Button asChild variant="outline" className="mt-7">
              <Link href="/resources">
                Browse resources <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {resources.slice(0, 4).map((resource) => (
              <Link
                href="/resources"
                key={resource.id}
                className="group rounded-[1.5rem] border border-navy-950/8 bg-white p-5 shadow-[0_15px_45px_rgba(17,38,71,0.07)] transition hover:-translate-y-1 hover:border-gold/35"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">
                    {resource.resourceType}
                  </span>
                  <ArrowUpRight className="size-4 text-slate-400 transition group-hover:text-gold-dark" />
                </div>
                <h3 className="mt-5 font-display text-2xl leading-tight text-navy-950">
                  {resource.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {resource.description}
                </p>
                <p className="mt-5 border-t border-navy-950/8 pt-4 text-xs font-semibold text-slate-500">
                  {[resource.category, resource.audience, resource.academicYear]
                    .filter(Boolean)
                    .join(" • ") || resource.meta}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.3rem] bg-navy-950 px-6 py-14 text-center text-ivory shadow-[0_30px_90px_rgba(17,38,71,0.18)] sm:px-12 lg:py-18">
          <div className="absolute left-0 top-0 size-64 rounded-full bg-[#2f6798]/25 blur-3xl" />
          <div className="absolute bottom-0 right-0 size-72 rounded-full bg-gold/18 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <Badge className="text-gold-light">Become part of SESA</Badge>
            <h2 className="mt-6 font-display text-4xl leading-tight tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              You do not need to know everything. You need to be willing to
              contribute.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Join technical, design, content, event or outreach initiatives and
              build work that improves with every batch.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/contact">
                Start a conversation <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
