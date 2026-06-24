import { NextResponse, type NextRequest } from 'next/server';

import { searchCatalog } from '@/lib/catalog-api';
import { semanticSearch } from '@/lib/search/semantic';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return NextResponse.json({ results: [] });
  try {
    // Primary: Go aihues-api (FAISS + embeddings). Fall back to the in-process
    // index only if the backend is unavailable, so the page never goes dark.
    const results = await searchCatalog(q, 8);
    return NextResponse.json({ results });
  } catch {
    try {
      const results = await semanticSearch(q, 8);
      return NextResponse.json({ results });
    } catch (err) {
      return NextResponse.json(
        {
          results: [],
          error: err instanceof Error ? err.message : String(err),
        },
        { status: 200 }
      );
    }
  }
}
