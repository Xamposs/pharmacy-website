import Link from "next/link";
import { brands } from "@/data/taxonomy";

export function BrandStrip() {
  return (
    <section aria-label="Επιλεγμένα brands" className="rounded-2xl bg-primary-ink px-6 py-6 text-white">
      <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {brands.map((b) => (
          <li key={b.slug}>
            <Link href={`/brands/${b.slug}`} className="text-lg font-extrabold tracking-wide text-white/80 hover:text-white hover:underline">
              {b.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
