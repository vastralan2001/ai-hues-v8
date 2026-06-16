import { NextResponse } from 'next/server';

import { getAllPosts } from '@/lib/blog-data';
import { PUBLISHED_TOOL_SLUGS } from '@/lib/published-tools';
import { ALL_TOOLS } from '@/lib/tool-data';

export const dynamic = 'force-static';

interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  type: 'tool' | 'blog' | 'page';
}

export async function GET() {
  const publishedSlugSet = new Set(PUBLISHED_TOOL_SLUGS);

  const items: SearchItem[] = [
    { id: 'home', title: 'Home', href: '/', type: 'page' },
    { id: 'tools', title: 'Tools', href: '/tools', type: 'page' },
    { id: 'games', title: 'Games', href: '/games', type: 'page' },
    { id: 'blog', title: 'Blog', href: '/blog', type: 'page' },
    { id: 'pricing', title: 'Pricing', href: '/pricing', type: 'page' },
    { id: 'showcase', title: 'Showcase', href: '/showcase', type: 'page' },
    { id: 'discover', title: 'Discover', href: '/discover', type: 'page' },
    {
      id: 'collection',
      title: 'Collection',
      href: '/collection',
      type: 'page',
    },
    { id: 'wishlist', title: 'Wishlist', href: '/wishlist', type: 'page' },

    ...ALL_TOOLS.filter((tool) => publishedSlugSet.has(tool.slug)).map(
      (tool) => ({
        id: tool.slug,
        title: tool.name,
        subtitle: tool.category,
        href: `/tools/${tool.slug}`,
        type: 'tool' as const,
      })
    ),

    ...getAllPosts().map((post) => ({
      id: post.slug,
      title: post.title,
      subtitle: post.tag,
      href: `/blog/${post.slug}`,
      type: 'blog' as const,
    })),
  ];

  return NextResponse.json(items, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
