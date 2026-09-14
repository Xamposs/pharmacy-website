"use client";

import { useRef } from "react";
import type { Product } from "@/types/catalog";
import { ProductCard } from "@/components/commerce/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";

interface ProductSliderProps {
  title: string;
  products: Product[];
  actionLabel?: string;
  actionHref?: string;
  id?: string;
}

/** Horizontal scroll-snap product rail (arrows + native swipe). */
export function ProductSlider({ title, products, actionLabel, actionHref, id }: ProductSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  if (products.length === 0) return null;

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <section aria-label={title} id={id} className="scroll-mt-32">
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <SectionHeading title={title} actionLabel={actionLabel} actionHref={actionHref} />
        </div>
        <div className="mb-5 hidden shrink-0 gap-1.5 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={`Κύλιση ${title} προς τα πίσω`}
            className="rounded-full p-2 text-muted ring-1 ring-border hover:text-ink hover:ring-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="m15 6-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={`Κύλιση ${title} προς τα εμπρός`}
            className="rounded-full p-2 text-muted ring-1 ring-border hover:text-ink hover:ring-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1"
      >
        {products.map((p) => (
          <div key={p.slug} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
