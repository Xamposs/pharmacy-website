import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrand } from "@/data/taxonomy";
import { getProductsByBrand } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ProductCard } from "@/components/commerce/ProductCard";

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
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{brand.name}</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-600">{brand.description}</p>
      </div>
      {products.length === 0 ? (
        <p className="rounded-xl bg-neutral-50 p-8 text-center text-sm text-neutral-500 ring-1 ring-neutral-200">
          Δεν υπάρχουν demo προϊόντα για αυτή τη μάρκα ακόμη.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
