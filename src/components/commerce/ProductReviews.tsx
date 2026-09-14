import type { Product } from "@/types/catalog";
import { RatingStars } from "@/components/commerce/RatingStars";

const DEMO_REVIEWS = [
  {
    name: "Μαρία Κ.",
    date: "12/05/2026",
    rating: 5,
    text: "Πολύ καλό προϊόν για την τιμή του. Γρήγορη αποστολή και προσεγμένη συσκευασία.",
  },
  {
    name: "Γιώργος Π.",
    date: "28/04/2026",
    rating: 4,
    text: "Ικανοποιημένος συνολικά. Θα ήθελα μεγαλύτερη συσκευασία.",
  },
];

/** Generic demo reviews (clearly marked) — no medical claims. */
export function ProductReviews({ product }: { product: Product }) {
  if (product.rating === undefined) return null;
  return (
    <section aria-labelledby="reviews-title" className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-border sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="reviews-title" className="text-xl font-extrabold">Αξιολογήσεις</h2>
        <span className="text-xs text-faint">Demo αξιολογήσεις για λόγους σχεδίασης</span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-4xl font-extrabold">{product.rating.toFixed(1)}</span>
        <div>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          <p className="mt-0.5 text-xs text-muted">Βάσει {product.reviewCount ?? 0} demo αξιολογήσεων</p>
        </div>
      </div>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {DEMO_REVIEWS.map((r) => (
          <li key={r.name} className="rounded-xl bg-background p-4 ring-1 ring-border">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold">{r.name}</span>
              <span className="text-xs text-faint">{r.date}</span>
            </div>
            <div className="mt-1">
              <RatingStars rating={r.rating} />
            </div>
            <p className="mt-1.5 text-sm text-muted">{r.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
