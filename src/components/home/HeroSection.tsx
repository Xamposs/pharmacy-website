import Link from "next/link";

const slides = [
  {
    kicker: "Νέες αφίξεις",
    title: "Φροντίδα προσώπου για κάθε ημέρα",
    text: "Ανακαλύψτε τη demo συλλογή περιποίησης με ενυδατικές υφές.",
    href: "/category/prosopo",
    cta: "Αγορά τώρα",
    tone: "from-sky-100 via-white to-emerald-50",
  },
  {
    kicker: "Προσφορές",
    title: "Έως −25% σε επιλεγμένα αντηλιακά",
    text: "Demo προσφορές γνωριμίας σε όλη τη σειρά SolCare.",
    href: "/category/antiliaka",
    cta: "Δείτε τις προσφορές",
    tone: "from-amber-100 via-white to-sky-50",
  },
];

export function HeroSection() {
  return (
    <section aria-label="Προτεινόμενες προσφορές" className="grid gap-4 lg:grid-cols-2">
      {slides.map((s) => (
        <div key={s.title} className={`flex flex-col justify-center rounded-2xl bg-gradient-to-br p-6 sm:p-8 ${s.tone} ring-1 ring-neutral-200`}>
          <p className="text-xs font-bold uppercase tracking-widest text-sky-700">{s.kicker}</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
            {s.title}
          </h2>
          <p className="mt-2 max-w-md text-sm text-neutral-600">{s.text}</p>
          <Link
            href={s.href}
            className="mt-4 inline-flex w-fit items-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-neutral-700"
          >
            {s.cta}
          </Link>
        </div>
      ))}
    </section>
  );
}
