import { NextResponse } from 'next/server';

import { voteWish } from '@/lib/wishes';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      wishId?: string;
      anonymousId?: string;
      action?: 'up' | 'down';
    };

    if (!body.wishId || !body.anonymousId || !body.action) {
      return NextResponse.json(
        { error: 'wishId, anonymousId and action are required' },
        { status: 400 }
      );
    }

    const wish = voteWish(body.wishId, body.anonymousId, body.action);

    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }

    return NextResponse.json({ wish }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
