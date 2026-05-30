'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface PseudoToolProps {
  locale: Locale;
}

function generatePseudo(description: string, locale: Locale): string {
  const isZh = locale === 'zh';
  const d = description.trim().toLowerCase();
  if (!d) return '';

  if (d.includes('sort') || d.includes('排序')) {
    return isZh
      ? `算法: 排序
输入: 数组 A
输出: 排序后的数组 A

1. 对于 i 从 0 到 length(A)-1:
2.   对于 j 从 0 到 length(A)-i-2:
3.     如果 A[j] > A[j+1]:
4.       交换 A[j] 和 A[j+1]
5. 返回 A`
      : `ALGORITHM: Sort
INPUT: Array A
OUTPUT: Sorted array A

1. FOR i FROM 0 TO length(A)-1:
2.   FOR j FROM 0 TO length(A)-i-2:
3.     IF A[j] > A[j+1]:
4.       SWAP A[j] AND A[j+1]
5. RETURN A`;
  }

  if (d.includes('search') || d.includes('查找') || d.includes('搜索')) {
    return isZh
      ? `算法: 二分查找
输入: 已排序数组 A, 目标值 x
输出: x 的索引或 -1

1. 设置 low = 0, high = length(A) - 1
2. 当 low <= high:
3.   mid = (low + high) / 2
4.   如果 A[mid] == x, 返回 mid
5.   如果 A[mid] < x, low = mid + 1
6.   否则 high = mid - 1
7. 返回 -1`
      : `ALGORITHM: Binary Search
INPUT: Sorted array A, target value x
OUTPUT: Index of x or -1

1. SET low = 0, high = length(A) - 1
2. WHILE low <= high:
3.   mid = (low + high) / 2
4.   IF A[mid] == x, RETURN mid
5.   IF A[mid] < x, low = mid + 1
6.   ELSE high = mid - 1
7. RETURN -1`;
  }

  if (d.includes('fibonacci') || d.includes('斐波那契')) {
    return isZh
      ? `算法: 斐波那契数列
输入: 整数 n
输出: 第 n 个斐波那契数

1. 如果 n <= 1, 返回 n
2. 设置 a = 0, b = 1
3. 对于 i 从 2 到 n:
4.   temp = a + b
5.   a = b
6.   b = temp
7. 返回 b`
      : `ALGORITHM: Fibonacci
INPUT: Integer n
OUTPUT: nth Fibonacci number

1. IF n <= 1, RETURN n
2. SET a = 0, b = 1
3. FOR i FROM 2 TO n:
4.   temp = a + b
5.   a = b
6.   b = temp
7. RETURN b`;
  }

  // Generic fallback
  return isZh
    ? `算法: ${description}
输入: [待定义]
输出: [待定义]

1. [步骤 1]
2. [步骤 2]
3. [步骤 3]
4. 返回结果`
    : `ALGORITHM: ${description}
INPUT: [To be defined]
OUTPUT: [To be defined]

1. [Step 1]
2. [Step 2]
3. [Step 3]
4. RETURN result`;
}

export default function PseudoTool({ locale }: PseudoToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setResult(generatePseudo(input, locale));
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.pseudo.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.pseudo.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.pseudo.input')}
            </label>
            <textarea
              className='h-[120px] w-full resize-none rounded-[10px] border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setInput(e.target.value)}
              placeholder={locale === 'zh' ? '排序一个数组' : 'Sort an array'}
              value={input}
            />
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleGenerate}
            type='button'
          >
            {t(locale, 'tool.pseudo.generate')}
          </button>

          {result && (
            <div className='mt-2'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.pseudo.result')}
                </span>
                <button
                  className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                  onClick={copy}
                  type='button'
                >
                  {copied ? t(locale, 'tool.copy.copied') : t(locale, 'tool.wordCount.copy')}
                </button>
              </div>
              <div className='min-h-[200px] w-full rounded-[14px] border border-border bg-surface p-5'>
                <pre className='whitespace-pre-wrap font-mono text-sm text-foreground'>
                  {result}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
