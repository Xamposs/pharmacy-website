export function TopBar() {
  return (
    <div className="bg-primary-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-1.5 text-center text-[11px] sm:justify-between sm:text-xs">
        <p className="font-medium">Δωρεάν μεταφορικά για παραγγελίες άνω των 65,00 €</p>
        <p className="hidden items-center gap-4 sm:flex">
          <span>
            Τηλεφωνικές παραγγελίες:{" "}
            <a href="tel:+302107001375" className="font-bold hover:underline">210 700 1375</a>
          </span>
          <span className="text-white/60">Βοήθεια / Επικοινωνία</span>
        </p>
      </div>
    </div>
  );
}
