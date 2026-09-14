interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
}

export function RatingStars({ rating, reviewCount }: RatingStarsProps) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`Αξιολόγηση ${rating} στα 5`}>
      <span aria-hidden="true" className="tracking-tight text-amber-400">
        {"★".repeat(full)}
        <span className="text-neutral-300">{"★".repeat(Math.max(0, 5 - full))}</span>
      </span>
      <span className="text-xs font-semibold text-neutral-700">{rating.toFixed(1)}</span>
      {reviewCount !== undefined ? (
        <span className="text-xs text-neutral-400">({reviewCount})</span>
      ) : null}
    </span>
  );
}
