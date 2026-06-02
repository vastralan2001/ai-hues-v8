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

const LOCAL_FALLBACK_TOOLS: CatalogTool[] = LOCAL_TOOLS.map((t, idx) => ({
  id: t.slug,
  slug: t.slug,
  icon: t.icon,
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
