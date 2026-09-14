"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section aria-labelledby="newsletter-title" className="rounded-2xl bg-primary-ink px-6 py-8 text-white">
      <h2 id="newsletter-title" className="text-lg font-extrabold">
        Εγγραφείτε στο newsletter μας
      </h2>
      <p className="mt-1 text-sm text-white/70">
        Νέα προϊόντα και προσφορές (demo — δεν αποστέλλεται τίποτα).
      </p>
      {done ? (
        <p role="status" className="mt-4 rounded-lg bg-success-soft px-3 py-2 text-sm font-semibold text-success">
          Ευχαριστούμε για την εγγραφή (demo)!
        </p>
      ) : (
        <form
          className="mt-4 flex max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setDone(true);
          }}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Διεύθυνση email
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Το email σας"
            className="h-11 w-full rounded-lg bg-white px-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button type="submit" className="h-11 shrink-0 rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-primary-hover">
            Εγγραφή
          </button>
        </form>
      )}
    </section>
  );
}
