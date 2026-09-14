import Link from "next/link";
import { getTopLevelCategories } from "@/data/taxonomy";

export function CategoryTiles() {
  const categories = getTopLevelCategories();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          className="group rounded-xl bg-surface p-4 shadow-card ring-1 ring-border transition-shadow hover:shadow-pop"
        >
          <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-xl font-extrabold text-primary ring-1 ring-border">
            {c.name.charAt(0)}
          </span>
          <span className="mt-2 block text-sm font-bold text-ink group-hover:text-primary group-hover:underline">
            {c.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
