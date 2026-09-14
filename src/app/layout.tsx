import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/lib/cart-store";
import { TopBar } from "@/components/layout/TopBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartDrawer } from "@/components/commerce/CartDrawer";

export const metadata: Metadata = {
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
        <CartProvider>
          <TopBar />
          <SiteHeader />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
