'use client';

import { Search } from 'lucide-react';

/* Shared search input for the listing pages (Tools form-submit, Stories
   in-place filter). One look everywhere: rounded surface field with a leading
   search glyph that picks up the page's accent on focus. */
export function SearchBox({
  value,
  defaultValue,
  onChange,
  placeholder,
  name,
  id,
  ariaLabel = 'Search',
}: {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <div className='relative'>
      <Search
        aria-hidden='true'
        className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted'
      />
      <label className='sr-only' htmlFor={id}>
        {ariaLabel}
      </label>
      <input
        className='h-12 w-full rounded-[12px] border border-border bg-surface pl-11 pr-4 text-sm text-foreground transition-colors placeholder:text-muted focus:border-accent focus:outline-none'
        defaultValue={defaultValue}
        id={id}
        name={name}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        type='search'
        value={value}
      />
    </div>
  );
}
