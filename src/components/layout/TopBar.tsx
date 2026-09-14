export function TopBar() {
  return (
    <div className="bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-center text-[11px] sm:justify-between sm:text-xs">
        <p className="font-medium">Δωρεάν αποστολή για παραγγελίες άνω των 65,00 € (demo)</p>
        <p className="hidden sm:block">
          Τηλεφωνικές παραγγελίες:{" "}
          <a href="tel:+302107001375" className="font-bold hover:underline">210 700 1375</a>
        </p>
      </div>
    </div>
  );
}
