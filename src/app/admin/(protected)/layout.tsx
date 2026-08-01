import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";

const adminNavigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/resources", label: "Resources" },
];

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { profile, user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#efe6d8]">
      <header className="border-b border-white/10 bg-navy-950 text-ivory">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <Image
              src="/sesa-logo.svg"
              alt=""
              width={48}
              height={48}
              className="size-11 object-contain"
            />
            <div>
              <p className="font-display text-xl tracking-[0.08em]">SESA CMS</p>
              <p className="text-xs text-slate-300">
                {profile.full_name} · {user.email}
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Admin">
            {adminNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-ivory"
              >
                {item.label}
              </Link>
            ))}
            <form action={logoutAction}>
              <Button type="submit" size="sm" variant="secondary">
                <LogOut className="size-4" /> Logout
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        {children}
      </main>
    </div>
  );
}
