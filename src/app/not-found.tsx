import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <p aria-hidden="true" className="text-6xl font-extrabold text-neutral-200">404</p>
      <h1 className="text-xl font-extrabold">Η σελίδα δεν βρέθηκε</h1>
      <p className="text-sm text-neutral-500">
        Ο σύνδεσμος μπορεί να είναι λανθασμένος ή η σελίδα demo να μην υπάρχει ακόμη.
      </p>
      <Link href="/" className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-neutral-700">
        Επιστροφή στην αρχική
      </Link>
    </div>
  );
}
