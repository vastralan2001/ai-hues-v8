import { cookies } from 'next/headers';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { notFound, redirect } from 'next/navigation';

import type { Locale } from '@/lib/dict';
import WordCountTool from '@/components/tools/WordCountTool';
import Base64Tool from '@/components/tools/Base64Tool';
import UrlEncodeTool from '@/components/tools/UrlEncodeTool';
import UuidTool from '@/components/tools/UuidTool';
import JwtTool from '@/components/tools/JwtTool';
import JsonTool from '@/components/tools/JsonTool';
import Sha256Tool from '@/components/tools/Sha256Tool';
import LoremIpsumTool from '@/components/tools/LoremIpsumTool';
import TimestampTool from '@/components/tools/TimestampTool';
import HtmlEntityTool from '@/components/tools/HtmlEntityTool';
import FullwidthTool from '@/components/tools/FullwidthTool';
import PasswordTool from '@/components/tools/PasswordTool';
import RegexTool from '@/components/tools/RegexTool';
import DiffTool from '@/components/tools/DiffTool';
import CsvJsonTool from '@/components/tools/CsvJsonTool';
import ColorTool from '@/components/tools/ColorTool';
import TitleCaseTool from '@/components/tools/TitleCaseTool';
import GitCommitTool from '@/components/tools/GitCommitTool';
import ReadabilityTool from '@/components/tools/ReadabilityTool';
import PomodoroTool from '@/components/tools/PomodoroTool';
import CurlGenTool from '@/components/tools/CurlGenTool';
import HttpStatusTool from '@/components/tools/HttpStatusTool';
import UnitConvertTool from '@/components/tools/UnitConvertTool';
import MarkdownTool from '@/components/tools/MarkdownTool';
import MetaTagTool from '@/components/tools/MetaTagTool';
import TldrTool from '@/components/tools/TldrTool';
import ImageToBase64Tool from '@/components/tools/ImageToBase64Tool';
import PrDescTool from '@/components/tools/PrDescTool';

const REACT_TOOLS: Record<string, React.ComponentType<{ locale: Locale }>> = {
  'word-count': WordCountTool,
  'base64': Base64Tool,
  'url-encode': UrlEncodeTool,
  'uuid': UuidTool,
  'jwt': JwtTool,
  'json': JsonTool,
  'sha256': Sha256Tool,
  'lorem-ipsum': LoremIpsumTool,
  'timestamp': TimestampTool,
  'html-entity': HtmlEntityTool,
  'fullwidth': FullwidthTool,
  'password-gen': PasswordTool,
  'regex': RegexTool,
  'diff': DiffTool,
  'csv-json': CsvJsonTool,
  'color-convert': ColorTool,
  'title-case': TitleCaseTool,
  'git-commit': GitCommitTool,
  'readability': ReadabilityTool,
  'pomodoro': PomodoroTool,
  'curl-gen': CurlGenTool,
  'http-status': HttpStatusTool,
  'unit-convert': UnitConvertTool,
  'markdown': MarkdownTool,
  'meta': MetaTagTool,
  'tldr': TldrTool,
  'image-to-base64': ImageToBase64Tool,
  'pr-desc': PrDescTool,
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
