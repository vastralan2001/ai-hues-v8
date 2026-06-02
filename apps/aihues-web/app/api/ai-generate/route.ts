import { NextResponse } from 'next/server';

import { buildPrompt } from '@/lib/ai-prompts';

const API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
const API_URL = process.env.DEEPSEEK_API_KEY
  ? 'https://api.deepseek.com/v1/chat/completions'
  : 'https://api.openai.com/v1/chat/completions';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      tool?: string;
      locale?: string;
      inputs?: Record<string, string>;
    };

    const { tool, locale, inputs } = body;

    if (!tool || !inputs) {
      return NextResponse.json(
        { error: 'tool and inputs are required' },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        {
          error:
            'LLM API key not configured. Set DEEPSEEK_API_KEY or OPENAI_API_KEY environment variable.',
        },
        { status: 503 }
      );
    }

    const prompt = buildPrompt(tool, locale || 'en', inputs);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `LLM API error (${res.status}): ${errText}` },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const result = data.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
