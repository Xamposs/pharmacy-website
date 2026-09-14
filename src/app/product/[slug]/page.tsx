import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand, getCategory } from "@/data/taxonomy";
import { getProduct, getProductsByCategory, getRelatedProducts } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BuyBox } from "@/components/commerce/BuyBox";
import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { ProductReviews } from "@/components/commerce/ProductReviews";
import { RatingStars } from "@/components/commerce/RatingStars";
import { AvailabilityBadge } from "@/components/commerce/AvailabilityBadge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Προϊόν | Pharmacy" };
  return {
    title: `${product.name} | Pharmacy`,
    description: `${product.shortDescription} Τιμή ${product.price.toFixed(2).replace(".", ",")} €. Demo κατάλογος.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const brand = getBrand(product.brandSlug);
  const primaryCategory = product.categorySlugs.map((s) => getCategory(s)).find(Boolean);
  const related = getRelatedProducts(product, 4);
  const inCategory = primaryCategory
    ? getProductsByCategory(primaryCategory.slug).filter((p) => p.slug !== product.slug).slice(0, 4)
    : [];

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
        <ProductGallery brandName={brand?.name ?? "?"} productName={product.name} />

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {brand ? (
              <Link href={`/brands/${brand.slug}`} className="text-sm font-bold uppercase tracking-wide text-accent hover:underline">
                {brand.name}
              </Link>
            ) : null}
            {(product.badges ?? []).slice(0, 2).map((b) => (
              <span key={b} className="rounded-md bg-ink px-1.5 py-0.5 text-[11px] font-bold text-white">
                {b === "top" ? "Top Seller" : b === "hot" ? "HOT" : b === "gift" ? "ΔΩΡΟ" : b === "new" ? "ΝΕΟ" : "Προσφορά"}
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span>
              Κωδικός demo: <span className="font-mono font-semibold text-ink">{product.demoCode}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.sizeLabel}</span>
          </div>
          {product.rating !== undefined ? (
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          ) : null}
          <p className="text-sm leading-relaxed text-muted">{product.shortDescription}</p>
          <BuyBox product={product} />

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-surface p-3 text-sm shadow-card ring-1 ring-border">
              <p className="font-bold">Τρόποι αποστολής (demo)</p>
              <p className="mt-0.5 text-muted">Παράδοση σε 1–3 εργάσιμες · δωρεάν άνω των 65 €.</p>
            </div>
            <div className="rounded-xl bg-surface p-3 text-sm shadow-card ring-1 ring-border">
              <p className="font-bold">Τρόποι πληρωμής (demo)</p>
              <p className="mt-0.5 text-muted">Κάρτα, τραπεζική κατάθεση, αντικαταβολή.</p>
            </div>
          </div>
          <AvailabilityBadge availability={product.availability} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section aria-labelledby="pdp-desc" className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-border">
          <h2 id="pdp-desc" className="text-lg font-extrabold">Περιγραφή</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{product.description}</p>
          <h3 className="mt-4 text-base font-bold">Χαρακτηριστικά</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
            <li>Συσκευασία: {product.sizeLabel}</li>
            <li>Κατασκευαστής (demo): {brand?.name ?? "—"}</li>
            {primaryCategory ? <li>Κατηγορία: {primaryCategory.name}</li> : null}
          </ul>
        </section>
        <section aria-labelledby="pdp-use" className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-border">
          <h2 id="pdp-use" className="text-lg font-extrabold">Χρήση</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{product.usage}</p>
          <h3 className="mt-4 text-base font-bold">Συστατικά / πληροφορίες (demo)</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Ενδεικτικές demo πληροφορίες. Οι πραγματικές πληροφορίες θα προέρχονται
            από τον παραγωγό / ERP σε επόμενη φάση.
          </p>
        </section>
      </div>

      <ProductReviews product={product} />

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

      {inCategory.length > 0 ? (
        <section aria-label={`Περισσότερα στην κατηγορία ${primaryCategory?.name ?? ""}`}>
          <h2 className="mb-4 text-xl font-extrabold">
            Περισσότερα στην κατηγορία{primaryCategory ? `: ${primaryCategory.name}` : ""}
          </h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {inCategory.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
