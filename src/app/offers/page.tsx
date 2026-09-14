import type { Metadata } from "next";
import { getOffers } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ProductCard } from "@/components/commerce/ProductCard";

export const metadata: Metadata = {
  title: "Προσφορές | Pharmacy",
  description: "Όλα τα demo προϊόντα σε προσφορά.",
};

export default function OffersPage() {
  const offers = getOffers(50);
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs items={[{ label: "Αρχική", href: "/" }, { label: "Προσφορές" }]} />
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Προσφορές</h1>
        <p className="mt-1 text-sm text-muted" aria-live="polite">
          {offers.length === 1 ? "1 προϊόν σε προσφορά" : `${offers.length} προϊόντα σε προσφορά`} (demo).
        </p>
      </div>
      {offers.length === 0 ? (
        <p className="rounded-xl bg-surface p-8 text-center text-sm text-muted shadow-card ring-1 ring-border">
          Δεν υπάρχουν ενεργές demo προσφορές αυτή τη στιγμή.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {offers.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
