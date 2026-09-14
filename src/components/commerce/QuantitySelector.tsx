"use client";

interface QuantitySelectorProps {
  qty: number;
  onChange: (qty: number) => void;
}

export function QuantitySelector({ qty, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-lg ring-1 ring-neutral-300">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, qty - 1))}
        disabled={qty <= 1}
        aria-label="Μείωση ποσότητας"
        className="px-3 py-2 text-lg font-bold text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
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
        className="px-3 py-2 text-lg font-bold text-neutral-700 hover:bg-neutral-100"
      >
        +
      </button>
    </div>
  );
}
