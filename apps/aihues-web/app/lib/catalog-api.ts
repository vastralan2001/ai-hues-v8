export const DEFAULT_API_BASE_URL = 'http://127.0.0.1:9005';

import { LOCAL_TOOLS } from './tool-data';

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

/* ── Search helpers: fuzzy + token semantic matching ── */

const SEARCH_SYNONYMS: Record<string, string[]> = {
  ai: ['ai', 'writing', 'generator', 'copy', 'content', 'text'],
  write: ['write', 'writing', 'copy', 'content', 'generator', 'draft'],
  json: ['json', 'formatter', 'validator', 'format'],
  url: ['url', 'encode', 'decode', 'link', 'uri'],
  hash: ['hash', 'sha256', 'sha', 'md5', 'checksum'],
  password: ['password', 'generator', 'secure', 'random'],
  uuid: ['uuid', 'guid', 'id', 'identifier'],
  image: ['image', 'base64', 'picture', 'photo', 'img'],
  time: ['time', 'timestamp', 'unix', 'date', 'cron', 'schedule'],
  sql: ['sql', 'query', 'database', 'db'],
  code: ['code', 'developer', 'dev', 'programming'],
  color: ['color', 'gradient', 'hex', 'rgb', 'hsl'],
  diff: ['diff', 'compare', 'difference'],
  qr: ['qr', 'qrcode', 'barcode'],
  text: ['text', 'string', 'words', 'chars'],
};

function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenizeSearch(text: string): string[] {
  return normalizeSearchText(text).split(/\s+/).filter(Boolean);
}

function fuzzyCharScore(needle: string, haystack: string): number {
  let j = 0;
  let matched = 0;
  let gaps = 0;
  for (const ch of haystack) {
    if (j < needle.length && ch === needle[j]) {
      j++;
      matched++;
    } else if (j > 0 && j < needle.length) {
      gaps++;
    }
  }
  if (j !== needle.length) return 0;
  return matched / (haystack.length + gaps * 0.5 + 1);
}

function tokenMatchScore(token: string, text: string): number {
  if (token.length === 0) return 0;
  const normalized = normalizeSearchText(text);
  if (normalized === token) return 3;
  if (normalized.startsWith(`${token} `) || normalized.endsWith(` ${token}`))
    return 2;
  if (normalized.includes(token)) return 1;
  return fuzzyCharScore(token, normalized) * 0.7;
}

function expandQueryTokens(rawTokens: string[]): string[] {
  const expanded = new Set<string>();
  for (const token of rawTokens) {
    expanded.add(token);
    const synonyms = SEARCH_SYNONYMS[token];
    if (synonyms) {
      for (const synonym of synonyms) {
        expanded.add(synonym);
      }
    }
  }
  return Array.from(expanded);
}

function scoreTool(tool: CatalogTool, queryTokens: string[]): number {
  const fields: { text: string; weight: number }[] = [
    { text: tool.name, weight: 1.6 },
    { text: tool.slug, weight: 1.3 },
    { text: tool.category, weight: 0.8 },
    { text: tool.description, weight: 0.7 },
    ...tool.tags.map((tag) => ({ text: tag, weight: 1.0 })),
  ];

  let total = 0;
  for (const token of queryTokens) {
    let best = 0;
    for (const { text, weight } of fields) {
      const score = tokenMatchScore(token, text) * weight;
      if (score > best) best = score;
    }
    if (best === 0) return 0; // every token must match at least one field
    total += best;
  }

  // phrase-match bonus when the full query appears in name or description
  const phrase = queryTokens.join(' ');
  if (normalizeSearchText(tool.name).includes(phrase)) total += 0.8;
  if (normalizeSearchText(tool.description).includes(phrase)) total += 0.4;

  return total;
}

export function searchTools(
  tools: CatalogTool[],
  q: string,
  options: { threshold?: number; limit?: number } = {}
): CatalogTool[] {
  const rawTokens = tokenizeSearch(q);
  if (rawTokens.length === 0) return tools;

  const tokens = expandQueryTokens(rawTokens);
  const threshold = options.threshold ?? 0.3;

  const scored = tools
    .map((tool) => ({ tool, score: scoreTool(tool, tokens) }))
    .filter((entry) => entry.score >= threshold)
    .sort((a, b) => b.score - a.score);

  const result = scored.map((entry) => entry.tool);
  return options.limit ? result.slice(0, options.limit) : result;
}

export function getToolCategoryCounts(): Record<ToolCategoryKey, number> {
  const internal = LOCAL_FALLBACK_TOOLS.filter((t) => !t.externalUrl);
  const counts: Record<ToolCategoryKey, number> = {
    all: internal.length,
    developer: 0,
    utility: 0,
    'ai-writing': 0,
  };
  for (const tool of internal) {
    if (tool.category === 'developer') counts.developer++;
    if (tool.category === 'utility') counts.utility++;
    if (tool.category === 'ai-writing') counts['ai-writing']++;
  }
  return counts;
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
    icon: item.name?.slice(0, 2).toUpperCase() ?? '◇',
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
    icon: item.name?.slice(0, 2).toUpperCase() ?? '◇',
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

const LOCAL_FALLBACK_TOOLS: CatalogTool[] = LOCAL_TOOLS.map((t, idx) => ({
  id: t.slug,
  slug: t.slug,
  icon: t.name.slice(0, 2).toUpperCase(),
  name: t.name,
  description: t.description,
  category: t.category as CatalogTool['category'],
  status: 'ITEM_STATUS_PUBLISHED' as const,
  sortOrder: idx,
  priceTag: t.price,
  externalUrl: t.isExternal ? t.url : '',
  tags: [],
  creditCost: t.credit,
}));

const LOCAL_FALLBACK_GAMES: CatalogGame[] = [
  {
    id: 'doodle-jump',
    slug: 'doodle-jump',
    icon: 'J',
    name: 'Doodle Jump',
    description: 'Hop ever higher across a starry night sky',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 0,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'daily-luck',
    slug: 'daily-luck',
    icon: 'D',
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
    icon: 'S',
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
    icon: 'B',
    name: 'Basketball Shootout',
    description: '60 seconds to score maximum points',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 2,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'snake',
    slug: 'snake',
    icon: 'SN',
    name: 'Snake',
    description: 'Glide, grow, and feast — don’t bite your own tail',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 3,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'color-hunt',
    slug: 'color-hunt',
    icon: 'CH',
    name: 'Color Hunt',
    description: 'Spot the tile with a different shade',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 4,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
  {
    id: 'chess',
    slug: 'chess',
    icon: 'CS',
    name: 'Chess',
    description: 'Play, spectate, or analyze the position',
    status: 'ITEM_STATUS_PUBLISHED',
    sortOrder: 5,
    priceTag: 'free',
    externalUrl: '',
    tags: [],
    creditCost: 0,
  },
];

function filterFallbackTools(options: ListToolsOptions): CatalogTool[] {
  let tools = LOCAL_FALLBACK_TOOLS;
  if (options.q) {
    tools = searchTools(tools, options.q);
  }
  if (options.category && options.category !== 'all') {
    tools = tools.filter((t) => t.category === options.category);
  }
  return tools;
}

export async function safeListTools(options: ListToolsOptions = {}) {
  try {
    const result = await listTools(options);
    // Merge: backend data takes precedence, local fallback fills gaps
    const backendSlugs = new Set(result.tools.map((t) => t.slug));
    let tools = [
      ...result.tools,
      ...LOCAL_FALLBACK_TOOLS.filter((t) => !backendSlugs.has(t.slug)),
    ];

    if (options.q) {
      tools = searchTools(tools, options.q);
    }
    if (options.category && options.category !== 'all') {
      tools = tools.filter((t) => t.category === options.category);
    }

    // Filter out external-link tools (not ready for launch)
    tools = tools.filter((t) => !t.externalUrl);

    return { data: { ...result, tools, nextPageToken: '' }, error: null };
  } catch (error) {
    return {
      data: { tools: filterFallbackTools(options), nextPageToken: '' },
      error: error as Error,
    };
  }
}

export async function safeListGames(options: ListGamesOptions = {}) {
  try {
    const result = await listGames(options);
    // Merge: backend data takes precedence, local fallback fills gaps
    const backendSlugs = new Set(result.games.map((g) => g.slug));
    const games = [
      ...result.games,
      ...LOCAL_FALLBACK_GAMES.filter((g) => !backendSlugs.has(g.slug)),
    ];
    return { data: { ...result, games, nextPageToken: '' }, error: null };
  } catch (error) {
    return {
      data: { games: LOCAL_FALLBACK_GAMES, nextPageToken: '' },
      error: error as Error,
    };
  }
}
