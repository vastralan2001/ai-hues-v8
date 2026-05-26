import fs from 'node:fs';
import path from 'node:path';
import type { NextConfig } from 'next';

const legacyHtmlPages = [
  'collection',
  'discover',
  'pricing',
  'ranking',
  'showcase',
  'wishlist',
];

// Collect slugs for static files that still exist under public/<subdir>*.html.
// When a tool/game moves to React, removing its .html file lets the URL pass
// through to the app/ route automatically.
function staticHtmlSlugs(subdir: string): string[] {
  const dir = path.join(process.cwd(), 'public', subdir);
  try {
    return fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.html'))
      .map((file) => file.replace(/\.html$/, ''));
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const toolSlugs = staticHtmlSlugs('tools');
    const gameSlugs = staticHtmlSlugs('games');

    return {
      // beforeFiles runs before filesystem routes, so only legacy static slugs
      // are rewritten to .html.
      beforeFiles: [
        ...toolSlugs.map((slug) => ({
          source: `/tools/${slug}`,
          destination: `/tools/${slug}.html`,
        })),
        ...gameSlugs.map((slug) => ({
          source: `/games/${slug}`,
          destination: `/games/${slug}.html`,
        })),
      ],
      // Legacy .html links fall back to the React list/static pages.
      afterFiles: [
        { source: '/index.html', destination: '/' },
        { source: '/tools.html', destination: '/tools' },
        { source: '/games.html', destination: '/games' },
        ...legacyHtmlPages.map((page) => ({
          source: `/${page}.html`,
          destination: `/${page}`,
        })),
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
