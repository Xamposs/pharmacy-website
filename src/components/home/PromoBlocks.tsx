import Link from "next/link";

const blocks = [
  {
    title: "Καλοκαιρινή ρουτίνα",
    text: "Αντηλιακά, after sun και ενυδάτωση για τις διακοπές.",
    href: "/category/antiliaka",
    cta: "Ετοιμαστείτε",
    tone: "from-sky-100 to-surface",
  },
  {
    title: "Φροντίδα μαλλιών",
    text: "Σαμπουάν, μάσκες και έλαια για υγιή, λαμπερά μαλλιά.",
    href: "/category/mallia",
    cta: "Δείτε περισσότερα",
    tone: "from-emerald-100 to-surface",
  },
];

/** Original neutral seasonal promo blocks (not reference banners). */
export function PromoBlocks() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {blocks.map((b) => (
        <section key={b.title} aria-label={b.title} className={`flex flex-col justify-center rounded-2xl bg-gradient-to-br p-6 shadow-card ring-1 ring-border sm:p-8 ${b.tone}`}>
          <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{b.title}</h2>
          <p className="mt-1 max-w-md text-sm text-muted">{b.text}</p>
          <Link
            href={b.href}
            className="mt-3 inline-flex h-10 w-fit items-center rounded-lg bg-ink px-5 text-sm font-bold text-white hover:bg-primary"
          >
            {b.cta}
          </Link>
        </section>
      ))}
    </div>
  );
}
