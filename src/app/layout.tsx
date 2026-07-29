import type { Metadata, Viewport } from "next";

import { SplashScreen } from "@/components/splash-screen";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: { default: "SESA | Software Engineering Student Association", template: "%s | SESA" },
  description: "Official website of the Software Engineering Student Association, Department of Computer Engineering (Software Engineering), MIT Academy of Engineering.",
  keywords: ["SESA", "MITAOE", "Software Engineering", "Student Association", "Technology Events"],
  openGraph: { title: "SESA | Dream • Build • Achieve", description: "Where software engineers build what's next.", type: "website" },
  icons: { icon: "/sesa-logo.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#08162a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={cn("font-sans", geist.variable)}><body><SplashScreen />{children}</body></html>;
}
