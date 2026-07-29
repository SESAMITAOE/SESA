import type { Metadata } from "next";
import { Clock3, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/pages/contact-form";
import { PageHero } from "@/components/pages/page-hero";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() {
  return <SiteShell><PageHero eyebrow="Contact SESA" title="Bring an idea, a question or a willingness to help." description="Use this page to connect with the association about participation, collaborations, events or technical initiatives." /><section className="section-pad bg-[#efe6d8]"><div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10"><div><h2 className="font-display text-4xl text-navy-950">Start with a clear message.</h2><p className="mt-4 text-sm leading-7 text-slate-600">The actual association email, social profiles and office hours can be replaced later from one configuration file.</p><div className="mt-8 grid gap-4"><div className="rounded-2xl border border-navy-950/8 bg-white/65 p-5"><Mail className="size-5 text-gold-dark" /><p className="mt-3 text-sm font-bold text-navy-950">Email</p><p className="mt-1 text-sm text-slate-600">sesa.mitaoe@gmail.com</p></div><div className="rounded-2xl border border-navy-950/8 bg-white/65 p-5"><MapPin className="size-5 text-gold-dark" /><p className="mt-3 text-sm font-bold text-navy-950">Location</p><p className="mt-1 text-sm text-slate-600">Department of Computer Engineering, MITAOE, Alandi, Pune</p></div><div className="rounded-2xl border border-navy-950/8 bg-white/65 p-5"><Clock3 className="size-5 text-gold-dark" /><p className="mt-3 text-sm font-bold text-navy-950">Response target</p><p className="mt-1 text-sm text-slate-600">Within two working days</p></div></div></div><ContactForm /></div></section></SiteShell>;
}
