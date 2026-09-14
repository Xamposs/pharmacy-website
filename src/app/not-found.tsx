import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <p aria-hidden="true" className="text-6xl font-extrabold text-border">404</p>
      <h1 className="text-xl font-extrabold">Η σελίδα δεν βρέθηκε</h1>
      <p className="text-sm text-muted">
        Ο σύνδεσμος μπορεί να είναι λανθασμένος ή η σελίδα demo να μην υπάρχει ακόμη.
      </p>
      <Link href="/" className="h-11 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover">
        Επιστροφή στην αρχική
      </Link>
    </div>
  );
}
