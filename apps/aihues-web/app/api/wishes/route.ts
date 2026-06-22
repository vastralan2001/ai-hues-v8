import { NextResponse } from 'next/server';

import { listWishes, addWish } from '@/lib/wishes';

export const dynamic = 'force-dynamic';

export async function GET() {
  const wishes = listWishes();
  return NextResponse.json({ wishes }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      description?: string;
      category?: string;
      email?: string;
    };

    if (!body.title?.trim() || !body.description?.trim()) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const wish = addWish({
      title: body.title.trim(),
      description: body.description.trim(),
      category: body.category?.trim() || 'Other',
      email: body.email?.trim(),
    });

    return NextResponse.json({ wish }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
