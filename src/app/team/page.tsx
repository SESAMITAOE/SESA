import type { Metadata } from "next";

import { ContentNotice } from "@/components/content-notice";
import { PageHero } from "@/components/pages/page-hero";
import { SiteShell } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
import { getPublicTeamMembers } from "@/lib/data/public-content";

const preferredGroupOrder = ["Core Members", "Executive Members"];
const yearOrder = ["B.Tech", "TY", "SY", "FY"];

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  const result = await getPublicTeamMembers();
  const groups = Array.from(
    new Set([
      ...preferredGroupOrder,
      ...result.data.map((member) => member.group),
    ]),
  ).filter((group) =>
    result.data.some((member) => member.group === group),
  );

  return (
    <SiteShell>
      <PageHero
        eyebrow="Our team"
        title="Responsibility is distributed. Direction is shared."
        description="SESA is led by students across technical, creative, event and community functions, with faculty guidance and clear handover between batches."
      />
      <section className="section-pad bg-ivory">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <ContentNotice message={result.notice} />
          {groups.map((group, groupIndex) => (
            <div key={group} className={groupIndex ? "mt-16" : ""}>
              <div className="flex items-center gap-4">
                <Badge className="text-gold-dark">{group}</Badge>
                <div className="h-px flex-1 bg-navy-950/10" />
              </div>
              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {result.data
                  .filter((member) => member.group === group)
                  .sort((a, b) => {
                    const yearDifference =
                      yearOrder.indexOf(a.year) - yearOrder.indexOf(b.year);
                    return yearDifference || a.name.localeCompare(b.name);
                  })
                  .map((member) => (
                    <article
                      key={member.id}
                      className="rounded-[1.75rem] border border-navy-950/8 bg-white p-5 shadow-[0_18px_60px_rgba(17,38,71,0.08)]"
                    >
                      <div className="grid aspect-[4/3] place-items-center rounded-[1.3rem] bg-[linear-gradient(145deg,#112647,#285780)] font-display text-5xl text-gold-light">
                        {member.initials}
                      </div>
                      <h2 className="mt-5 font-display text-3xl text-navy-950">
                        {member.name}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-gold-dark">
                        {member.role}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        {member.year}
                      </p>
                      {member.isEmailPublic && member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          className="mt-3 block break-all text-sm font-medium text-gold-dark hover:underline"
                        >
                          {member.email}
                        </a>
                      ) : null}
                    </article>
                  ))}
              </div>
            </div>
          ))}
          {!result.data.length ? (
            <p className="rounded-2xl border border-dashed border-navy-950/20 p-12 text-center text-slate-600">
              Team information will be available soon.
            </p>
          ) : null}
        </div>
      </section>
    </SiteShell>
  );
}
