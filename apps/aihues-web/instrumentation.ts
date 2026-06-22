// Runs once on server startup. Warm the semantic-search embedding index
// (load the BERT model + embed the full catalog) so the first search is instant.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { warmIndex } = await import('@/lib/search/semantic');
      console.log('[search] startup warm: kicking off index build');
      void warmIndex()
        .then(() => console.log('[search] startup warm: done'))
        .catch((e) => console.error('[search] startup warm failed:', e));
    } catch (e) {
      console.error('[search] startup warm import failed:', e);
    }
  }
}
