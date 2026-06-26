'use client';

import { SearchBox } from '@/components/SearchBox';
import type { ToolCategoryKey } from '@/lib/catalog-types';
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
      onSubmit={(e) => {
        const form = e.currentTarget;
        const input = form.querySelector<HTMLInputElement>('input[name="q"]');
        const term = input?.value?.trim();
        if (term) {
          event(GA_EVENTS.search, { term, category });
        }
      }}
    >
      <SearchBox
        ariaLabel='Search tools'
        defaultValue={q}
        id='tool-search'
        name='q'
        placeholder='Search tools...'
      />
      {category !== 'all' ? (
        <input name='category' type='hidden' value={category} />
      ) : null}
    </form>
  );
}
