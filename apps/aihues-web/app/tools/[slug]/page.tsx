import { cookies } from 'next/headers';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { notFound, redirect } from 'next/navigation';

import type { Locale } from '@/lib/dict';
import WordCountTool from '@/components/tools/WordCountTool';
import Base64Tool from '@/components/tools/Base64Tool';

const REACT_TOOLS: Record<string, React.ComponentType<{ locale: Locale }>> = {
  'word-count': WordCountTool,
  'base64': Base64Tool,
};

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = (cookieStore.get('aihues-locale')?.value as Locale) || 'en';

  // Render React-native tool if available
  const ReactTool = REACT_TOOLS[slug];
  if (ReactTool) {
    return <ReactTool locale={locale} />;
  }

  // Fallback to static HTML page if it exists
  const htmlPath = join(process.cwd(), 'public', 'tools', `${slug}.html`);
  if (existsSync(htmlPath)) {
    redirect(`/tools/${slug}.html`);
  }

  notFound();
}
