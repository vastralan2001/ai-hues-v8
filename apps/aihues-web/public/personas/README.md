# Persona character art — drop slots

Character images for the **MBTI** and **SBTI** result + share pages. Drop a PNG
into the matching path and it shows up automatically. Until a file exists, the
page renders a neutral reserved-slot placeholder, so the layout never breaks.

## Spec

- **Format:** PNG (transparent background recommended; flat background also fine)
- **Shape:** square **1:1**
- **Size:** 512×512 px (anything square works; it's scaled to fit)
- **Framing:** head-and-shoulders bust, centered, looking forward — it's shown
  inside a rounded medallion, so keep the character roughly centered and avoid
  important detail in the far corners.

## Filenames

### MBTI — `public/personas/mbti/<type>.png` (16)

```
intj.png  intp.png  entj.png  entp.png
infj.png  infp.png  enfj.png  enfp.png
istj.png  isfj.png  estj.png  esfj.png
istp.png  isfp.png  estp.png  esfp.png
```

The four-letter type is taken from the result code (e.g. `INTJ-A` → `intj.png`),
so the Assertive/Turbulent suffix shares one image.

### SBTI — `public/personas/sbti/<code>.png` (16)

```
goblin.png    npc.png       doomer.png    grindset.png
mainchar.png  ghost.png     simp.png      karen.png
zen.png       clown.png     gigachad.png  burnout.png
yesman.png    overthink.png drunk.png     hhhh.png
```

`drunk` is the hidden archetype; `hhhh` is the Wildcard fallback.

## How it's wired

- `app/lib/tests/persona-art.ts` → `personaImageSrc(slug, code)` builds the path.
- `app/components/tests/PersonaImage.tsx` → shows the image, or
  `PersonaPlaceholder` if the file is missing (graceful fallback via `onError`).
- Used on the in-quiz result (`QuizRunner`) and the share page
  (`app/tests/[slug]/result`). `mensa` / `sbinet` keep the generative
  `TestAvatar`.
