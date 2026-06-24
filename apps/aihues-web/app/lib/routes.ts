import type { ToolCategoryKey } from '@/lib/catalog-types';

export const homeHref = '/';
export const toolsHref = '/tools';
export const gamesHref = '/games';
export const testsHref = '/tests';
export const wishlistHref = '/wishlist';
export const rankingHref = '/ranking';
export const pricingHref = '/pricing';
export const collectionHref = '/collection';
export const discoverHref = '/discover';
export const storiesHref = '/stories';

export function toolDetailHref(slug: string) {
  return `/tools/${slug}`;
}

export function gameDetailHref(slug: string) {
  return `/games/${slug}`;
}

export function gamesGenreHref(genre: string) {
  return `${gamesHref}?genre=${encodeURIComponent(genre)}`;
}

export function testDetailHref(slug: string) {
  return `/tests/${slug}`;
}

export function toolsCategoryHref(category?: ToolCategoryKey, q?: string) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category && category !== 'all') params.set('category', category);
  const query = params.toString();
  return query ? `${toolsHref}?${query}` : toolsHref;
}
