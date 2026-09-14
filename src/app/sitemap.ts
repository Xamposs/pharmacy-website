import type { MetadataRoute } from "next";
import { brands, categories } from "@/data/taxonomy";
import { products } from "@/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Sitemap over local mock routes only — no third-party references. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/categories", "/brands", "/offers", "/favorites", "/cart", "/search"].map(
    (route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.6,
    }),
  );
  return [
    ...staticRoutes,
    ...categories.map((c) => ({
      url: `${siteUrl}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...brands.map((b) => ({
      url: `${siteUrl}/brands/${b.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${siteUrl}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
