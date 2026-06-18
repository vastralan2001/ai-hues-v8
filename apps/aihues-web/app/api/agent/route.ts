import { NextResponse } from 'next/server';
import { processAgentMessage } from '@/lib/agent/orchestrator';
import type { AgentRequest, AgentMessage } from '@/lib/agent/types';

export const dynamic = 'force-dynamic';

const MAX_MESSAGES = 30;
const MAX_CONTENT_LENGTH = 3000;
const ALLOWED_ROLES: Array<'user' | 'agent'> = ['user', 'agent'];
const ALLOWED_LOCALES = ['en', 'zh'];

const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return (request as Request & { ip?: string }).ip || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= RATE_LIMIT) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  entry.count += 1;
  return { allowed: true };
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AgentRequest;

    const ip = getClientIp(request);
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: { 'Retry-After': String(rate.retryAfter) },
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
    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
