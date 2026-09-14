"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Slide {
  kicker: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  tone: string;
}

const slides: Slide[] = [
  {
    kicker: "Αντηλιακή προστασία",
    title: "Έτοιμοι για τον ήλιο",
    text: "Αντηλιακά προσώπου και σώματος για όλη την οικογένεια (demo καμπάνια).",
    href: "/category/antiliaka",
    cta: "Δείτε τα αντηλιακά",
    tone: "from-amber-100 via-surface to-sky-100",
  },
  {
    kicker: "Περιποίηση προσώπου",
    title: "Καθημερινή φροντίδα",
    text: "Καθαρισμός, ενυδάτωση και οροί για κάθε τύπο δέρματος.",
    href: "/category/prosopo",
    cta: "Αγορά τώρα",
    tone: "from-primary-soft via-surface to-accent-soft",
  },
  {
    kicker: "Βιταμίνες & ευεξία",
    title: "Ενέργεια κάθε μέρα",
    text: "Βιταμίνες και συμπληρώματα για τόνωση και ανοσοποιητικό.",
    href: "/category/vitamines",
    cta: "Ανακαλύψτε τα",
    tone: "from-emerald-100 via-surface to-teal-100",
  },
];

const AUTOPLAY_MS = 6000;

/** Commercial hero carousel: autoplay with pause, dots, arrows, reduced-motion safe. */
export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((i: number) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const slide = slides[index] as Slide;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Προτεινόμενες καμπάνιες"
      className="overflow-hidden rounded-2xl bg-gradient-to-br shadow-card ring-1 ring-border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className={`flex min-h-56 flex-col justify-center gap-2 bg-gradient-to-br p-6 sm:min-h-64 sm:p-10 ${slide.tone}`}>
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{slide.kicker}</p>
        <h2 className="max-w-lg text-2xl font-extrabold tracking-tight sm:text-4xl">{slide.title}</h2>
        <p className="max-w-md text-sm text-muted sm:text-base">{slide.text}</p>
        <Link
          href={slide.href}
          className="mt-2 inline-flex h-11 w-fit items-center rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary-hover"
        >
          {slide.cta}
        </Link>
      </div>
      <div className="flex items-center justify-between bg-surface px-4 py-2.5">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Προηγούμενη καμπάνια"
          className="rounded-full p-2 text-muted ring-1 ring-border hover:text-ink hover:ring-primary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
        <div className="flex gap-2" role="tablist" aria-label="Επιλογή καμπάνιας">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Καμπάνια ${i + 1}: ${s.title}`}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-2 bg-border hover:bg-faint"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Επόμενη καμπάνια"
          className="rounded-full p-2 text-muted ring-1 ring-border hover:text-ink hover:ring-primary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
