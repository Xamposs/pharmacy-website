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
      className={`flex w-full ${dims} items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 via-white to-emerald-50 font-extrabold text-sky-900/30 ring-1 ring-inset ring-neutral-200`}
    >
      <span aria-hidden="true">{initial}</span>
    </div>
  );
}
