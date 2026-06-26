import type { ReactNode } from 'react';

/* PersonaAvatar — an original, on-brand illustrated medallion for personality
   results. Every emblem here is hand-authored SVG drawn in the same warm-ink
   "story-scene" language as SceneHeader (ink outline + accent fills on paper),
   so MBTI / SBTI results get distinctive artwork WITHOUT hotlinking any
   third-party (16personalities / sbti.pics) copyrighted character art.

   Pure SVG, no client hooks — safe to render in both server and client
   components. Colours follow the design tokens: paper bg (#faf9f5), ink
   (#5b5346) and the result's group accent passed in by the caller. */

const INK = '#5b5346';

interface EmblemCtx {
  accent: string;
  ink: string;
}

/* Each emblem is drawn centred on (0,0), roughly within a -34..34 box; the
   parent <g> translates it to the medallion centre. Stroke ~6, round caps. */
type Emblem = (c: EmblemCtx) => ReactNode;

const stroke = (accent: string) => ({
  fill: 'none',
  stroke: accent,
  strokeWidth: 6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

// ── MBTI emblems (keyed by 4-letter type) ──────────────────────────────────
const MBTI_EMBLEMS: Record<string, Emblem> = {
  // Architect — drafting compass
  INTJ: ({ accent, ink }) => (
    <g>
      <path d='M0 -26 L-15 24 M0 -26 L15 24' {...stroke(accent)} />
      <circle cx={0} cy={-26} r={5} fill={ink} />
      <path d='M-9 8 Q0 17 9 8' {...stroke(ink)} strokeWidth={4} />
    </g>
  ),
  // Logician — lightbulb of ideas
  INTP: ({ accent, ink }) => (
    <g>
      <path
        d='M-15 -6 a15 15 0 1 1 30 0 q0 9 -8 15 h-14 q-8 -6 -8 -15'
        {...stroke(accent)}
      />
      <path d='M-7 24 h14 M-5 31 h10' {...stroke(ink)} strokeWidth={4} />
    </g>
  ),
  // Commander — crown
  ENTJ: ({ accent, ink }) => (
    <g>
      <path
        d='M-26 18 L-22 -16 L-8 4 L0 -20 L8 4 L22 -16 L26 18 Z'
        {...stroke(accent)}
        fill={`${accent}1f`}
      />
      <path d='M-22 18 H22' {...stroke(ink)} strokeWidth={4} />
    </g>
  ),
  // Debater — clashing speech bubbles
  ENTP: ({ accent, ink }) => (
    <g>
      <path d='M-30 -18 h26 v18 h-16 l-6 8 v-8 h-4 Z' {...stroke(accent)} />
      <path
        d='M30 2 h-22 v16 h14 l6 7 v-7 h2 Z'
        {...stroke(ink)}
        strokeWidth={4.5}
      />
    </g>
  ),
  // Advocate — quiet candle flame
  INFJ: ({ accent, ink }) => (
    <g>
      <path
        d='M0 -28 Q12 -12 0 2 Q-12 -12 0 -28 Z'
        {...stroke(accent)}
        fill={`${accent}26`}
      />
      <rect
        x={-7}
        y={6}
        width={14}
        height={20}
        rx={3}
        {...stroke(ink)}
        strokeWidth={4.5}
      />
    </g>
  ),
  // Mediator — heart with a leaf
  INFP: ({ accent, ink }) => (
    <g>
      <path
        d='M0 22 C-26 4 -20 -22 0 -8 C20 -22 26 4 0 22 Z'
        {...stroke(accent)}
        fill={`${accent}1f`}
      />
      <path
        d='M0 -8 q10 -10 18 -6 q-4 10 -18 6'
        {...stroke(ink)}
        strokeWidth={4}
        fill={`${ink}14`}
      />
    </g>
  ),
  // Protagonist — radiant guiding star
  ENFJ: ({ accent, ink }) => (
    <g>
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={Math.cos(r) * 16}
            y1={Math.sin(r) * 16}
            x2={Math.cos(r) * 30}
            y2={Math.sin(r) * 30}
            {...stroke(accent)}
            strokeWidth={5}
          />
        );
      })}
      <circle
        cx={0}
        cy={0}
        r={12}
        {...stroke(ink)}
        strokeWidth={5}
        fill={`${accent}26`}
      />
    </g>
  ),
  // Campaigner — bright sparkles
  ENFP: ({ accent, ink }) => (
    <g>
      <path
        d='M-6 -22 L-2 -6 L14 -2 L-2 2 L-6 18 L-10 2 L-26 -2 L-10 -6 Z'
        {...stroke(accent)}
        fill={`${accent}26`}
      />
      <path
        d='M18 14 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3 l9 -3 Z'
        {...stroke(ink)}
        strokeWidth={3.5}
      />
    </g>
  ),
  // Logistician — checklist clipboard
  ISTJ: ({ accent, ink }) => (
    <g>
      <rect x={-20} y={-24} width={40} height={48} rx={6} {...stroke(accent)} />
      <rect
        x={-9}
        y={-30}
        width={18}
        height={10}
        rx={3}
        {...stroke(ink)}
        strokeWidth={4}
      />
      <path
        d='M-12 -4 l4 4 l8 -9 M-12 12 l4 4 l8 -9'
        {...stroke(ink)}
        strokeWidth={4}
      />
    </g>
  ),
  // Defender — shield with a heart
  ISFJ: ({ accent, ink }) => (
    <g>
      <path
        d='M0 -26 L22 -16 V4 Q22 22 0 30 Q-22 22 -22 4 V-16 Z'
        {...stroke(accent)}
        fill={`${accent}1a`}
      />
      <path d='M0 12 C-12 3 -9 -10 0 -3 C9 -10 12 3 0 12 Z' fill={ink} />
    </g>
  ),
  // Executive — gavel
  ESTJ: ({ accent, ink }) => (
    <g>
      <rect
        x={-22}
        y={-22}
        width={26}
        height={16}
        rx={4}
        transform='rotate(-40 -9 -14)'
        {...stroke(accent)}
        fill={`${accent}1f`}
      />
      <line x1={-2} y1={-6} x2={20} y2={20} {...stroke(ink)} strokeWidth={5} />
      <path d='M-14 26 h28' {...stroke(ink)} strokeWidth={5} />
    </g>
  ),
  // Consul — two caring hearts
  ESFJ: ({ accent, ink }) => (
    <g>
      <path
        d='M-6 18 C-26 4 -22 -18 -6 -8 C8 -18 14 2 -6 18 Z'
        {...stroke(accent)}
        fill={`${accent}1f`}
      />
      <path
        d='M14 26 C0 16 3 0 14 7 C24 0 28 14 14 26 Z'
        {...stroke(ink)}
        strokeWidth={4}
      />
    </g>
  ),
  // Virtuoso — wrench
  ISTP: ({ accent }) => (
    <g>
      <path
        d='M14 -26 a12 12 0 1 0 8 20 L-14 26 a8 8 0 0 1 -10 -10 L18 -16 a12 12 0 0 0 -4 -10 Z'
        {...stroke(accent)}
        fill={`${accent}14`}
      />
    </g>
  ),
  // Adventurer — mountain horizon
  ISFP: ({ accent, ink }) => (
    <g>
      <circle cx={14} cy={-14} r={7} {...stroke(accent)} fill={`${accent}33`} />
      <path
        d='M-28 22 L-8 -6 L4 10 L14 -4 L28 22 Z'
        {...stroke(ink)}
        strokeWidth={5}
        fill={`${ink}10`}
      />
    </g>
  ),
  // Entrepreneur — lightning bolt
  ESTP: ({ accent, ink }) => (
    <g>
      <path
        d='M6 -28 L-16 6 H-2 L-8 28 L18 -8 H2 Z'
        {...stroke(accent)}
        fill={`${accent}26`}
      />
      <path d='M6 -28 L-16 6 H-2' {...stroke(ink)} strokeWidth={3} />
    </g>
  ),
  // Entertainer — microphone
  ESFP: ({ accent, ink }) => (
    <g>
      <rect
        x={-11}
        y={-28}
        width={22}
        height={34}
        rx={11}
        {...stroke(accent)}
        fill={`${accent}1f`}
      />
      <path d='M-18 0 a18 18 0 0 0 36 0' {...stroke(ink)} strokeWidth={4.5} />
      <line x1={0} y1={18} x2={0} y2={30} {...stroke(ink)} strokeWidth={4.5} />
    </g>
  ),
};

// ── SBTI emblems (keyed by archetype code) ─────────────────────────────────
const SBTI_EMBLEMS: Record<string, Emblem> = {
  // The Goblin — mischief horns + grin
  GOBLIN: ({ accent, ink }) => (
    <g>
      <path
        d='M-22 -10 Q-26 -26 -14 -22 M22 -10 Q26 -26 14 -22'
        {...stroke(ink)}
        strokeWidth={5}
      />
      <path d='M-20 -8 Q0 8 20 -8' {...stroke(accent)} fill={`${accent}1f`} />
      <path d='M-12 8 q12 14 24 0' {...stroke(ink)} strokeWidth={4.5} />
    </g>
  ),
  // The NPC — dialog brackets with dots
  NPC: ({ accent, ink }) => (
    <g>
      <path
        d='M-12 -24 H-26 V24 H-12 M12 -24 H26 V24 H12'
        {...stroke(accent)}
      />
      <circle cx={-8} cy={0} r={3.5} fill={ink} />
      <circle cx={4} cy={0} r={3.5} fill={ink} />
      <circle cx={16} cy={0} r={3.5} fill={ink} />
    </g>
  ),
  // The Doomer — rain cloud
  DOOMER: ({ accent, ink }) => (
    <g>
      <path
        d='M-22 2 a11 11 0 0 1 6 -21 a14 14 0 0 1 27 3 a9 9 0 0 1 -3 18 Z'
        {...stroke(accent)}
        fill={`${accent}14`}
      />
      <path
        d='M-14 12 l-4 12 M2 12 l-4 12 M16 12 l-4 12'
        {...stroke(ink)}
        strokeWidth={4.5}
      />
    </g>
  ),
  // The Grindset — coffee + rising arrow
  GRINDSET: ({ accent, ink }) => (
    <g>
      <path
        d='M-18 0 H14 V12 a10 10 0 0 1 -10 10 H-8 a10 10 0 0 1 -10 -10 Z'
        {...stroke(accent)}
        fill={`${accent}1a`}
      />
      <path d='M14 4 h6 a6 6 0 0 1 0 12 h-6' {...stroke(accent)} />
      <path
        d='M-2 -8 V-26 M-10 -18 L-2 -26 L6 -18'
        {...stroke(ink)}
        strokeWidth={4.5}
      />
    </g>
  ),
  // The Main Character — spotlight star
  MAINCHAR: ({ accent, ink }) => (
    <g>
      <path
        d='M-18 -28 L-2 2 H-34 Z'
        {...stroke(ink)}
        strokeWidth={3.5}
        fill={`${accent}14`}
        transform='translate(18 0)'
      />
      <path
        d='M0 -4 l6 13 l14 1 l-11 9 l4 14 l-13 -8 l-13 8 l4 -14 l-11 -9 l14 -1 Z'
        {...stroke(accent)}
        fill={`${accent}26`}
      />
    </g>
  ),
  // The Ghost — friendly ghost
  GHOST: ({ accent, ink }) => (
    <g>
      <path
        d='M-18 26 V-4 a18 18 0 0 1 36 0 V26 l-7 -6 l-7 6 l-7 -6 l-8 6 Z'
        {...stroke(accent)}
        fill={`${accent}14`}
      />
      <circle cx={-7} cy={-4} r={3.5} fill={ink} />
      <circle cx={7} cy={-4} r={3.5} fill={ink} />
    </g>
  ),
  // The Simp — overflowing heart
  SIMP: ({ accent, ink }) => (
    <g>
      <path
        d='M0 26 C-30 4 -23 -24 0 -10 C23 -24 30 4 0 26 Z'
        {...stroke(accent)}
        fill={`${accent}2e`}
      />
      <path d='M-9 -2 q4 6 9 4' {...stroke(ink)} strokeWidth={3.5} />
    </g>
  ),
  // The Manager-Seeker — rules / exclamation tag
  KAREN: ({ accent, ink }) => (
    <g>
      <rect
        x={-20}
        y={-24}
        width={40}
        height={48}
        rx={6}
        {...stroke(accent)}
        fill={`${accent}12`}
      />
      <line x1={0} y1={-14} x2={0} y2={8} {...stroke(ink)} strokeWidth={6} />
      <circle cx={0} cy={17} r={3.5} fill={ink} />
    </g>
  ),
  // The Zen Master — lotus / calm rings
  ZEN: ({ accent, ink }) => (
    <g>
      <path
        d='M0 18 Q-22 8 -24 -10 Q-8 -2 0 14 Q8 -2 24 -10 Q22 8 0 18 Z'
        {...stroke(accent)}
        fill={`${accent}1a`}
      />
      <path
        d='M0 16 Q-10 -10 0 -24 Q10 -10 0 16 Z'
        {...stroke(ink)}
        strokeWidth={4}
      />
    </g>
  ),
  // The Clown — nose + smile + tuft
  CLOWN: ({ accent, ink }) => (
    <g>
      <path d='M-20 -4 Q0 14 20 -4' {...stroke(ink)} strokeWidth={5} />
      <circle cx={0} cy={6} r={9} {...stroke(accent)} fill={`${accent}33`} />
      <path
        d='M-22 -14 q6 -8 12 -2 M22 -14 q-6 -8 -12 -2'
        {...stroke(accent)}
        strokeWidth={5}
      />
    </g>
  ),
  // The Gigachad — strength chevrons
  GIGACHAD: ({ accent, ink }) => (
    <g>
      <path d='M-26 4 L0 -22 L26 4' {...stroke(accent)} />
      <path d='M-26 20 L0 -6 L26 20' {...stroke(ink)} strokeWidth={5} />
    </g>
  ),
  // The Burnout — low battery
  BURNOUT: ({ accent, ink }) => (
    <g>
      <rect x={-26} y={-12} width={44} height={24} rx={5} {...stroke(accent)} />
      <rect x={18} y={-5} width={7} height={10} rx={2} fill={ink} />
      <rect x={-21} y={-7} width={9} height={14} rx={2} fill={accent} />
    </g>
  ),
  // The People-Pleaser — yes + sweat
  YESMAN: ({ accent, ink }) => (
    <g>
      <path d='M-20 0 l12 14 l24 -28' {...stroke(accent)} strokeWidth={7} />
      <path
        d='M18 8 q6 8 0 13 q-6 -5 0 -13 Z'
        {...stroke(ink)}
        strokeWidth={3.5}
        fill={`${ink}1f`}
      />
    </g>
  ),
  // The Overthinker — spiral
  OVERTHINK: ({ accent }) => (
    <g>
      <path
        d='M2 2 m0 0 a4 4 0 1 1 6 2 a10 10 0 1 1 -14 4 a18 18 0 1 1 26 6 a26 26 0 1 1 -36 8'
        {...stroke(accent)}
        strokeWidth={5}
      />
    </g>
  ),
  // The Drunk — tilted glass
  DRUNK: ({ accent, ink }) => (
    <g transform='rotate(12)'>
      <path
        d='M-20 -18 H20 L4 6 V24 H-4 V6 Z'
        {...stroke(accent)}
        fill={`${accent}1a`}
      />
      <path d='M-12 -18 L0 -4 L12 -18' {...stroke(ink)} strokeWidth={3.5} />
    </g>
  ),
  // The Wildcard — question dice
  HHHH: ({ accent, ink }) => (
    <g>
      <rect
        x={-22}
        y={-22}
        width={44}
        height={44}
        rx={9}
        {...stroke(accent)}
        fill={`${accent}12`}
      />
      <path
        d='M-8 -8 q0 -10 8 -10 q9 0 9 8 q0 6 -8 9 v4'
        {...stroke(ink)}
        strokeWidth={5}
      />
      <circle cx={1} cy={16} r={3.5} fill={ink} />
    </g>
  ),
};

function getEmblem(code: string): Emblem | null {
  const upper = code.toUpperCase();
  if (SBTI_EMBLEMS[upper]) return SBTI_EMBLEMS[upper];
  const type4 = upper.slice(0, 4);
  if (MBTI_EMBLEMS[type4]) return MBTI_EMBLEMS[type4];
  return null;
}

/** Whether we have bespoke artwork for this result code. */
export function hasPersona(code: string): boolean {
  return getEmblem(code) !== null;
}

interface PersonaAvatarProps {
  code: string;
  accent: string;
  size?: number;
}

/* Hand-drawn medallion: paper disc + accent glow + a ring of sun-ray ticks
   (echoing SceneHeader's sun) framing the persona's signature emblem. */
export function PersonaAvatar({
  code,
  accent,
  size = 120,
}: PersonaAvatarProps) {
  const emblem = getEmblem(code);
  const gid = `persona-${code.replace(/[^a-z0-9]/gi, '')}`;
  const ticks = Array.from({ length: 24 }, (_, i) => (i * 360) / 24);

  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 200 200'
      aria-label={`${code} illustration`}
      role='img'
    >
      <defs>
        <radialGradient id={gid} cx='50%' cy='42%' r='60%'>
          <stop offset='0%' stopColor={`${accent}30`} />
          <stop offset='70%' stopColor='#faf9f5' />
          <stop offset='100%' stopColor='#f3f1ea' />
        </radialGradient>
      </defs>

      {/* paper disc with accent glow */}
      <circle cx={100} cy={100} r={94} fill={`url(#${gid})`} />

      {/* hand-drawn ray ring */}
      <g transform='translate(100 100)'>
        {ticks.map((a) => {
          const r = (a * Math.PI) / 180;
          const inner = 78;
          const outer = a % 30 === 0 ? 90 : 85;
          return (
            <line
              key={a}
              x1={Math.cos(r) * inner}
              y1={Math.sin(r) * inner}
              x2={Math.cos(r) * outer}
              y2={Math.sin(r) * outer}
              stroke={accent}
              strokeWidth={a % 30 === 0 ? 2.4 : 1.4}
              strokeLinecap='round'
              opacity={0.55}
            />
          );
        })}
      </g>

      {/* inner outline ring */}
      <circle
        cx={100}
        cy={100}
        r={70}
        fill='none'
        stroke={INK}
        strokeWidth={2.4}
        opacity={0.4}
      />

      {/* signature emblem */}
      {emblem ? (
        <g transform='translate(100 100)'>{emblem({ accent, ink: INK })}</g>
      ) : (
        <text
          x={100}
          y={118}
          textAnchor='middle'
          fontSize={56}
          fontWeight={800}
          fill={accent}
        >
          {code.slice(0, 2).toUpperCase()}
        </text>
      )}
    </svg>
  );
}
