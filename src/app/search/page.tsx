import type { Metadata } from "next";
import { getAllProducts, searchProducts } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ProductCard } from "@/components/commerce/ProductCard";
import { SearchBar } from "@/components/navigation/SearchBar";

export const metadata: Metadata = {
  title: "Αναζήτηση | Pharmacy",
  description: "Αναζήτηση στον demo κατάλογο.",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: rawQ } = await searchParams;
  const q = (rawQ ?? "").trim();
  const results = q ? searchProducts(q) : getAllProducts();

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs items={[{ label: "Αρχική", href: "/" }, { label: "Αναζήτηση" }]} />
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        {q ? `Αποτελέσματα για «${q}»` : "Όλα τα προϊόντα"}
      </h1>
      <div className="max-w-xl">
        <SearchBar initial={q} />
      </div>
      <p aria-live="polite" className="text-sm text-muted">
        {q && results.length === 0
          ? "Δεν βρέθηκαν προϊόντα (demo κατάλογος)."
          : `${results.length === 1 ? "1 προϊόν" : `${results.length} προϊόντα`} (demo κατάλογος)`}
      </p>
      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
