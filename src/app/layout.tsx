import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteCodeInjector, SiteBodyStart, SiteBodyEnd } from "@/components/SiteCodeInjector";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Fashion, Beauty & Careers`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: ["fashion", "beauty", "lifestyle", "editorial", "careers", "luxury"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Fashion, Beauty & Careers`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Fashion, Beauty & Careers`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");
  const isSecurePortal = pathname.startsWith("/secure-portal");

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-text-primary font-body antialiased">
        <SiteCodeInjector />
        {!isAdmin && !isSecurePortal && <Navbar />}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        {!isAdmin && !isSecurePortal && <Footer />}
        <SiteBodyEnd />
      </body>
    </html>
  );
}
