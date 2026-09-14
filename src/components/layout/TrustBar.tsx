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
        <div key={b.title} className="rounded-xl bg-surface p-4 text-center shadow-card ring-1 ring-border">
          <p className="text-sm font-extrabold text-ink">{b.title}</p>
          <p className="mt-0.5 text-xs text-muted">{b.text}</p>
        </div>
      ))}
    </section>
  );
}
