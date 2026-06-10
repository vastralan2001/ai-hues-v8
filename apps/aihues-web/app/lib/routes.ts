import type { ToolCategoryKey } from '@/lib/catalog-api';

export const homeHref = '/';
export const toolsHref = '/tools';
export const gamesHref = '/games';
export const pricingHref = '/pricing';
export const collectionHref = '/collection';
export const showcaseHref = '/showcase';
export const discoverHref = '/discover';
export const blogHref = '/blog';

export function toolDetailHref(slug: string) {
  return `/tools/${slug}`;
}

export function gameDetailHref(slug: string) {
  return `/games/${slug}`;
}

export function toolsCategoryHref(category?: ToolCategoryKey, q?: string) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category && category !== 'all') params.set('category', category);
  const query = params.toString();
  return query ? `${toolsHref}?${query}` : toolsHref;
}
