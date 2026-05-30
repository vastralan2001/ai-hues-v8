import { cookies } from 'next/headers';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

import type { Locale } from '@/lib/dict';
import { t } from '@/lib/dict';
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
import CodeReviewTool from '@/components/tools/CodeReviewTool';
import ChangelogTool from '@/components/tools/ChangelogTool';
import SeoTitleTool from '@/components/tools/SeoTitleTool';
import PushTool from '@/components/tools/PushTool';
import BaseConvertTool from '@/components/tools/BaseConvertTool';
import CronParserTool from '@/components/tools/CronParserTool';
import FaqTool from '@/components/tools/FaqTool';
import SqlTool from '@/components/tools/SqlTool';
import TaglineTool from '@/components/tools/TaglineTool';
import ColdEmailTool from '@/components/tools/ColdEmailTool';
import NewsletterTool from '@/components/tools/NewsletterTool';
import XPostTool from '@/components/tools/XPostTool';
import VideoTitleTool from '@/components/tools/VideoTitleTool';
import YtScriptTool from '@/components/tools/YtScriptTool';
import AdCopyTool from '@/components/tools/AdCopyTool';
import ShellTool from '@/components/tools/ShellTool';
import CodeExplainTool from '@/components/tools/CodeExplainTool';
import HumanizeTool from '@/components/tools/HumanizeTool';
import IpLookupTool from '@/components/tools/IpLookupTool';
import DocsTool from '@/components/tools/DocsTool';
import AltTextTool from '@/components/tools/AltTextTool';
import BlogOutlineTool from '@/components/tools/BlogOutlineTool';
import LinkedinTool from '@/components/tools/LinkedinTool';
import LpHeroTool from '@/components/tools/LpHeroTool';
import CssGradientTool from '@/components/tools/CssGradientTool';
import PseudoTool from '@/components/tools/PseudoTool';
import DiffProTool from '@/components/tools/DiffProTool';
import QrcodeTool from '@/components/tools/QrcodeTool';
import ChiSquaredTool from '@/components/tools/ChiSquaredTool';

const SLUG_TO_DICT_KEY: Record<string, string> = {
  'lorem-ipsum': 'lorem',
  'password-gen': 'password',
  'color-convert': 'color',
  'curl-gen': 'curl',
  'unit-convert': 'unit',
  'image-to-base64': 'imageBase64',
  'cron-parser': 'cron',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = (cookieStore.get('aihues-locale')?.value as Locale) || 'en';

  const dictKey = SLUG_TO_DICT_KEY[slug] ?? slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const title = t(locale, `tool.${dictKey}.title`);
  const description = t(locale, `tool.${dictKey}.desc`);

  const titleKey = `tool.${dictKey}.title`;
  const descKey = `tool.${dictKey}.desc`;

  return {
    title: title === titleKey ? `${slug} | AIHues` : `${title} | AIHues`,
    description: description === descKey ? undefined : description,
  };
}

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
  'code-review': CodeReviewTool,
  'changelog': ChangelogTool,
  'seo-title': SeoTitleTool,
  'push': PushTool,
  'base-convert': BaseConvertTool,
  'cron-parser': CronParserTool,
  'faq': FaqTool,
  'sql': SqlTool,
  'tagline': TaglineTool,
  'cold-email': ColdEmailTool,
  'newsletter': NewsletterTool,
  'x-post': XPostTool,
  'video-title': VideoTitleTool,
  'yt-script': YtScriptTool,
  'ad-copy': AdCopyTool,
  'shell': ShellTool,
  'code-explain': CodeExplainTool,
  'humanize': HumanizeTool,
  'ip-lookup': IpLookupTool,
  'docs': DocsTool,
  'alt-text': AltTextTool,
  'blog-outline': BlogOutlineTool,
  'linkedin': LinkedinTool,
  'lp-hero': LpHeroTool,
  'css-gradient': CssGradientTool,
  'pseudo': PseudoTool,
  'diff-pro': DiffProTool,
  'qrcode': QrcodeTool,
  'chi-squared': ChiSquaredTool,
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
