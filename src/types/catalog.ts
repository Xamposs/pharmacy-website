/** Core catalog types. Mock-data only in Phase 1 (no backend). */

export type Availability = "in_stock" | "low_stock" | "out_of_stock";

export interface Category {
  slug: string;
  name: string;
  description: string;
  parentSlug?: string;
}

export interface Brand {
  slug: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brandSlug: string;
  categorySlugs: string[];
  /** Current selling price in EUR. */
  price: number;
  /** Original price when discounted (EUR). Omit when not on offer. */
  originalPrice?: number;
  availability: Availability;
  shortDescription: string;
  description: string;
  usage: string;
  /** Demo-only identifier (NOT a real SKU/EAN). */
  demoCode: string;
  rating?: number;
  reviewCount?: number;
  badges?: Array<"hot" | "gift" | "top" | "new" | "offer">;
  sizeLabel: string;
}

export interface CartLine {
  productSlug: string;
  qty: number;
}
