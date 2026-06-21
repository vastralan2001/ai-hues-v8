'use client';

import type { ToolCategoryKey } from '@/lib/catalog-api';
import { toolsHref } from '@/lib/routes';
import { event, GA_EVENTS } from '@/lib/gtag';

export function ToolSearchForm({
  q,
  category,
}: {
  q?: string;
  category: ToolCategoryKey;
}) {
  return (
    <form
      action={toolsHref}
      className='search-form'
      onSubmit={(e) => {
        const form = e.currentTarget;
        const input = form.querySelector<HTMLInputElement>('input[name="q"]');
        const term = input?.value?.trim();
        if (term) {
          event(GA_EVENTS.search, { term, category });
        }
      }}
    >
      <label className='sr-only' htmlFor='tool-search'>
        Search tools
      </label>
      <input
        defaultValue={q}
        id='tool-search'
        name='q'
        placeholder='Search tools...'
        type='search'
      />
      {category !== 'all' ? (
        <input name='category' type='hidden' value={category} />
      ) : null}
    </form>
  );
}
