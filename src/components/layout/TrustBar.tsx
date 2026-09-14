const benefits = [
  { title: "Δωρεάν αποστολή", text: "Για παραγγελίες άνω των 65,00 €" },
  { title: "Τηλεφωνική υποστήριξη", text: "Δευ–Παρ 09:30–17:00" },
  { title: "Ασφαλείς συναλλαγές", text: "Πολλαπλοί τρόποι πληρωμής" },
  { title: "Εύκολες επιστροφές", text: "Εντός 14 ημερών" },
];

export function TrustBar() {
  return (
    <section aria-label="Πλεονεκτήματα καταστήματος" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {benefits.map((b) => (
        <div key={b.title} className="rounded-xl bg-neutral-50 p-4 text-center ring-1 ring-neutral-200">
          <p className="text-sm font-extrabold text-neutral-900">{b.title}</p>
          <p className="mt-0.5 text-xs text-neutral-500">{b.text}</p>
        </div>
      ))}
    </section>
  );
}
