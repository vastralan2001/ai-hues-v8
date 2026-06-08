/* ── AIHues Agent Tool Registry ──
   Maps user intent to available tools.
   Used for both LLM function calling and fallback keyword matching.
*/

import { LOCAL_TOOLS } from '../tool-data';
import type { RecommendedTool, AgentToolDefinition } from './types';

export const ALL_TOOLS = LOCAL_TOOLS;

/* ── Agent-native tool definitions (AI writing tools callable by Agent) ── */
export const AGENT_TOOLS: AgentToolDefinition[] = [
  {
    name: 'generate_content',
    description:
      'Generate content using AIHues writing tools (ad-copy, blog-outline, cold-email, x-post, linkedin, seo-title, video-title, yt-script, newsletter, tagline, docs, faq, pr-desc, changelog, push, alt-text, tldr, lp-hero, meta, humanize, code-explain, pseudo)',
    parameters: {
      type: 'object',
      properties: {
        tool: {
          type: 'string',
          description: 'Tool slug, e.g. "seo-title", "x-post", "blog-outline"',
        },
        ...Object.fromEntries(
          [
            'topic',
            'keyword',
            'product',
            'audience',
            'tone',
            'text',
            'code',
            'language',
            'changes',
            'version',
            'description',
            'brand',
            'benefit',
            'recipient',
            'purpose',
            'scenario',
            'duration',
            'style',
            'params',
            'questions',
          ].map((k) => [
            k,
            { type: 'string', description: `Input parameter: ${k}` },
          ])
        ),
      },
      required: ['tool'],
    },
  },
  {
    name: 'recommend_tools',
    description: 'Recommend relevant AIHues tools based on user need',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'What the user wants to do',
        },
        max_results: {
          type: 'number',
          description: 'Number of tools to recommend (default 3)',
        },
      },
      required: ['query'],
    },
  },
];

/* ── Keyword → tool slug mapping for fallback (no LLM) ── */
const KEYWORD_TOOL_MAP: Record<string, string[]> = {
  'jwt token': ['jwt'],
  'json format': ['json'],
  'regular expression': ['regex'],
  'uuid generate': ['uuid'],
  'timestamp convert': ['timestamp'],
  'base64 encode': ['base64'],
  'base64 decode': ['base64'],
  'hash sha': ['sha256'],
  'sql format': ['sql'],
  'url encode': ['url-encode'],
  'url decode': ['url-encode'],
  'binary convert': ['base-convert'],
  'hex convert': ['base-convert'],
  'password generate': ['password-gen'],
  'http status': ['http-status'],
  'html entity': ['html-entity'],
  'cron expression': ['cron-parser'],
  'code explain': ['code-explain'],
  'code review': ['code-review'],
  'shell command': ['shell'],
  'git commit': ['git-commit'],
  'ip lookup': ['ip-lookup'],
  'curl generate': ['curl-gen'],
  'image base64': ['image-to-base64'],
  'css gradient': ['css-gradient'],
  'color convert': ['color-convert'],
  'csv json': ['csv-json'],
  'text diff': ['diff', 'diff-pro'],
  'unit convert': ['unit-convert'],
  qrcode: ['qrcode'],
  'markdown preview': ['markdown'],
  'pomodoro timer': ['pomodoro'],
  'ab test': ['chi-squared'],
  'word count': ['word-count'],
  'title case': ['title-case'],
  readability: ['readability'],
  humanize: ['humanize'],
  'lorem ipsum': ['lorem-ipsum'],
  'ad copy': ['ad-copy'],
  advertisement: ['ad-copy'],
  'alt text': ['alt-text'],
  'blog outline': ['blog-outline'],
  changelog: ['changelog'],
  'cold email': ['cold-email'],
  outreach: ['cold-email'],
  documentation: ['docs'],
  faq: ['faq'],
  'linkedin post': ['linkedin'],
  'landing page': ['lp-hero'],
  'meta tag': ['meta'],
  newsletter: ['newsletter'],
  'pr description': ['pr-desc'],
  pseudocode: ['pseudo'],
  'push notification': ['push'],
  tagline: ['tagline'],
  slogan: ['tagline'],
  summary: ['tldr'],
  'video title': ['video-title'],
  'youtube title': ['video-title'],
  'youtube script': ['yt-script'],
  'x post': ['x-post'],
  tweet: ['x-post'],
  twitter: ['x-post'],
  'seo title': ['seo-title'],
};

/* ── Simple keyword-based tool recommendation (fallback) ── */
export function recommendToolsByKeyword(
  query: string,
  maxResults = 3
): RecommendedTool[] {
  const q = query.toLowerCase();
  const matchedSlugs = new Set<string>();

  for (const [keyword, slugs] of Object.entries(KEYWORD_TOOL_MAP)) {
    if (q.includes(keyword.toLowerCase())) {
      slugs.forEach((s) => matchedSlugs.add(s));
    }
  }

  // Also match by tool name/description
  for (const tool of ALL_TOOLS) {
    const searchable =
      `${tool.name} ${tool.description} ${tool.nameZh} ${tool.descriptionZh}`.toLowerCase();
    if (
      q.split(' ').some((word) => word.length > 2 && searchable.includes(word))
    ) {
      matchedSlugs.add(tool.slug);
    }
  }

  return Array.from(matchedSlugs)
    .slice(0, maxResults)
    .map((slug) => {
      const tool = ALL_TOOLS.find((t) => t.slug === slug)!;
      return {
        slug: tool.slug,
        name: tool.name,
        description: tool.description,
        url: tool.url,
        category: tool.category,
        icon: tool.icon,
      };
    });
}

/* ── AI writing tool input parameter schemas ── */
export const WRITING_TOOL_INPUTS: Record<
  string,
  { fields: string[]; required: string[] }
> = {
  'ad-copy': { fields: ['product', 'audience'], required: ['product'] },
  'blog-outline': { fields: ['topic', 'audience'], required: ['topic'] },
  'cold-email': {
    fields: ['recipient', 'product', 'purpose'],
    required: ['recipient', 'product'],
  },
  'x-post': { fields: ['topic', 'tone'], required: ['topic'] },
  linkedin: { fields: ['topic', 'tone'], required: ['topic'] },
  'seo-title': { fields: ['keyword', 'topic'], required: ['keyword'] },
  'video-title': { fields: ['topic', 'style'], required: ['topic'] },
  'yt-script': { fields: ['topic', 'duration'], required: ['topic'] },
  newsletter: { fields: ['topic', 'audience'], required: ['topic'] },
  tagline: { fields: ['brand', 'benefit'], required: ['brand'] },
  docs: { fields: ['product', 'params'], required: ['product'] },
  faq: { fields: ['product', 'questions'], required: ['product'] },
  'pr-desc': { fields: ['changes'], required: ['changes'] },
  changelog: {
    fields: ['version', 'changes'],
    required: ['version', 'changes'],
  },
  push: { fields: ['product', 'scenario'], required: ['product'] },
  'alt-text': { fields: ['description'], required: ['description'] },
  tldr: { fields: ['text'], required: ['text'] },
  'lp-hero': {
    fields: ['product', 'benefit'],
    required: ['product', 'benefit'],
  },
  meta: { fields: ['topic', 'keyword'], required: ['topic'] },
  humanize: { fields: ['text'], required: ['text'] },
  'code-explain': { fields: ['code', 'language'], required: ['code'] },
  pseudo: { fields: ['code'], required: ['code'] },
};

export function isWritingTool(slug: string): boolean {
  return slug in WRITING_TOOL_INPUTS;
}
