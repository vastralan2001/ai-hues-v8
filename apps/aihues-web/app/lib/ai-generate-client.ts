import { event, GA_EVENTS } from './gtag';

export interface AiGenerateOptions {
  tool: string;
  locale?: string;
  inputs: Record<string, string>;
}

export async function aiGenerate(options: AiGenerateOptions): Promise<string> {
  const res = await fetch('/api/ai-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tool: options.tool,
      locale: options.locale || 'en',
      inputs: options.inputs,
    }),
  });

  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  const data = (await res.json()) as { result?: string };
  event(GA_EVENTS.toolGenerate, {
    tool: options.tool,
    locale: options.locale || 'en',
  });
  return data.result || '';
}
