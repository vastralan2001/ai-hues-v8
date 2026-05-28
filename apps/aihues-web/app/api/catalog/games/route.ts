import { NextResponse, type NextRequest } from 'next/server';

import { listGames } from '@/lib/catalog-api';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const data = await listGames({
    pageToken: searchParams.get('pageToken') ?? undefined,
    pageSize: Number(searchParams.get('pageSize') ?? 20),
  });

  return NextResponse.json(data);
}
