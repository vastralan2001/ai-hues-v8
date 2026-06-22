import type { MetadataRoute } from 'next';

const BASE_URL = 'https://aihues.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/js/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
