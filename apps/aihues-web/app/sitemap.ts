import type { MetadataRoute } from 'next';

import { getAllPosts } from '@/lib/resources-data';
import { PUBLISHED_GAME_SLUGS } from '@/lib/published-games';
import { PUBLISHED_TOOL_SLUGS } from '@/lib/published-tools';
import { TEST_META } from '@/lib/tests';

const BASE_URL = 'https://aihues.com';

const STATIC_PATHS = [
  '',
  '/tools',
  '/games',
  '/tests',
  '/resources',
  '/pricing',
  '/discover',
  '/collection',
  '/wishlist',
  '/about',
  '/terms',
  '/privacy',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = STATIC_PATHS.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  const toolPages = PUBLISHED_TOOL_SLUGS.map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const gamePages = PUBLISHED_GAME_SLUGS.map((slug) => ({
    url: `${BASE_URL}/games/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const testPages = TEST_META.map((tm) => ({
    url: `${BASE_URL}/tests/${tm.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const posts = getAllPosts();
  const resourcePages = posts.map((post) => ({
    url: `${BASE_URL}/resources/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...toolPages,
    ...gamePages,
    ...testPages,
    ...resourcePages,
  ];
}
