export const DEFAULT_API_BASE_URL = 'http://127.0.0.1:9005';

const CATALOG_SERVICE = '/aihues.catalog.v1.CatalogService';

export const toolCategories = [
  {
    key: 'all',
    label: 'All',
    badge: 'Catalog',
    description: 'Every published tool from the catalog service.',
  },
  {
    key: 'developer',
    label: 'Developer',
    badge: 'Build',
    description: 'Formatters, encoders, parsers, generators, and code helpers.',
  },
  {
    key: 'utility',
    label: 'Utility',
    badge: 'Daily',
    description: 'Small text and productivity tools for repeated work.',
  },
  {
    key: 'ai-writing',
    label: 'AI Writing',
    badge: 'Draft',
    description: 'Prompts and copy generators for marketing and docs.',
  },
] as const;

export type ToolCategoryKey = (typeof toolCategories)[number]['key'];

export type PriceTagKey = 'unspecified' | 'free' | 'freemium' | 'paid';

type ProtoCategory =
  | 'ITEM_CATEGORY_UNSPECIFIED'
  | 'ITEM_CATEGORY_DEVELOPER'
  | 'ITEM_CATEGORY_UTILITY'
  | 'ITEM_CATEGORY_AI_WRITING';

type ProtoStatus =
  | 'ITEM_STATUS_UNSPECIFIED'
  | 'ITEM_STATUS_DRAFT'
  | 'ITEM_STATUS_PUBLISHED'
  | 'ITEM_STATUS_ARCHIVED';

type ProtoPriceTag =
  | 'PRICE_TAG_UNSPECIFIED'
  | 'PRICE_TAG_FREE'
  | 'PRICE_TAG_FREEMIUM'
  | 'PRICE_TAG_PAID';

export interface CatalogTool {
  id: string;
  slug: string;
  icon: string;
  name: string;
  description: string;
  category: ToolCategoryKey;
  status: ProtoStatus | number | string;
  sortOrder: number;
  priceTag: PriceTagKey;
  externalUrl: string;
  tags: string[];
  creditCost: number;
}

export interface CatalogGame {
  id: string;
  slug: string;
  icon: string;
  name: string;
  description: string;
  status: ProtoStatus | number | string;
  sortOrder: number;
  priceTag: PriceTagKey;
  externalUrl: string;
  tags: string[];
  creditCost: number;
}

export interface ListToolsOptions {
  q?: string;
  pageSize?: number;
  pageToken?: string;
  category?: ToolCategoryKey;
}

export interface ListGamesOptions {
  pageSize?: number;
  pageToken?: string;
}

export interface ListToolsResult {
  tools: CatalogTool[];
  nextPageToken: string;
}

export interface ListGamesResult {
  games: CatalogGame[];
  nextPageToken: string;
}

interface RawCatalogItem {
  id?: string;
  slug?: string;
  icon?: string;
  name?: string;
  description?: string;
  category?: ProtoCategory | number | string;
  status?: ProtoStatus | number | string;
  sortOrder?: number;
  sort_order?: number;
  priceTag?: ProtoPriceTag | number | string;
  price_tag?: ProtoPriceTag | number | string;
  externalUrl?: string;
  external_url?: string;
  tags?: string[];
  creditCost?: number;
  credit_cost?: number;
}

interface RawListToolsResponse {
  tools?: RawCatalogItem[];
  nextPageToken?: string;
  next_page_token?: string;
}

interface RawListGamesResponse {
  games?: RawCatalogItem[];
  nextPageToken?: string;
  next_page_token?: string;
}

export class CatalogApiError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = 'CatalogApiError';
  }
}

export function getCatalogApiBaseUrl() {
  return (
    process.env.AIHUES_API_BASE_URL ??
    process.env.NEXT_PUBLIC_AIHUES_API_BASE_URL ??
    DEFAULT_API_BASE_URL
  ).replace(/\/+$/, '');
}

export function categoryToProto(
  category?: ToolCategoryKey
): ProtoCategory | undefined {
  switch (category) {
    case 'developer':
      return 'ITEM_CATEGORY_DEVELOPER';
    case 'utility':
      return 'ITEM_CATEGORY_UTILITY';
    case 'ai-writing':
      return 'ITEM_CATEGORY_AI_WRITING';
    default:
      return undefined;
  }
}

export function protoToCategory(
  category: RawCatalogItem['category']
): ToolCategoryKey {
  if (category === 'ITEM_CATEGORY_DEVELOPER' || category === 1) {
    return 'developer';
  }
  if (category === 'ITEM_CATEGORY_UTILITY' || category === 2) {
    return 'utility';
  }
  if (category === 'ITEM_CATEGORY_AI_WRITING' || category === 3) {
    return 'ai-writing';
  }
  return 'all';
}

export function protoToPriceTag(pt: RawCatalogItem['priceTag']): PriceTagKey {
  if (pt === 'PRICE_TAG_FREE' || pt === 1) {
    return 'free';
  }
  if (pt === 'PRICE_TAG_FREEMIUM' || pt === 2) {
    return 'freemium';
  }
  if (pt === 'PRICE_TAG_PAID' || pt === 3) {
    return 'paid';
  }
  return 'unspecified';
}

export function normalizeCategory(value?: string): ToolCategoryKey {
  if (value === 'developer' || value === 'utility' || value === 'ai-writing') {
    return value;
  }
  return 'all';
}

async function connectJson<TRequest extends object, TResponse>(
  method: 'ListTools' | 'ListGames',
  body: TRequest
): Promise<TResponse> {
  const response = await fetch(
    `${getCatalogApiBaseUrl()}${CATALOG_SERVICE}/${method}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Connect-Protocol-Version': '1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    }
  );

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : {};

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String(payload.message)
        : `Catalog API request failed with HTTP ${response.status}`;
    throw new CatalogApiError(message, response.status);
  }

  return payload as TResponse;
}

function normalizeTool(item: RawCatalogItem): CatalogTool {
  return {
    id: item.id ?? item.slug ?? '',
    slug: item.slug ?? '',
    icon: item.icon ?? '◇',
    name: item.name ?? 'Untitled tool',
    description: item.description ?? '',
    category: protoToCategory(item.category),
    status: item.status ?? 'ITEM_STATUS_UNSPECIFIED',
    sortOrder: item.sortOrder ?? item.sort_order ?? 0,
    priceTag: protoToPriceTag(item.priceTag ?? item.price_tag),
    externalUrl: item.externalUrl ?? item.external_url ?? '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    creditCost: item.creditCost ?? item.credit_cost ?? 0,
  };
}

function normalizeGame(item: RawCatalogItem): CatalogGame {
  return {
    id: item.id ?? item.slug ?? '',
    slug: item.slug ?? '',
    icon: item.icon ?? '◇',
    name: item.name ?? 'Untitled game',
    description: item.description ?? '',
    status: item.status ?? 'ITEM_STATUS_UNSPECIFIED',
    sortOrder: item.sortOrder ?? item.sort_order ?? 0,
    priceTag: protoToPriceTag(item.priceTag ?? item.price_tag),
    externalUrl: item.externalUrl ?? item.external_url ?? '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    creditCost: item.creditCost ?? item.credit_cost ?? 0,
  };
}

export async function listTools(
  options: ListToolsOptions = {}
): Promise<ListToolsResult> {
  const request = {
    q: options.q?.trim() || undefined,
    pageSize: options.pageSize ?? 20,
    pageToken: options.pageToken || undefined,
    category: categoryToProto(options.category),
  };
  const response = await connectJson<typeof request, RawListToolsResponse>(
    'ListTools',
    request
  );

  return {
    tools: (response.tools ?? []).map(normalizeTool),
    nextPageToken: response.nextPageToken ?? response.next_page_token ?? '',
  };
}

export async function listGames(
  options: ListGamesOptions = {}
): Promise<ListGamesResult> {
  const request = {
    pageSize: options.pageSize ?? 20,
    pageToken: options.pageToken || undefined,
  };
  const response = await connectJson<typeof request, RawListGamesResponse>(
    'ListGames',
    request
  );

  return {
    games: (response.games ?? []).map(normalizeGame),
    nextPageToken: response.nextPageToken ?? response.next_page_token ?? '',
  };
}

const LOCAL_FALLBACK_TOOLS: CatalogTool[] = [
  /* Developer */
  {
    id: 'jwt',
    slug: 'jwt',
    icon: '🔐',
    name: 'JWT Parser',
    description: 'Decode and inspect JWT tokens with payload preview.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 0,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'json',
    slug: 'json',
    icon: '📋',
    name: 'JSON Formatter',
    description:
      'Format, validate, and pretty-print JSON with syntax highlighting.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 1,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'regex',
    slug: 'regex',
    icon: '🔍',
    name: 'Regex Tester',
    description: 'Test regular expressions with real-time match highlighting.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 2,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'uuid',
    slug: 'uuid',
    icon: '🆔',
    name: 'UUID Generator',
    description: 'Generate v4 and v7 UUIDs in bulk with one click.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 3,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'timestamp',
    slug: 'timestamp',
    icon: '⏱️',
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 4,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'base64',
    slug: 'base64',
    icon: '📦',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings with file support.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 5,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'sha256',
    slug: 'sha256',
    icon: '🔒',
    name: 'SHA256 Hash',
    description: 'Generate SHA256 hashes for text and files.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 6,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'sql',
    slug: 'sql',
    icon: '🗄️',
    name: 'SQL Formatter',
    description: 'Beautify and format SQL queries for readability.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 7,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'url-encode',
    slug: 'url-encode',
    icon: '🔗',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URL components and query strings.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 8,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'base-convert',
    slug: 'base-convert',
    icon: '🔢',
    name: 'Base Converter',
    description: 'Convert numbers between binary, octal, decimal, and hex.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 9,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'password-gen',
    slug: 'password-gen',
    icon: '🛡️',
    name: 'Password Generator',
    description: 'Generate secure random passwords with custom rules.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 10,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'http-status',
    slug: 'http-status',
    icon: '📡',
    name: 'HTTP Status Codes',
    description: 'Quick reference for all HTTP status codes.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 11,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'html-entity',
    slug: 'html-entity',
    icon: '📝',
    name: 'HTML Entity Encoder',
    description: 'Encode special characters to HTML entities.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 12,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'cron-parser',
    slug: 'cron-parser',
    icon: '⏰',
    name: 'Cron Parser',
    description: 'Parse cron expressions into human-readable schedules.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 13,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'code-explain',
    slug: 'code-explain',
    icon: '💡',
    name: 'Code Explainer',
    description: 'Explain what any code snippet does in plain English.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 14,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'code-review',
    slug: 'code-review',
    icon: '👁️',
    name: 'Code Review Assistant',
    description: 'Get AI-powered code review suggestions.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 15,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'shell',
    slug: 'shell',
    icon: '🐚',
    name: 'Shell Command Generator',
    description: 'Generate shell commands from natural language descriptions.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 16,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'git-commit',
    slug: 'git-commit',
    icon: '🌿',
    name: 'Git Commit Message',
    description: 'Generate conventional commit messages from diffs.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 17,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'ip-lookup',
    slug: 'ip-lookup',
    icon: '🌐',
    name: 'IP Lookup',
    description: 'Look up IP address geolocation and ISP info.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 18,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'curl-gen',
    slug: 'curl-gen',
    icon: '🌀',
    name: 'cURL Generator',
    description: 'Generate cURL commands from HTTP requests.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 19,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'image-to-base64',
    slug: 'image-to-base64',
    icon: '🖼️',
    name: 'Image to Base64',
    description: 'Convert images to Base64 data URIs for embedding.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 20,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'css-gradient',
    slug: 'css-gradient',
    icon: '🎨',
    name: 'CSS Gradient Generator',
    description: 'Create beautiful CSS gradients with a visual editor.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 21,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'color-convert',
    slug: 'color-convert',
    icon: '🎨',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL, and CMYK color formats.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 22,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'csv-json',
    slug: 'csv-json',
    icon: '📊',
    name: 'CSV ↔ JSON',
    description: 'Convert between CSV and JSON formats.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 23,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'diff-pro',
    slug: 'diff-pro',
    icon: '🔀',
    name: 'Diff Pro',
    description: 'Compare text or code side-by-side with syntax highlighting.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 24,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'unit-convert',
    slug: 'unit-convert',
    icon: '📏',
    name: 'Unit Converter',
    description: 'Convert length, weight, temperature, and more.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 25,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'qrcode',
    slug: 'qrcode',
    icon: '📱',
    name: 'QR Code Generator',
    description: 'Generate QR codes for URLs, text, and contact info.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 26,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'markdown',
    slug: 'markdown',
    icon: '✍️',
    name: 'Markdown Editor',
    description: 'Live Markdown editor with preview and export.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 27,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'diff',
    slug: 'diff',
    icon: '🔍',
    name: 'Text Diff',
    description: 'Simple text diff for quick comparisons.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 28,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'fullwidth',
    slug: 'fullwidth',
    icon: '↔️',
    name: 'Fullwidth Converter',
    description: 'Convert between halfwidth and fullwidth characters.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 29,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'title-case',
    slug: 'title-case',
    icon: '📝',
    name: 'Title Case Converter',
    description: 'Convert text to AP, Chicago, or MLA title case.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 30,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'chi-squared',
    slug: 'chi-squared',
    icon: '📉',
    name: 'Chi-Squared Calculator',
    description: 'Perform chi-squared tests for statistical analysis.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 31,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'word-count',
    slug: 'word-count',
    icon: '🔢',
    name: 'Word Count',
    description: 'Count words, characters, and reading time.',
    category: 'developer',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 32,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  /* AI Writing */
  {
    id: 'readability',
    slug: 'readability',
    icon: '📖',
    name: 'Readability Checker',
    description: 'Check Flesch-Kincaid and other readability scores.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 33,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'humanize',
    slug: 'humanize',
    icon: '✨',
    name: 'Humanize Text',
    description: 'Make AI-generated text sound more natural.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 34,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'lorem-ipsum',
    slug: 'lorem-ipsum',
    icon: '📝',
    name: 'Lorem Ipsum',
    description: 'Generate placeholder text for design mockups.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 35,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'seo-title',
    slug: 'seo-title',
    icon: '🎯',
    name: 'SEO Title Generator',
    description: 'Generate click-worthy SEO titles for your content.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 36,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'ad-copy',
    slug: 'ad-copy',
    icon: '📢',
    name: 'Ad Copy Generator',
    description: 'Create compelling ad copy for any platform.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 37,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'alt-text',
    slug: 'alt-text',
    icon: '🖼️',
    name: 'Alt Text Generator',
    description: 'Generate accessible alt text for images.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 38,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'blog-outline',
    slug: 'blog-outline',
    icon: '📋',
    name: 'Blog Outline Generator',
    description: 'Generate structured blog post outlines in seconds.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 39,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'changelog',
    slug: 'changelog',
    icon: '📜',
    name: 'Changelog Writer',
    description: 'Turn git commits into polished changelog entries.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 40,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'cold-email',
    slug: 'cold-email',
    icon: '📧',
    name: 'Cold Email Writer',
    description: 'Write personalized cold emails that get replies.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 41,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'docs',
    slug: 'docs',
    icon: '📚',
    name: 'Documentation Writer',
    description: 'Generate technical documentation from code.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 42,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'faq',
    slug: 'faq',
    icon: '❓',
    name: 'FAQ Generator',
    description: 'Generate frequently asked questions and answers.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 43,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'linkedin',
    slug: 'linkedin',
    icon: '💼',
    name: 'LinkedIn Post Generator',
    description: 'Create engaging LinkedIn posts for personal branding.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 44,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'lp-hero',
    slug: 'lp-hero',
    icon: '🚀',
    name: 'Landing Page Hero',
    description: 'Generate compelling landing page hero sections.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 45,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'meta',
    slug: 'meta',
    icon: '🏷️',
    name: 'Meta Description Generator',
    description: 'Write SEO-optimized meta descriptions.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 46,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'newsletter',
    slug: 'newsletter',
    icon: '📰',
    name: 'Newsletter Generator',
    description: 'Generate newsletter content that drives engagement.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 47,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'pr-desc',
    slug: 'pr-desc',
    icon: '🔀',
    name: 'PR Description Writer',
    description: 'Generate pull request descriptions from diffs.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 48,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'pseudo',
    slug: 'pseudo',
    icon: '🧩',
    name: 'Pseudocode Generator',
    description: 'Convert code into easy-to-read pseudocode.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 49,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'push',
    slug: 'push',
    icon: '📲',
    name: 'Push Notification Writer',
    description: 'Write engaging push notification copy.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 50,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'tagline',
    slug: 'tagline',
    icon: '💬',
    name: 'Tagline Generator',
    description: 'Create memorable taglines for your brand.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 51,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'tldr',
    slug: 'tldr',
    icon: '⚡',
    name: 'TL;DR Generator',
    description: 'Summarize long articles into concise takeaways.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 52,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'video-title',
    slug: 'video-title',
    icon: '🎬',
    name: 'Video Title Generator',
    description: 'Generate catchy YouTube video titles.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 53,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'x-post',
    slug: 'x-post',
    icon: '🐦',
    name: 'X Post Generator',
    description: 'Create viral X/Twitter posts and threads.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 54,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'yt-script',
    slug: 'yt-script',
    icon: '📹',
    name: 'YouTube Script Writer',
    description: 'Generate YouTube video scripts with hooks.',
    category: 'ai-writing',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 55,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  /* Productivity */
  {
    id: 'pomodoro',
    slug: 'pomodoro',
    icon: '🍅',
    name: 'Pomodoro Timer',
    description: 'Stay focused with customizable Pomodoro intervals.',
    category: 'utility',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 56,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
];

const LOCAL_FALLBACK_GAMES: CatalogGame[] = [
  {
    id: 'daily-luck',
    slug: 'daily-luck',
    icon: '🧧',
    name: 'Daily Fortune',
    description: 'Daily draw for wisdom & Credit rewards',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 0,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'slot-machine',
    slug: 'slot-machine',
    icon: '🎰',
    name: 'Lucky Slots',
    description: '3 free spins daily, win big prizes',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 1,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'basketball',
    slug: 'basketball',
    icon: '🏀',
    name: 'Basketball Shootout',
    description: '60 seconds to score maximum points',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 2,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
];

function filterFallbackTools(options: ListToolsOptions): CatalogTool[] {
  let tools = LOCAL_FALLBACK_TOOLS;
  if (options.q) {
    const q = options.q.toLowerCase();
    tools = tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }
  if (options.category && options.category !== 'all') {
    tools = tools.filter((t) => t.category === options.category);
  }
  return tools;
}

export async function safeListTools(options: ListToolsOptions = {}) {
  try {
    const result = await listTools(options);
    // Filter out external-link tools (not ready for launch)
    const tools = result.tools.filter((t) => !t.externalUrl);
    return { data: { ...result, tools }, error: null };
  } catch (error) {
    return {
      data: { tools: filterFallbackTools(options), nextPageToken: '' },
      error: error as Error,
    };
  }
}

export async function safeListGames(options: ListGamesOptions = {}) {
  try {
    return { data: await listGames(options), error: null };
  } catch (error) {
    return {
      data: { games: LOCAL_FALLBACK_GAMES, nextPageToken: '' },
      error: error as Error,
    };
  }
}
