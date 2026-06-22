import { NextResponse } from 'next/server';

import { buildPrompt } from '@/lib/ai-prompts';

function getLlmConfig() {
  if (process.env.KIMI_API_KEY) {
    return {
      key: process.env.KIMI_API_KEY,
      url:
        process.env.KIMI_API_BASE_URL ||
        'https://api.moonshot.cn/v1/chat/completions',
      model: process.env.KIMI_API_MODEL || 'moonshot-v1-8k',
    };
  }
  if (process.env.DEEPSEEK_API_KEY) {
    return {
      key: process.env.DEEPSEEK_API_KEY,
      url:
        process.env.DEEPSEEK_API_BASE_URL ||
        'https://api.deepseek.com/v1/chat/completions',
      model: process.env.DEEPSEEK_API_MODEL || 'deepseek-chat',
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      key: process.env.OPENAI_API_KEY,
      url:
        process.env.OPENAI_API_BASE_URL ||
        'https://api.openai.com/v1/chat/completions',
      model: process.env.OPENAI_API_MODEL || 'gpt-3.5-turbo',
    };
  }
  return null;
}

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

    const config = getLlmConfig();
    if (!config) {
      return NextResponse.json(
        {
          error:
            'LLM API key not configured. Set KIMI_API_KEY, DEEPSEEK_API_KEY or OPENAI_API_KEY environment variable.',
        },
        { status: 503 }
      );
    }

    const prompt = buildPrompt(tool, locale || 'en', inputs);

    const res = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.key}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ],
        temperature: prompt.temperature ?? 0.7,
        max_tokens: prompt.maxTokens ?? 2000,
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
