interface ProductImageProps {
  brandName: string;
  productName: string;
  size?: "card" | "large" | "thumb";
}

/**
 * Local neutral placeholder visual (no third-party images).
 * Replaced by real product media in a later phase.
 */
export function ProductImage({ brandName, productName, size = "card" }: ProductImageProps) {
  const initial = (brandName.charAt(0) || "Φ").toUpperCase();
  const dims =
    size === "large"
      ? "aspect-square text-7xl"
      : size === "thumb"
        ? "aspect-square text-xl"
        : "aspect-square text-5xl";
  return (
    <div
      role="img"
      aria-label={`Εικόνα προϊόντος: ${productName}`}
      className={`flex w-full ${dims} items-center justify-center rounded-xl bg-gradient-to-br from-primary-soft via-surface to-accent-soft font-extrabold text-primary/25 ring-1 ring-inset ring-border`}
    >
      <span aria-hidden="true">{initial}</span>
    </div>
  );
}
