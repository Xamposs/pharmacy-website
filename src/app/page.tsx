import { BrandStrip } from "@/components/home/BrandStrip";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductSlider } from "@/components/home/ProductSlider";
import { PromoBlocks } from "@/components/home/PromoBlocks";
import { Newsletter } from "@/components/layout/Newsletter";
import { TrustBar } from "@/components/layout/TrustBar";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getNew, getOffers, getPopular } from "@/lib/catalog";

export default function HomePage() {
  const offers = getOffers(8);
  const popular = getPopular(8);
  const fresh = getNew(8);

  return (
    <div className="flex flex-col gap-10">
      <HeroCarousel />

      <section aria-label="Κατηγορίες">
        <SectionHeading title="Κατηγορίες" actionLabel="Όλες οι κατηγορίες" actionHref="/categories" />
        <CategoryTiles />
      </section>

      <ProductSlider
        id="prosfores"
        title="Προσφορές"
        products={offers}
        actionLabel="Δείτε τα όλα"
        actionHref="/offers"
      />

      <BrandStrip />

      <ProductSlider title="Δημοφιλή προϊόντα" products={popular} />

      <PromoBlocks />

      {fresh.length > 0 ? <ProductSlider title="Νέες αφίξεις" products={fresh} /> : null}

      <TrustBar />
      <Newsletter />
    </div>
  );
}
