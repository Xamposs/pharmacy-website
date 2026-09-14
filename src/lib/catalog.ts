import { getBrand, getCategory } from "@/data/taxonomy";
import { products } from "@/data/products";
import type { Product } from "@/types/catalog";

export function getAllProducts(): Product[] {
  return products;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlugs.includes(categorySlug));
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return products.filter((p) => p.brandSlug === brandSlug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const scored = products
    .filter((p) => p.slug !== product.slug)
    .map((p) => {
      let score = 0;
      if (p.brandSlug === product.brandSlug) score += 2;
      if (p.categorySlugs.some((c) => product.categorySlugs.includes(c))) score += 3;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name, "el"));
  return scored.slice(0, limit).map((s) => s.p);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) => {
    const brand = getBrand(p.brandSlug)?.name.toLowerCase() ?? "";
    const cats = p.categorySlugs
      .map((c) => getCategory(c)?.name.toLowerCase() ?? "")
      .join(" ");
    return (
      p.name.toLowerCase().includes(q) ||
      brand.includes(q) ||
      cats.includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
    );
  });
}

export function getOffers(limit = 8): Product[] {
  return products.filter((p) => p.originalPrice !== undefined).slice(0, limit);
}

export function getPopular(limit = 8): Product[] {
  return [...products]
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, limit);
}

export function getNew(limit = 8): Product[] {
  return products.filter((p) => p.badges?.includes("new")).slice(0, limit);
}

/** Format EUR prices the Greek way: 14,90 € */
export function formatPrice(value: number): string {
  return `${value.toFixed(2).replace(".", ",")} €`;
}

export function discountPercent(p: Product): number | null {
  if (p.originalPrice === undefined || p.originalPrice <= p.price) return null;
  return Math.round((1 - p.price / p.originalPrice) * 100);
}
