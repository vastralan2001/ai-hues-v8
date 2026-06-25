'use client';

import { ImageDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { getTest } from '@/lib/tests';
import { buildResultPoster, shareOrDownloadPoster } from '@/lib/tests/poster';
import type { TestResult } from '@/lib/tests/types';
import { ToolIcon } from '@/components/ToolIcon';
import { testsHref } from '@/lib/routes';
import { CATEGORY_ACCENT_HEX } from '@/lib/category-brand';

type Phase = 'intro' | 'quiz' | 'result';

export default function QuizRunner({ slug }: { slug: string }) {
  const config = getTest(slug);
  const total = config?.questions.length ?? 0;

  const [phase, setPhase] = useState<Phase>('intro');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => Array(total).fill(-1));
  const [result, setResult] = useState<TestResult | null>(null);
  const [posterBusy, setPosterBusy] = useState(false);

  if (!config) return null;
  // Every Test detail page uses the Tests family brand hue, not a per-test
  // colour, so the section stays consistent with its category theme.
  const accent = CATEGORY_ACCENT_HEX.tests;

  function start() {
    setAnswers(Array(total).fill(-1));
    setIdx(0);
    setResult(null);
    setPhase('quiz');
  }

  function choose(optIdx: number) {
    if (!config) return;
    const next = answers.slice();
    next[idx] = optIdx;
    setAnswers(next);
    if (idx < total - 1) {
      setIdx(idx + 1);
    } else {
      setResult(config.score(next));
      setPhase('result');
    }
  }

  function back() {
    if (idx > 0) setIdx(idx - 1);
    else setPhase('intro');
  }

  function retake() {
    start();
  }

  async function savePoster() {
    if (!result || !config || posterBusy) return;
    setPosterBusy(true);
    try {
      const blob = await buildResultPoster(config, result);
      const safe = result.code.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      const text = `My ${config.name} result: ${result.code} — ${result.title} · via AIHues`;
      await shareOrDownloadPoster(
        blob,
        `aihues-${config.slug}-${safe}.png`,
        text
      );
    } finally {
      setPosterBusy(false);
    }
  }

  /* ── Intro ── */
  if (phase === 'intro') {
    return (
      <div className='mx-auto w-full max-w-[640px]'>
        <div
          className='rounded-[20px] border border-border bg-surface p-8 text-center'
          style={{ boxShadow: `0 1px 0 ${accent}22` }}
        >
          <span
            className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[16px] text-white'
            style={{ background: accent }}
          >
            <ToolIcon slug={config.slug} size={28} className='text-white' />
          </span>
          <span
            className='mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]'
            style={{ color: accent, background: `${accent}14` }}
          >
            {config.tagline}
          </span>
          <h1 className='mb-3 text-[34px] font-extrabold leading-tight tracking-[-0.02em] text-foreground'>
            {config.name}
          </h1>
          <p className='mx-auto mb-6 max-w-[460px] text-[15px] leading-relaxed text-secondary'>
            {config.intro}
          </p>
          <ul className='mx-auto mb-7 max-w-[440px] space-y-2 text-left'>
            {config.rules.map((r) => (
              <li
                key={r}
                className='flex items-start gap-2.5 text-[13px] leading-relaxed text-secondary'
              >
                <span
                  aria-hidden='true'
                  className='mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full'
                  style={{ background: accent }}
                />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <button
            type='button'
            onClick={start}
            className='inline-flex items-center rounded-[12px] px-9 py-3 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5'
            style={{ background: accent }}
          >
            Start test
          </button>
          <p className='mt-4 text-[12px] text-muted'>
            {total} questions · ~{config.durationMin} min · instant results
          </p>
        </div>
      </div>
    );
  }

  /* ── Quiz ── */
  if (phase === 'quiz') {
    const q = config.questions[idx];
    const selected = answers[idx];
    const progress = Math.round(
      ((idx + (selected >= 0 ? 1 : 0)) / total) * 100
    );

    return (
      <div className='mx-auto w-full max-w-[640px]'>
        {/* progress */}
        <div className='mb-6'>
          <div className='mb-2 flex items-center justify-between text-[12px] font-semibold text-muted'>
            <button
              type='button'
              onClick={back}
              className='inline-flex items-center gap-1 transition-colors hover:text-foreground'
            >
              ← Back
            </button>
            <span>
              {idx + 1} / {total}
            </span>
          </div>
          <div className='h-1.5 w-full overflow-hidden rounded-full bg-border'>
            <div
              className='h-full rounded-full transition-[width] duration-300 ease-out'
              style={{ width: `${progress}%`, background: accent }}
            />
          </div>
        </div>

        {/* question */}
        <div key={idx} className='quiz-fade'>
          <h2 className='mb-6 text-[22px] font-bold leading-snug text-foreground'>
            {q.prompt}
          </h2>
          {q.note && (
            <p className='-mt-4 mb-6 text-[13px] text-muted'>{q.note}</p>
          )}
          <div className='grid gap-3'>
            {q.options.map((opt, i) => {
              const isSel = selected === i;
              return (
                <button
                  key={i}
                  type='button'
                  onClick={() => choose(i)}
                  className='group flex w-full items-center gap-3 rounded-[14px] border bg-surface px-5 py-4 text-left text-[15px] font-medium text-foreground transition-all hover:-translate-y-px'
                  style={{
                    borderColor: isSel ? accent : 'var(--color-border)',
                    background: isSel ? `${accent}10` : undefined,
                  }}
                >
                  <span
                    className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors'
                    style={{
                      borderColor: isSel
                        ? accent
                        : 'var(--color-border-strong)',
                      background: isSel ? accent : 'transparent',
                    }}
                  >
                    {isSel && (
                      <span className='h-1.5 w-1.5 rounded-full bg-white' />
                    )}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes quizFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          .quiz-fade { animation: quizFade 0.25s cubic-bezier(0.23,1,0.32,1) both; }
          @media (prefers-reduced-motion: reduce) { .quiz-fade { animation: none; } }
        `}</style>
      </div>
    );
  }

  /* ── Result ── */
  if (phase === 'result' && result) {
    const racc = CATEGORY_ACCENT_HEX.tests;
    const isSbti = config.resultStyle === 'sbti';

    return (
      <div className='mx-auto w-full max-w-[680px]'>
        <div className='overflow-hidden rounded-[22px] border border-border bg-surface'>
          {/* header band */}
          <div
            className='px-8 py-9 text-center'
            style={{ background: `${racc}12` }}
          >
            {result.hidden && (
              <span className='mb-2 inline-block rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white'>
                Hidden archetype
              </span>
            )}
            <div
              className='text-[44px] font-black leading-none tracking-[-0.01em]'
              style={{ color: racc }}
            >
              {result.code}
            </div>
            <h1 className='mt-2 text-[22px] font-extrabold text-foreground'>
              {result.title}
            </h1>
            {result.matchPct != null && (
              <div className='mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-[12px] font-bold text-secondary'>
                <span style={{ color: racc }}>●</span>
                {result.matchPct}% match
              </div>
            )}
          </div>

          <div className='px-8 py-7'>
            <p className='mb-5 text-[15px] leading-relaxed text-secondary'>
              {result.blurb}
            </p>

            {result.tags && result.tags.length > 0 && (
              <div className='mb-7 flex flex-wrap gap-2'>
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-full border border-border px-3 py-1 text-[12px] font-semibold text-secondary'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* breakdown */}
            <div className='mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted'>
              {config.breakdownLabel ??
                (isSbti ? 'Soul dimensions' : 'Your breakdown')}
            </div>

            {isSbti ? (
              <div className='grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2'>
                {result.bars.map((b) => (
                  <div key={b.label} className='flex items-center gap-2.5'>
                    <span className='w-[88px] shrink-0 text-[12px] text-secondary'>
                      {b.label}
                    </span>
                    <div className='relative h-1.5 flex-1 overflow-hidden rounded-full bg-border'>
                      <div
                        className='absolute inset-y-0 left-0 rounded-full'
                        style={{ width: `${b.pct}%`, background: racc }}
                      />
                    </div>
                    <span
                      className='w-4 shrink-0 text-center text-[11px] font-bold'
                      style={{ color: racc }}
                    >
                      {b.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className='space-y-4'>
                {result.bars.map((b) => (
                  <div key={b.label}>
                    <div className='mb-1.5 flex items-center justify-between'>
                      <span className='text-[13px] font-semibold text-foreground'>
                        {b.label}
                      </span>
                      <span
                        className='rounded-md px-2 py-0.5 text-[11px] font-bold'
                        style={{ color: racc, background: `${racc}16` }}
                      >
                        {b.value}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-[11px] text-muted'>
                      <span className='w-[88px] shrink-0 text-right'>
                        {b.leftLabel}
                      </span>
                      <div className='relative h-2 flex-1 rounded-full bg-border'>
                        <div
                          className='absolute inset-y-0 left-0 rounded-full opacity-90'
                          style={{ width: `${b.pct}%`, background: racc }}
                        />
                        <span
                          className='absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white'
                          style={{ left: `${b.pct}%`, background: racc }}
                        />
                      </div>
                      <span className='w-[88px] shrink-0'>{b.rightLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* actions */}
            <div className='mt-8 flex flex-wrap items-center gap-3'>
              <button
                type='button'
                onClick={retake}
                className='inline-flex items-center rounded-[12px] px-7 py-2.5 text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5'
                style={{ background: racc }}
              >
                Retake
              </button>
              <button
                type='button'
                onClick={savePoster}
                disabled={posterBusy}
                className='inline-flex items-center gap-2 rounded-[12px] border border-border bg-surface px-7 py-2.5 text-[14px] font-semibold text-foreground transition-colors hover:border-border-strong disabled:opacity-60'
              >
                <ImageDown size={16} />
                {posterBusy ? 'Preparing…' : 'Save poster'}
              </button>
              <Link
                href={testsHref}
                className='ml-auto text-[13px] font-semibold text-muted transition-colors hover:text-foreground'
              >
                All tests →
              </Link>
            </div>
          </div>
        </div>

        <p className='mt-4 text-center text-[12px] text-muted'>
          For fun and self-reflection — not a clinical or scientific diagnosis.
        </p>
      </div>
    );
  }

  return null;
}
