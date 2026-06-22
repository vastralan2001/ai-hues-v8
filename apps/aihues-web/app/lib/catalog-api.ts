import 'server-only';

import { create } from '@bufbuild/protobuf';
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import {
  CatalogService,
  ListGamesRequestSchema,
  ListToolsRequestSchema,
} from '@aiushtha/proto-es/aihues/catalog/v1/service_pb';
import {
  ItemCategory,
  PriceTag,
  type Game,
  type Tool,
} from '@aiushtha/proto-es/aihues/catalog/v1/types_pb';

import {
  type CatalogGame,
  type CatalogTool,
  type ListGamesOptions,
  type ListGamesResult,
  type ListToolsOptions,
  type ListToolsResult,
  type PriceTagKey,
  type ToolCategoryKey,
} from '@/lib/catalog-types';

import { LOCAL_TOOLS } from './tool-data';

export * from '@/lib/catalog-types';

export const DEFAULT_API_BASE_URL = 'http://127.0.0.1:9005';

export function getCatalogApiBaseUrl() {
  return (
    process.env.AIHUES_API_BASE_URL ??
    process.env.NEXT_PUBLIC_AIHUES_API_BASE_URL ??
    DEFAULT_API_BASE_URL
  ).replace(/\/+$/, '');
}

function makeCatalogClient() {
  const transport = createConnectTransport({
    baseUrl: getCatalogApiBaseUrl(),
    defaultTimeoutMs: 8000,
  });

  return createClient(CatalogService, transport);
}

function categoryToProto(category?: ToolCategoryKey): ItemCategory {
  switch (category) {
    case 'developer':
      return ItemCategory.DEVELOPER;
    case 'utility':
      return ItemCategory.UTILITY;
    case 'ai-writing':
      return ItemCategory.AI_WRITING;
    default:
      return ItemCategory.UNSPECIFIED;
  }
}

function protoToCategory(category: ItemCategory): ToolCategoryKey {
  switch (category) {
    case ItemCategory.DEVELOPER:
      return 'developer';
    case ItemCategory.UTILITY:
      return 'utility';
    case ItemCategory.AI_WRITING:
      return 'ai-writing';
    default:
      return 'all';
  }
}

function protoToPriceTag(pt: PriceTag): PriceTagKey {
  switch (pt) {
    case PriceTag.FREE:
      return 'free';
    case PriceTag.FREEMIUM:
      return 'freemium';
    case PriceTag.PAID:
      return 'paid';
    default:
      return 'unspecified';
  }
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

function normalizeTool(item: Tool): CatalogTool {
  return {
    id: item.id,
    slug: item.slug,
    icon: item.icon || '◇',
    name: item.name || 'Untitled tool',
    description: item.description,
    category: protoToCategory(item.category),
    status: item.status,
    sortOrder: item.sortOrder,
    priceTag: protoToPriceTag(item.priceTag),
    externalUrl: item.externalUrl,
    tags: item.tags,
    creditCost: item.creditCost,
  };
}

function normalizeGame(item: Game): CatalogGame {
  return {
    id: item.id,
    slug: item.slug,
    icon: item.icon || '◇',
    name: item.name || 'Untitled game',
    description: item.description,
    status: item.status,
    sortOrder: item.sortOrder,
    priceTag: protoToPriceTag(item.priceTag),
    externalUrl: item.externalUrl,
    tags: item.tags,
    creditCost: item.creditCost,
  };
}

export async function listTools(
  options: ListToolsOptions = {}
): Promise<ListToolsResult> {
  const client = makeCatalogClient();
  const response = await client.listTools(
    create(ListToolsRequestSchema, {
      q: options.q?.trim() || undefined,
      pageSize: options.pageSize ?? 20,
      pageToken: options.pageToken || undefined,
      category: categoryToProto(options.category),
    })
  );

  return {
    tools: response.tools.map(normalizeTool),
    nextPageToken: response.nextPageToken,
  };
}

export async function listGames(
  options: ListGamesOptions = {}
): Promise<ListGamesResult> {
  const client = makeCatalogClient();
  const response = await client.listGames(
    create(ListGamesRequestSchema, {
      pageSize: options.pageSize ?? 20,
      pageToken: options.pageToken || undefined,
    })
  );

  return {
    games: response.games.map(normalizeGame),
    nextPageToken: response.nextPageToken,
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
