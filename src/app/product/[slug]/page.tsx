import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand } from "@/data/taxonomy";
import { getProduct, getRelatedProducts } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BuyBox } from "@/components/commerce/BuyBox";
import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductImage } from "@/components/commerce/ProductImage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return {
    title: product ? `${product.name} | Pharmacy` : "Προϊόν | Pharmacy",
    description: product?.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const brand = getBrand(product.brandSlug);
  const related = getRelatedProducts(product, 4);

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { label: "Αρχική", href: "/" },
          ...(brand ? [{ label: brand.name, href: `/brands/${brand.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <ProductImage brandName={brand?.name ?? "?"} productName={product.name} size="large" />
          <div className="grid grid-cols-4 gap-2" aria-label="Μικρογραφίες προϊόντος (demo)">
            {[0, 1, 2, 3].map((i) => (
              <ProductImage key={i} brandName={brand?.name ?? "?"} productName={product.name} size="thumb" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {brand ? (
            <Link href={`/brands/${brand.slug}`} className="text-sm font-bold uppercase tracking-wide text-sky-700 hover:underline">
              {brand.name}
            </Link>
          ) : null}
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{product.name}</h1>
          <p className="text-sm text-neutral-500">
            Κωδικός demo: <span className="font-mono font-semibold">{product.demoCode}</span>
            {" · "}
            {product.sizeLabel}
          </p>
          <p className="text-sm text-neutral-600">{product.shortDescription}</p>
          <BuyBox product={product} />

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-neutral-50 p-3 text-sm ring-1 ring-neutral-200">
              <p className="font-bold">Τρόποι αποστολής (demo)</p>
              <p className="mt-0.5 text-neutral-600">Παράδοση σε 1–3 εργάσιμες · δωρεάν άνω των 65 €.</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 text-sm ring-1 ring-neutral-200">
              <p className="font-bold">Τρόποι πληρωμής (demo)</p>
              <p className="mt-0.5 text-neutral-600">Κάρτα, τραπεζική κατάθεση, αντικαταβολή.</p>
            </div>
          </div>
        </div>
      </div>

      <section aria-label="Περιγραφή προϊόντος" className="grid gap-4 lg:grid-cols-3">
        <details open className="rounded-xl ring-1 ring-neutral-200">
          <summary className="cursor-pointer px-4 py-3 font-bold">Περιγραφή</summary>
          <p className="border-t border-neutral-200 px-4 py-3 text-sm leading-relaxed text-neutral-700">{product.description}</p>
        </details>
        <details className="rounded-xl ring-1 ring-neutral-200">
          <summary className="cursor-pointer px-4 py-3 font-bold">Χρήση</summary>
          <p className="border-t border-neutral-200 px-4 py-3 text-sm leading-relaxed text-neutral-700">{product.usage}</p>
        </details>
        <details className="rounded-xl ring-1 ring-neutral-200">
          <summary className="cursor-pointer px-4 py-3 font-bold">Συστατικά / Λεπτομέρειες (demo)</summary>
          <p className="border-t border-neutral-200 px-4 py-3 text-sm leading-relaxed text-neutral-700">
            Ενδεικτική demo σύνθεση για {product.sizeLabel}. Οι πραγματικές πληροφορίες θα
            προέρχονται από τον παραγωγό / ERP σε επόμενη φάση.
          </p>
        </details>
      </section>

      {related.length > 0 ? (
        <section aria-label="Σχετικά προϊόντα">
          <h2 className="mb-4 text-xl font-extrabold">Σχετικά προϊόντα</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
