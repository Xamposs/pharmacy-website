import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { StoreProviders } from "@/components/providers/StoreProviders";
import { TopBar } from "@/components/layout/TopBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartDrawer } from "@/components/commerce/CartDrawer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pharmacy — Το online φαρμακείο (demo)",
    template: "%s | Pharmacy",
  },
  description: "Demo φαρμακείο: κατάλογος, κατηγορίες, brands και αναζήτηση με δοκιμαστικά δεδομένα.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="el">
      <body className="flex min-h-screen flex-col">
        <StoreProviders>
          <TopBar />
          <SiteHeader />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </StoreProviders>
      </body>
    </html>
  );
}
