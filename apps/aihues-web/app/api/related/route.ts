import { NextResponse, type NextRequest } from 'next/server';

import { relatedBySlug, relatedByQuery } from '@/lib/search/semantic';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TYPES = ['tool', 'game', 'test'] as const;
type ItemType = (typeof TYPES)[number];

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const typeParam = sp.get('type') ?? 'tool';
  const type: ItemType = (TYPES as readonly string[]).includes(typeParam)
    ? (typeParam as ItemType)
    : 'tool';
  const slug = sp.get('slug')?.trim();
  const q = sp.get('q')?.trim();
  const kRaw = Number(sp.get('k'));
  const k =
    Number.isFinite(kRaw) && kRaw > 0 ? Math.min(12, Math.floor(kRaw)) : 6;

  try {
    const items = slug
      ? await relatedBySlug(slug, type, k)
      : q && q.length >= 2
        ? await relatedByQuery(q, type, k)
        : [];
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json(
      { items: [], error: err instanceof Error ? err.message : String(err) },
      { status: 200 }
    );
  }
}
