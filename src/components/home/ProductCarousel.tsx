import type { Product } from "@/types/catalog";
import { ProductCard } from "@/components/commerce/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";

interface ProductCarouselProps {
  title: string;
  products: Product[];
  actionLabel?: string;
  actionHref?: string;
  id?: string;
}

export function ProductCarousel({ title, products, actionLabel, actionHref, id }: ProductCarouselProps) {
  if (products.length === 0) return null;
  return (
    <section aria-label={title} id={id} className="scroll-mt-24">
      <SectionHeading title={title} actionLabel={actionLabel} actionHref={actionHref} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
