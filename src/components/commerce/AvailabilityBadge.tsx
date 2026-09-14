import type { Availability } from "@/types/catalog";

const labels: Record<Availability, { text: string; className: string }> = {
  in_stock: { text: "Άμεσα διαθέσιμο", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  low_stock: { text: "Τελευταία τεμάχια", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  out_of_stock: { text: "Μη διαθέσιμο", className: "bg-neutral-100 text-neutral-500 ring-neutral-200" },
};

export function AvailabilityBadge({ availability }: { availability: Availability }) {
  const { text, className } = labels[availability];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {text}
    </span>
  );
}
