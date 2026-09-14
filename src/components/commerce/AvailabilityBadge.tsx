import type { Availability } from "@/types/catalog";

const labels: Record<Availability, { text: string; className: string }> = {
  in_stock: { text: "Άμεσα διαθέσιμο", className: "bg-success-soft text-success ring-success/30" },
  low_stock: { text: "Τελευταία τεμάχια", className: "bg-warning-soft text-warning ring-warning/30" },
  out_of_stock: { text: "Μη διαθέσιμο", className: "bg-background text-muted ring-border" },
};

export function AvailabilityBadge({ availability }: { availability: Availability }) {
  const { text, className } = labels[availability];
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {text}
    </span>
  );
}
