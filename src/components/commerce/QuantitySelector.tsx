"use client";

interface QuantitySelectorProps {
  qty: number;
  onChange: (qty: number) => void;
}

export function QuantitySelector({ qty, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex h-11 items-center rounded-lg bg-surface ring-1 ring-border">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, qty - 1))}
        disabled={qty <= 1}
        aria-label="Μείωση ποσότητας"
        className="h-full px-3 text-lg font-bold text-ink hover:bg-background disabled:opacity-40"
      >
        −
      </button>
      <span aria-live="polite" aria-label={`Ποσότητα ${qty}`} className="w-8 text-center text-sm font-bold">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(99, qty + 1))}
        aria-label="Αύξηση ποσότητας"
        className="h-full px-3 text-lg font-bold text-ink hover:bg-background"
      >
        +
      </button>
    </div>
  );
}
