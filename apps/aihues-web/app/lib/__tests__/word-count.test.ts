import { describe, expect, it } from 'vitest';

import { countWords } from '../word-count';

describe('countWords', () => {
  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('counts English words', () => {
    expect(countWords('hello world')).toBe(2);
  });

  it('counts Chinese characters as words', () => {
    expect(countWords('你好世界')).toBe(4);
  });

  it('counts mixed English and Chinese', () => {
    expect(countWords('hello 你好 world 世界')).toBe(6);
  });

  it('ignores extra whitespace', () => {
    expect(countWords('  hello   world  ')).toBe(2);
  });

  it('ignores punctuation-only tokens', () => {
    expect(countWords('hello, world!')).toBe(2);
  });
});
