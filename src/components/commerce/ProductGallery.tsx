"use client";

import { useState } from "react";
import { ProductImage } from "@/components/commerce/ProductImage";

interface ProductGalleryProps {
  brandName: string;
  productName: string;
}

/** Placeholder gallery: main visual + selectable thumbnails (consistent sizing). */
export function ProductGallery({ brandName, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const thumbs = [0, 1, 2, 3];

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl bg-surface p-4 shadow-card ring-1 ring-border">
        <ProductImage brandName={brandName} productName={`${productName} — εικόνα ${active + 1}`} size="large" />
      </div>
      <div className="grid grid-cols-4 gap-2" role="tablist" aria-label="Εικόνες προϊόντος (demo)">
        {thumbs.map((i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Εμφάνιση εικόνας ${i + 1}`}
            onClick={() => setActive(i)}
            className={`rounded-xl bg-surface p-1.5 shadow-card ring-2 transition ${
              i === active ? "ring-primary" : "ring-border hover:ring-faint"
            }`}
          >
            <ProductImage brandName={brandName} productName={productName} size="thumb" />
          </button>
        ))}
      </div>
    </div>
  );
}
