import { NextResponse } from 'next/server';
import { processAgentMessage } from '@/lib/agent/orchestrator';
import type { AgentRequest } from '@/lib/agent/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AgentRequest;
    const { messages, locale = 'en', enableLlm = true } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      );
    }

    const response = await processAgentMessage(messages, locale, enableLlm);
    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
