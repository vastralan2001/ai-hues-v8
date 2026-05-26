import type { ToolCategoryKey } from '@/lib/catalog-api';
import { toolsHref } from '@/lib/routes';

export function ToolSearchForm({
  q,
  category,
}: {
  q?: string;
  category: ToolCategoryKey;
}) {
  return (
    <form action={toolsHref} className='search-form'>
      <label className='sr-only' htmlFor='tool-search'>
        Search tools
      </label>
      <input
        defaultValue={q}
        id='tool-search'
        name='q'
        placeholder='Search 57 tools...'
        type='search'
      />
      {category !== 'all' ? (
        <input name='category' type='hidden' value={category} />
      ) : null}
    </form>
  );
}
