import type { MetadataRoute } from 'next';

import { getAllPosts } from '@/lib/blog-data';
import { ALL_TOOLS } from '@/lib/tool-data';

const BASE_URL = 'https://aihues.com';

const STATIC_PATHS = [
  '',
  '/tools',
  '/games',
  '/blog',
  '/pricing',
  '/showcase',
  '/discover',
  '/ranking',
  '/collection',
  '/wishlist',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = STATIC_PATHS.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  const toolPages = ALL_TOOLS.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const posts = getAllPosts();
  const blogPages = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...toolPages, ...blogPages];
}
