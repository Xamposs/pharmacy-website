import type { Metadata } from "next";
import Link from "next/link";
import { getSubcategories, getTopLevelCategories } from "@/data/taxonomy";
import { getProductsByCategory } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";

export const metadata: Metadata = {
  title: "Κατηγορίες | Pharmacy",
  description: "Πλήρης ιεραρχία κατηγοριών του demo φαρμακείου.",
};

export default function CategoriesPage() {
  const top = getTopLevelCategories();
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Αρχική", href: "/" }, { label: "Κατηγορίες" }]} />
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Κατηγορίες</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Περιηγηθείτε σε όλες τις κατηγορίες και υποκατηγορίες του καταστήματος.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {top.map((c) => {
          const subs = getSubcategories(c.slug);
          const count = getProductsByCategory(c.slug).length;
          return (
            <section key={c.slug} aria-label={c.name} className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-border">
              <Link href={`/category/${c.slug}`} className="flex items-center gap-3 hover:underline">
                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-lg font-extrabold text-primary">
                  {c.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-base font-extrabold">{c.name}</span>
                  <span className="block text-xs text-muted">
                    {count === 1 ? "1 προϊόν" : `${count} προϊόντα`}
                  </span>
                </span>
              </Link>
              <p className="mt-2 text-sm text-muted">{c.description}</p>
              {subs.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {subs.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/category/${s.slug}`}
                        className="inline-block rounded-full bg-background px-3 py-1.5 text-xs font-semibold ring-1 ring-border hover:ring-primary hover:text-primary"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
