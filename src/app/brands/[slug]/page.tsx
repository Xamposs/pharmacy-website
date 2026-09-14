import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrand } from "@/data/taxonomy";
import { getProductsByBrand } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BrandProducts } from "@/components/brands/BrandProducts";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  return {
    title: brand ? `${brand.name} | Pharmacy` : "Brand | Pharmacy",
    description: brand?.description,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();
  const products = getProductsByBrand(brand.slug);

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs
        items={[
          { label: "Αρχική", href: "/" },
          { label: "Brands", href: "/brands" },
          { label: brand.name },
        ]}
      />
      <div className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-border">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{brand.name}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{brand.description}</p>
        <p className="mt-2 text-sm font-semibold text-primary" aria-live="polite">
          {products.length === 1 ? "1 demo προϊόν" : `${products.length} demo προϊόντα`}
        </p>
      </div>
      {products.length === 0 ? (
        <p className="rounded-xl bg-surface p-8 text-center text-sm text-muted shadow-card ring-1 ring-border">
          Δεν υπάρχουν demo προϊόντα για αυτή τη μάρκα ακόμη.
        </p>
      ) : (
        <BrandProducts products={products} />
      )}
    </div>
  );
}
