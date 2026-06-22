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

export interface CatalogTool {
  id: string;
  slug: string;
  icon: string;
  name: string;
  description: string;
  category: ToolCategoryKey;
  status: number | string;
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
  status: number | string;
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

export function normalizeCategory(value?: string): ToolCategoryKey {
  if (value === 'developer' || value === 'utility' || value === 'ai-writing') {
    return value;
  }
  return 'all';
}
