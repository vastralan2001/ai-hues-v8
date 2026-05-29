import { NextResponse, type NextRequest } from 'next/server';

import { listTools } from '@/lib/catalog-api';
import { normalizeCategory } from '@/lib/catalog-types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const data = await listTools({
    q: searchParams.get('q') ?? undefined,
    category: normalizeCategory(searchParams.get('category') ?? undefined),
    pageToken: searchParams.get('pageToken') ?? undefined,
    pageSize: Number(searchParams.get('pageSize') ?? 20),
  });

  return NextResponse.json(data);
}
