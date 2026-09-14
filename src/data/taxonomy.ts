import type { Brand, Category } from "@/types/catalog";

/** Demo navigation taxonomy (our own structure, inspired by reference IA). */
export const categories: Category[] = [
  { slug: "prosopo", name: "Πρόσωπο", description: "Κρέμες, οροί, καθαρισμός και φροντίδα προσώπου για κάθε τύπο δέρματος." },
  { slug: "soma", name: "Σώμα", description: "Ενυδάτωση, καθαρισμός και φροντίδα σώματος." },
  { slug: "mallia", name: "Μαλλιά", description: "Σαμπουάν, μάσκες και θεραπείες για υγιή μαλλιά." },
  { slug: "antiliaka", name: "Αντηλιακά", description: "Αντηλιακή προστασία προσώπου και σώματος." },
  { slug: "vitamines", name: "Βιταμίνες & Συμπληρώματα", description: "Βιταμίνες, μέταλλα και συμπληρώματα διατροφής." },
  { slug: "mitera-paidi", name: "Μητέρα & Παιδί", description: "Βρεφική φροντίδα και προϊόντα για νέες μητέρες." },
  { slug: "farmakeio", name: "Φαρμακείο", description: "Είδη πρώτων βοηθειών και καθημερινής φροντίδας υγείας." },
  { slug: "prosopo-katharismos", name: "Καθαρισμός Προσώπου", description: "Aφροί, τζελ και γαλακτώματα καθαρισμού.", parentSlug: "prosopo" },
  { slug: "prosopo-ensydatosi", name: "Ενυδάτωση Προσώπου", description: "Ενυδατικές κρέμες ημέρας και νύχτας.", parentSlug: "prosopo" },
  { slug: "soma-ensydatosi", name: "Ενυδάτωση Σώματος", description: "Γαλακτώματα και κρέμες σώματος.", parentSlug: "soma" },
];

export const brands: Brand[] = [
  { slug: "mediderm", name: "MediDerm", description: "Δερμοκαλλυντική φροντίδα για ευαίσθητες επιδερμίδες." },
  { slug: "herbapharm", name: "HerbaPharm", description: "Φυτικά συμπληρώματα και φυσική φροντίδα." },
  { slug: "solcare", name: "SolCare", description: "Εξειδικευμένη αντηλιακή προστασία." },
  { slug: "vitaplus", name: "VitaPlus", description: "Βιταμίνες και συμπληρώματα καθημερινής ευεξίας." },
  { slug: "babysoft", name: "BabySoft", description: "Απαλή βρεφική φροντίδα, δερματολογικά ελεγμένη." },
  { slug: "capillex", name: "Capillex", description: "Εξειδικευμένη περιποίηση μαλλιών." },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getSubcategories(parentSlug: string): Category[] {
  return categories.filter((c) => c.parentSlug === parentSlug);
}

export function getTopLevelCategories(): Category[] {
  return categories.filter((c) => !c.parentSlug);
}
