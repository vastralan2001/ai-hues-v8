// Runs once on server startup. Warm the semantic-search embedding index
// (load the BERT model + embed the catalog) so the first search is instant.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { warmIndex } = await import('@/lib/search/semantic');
    void warmIndex().catch(() => {
      /* a failed warm just falls back to lazy build on first query */
    });
  }
}
