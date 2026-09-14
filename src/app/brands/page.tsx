import type { Metadata } from "next";
import Link from "next/link";
import { brands } from "@/data/taxonomy";
import { getProductsByBrand } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";

export const metadata: Metadata = {
  title: "Brands | Pharmacy",
  description: "Όλες οι demo μάρκες του καταστήματος.",
};

export default function BrandsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs items={[{ label: "Αρχική", href: "/" }, { label: "Brands" }]} />
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Brands</h1>
      <p className="max-w-2xl text-sm text-neutral-600">
        Demo μάρκες για ανάπτυξη διεπαφής. Ο πραγματικός κατάλογος θα προέλθει από ERP/προμηθευτές.
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {brands.map((b) => {
          const count = getProductsByBrand(b.slug).length;
          return (
            <li key={b.slug}>
              <Link
                href={`/brands/${b.slug}`}
                className="block rounded-xl bg-neutral-50 p-5 ring-1 ring-neutral-200 hover:shadow-md"
              >
                <span className="block text-lg font-extrabold">{b.name}</span>
                <span className="mt-1 block text-sm text-neutral-500">
                  {count === 1 ? "1 προϊόν" : `${count} προϊόντα`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
