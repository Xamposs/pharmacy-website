import Link from "next/link";
import { getTopLevelCategories } from "@/data/taxonomy";

export function SiteFooter() {
  const categories = getTopLevelCategories();
  return (
    <footer className="mt-12 bg-neutral-100 text-neutral-700">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <nav aria-label="Πληροφορίες">
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-neutral-900">Πληροφορίες</h2>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/search?q=" className="hover:underline">Επικοινωνία</Link></li>
            <li><Link href="/brands" className="hover:underline">Γιατί Pharmacy</Link></li>
            <li><Link href="/brands" className="hover:underline">Τα καταστήματά μας</Link></li>
          </ul>
        </nav>
        <nav aria-label="Κατηγορίες">
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-neutral-900">Κατηγορίες</h2>
          <ul className="space-y-1.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:underline">{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Τρόποι χρήσης">
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-neutral-900">Τρόποι χρήσης</h2>
          <ul className="space-y-1.5 text-sm">
            <li><span>Συχνές ερωτήσεις (FAQ)</span></li>
            <li><span>Τρόποι πληρωμής</span></li>
            <li><span>Τρόποι αποστολής</span></li>
            <li><span>Πολιτική επιστροφών</span></li>
            <li><span>Όροι χρήσης &amp; απορρήτου</span></li>
          </ul>
        </nav>
        <div>
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-neutral-900">Τηλεφωνικές παραγγελίες</h2>
          <p className="text-2xl font-extrabold text-sky-700">
            <a href="tel:+302107001375" className="hover:underline">210 700 1375</a>
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            Demo κατάστημα — τα στοιχεία είναι ενδεικτικά.
          </p>
        </div>
      </div>
      <div className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-neutral-500 sm:flex-row">
          <p>© 2026 Pharmacy (demo). Με επιφύλαξη παντός δικαιώματος.</p>
          <p>Καθαρή υλοποίηση — καμία σύνδεση με πραγματικά καταστήματα.</p>
        </div>
      </div>
    </footer>
  );
}
