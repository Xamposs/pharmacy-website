import { BrandStrip } from "@/components/home/BrandStrip";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Newsletter } from "@/components/layout/Newsletter";
import { TrustBar } from "@/components/layout/TrustBar";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getNew, getOffers, getPopular } from "@/lib/catalog";

export default function HomePage() {
  const offers = getOffers(4);
  const popular = getPopular(8);
  const fresh = getNew(4);

  return (
    <div className="flex flex-col gap-10">
      <HeroSection />

      <section aria-label="Κατηγορίες">
        <SectionHeading title="Κατηγορίες" />
        <CategoryTiles />
      </section>

      <ProductCarousel
        id="prosfores"
        title="Προσφορές"
        products={offers}
        actionLabel="Δείτε τα όλα"
        actionHref="/search?q="
      />

      <BrandStrip />

      <ProductCarousel title="Δημοφιλή προϊόντα" products={popular} />

      {fresh.length > 0 ? <ProductCarousel title="Νέα προϊόντα" products={fresh} /> : null}

      <TrustBar />
      <Newsletter />
    </div>
  );
}
