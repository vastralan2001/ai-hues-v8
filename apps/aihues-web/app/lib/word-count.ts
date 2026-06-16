export function countWords(text: string): number {
  const englishWords = text
    .trim()
    .split(/\s+/)
    .filter((w) => /[a-zA-Z]/.test(w)).length;
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  return englishWords + chineseChars;
}
