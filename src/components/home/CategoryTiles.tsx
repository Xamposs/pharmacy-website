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
          className="group rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200 transition-shadow hover:shadow-md"
        >
          <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-extrabold text-sky-700 ring-1 ring-neutral-200">
            {c.name.charAt(0)}
          </span>
          <span className="mt-2 block text-sm font-bold text-neutral-900 group-hover:underline">
            {c.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
