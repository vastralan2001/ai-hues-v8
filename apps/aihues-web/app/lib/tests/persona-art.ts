/* Persona art slots — maps a personality result code to the character image the
   user drops into /public/personas. While a slot is empty the UI falls back to
   a placeholder, so the layout stays stable as artwork is filled in. */

// 16 MBTI four-letter types (file: /personas/mbti/<type4>.png)
export const MBTI_PERSONA_CODES = [
  'intj',
  'intp',
  'entj',
  'entp',
  'infj',
  'infp',
  'enfj',
  'enfp',
  'istj',
  'isfj',
  'estj',
  'esfj',
  'istp',
  'isfp',
  'estp',
  'esfp',
] as const;

// 16 SBTI archetypes (file: /personas/sbti/<code>.png)
export const SBTI_PERSONA_CODES = [
  'malo',
  'fake',
  'dead',
  'gogo',
  'sexy',
  'solo',
  'love-r',
  'ctrl',
  'monk',
  'joke-r',
  'boss',
  'zzzz',
  'atm-er',
  'imsb',
  'hhhh',
  'drunk',
] as const;

/** Public path for a result's character art, or null when the test has no art set. */
export function personaImageSrc(slug: string, code: string): string | null {
  if (!code) return null;
  if (slug === 'mbti') {
    const t = code.slice(0, 4).toLowerCase();
    return (MBTI_PERSONA_CODES as readonly string[]).includes(t)
      ? `/personas/mbti/${t}.png`
      : null;
  }
  if (slug === 'sbti') {
    const c = code.toLowerCase();
    return (SBTI_PERSONA_CODES as readonly string[]).includes(c)
      ? `/personas/sbti/${c}.png`
      : null;
  }
  return null;
}

/** Tests that show a character-art slot (vs the generative TestAvatar). */
export function hasPersonaArt(slug: string): boolean {
  return slug === 'mbti' || slug === 'sbti';
}
