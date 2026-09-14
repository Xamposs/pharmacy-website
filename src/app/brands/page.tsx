import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BrandsIndex } from "@/components/brands/BrandsIndex";

export const metadata: Metadata = {
  title: "Brands | Pharmacy",
  description: "Όλες οι demo μάρκες του καταστήματος, με αναζήτηση και ομαδοποίηση.",
};

export default function BrandsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs items={[{ label: "Αρχική", href: "/" }, { label: "Brands" }]} />
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Brands</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Demo μάρκες για ανάπτυξη διεπαφής. Ο πραγματικός κατάλογος θα προέλθει από ERP/προμηθευτές.
        </p>
      </div>
      <BrandsIndex />
    </div>
  );
}
