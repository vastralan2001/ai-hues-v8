import { NextResponse, type NextRequest } from 'next/server';

import { listGames, type CatalogGame } from '@/lib/catalog-api';

const LOCAL_GAMES: CatalogGame[] = [
  {
    id: 'daily-luck',
    slug: 'daily-luck',
    icon: '🧧',
    name: 'Daily Fortune',
    description: 'Daily draw for wisdom & Credit rewards',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 0,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'slot-machine',
    slug: 'slot-machine',
    icon: '🎰',
    name: 'Lucky Slots',
    description: '3 free spins daily, win big prizes',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 1,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'basketball',
    slug: 'basketball',
    icon: '🏀',
    name: 'Basketball Shootout',
    description: '60 seconds to score maximum points',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 2,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  try {
    const data = await listGames({
      pageToken: searchParams.get('pageToken') ?? undefined,
      pageSize: Number(searchParams.get('pageSize') ?? 20),
    });
    return NextResponse.json(data);
  } catch {
    // Fallback to local static data when backend is unavailable
    return NextResponse.json({ games: LOCAL_GAMES, nextPageToken: '' });
  }
}
