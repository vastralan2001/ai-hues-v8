---
name: story-demo
description: Hand-author a unique, content-specific Stories visual ("demo") for one AIHues article — an animated rough.js + Framer Motion SVG scene. Use when adding or redrawing a story's cover scene in apps/aihues-web. One article at a time; never batch, template, or auto-generate.
---

# Authoring a Stories demo scene

Each AIHues article has a bespoke **scene**: a small animated SVG illustration that
stands in for a cover image. Every scene is **hand-authored for that one article** —
you read the article, invent a single visual metaphor for *its* idea, and draw it.

**Hard rules (the user is emphatic about these):**

- **One article at a time, individually.** Never write a function that maps
  metadata → scene. No templates, no shared "layouts", no randomness, no bulk
  recolor. Two articles must never resolve to the same composition.
- **Content-specific metaphor.** The scene must relate to *this* article's thesis.
  ("Hidden costs of AI writing" → an iceberg; "Solo founding" → a lone climber
  among vast summits; "React Server Components" → a quiet orbital system.) If a
  reader who knows the article sees the scene, the connection should feel obvious.
- **Hand-drawn, textured, premium.** Sketchy rough.js strokes + hachure fills over
  a soft gradient sky. Atmospheric and a little epic — generous negative space,
  a single understated focal subject, thin muted ink. **No cartoon faces**, no
  childish clip-art. Think editorial illustration, not emoji.

## Where scenes live

```
apps/aihues-web/app/components/story-scenes/_kit.tsx      ← shared primitives (do not template scenes here)
apps/aihues-web/app/components/story-scenes/<slug>.tsx    ← ONE file per article, default-exports the scene
apps/aihues-web/app/components/story-scenes/registry.ts   ← GENERATED — never hand-edit
apps/aihues-web/app/components/story-svg.tsx              ← merges hand-authored + generated into STORY_SVG
```

`<slug>` is the article's slug from `content/resources/posts.json` (kebab-case, a
safe filename). `StoryArt` renders `STORY_SVG[slug]` and falls back to the canvas
interpreter for slugs with no scene yet.

## The kit (import from `./_kit`)

```tsx
'use client';
import {
  Frame, Ink, Twinkle, Cloud, gen, filled, stroke, loop, linear, INK, motion,
} from './_kit';
```

- **`<Frame sky={['#hi','#lo']}>…</Frame>`** — gradient-sky `<div>` + a `200×100`
  `<svg>` (full-bleed, `xMidYMid slice`). The sky sets the mood/time-of-day.
- **`gen`** — a rough.js generator. Build drawables with `gen.path(d, opts)`,
  `gen.polygon(points, opts)`, `gen.circle(cx,cy,diameter,opts)`,
  `gen.ellipse(cx,cy,w,h,opts)`, `gen.line(x1,y1,x2,y2,opts)`, `gen.rectangle(x,y,w,h,opts)`.
- **`<Ink d={drawable} />`** — renders a drawable's sketchy op-sets as SVG paths.
- **`filled(seed, color, over?)`** — hachure-filled preset; pass `{fillStyle:'solid'}`
  for a flat fill. **`stroke(seed, over?)`** — outline-only preset.
  **Every shape needs a UNIQUE integer `seed`** (so rough is deterministic for SSR
  *and* so no two shapes share the same wobble). Use a per-file seed block, e.g.
  scene "ph" → 11,12,13…; another scene → 31,32,33…
- **`<Twinkle x y d? r? c? />`** — a twinkling star/spark. **`<Cloud x y s? o? />`** —
  soft sky cloud (plain fill, sits behind the rough subject).
- **`loop(dur, delay?)`** (easeInOut, infinite) and **`linear(dur)`** — transition
  presets for `motion`. Wrap rough shapes in `<motion.g animate={…} transition={…}
  style={{transformOrigin:'Xpx Ypx'}}>` for bobbing, rotation, sway, pulse.
- Gradients (sun glow, water, planet) are plain `<defs><radialGradient>/<linearGradient></defs>`
  + `<rect/circle fill="url(#id)">`. **Prefix gradient ids per scene** (e.g. `ph_sun`)
  so multiple scenes on the /stories grid never collide.

## Composition guidance

- **Layout:** soft gradient sky → distant layers (clouds, far hills/mountains,
  horizon, water line) for depth → one focal subject, small, with breathing room
  → a few twinkles/accents toward the edges. Keep the subject within ~x:[20,180],
  y:[20,80]; let the atmosphere bleed to the edges.
- **Palette:** AIHues family hues — terracotta `#c2502e`/`#e2693f`, gold
  `#e0a83f`/`#cf9836`, sage `#788c5d`/`#94ac78`, slate-blue `#6a9bcc`/`#5a86c5`,
  warm ink `INK`. Pick a sky that matches the article's mood. Light surfaces only
  (never dark mode).
- **Motion:** gentle and slow (1.5–3s loops); one or two moving elements, not a
  busy screen. Flowing dashed paths (`strokeDasharray` + animate `strokeDashoffset`
  with `linear`) read as trails/progress; `skewX` reads as a waving flag; slow
  `rotate` for orbits; `y`/`scale` for bob/breathe.
- **Texture:** lean on rough's `roughness` (1–1.6) and hachure fills for the
  hand-drawn quality. Thin ink (`strokeWidth` ~1–1.3). Outlines should look drawn,
  not CAD.

## Reference scenes (study, do not copy)

The six already-authored scenes are the bar to match — read them for technique,
then design something *different* for your article:
`launching-on-product-hunt-what-worked-in-2026` (rocket/dawn),
`claude-3-7-vs-gpt-4o-…` (two model panels + spark),
`app-store-optimization-…` (app climbing a growth curve to a star),
`the-hidden-costs-of-ai-writing-tools-…` (iceberg),
`solo-founding-…` (lone climber, layered summits),
`react-server-components-…` (orbital system over a planet).

## Process for one article

1. Read the article in `content/resources/posts.json` (title, tag, excerpt,
   description). Name its core idea in one sentence.
2. Invent ONE concrete visual metaphor for that idea — distinct from every other
   scene. Sketch the composition (sky, depth layers, focal subject, motion).
3. Write `app/components/story-scenes/<slug>.tsx`: `'use client'`, import the kit,
   `export default function Scene() { return <Frame …>…</Frame>; }`. Unique seeds,
   prefixed gradient ids.
4. Regenerate the registry and verify (from `apps/aihues-web`):
   ```
   node scripts/gen-story-registry.mjs
   npx tsc -p . --noEmit
   ```
   Then a build (`npx next build`) confirms it prerenders under SSR — rough must be
   deterministic (fixed seeds), or hydration will mismatch.

## Scene file template (structure only — fill with a UNIQUE composition)

```tsx
'use client';
import { Frame, Ink, Twinkle, Cloud, gen, filled, stroke, loop, linear, INK, motion } from './_kit';

export default function Scene() {
  return (
    <Frame sky={['#__hi', '#__lo']}>
      <defs>{/* <radialGradient id="<slug>_glow">… */}</defs>
      {/* distant layers for depth */}
      {/* the focal subject, drawn with gen.* + <Ink>, wrapped in <motion.g> */}
      {/* a few <Twinkle/> accents */}
    </Frame>
  );
}
```

## More primitives (lucide-inspired) + current rules

The kit now exports richer rough building blocks — prefer these over plain SVG:

- **`<RoughDash d c? w? dur? dash? />`** — a rough, animated dashed trail. **Use
  this for every trail / path / dashed line.** Never use a plain
  `<motion.path strokeDasharray>` — dashed lines must be hand-drawn too.
- **`<Star x y r? c? seed? />`** — a rough 5-point star (lucide `star`), a
  characterful accent. **`<Sun x y r? c? ray? seed? />`** — rough sun + rays
  (lucide `sun`). **`<Mountains peaks base? color? seed? />`** — layered rough
  hills (`peaks` = `[leftX, peakX, peakY][]`). **`<Bolt x y s? c? seed? />`** —
  rough lightning (lucide `zap`).
- Look at lucide-react icons for metaphor inspiration (the article's idea → an
  icon → a rough scene element), but always *redraw* it rough; never import the
  icon component itself.

**Hard rules (latest):**
1. **Everything is rough except the one big background.** The gradient sky in
   `Frame` is the only non-rough element. Water, waterlines, trails, glow rims,
   stars, suns, hills, the focal subject — all drawn with `gen.*` + `<Ink>` /
   the kit primitives. No plain `<rect>`/`<line>`/`<circle>`/`<motion.path>`
   shapes (a soft `url(#glow)` radial behind the subject is the one allowed
   exception).
2. **Don't overuse decorations.** At most **1–2** `Twinkle`s, **1** `Cloud`, and
   **1** dashed trail per scene. The bespoke focal subject carries the scene;
   sparkles/clouds/dashes are seasoning, not filler.
