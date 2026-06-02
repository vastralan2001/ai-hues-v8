import { NextResponse, type NextRequest } from 'next/server';

import {
  listTools,
  normalizeCategory,
  type CatalogTool,
} from '@/lib/catalog-api';
import { LOCAL_TOOLS } from '@/lib/tool-data';

const LOCAL_FALLBACK: CatalogTool[] = LOCAL_TOOLS.filter(
  (t) => !t.isExternal
).map((t, idx) => ({
  id: t.slug,
  slug: t.slug,
  icon: t.icon,
  name: t.name,
  description: t.description,
  category: t.category as CatalogTool['category'],
  status: 'ITEM_STATUS_PUBLISHED',
  sortOrder: idx,
  priceTag: t.price,
  externalUrl: '',
  tags: [],
  creditCost: t.credit,
}));

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  // Always start with complete local fallback, then merge backend data on top
  let tools: CatalogTool[] = LOCAL_FALLBACK;

  try {
    const data = await listTools({
      q: searchParams.get('q') ?? undefined,
      category: normalizeCategory(searchParams.get('category') ?? undefined),
      pageToken: searchParams.get('pageToken') ?? undefined,
      pageSize: Number(searchParams.get('pageSize') ?? 20),
    });
    // Merge: backend data takes precedence, local fallback fills gaps
    const backendSlugs = new Set(data.tools.map((t) => t.slug));
    const missing = LOCAL_FALLBACK.filter((t) => !backendSlugs.has(t.slug));
    tools = [...data.tools, ...missing];
  } catch {
    // Backend unavailable — already using LOCAL_FALLBACK above
  }

  // Apply search filter
  const q = searchParams.get('q')?.trim().toLowerCase();
  if (q) {
    tools = tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  // Apply category filter
  const cat = normalizeCategory(searchParams.get('category') ?? undefined);
  if (cat !== 'all') {
    tools = tools.filter((t) => t.category === cat);
  }

  // Apply page size limit
  const pageSize = Number(searchParams.get('pageSize') ?? 20);
  tools = tools.slice(0, pageSize);

  return NextResponse.json({ tools, nextPageToken: '' });
}
