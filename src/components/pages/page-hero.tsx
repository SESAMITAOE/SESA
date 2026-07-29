import { Badge } from "@/components/ui/badge";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-18 pt-32 text-ivory sm:pb-22 sm:pt-36">
      <div className="hero-grid absolute inset-0 opacity-25" />
      <div className="absolute -right-40 top-0 size-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Badge className="text-gold-light">{eyebrow}</Badge>
        <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
      </div>
    </section>
  );
}
