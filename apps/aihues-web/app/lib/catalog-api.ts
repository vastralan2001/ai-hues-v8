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
  type ToolCategoryKey,
} from '@/lib/catalog-types';

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

export async function safeListTools(options: ListToolsOptions = {}) {
  try {
    return { data: await listTools(options), error: null };
  } catch (error) {
    return { data: { tools: [], nextPageToken: '' }, error: error as Error };
  }
}

export async function safeListGames(options: ListGamesOptions = {}) {
  try {
    return { data: await listGames(options), error: null };
  } catch (error) {
    return { data: { games: [], nextPageToken: '' }, error: error as Error };
  }
}
