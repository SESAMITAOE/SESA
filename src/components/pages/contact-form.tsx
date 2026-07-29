"use client";

import { CheckCircle2, Send } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-700" />
        <h2 className="mt-4 font-display text-3xl text-navy-950">Message ready.</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">The form interaction is complete. Submission to the backend will be connected when the data phase begins.</p>
        <Button type="button" variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-navy-950/8 bg-white p-6 shadow-[0_24px_75px_rgba(17,38,71,0.1)] sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-navy-950">Name<input required name="name" className="h-12 rounded-xl border border-navy-950/10 bg-ivory px-4 font-normal outline-none transition focus:border-gold" placeholder="Your name" /></label>
        <label className="grid gap-2 text-sm font-semibold text-navy-950">Email<input required type="email" name="email" className="h-12 rounded-xl border border-navy-950/10 bg-ivory px-4 font-normal outline-none transition focus:border-gold" placeholder="you@example.com" /></label>
      </div>
      <label className="mt-5 grid gap-2 text-sm font-semibold text-navy-950">I am interested in<select name="interest" className="h-12 rounded-xl border border-navy-950/10 bg-ivory px-4 font-normal outline-none transition focus:border-gold"><option>Joining SESA</option><option>Event collaboration</option><option>Technical project</option><option>Workshop or talk</option><option>General query</option></select></label>
      <label className="mt-5 grid gap-2 text-sm font-semibold text-navy-950">Message<textarea required name="message" rows={6} className="rounded-xl border border-navy-950/10 bg-ivory px-4 py-3 font-normal outline-none transition focus:border-gold" placeholder="Tell us what you would like to discuss." /></label>
      <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">Send message <Send className="size-4" /></Button>
    </form>
  );
}
