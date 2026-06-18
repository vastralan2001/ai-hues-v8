import { NextResponse } from 'next/server';
import { processAgentMessage } from '@/lib/agent/orchestrator';
import { getAgentLimiter } from '@/lib/agent/rate-limit';
import type { AgentRequest, AgentMessage } from '@/lib/agent/types';

export const dynamic = 'force-dynamic';

const MAX_MESSAGES = 30;
const MAX_CONTENT_LENGTH = 3000;
const ALLOWED_ROLES: Array<'user' | 'agent'> = ['user', 'agent'];
const ALLOWED_LOCALES = ['en', 'zh'];

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return (request as Request & { ip?: string }).ip || 'unknown';
}

function sanitizeMessages(messages: unknown): AgentMessage[] | null {
  if (!Array.isArray(messages)) return null;
  if (messages.length === 0 || messages.length > MAX_MESSAGES) return null;

  const sanitized: AgentMessage[] = [];
  for (const m of messages) {
    if (!m || typeof m !== 'object') return null;
    const { role, content } = m as Record<string, unknown>;

    if (!ALLOWED_ROLES.includes(role as 'user' | 'agent')) return null;
    if (typeof content !== 'string') return null;
    if (content.length === 0 || content.length > MAX_CONTENT_LENGTH)
      return null;

    sanitized.push({ role: role as 'user' | 'agent', content });
  }
  return sanitized;
}

function getTotalTokens(message: {
  metadata?: { usageSummary?: { totalTokens?: number } };
}): number {
  return message.metadata?.usageSummary?.totalTokens ?? 0;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AgentRequest;
    const ip = getClientIp(request);
    const limiter = getAgentLimiter();

    const requestLimit = await limiter.checkRequest(ip);
    if (!requestLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'Retry-After': String(requestLimit.retryAfter ?? 60),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const messages = sanitizeMessages(body.messages);
    if (!messages) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const locale = ALLOWED_LOCALES.includes(body.locale as string)
      ? body.locale
      : 'en';
    const enableLlm = body.enableLlm !== false;

    const response = await processAgentMessage(messages, locale, enableLlm);

    const tokensUsed = getTotalTokens(response.message);
    const tokenLimit = await limiter.consumeTokens(ip, tokensUsed);

    if (!tokenLimit.allowed) {
      return NextResponse.json(
        { error: 'Daily token budget exceeded' },
        {
          status: 429,
          headers: {
            'Retry-After': String(tokenLimit.retryAfter ?? 3600),
            'X-RateLimit-Remaining': String(
              requestLimit.remainingRequests ?? 0
            ),
            'X-TokenBudget-Remaining': '0',
          },
        }
      );
    }

    return NextResponse.json(response, {
      headers: {
        'X-RateLimit-Remaining': String(requestLimit.remainingRequests ?? 0),
        'X-TokenBudget-Remaining': String(tokenLimit.remainingTokens ?? 0),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
