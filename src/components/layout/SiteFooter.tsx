import Link from "next/link";
import { brands, getTopLevelCategories } from "@/data/taxonomy";

const serviceLinks = [
  "Εξυπηρέτηση πελατών",
  "Τρόποι αποστολής",
  "Τρόποι πληρωμής",
  "Επιστροφές",
  "Όροι χρήσης",
  "Πολιτική απορρήτου",
  "Cookies",
  "Επικοινωνία",
];

const socials = ["Facebook", "Instagram", "YouTube", "TikTok"];
const paymentMarks = ["VISA", "Mastercard", "PayPal", "Αντικαταβολή", "Κατάθεση"];
const courierMarks = ["ACS", "ELTA", "Box Now", "Γενική Ταχυδρομική"];

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-xl bg-surface px-4 py-3 shadow-card ring-1 ring-border lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0" open={false}>
      <summary className="cursor-pointer list-none text-sm font-extrabold uppercase tracking-wide text-ink [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          {title}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="transition-transform group-open:rotate-180 lg:hidden">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </summary>
      <div className="footer-col-body mt-3">{children}</div>
    </details>
  );
}

export function SiteFooter() {
  const categories = getTopLevelCategories();
  return (
    <footer className="mt-12 bg-surface text-muted ring-1 ring-border">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-10">
        <FooterColumn title="Εξυπηρέτηση πελατών">
          <ul className="space-y-1.5 text-sm">
            {serviceLinks.map((l) => (
              <li key={l}>
                <span className="cursor-default hover:text-ink hover:underline">{l}</span>
              </li>
            ))}
          </ul>
        </FooterColumn>
        <FooterColumn title="Κατηγορίες">
          <ul className="space-y-1.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-ink hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/categories" className="font-semibold text-primary hover:underline">
                Όλες οι κατηγορίες
              </Link>
            </li>
          </ul>
        </FooterColumn>
        <FooterColumn title="Brands">
          <ul className="space-y-1.5 text-sm">
            {brands.map((b) => (
              <li key={b.slug}>
                <Link href={`/brands/${b.slug}`} className="hover:text-ink hover:underline">
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>
        <div className="rounded-xl bg-surface px-4 py-3 shadow-card ring-1 ring-border lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">Επικοινωνία</h2>
          <p className="mt-3 text-2xl font-extrabold text-primary">
            <a href="tel:+302107001375" className="hover:underline">210 700 1375</a>
          </p>
          <p className="mt-1 text-xs">Δευ–Παρ 09:30–17:00 (demo)</p>
          <h3 className="mt-4 text-xs font-bold uppercase tracking-wide text-ink">Ακολουθήστε μας</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {socials.map((s) => (
              <li key={s}>
                <span
                  title={`${s} (σύντομα)`}
                  className="inline-block cursor-default rounded-full bg-background px-2.5 py-1 text-xs font-semibold ring-1 ring-border"
                >
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-ink">Τρόποι πληρωμής (demo)</h2>
            <ul className="mt-1.5 flex flex-wrap gap-1.5" aria-label="Αποδεκτοί τρόποι πληρωμής">
              {paymentMarks.map((m) => (
                <li key={m} className="rounded-md bg-background px-2 py-1 text-[11px] font-bold ring-1 ring-border">
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-ink">Συνεργαζόμενες μεταφορικές (demo)</h2>
            <ul className="mt-1.5 flex flex-wrap gap-1.5" aria-label="Μεταφορικές">
              {courierMarks.map((m) => (
                <li key={m} className="rounded-md bg-background px-2 py-1 text-[11px] font-bold ring-1 ring-border">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 px-4 py-4 text-xs text-faint sm:flex-row">
          <p>© 2026 Pharmacy (demo). Με επιφύλαξη παντός δικαιώματος.</p>
          <p>Καθαρή υλοποίηση — καμία σύνδεση με πραγματικά καταστήματα.</p>
        </div>
      </div>
    </footer>
  );
}
