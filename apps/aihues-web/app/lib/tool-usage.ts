const LS_USAGE_KEY = 'aihues-tool-usage';

export interface ToolUsage {
  slug: string;
  count: number;
  lastUsed: string;
}

export function recordToolUsage(slug: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LS_USAGE_KEY);
    const map: Record<string, ToolUsage> = raw ? JSON.parse(raw) : {};
    const existing = map[slug];
    map[slug] = {
      slug,
      count: (existing?.count ?? 0) + 1,
      lastUsed: new Date().toISOString(),
    };
    localStorage.setItem(LS_USAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function getToolUsages(): ToolUsage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_USAGE_KEY);
    const map: Record<string, ToolUsage> = raw ? JSON.parse(raw) : {};
    return Object.values(map).sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
}

export function getTotalRuns(): number {
  return getToolUsages().reduce((sum, u) => sum + u.count, 0);
}

export function getTopTools(limit = 10): ToolUsage[] {
  return getToolUsages().slice(0, limit);
}
