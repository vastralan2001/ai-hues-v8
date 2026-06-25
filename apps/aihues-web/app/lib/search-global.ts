import 'server-only';

import { searchCatalog, type CatalogSearchHit } from '@/lib/catalog-api';

/* Global search across every content family — tools, games, tests and stories.
   Everything is served by the Go aihues-api (FAISS + embeddings) via
   searchCatalog; there is deliberately no JS fallback. Stories enter the Go
   corpus server-side (catalog-in-Go work), so they surface here once the API is
   running. The /search page groups the returned mixed-type hits into tabs. */
export async function searchGlobal(
  q: string,
  k = 30
): Promise<CatalogSearchHit[]> {
  const term = q.trim();
  if (term.length < 2) return [];
  return searchCatalog(term, k);
}
