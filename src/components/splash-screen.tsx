"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const SESSION_KEY = "sesa-intro-seen";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const hasSeenIntro = window.sessionStorage.getItem(SESSION_KEY);
    if (hasSeenIntro) return;
    setVisible(true);
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(SESSION_KEY, "true");
      setVisible(false);
    }, reduceMotion ? 650 : 1550);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div aria-label="SESA introduction" className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-navy-950" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.2 : 0.45 } }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(177,131,69,0.16),transparent_42%)]" />
          <motion.div className="relative flex flex-col items-center px-6 text-center" initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: reduceMotion ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <Image src="/sesa-logo.svg" alt="SESA crest" width={230} height={230} priority className="h-40 w-40 object-contain drop-shadow-[0_18px_45px_rgba(0,0,0,0.3)] sm:h-52 sm:w-52" />
            <p className="mt-5 font-display text-4xl tracking-[0.14em] text-ivory sm:text-5xl">SESA</p>
            <p className="mt-2 max-w-md text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 sm:text-sm">Software Engineering Student Association</p>
            <p className="mt-5 text-sm font-semibold tracking-[0.24em] text-gold-light">Dream • Build • Achieve</p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
