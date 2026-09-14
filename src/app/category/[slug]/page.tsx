import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, getSubcategories } from "@/data/taxonomy";
import { getProductsByCategory } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { CategoryView } from "@/components/commerce/CategoryView";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return {
    title: category ? `${category.name} | Pharmacy` : "Κατηγορία | Pharmacy",
    description: category?.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const subcategories = getSubcategories(category.slug);
  const products = getProductsByCategory(category.slug);

  const parent = category.parentSlug ? getCategory(category.parentSlug) : undefined;

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs
        items={[
          { label: "Αρχική", href: "/" },
          { label: "Κατηγορίες", href: "/categories" },
          ...(parent ? [{ label: parent.name, href: `/category/${parent.slug}` }] : []),
          { label: category.name },
        ]}
      />
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{category.name}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{category.description}</p>
      </div>
      <CategoryView products={products} subcategories={subcategories} />
    </div>
  );
}
