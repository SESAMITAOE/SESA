"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navItems } from "@/data/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all duration-300", scrolled && "border-white/8 bg-navy-950/88 shadow-[0_12px_40px_rgba(8,21,40,0.22)] backdrop-blur-xl")}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-3" aria-label="SESA home">
          <Image src="/sesa-logo.svg" alt="" width={52} height={52} className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105" />
          <span className="hidden sm:block"><span className="block font-display text-xl tracking-[0.08em] text-ivory">SESA</span><span className="block text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-slate-300">Software Engineering Student Association</span></span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} className={cn("relative rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-ivory", active && "text-ivory")}>{item.label}{active ? <motion.span layoutId="nav-active" className="absolute inset-x-3 -bottom-0.5 h-px bg-gold" /> : null}</Link>;
          })}
        </nav>

        <button type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center rounded-full border border-white/12 bg-white/7 text-ivory xl:hidden">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
      </div>

      <AnimatePresence>
        {open ? <motion.div id="mobile-navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/8 bg-navy-950/98 backdrop-blur-xl xl:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-5 py-5 sm:px-8" aria-label="Mobile navigation">
            {navItems.map((item) => { const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} className={cn("rounded-2xl px-4 py-3 text-base font-medium text-slate-300 hover:bg-white/7 hover:text-ivory", active && "bg-white/8 text-gold-light")}>{item.label}</Link>; })}
          </nav>
        </motion.div> : null}
      </AnimatePresence>
    </header>
  );
}
