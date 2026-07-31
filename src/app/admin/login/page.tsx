import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "@/app/admin/login/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Administrator sign in" };

const errorMessages: Record<string, string> = {
  "access-denied": "This account is not approved for administration.",
  configuration:
    "Supabase is not configured. Follow docs/ADMIN_CMS_SETUP.md before signing in.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configurationMessage = isSupabaseConfigured()
    ? undefined
    : errorMessages.configuration;
  const message = configurationMessage ?? (error ? errorMessages[error] : "");

  return (
    <main className="grid min-h-screen place-items-center bg-navy-950 px-5 py-16">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-ivory p-7 shadow-2xl sm:p-9">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/sesa-logo.svg"
            alt="SESA crest"
            width={58}
            height={58}
            className="size-14 object-contain"
          />
          <div>
            <p className="font-display text-2xl tracking-[0.08em] text-navy-950">
              SESA
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500">
              Administration
            </p>
          </div>
        </Link>
        <h1 className="mt-8 font-display text-4xl text-navy-950">
          Approved administrators only.
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Public students do not need an account. This sign-in is only for
          approved SESA content administrators.
        </p>
        {message ? (
          <p
            className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
            role="alert"
          >
            {message}
          </p>
        ) : null}
        <LoginForm />
        <Link
          href="/"
          className="mt-6 block text-center text-sm font-semibold text-gold-dark hover:underline"
        >
          Return to the public website
        </Link>
      </section>
    </main>
  );
}
