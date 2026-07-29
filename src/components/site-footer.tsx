import { ArrowUpRight, Github, Instagram, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { navItems } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#08162a] text-ivory">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr_0.65fr]">
          <div className="max-w-xl">
            <div className="flex items-center gap-4">
              <Image src="/sesa-logo.svg" alt="SESA crest" width={78} height={78} className="h-16 w-16 object-contain" />
              <div><p className="font-display text-3xl tracking-[0.08em]">SESA</p><p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Software Engineering Student Association</p></div>
            </div>
            <p className="mt-6 max-w-lg text-sm leading-7 text-slate-300">The student association of the Department of Computer Engineering (Software Engineering), MIT Academy of Engineering.</p>
            <p className="mt-5 text-sm font-semibold tracking-[0.2em] text-gold-light">Dream • Build • Achieve</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-light">Explore</p>
            <div className="mt-5 grid gap-3">
              {navItems.slice(1).map((item) => <Link key={item.href} href={item.href} className="w-fit text-sm text-slate-300 transition hover:text-ivory">{item.label}</Link>)}
              <Link href="/contact" className="w-fit text-sm text-slate-300 transition hover:text-ivory">Contact</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-light">Connect</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
<a href="mailto:sesa.mitaoe@gmail.com" className="flex items-center gap-2 transition hover:text-ivory"><Mail className="size-4" /> sesa.mitaoe@gmail.com</a>
              <a href="https://www.instagram.com/sesa.mitaoe/" className="flex items-center gap-2 transition hover:text-ivory"><Instagram className="size-4" /> Instagram</a>
              <a href="https://github.com/SESAMITAOE/SESA" className="flex items-center gap-2 transition hover:text-ivory"><Github className="size-4" /> GitHub <ArrowUpRight className="size-3.5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/8 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 SESA, MIT Academy of Engineering. All rights reserved.</p><p>Designed for continuity, clarity and future student teams.</p></div>
      </div>
    </footer>
  );
}
