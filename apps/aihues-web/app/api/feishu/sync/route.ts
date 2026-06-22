import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  listWikiNodes,
  readDocxBlocks,
  blocksToMarkdown,
  markdownToArticleHTML,
} from '@/lib/feishu';
import type { BlogPost } from '@/lib/blog-data';

const POSTS_JSON = join(process.cwd(), 'content', 'blog', 'posts.json');
const BLOG_DIR = join(process.cwd(), 'public', 'resources');

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

/**
 * POST /api/feishu/sync
 * Trigger a manual sync from Feishu wiki to local blog posts.
 * Requires FEISHU_APP_ID and FEISHU_APP_SECRET env vars.
 * Optional: FEISHU_SYNC_SECRET — when set, requires Bearer or x-feishu-sync-secret header.
 * Query param: spaceId (Feishu wiki space ID)
 */
function isAuthorized(request: Request): boolean {
  const secret = process.env.FEISHU_SYNC_SECRET;
  if (!secret) {
    // No secret configured — keep local dev behavior unchanged
    return true;
  }

  const authHeader = request.headers.get('authorization') || '';
  const customHeader = request.headers.get('x-feishu-sync-secret') || '';

  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7) === secret;
  }

  return customHeader === secret;
}

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized. Provide FEISHU_SYNC_SECRET header.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const spaceId = searchParams.get('spaceId');

    if (!spaceId) {
      return NextResponse.json(
        { error: 'Missing spaceId query param' },
        { status: 400 }
      );
    }

    // 1. Read existing posts
    let existingPosts: BlogPost[] = [];
    try {
      existingPosts = JSON.parse(readFileSync(POSTS_JSON, 'utf-8'));
    } catch {
      // File might not exist yet
    }

    const existingSlugs = new Set(existingPosts.map((p) => p.slug));
    let created = 0;
    let skipped = 0;

    // 2. List wiki nodes
    const nodes = await listWikiNodes(spaceId);

    // 3. For each docx node, read content and create post
    for (const node of nodes) {
      const slug = slugify(node.title);

      // Skip if already exists (prevent overwriting manual edits)
      if (existingSlugs.has(slug)) {
        skipped++;
        continue;
      }

      const blocks = await readDocxBlocks(node.node_token);
      const markdown = blocksToMarkdown(blocks);
      const html = markdownToArticleHTML({
        title: node.title,
        tag: 'Feishu Sync',
        date: new Date().toISOString().split('T')[0],
        readTime: '5 min',
        markdown,
      });

      // Write HTML file
      writeFileSync(join(BLOG_DIR, `${slug}.html`), html, 'utf-8');

      // Add to posts.json
      existingPosts.push({
        slug,
        tag: 'Feishu Sync',
        title: node.title,
        excerpt: `${node.title} — synced from Feishu wiki.`,
        date: new Date().toISOString().split('T')[0],
        readTime: '5 min',
        coverImage: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000000)}?w=600&q=80`,
      });

      created++;
    }

    // 4. Sort and save posts.json
    existingPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    writeFileSync(POSTS_JSON, JSON.stringify(existingPosts, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      created,
      skipped,
      total: existingPosts.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
