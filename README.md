# Ravi Kumar · Virtual Executive Portfolio (v3)

An interactive portfolio where Ravi's virtual character guides visitors through his finance leadership career.
Vite + React + TypeScript, GSAP + Lenis for motion, a 2D-canvas globe, optional Supabase for saved messages.

## Concept

**3D virtual human + cinematic executive portfolio + interactive finance dashboard.** Ravi is docked beside the content on wide screens. He changes pose by section, leans toward the cursor, and speaks in a bubble. Hovering, focusing or tapping a section, card or nav item makes him gesture toward it.

## Page structure

| Section | Avatar state | Notes |
|---|---|---|
| Intro (skippable, ~2 s) | — | Light sweep and name |
| Hero | greeting | Ravi's own photos (`hero-1`, `hero-2`) crossfade slowly; the intro clip plays over them with captions |
| KPI strip | — | 15+ · 17 · 3 · 25+ · US$456M, animated counters |
| About | about (arms crossed) | Lanyard ID card (`IdCard.tsx`): swings, tilts, flips to credentials and contact |
| Experience | experience (walking) | Expandable timeline, 4 roles |
| Expertise | skills (pointing) | 15 cards with cursor spotlight |
| Command Center | presenting | 5 modules, charts labelled "Illustrative visualization" |
| Achievements | achievement (confident) | 9 resume-backed cards |
| Finance Transformation | presenting → pointing | 7 stages; Ravi narrates the active stage |
| Global | presenting | Dotted globe: India, US, Middle East with arcs |
| Leadership | about | 6 traits, each tied to a resume line |
| Education | education (certificate) | CA ICAI 2017, B.Com 2009 |
| Ask Ravi | explaining | 10 predefined questions, resume-only answers, read aloud |
| Contact | contact (waving) | Resume details + optional saved message form |

## Avatar system

- `src/lib/avatar.ts`: the state machine. Scroll state comes from `data-avatar` on sections, with an optional `data-avatar-line` for the bubble text. Hover and focus state comes from `data-avatar-hover` on any element. Explicit speech comes from `avatar.say()`.
- `src/components/AvatarGuide.tsx`: the docked guide on wide screens, a compact button with a tap-to-open bubble on smaller screens.
- Poses are transparent WebP files in `public/ravi/avatar-*.webp`. Only idle and greeting preload; the rest load on first use.
- Lossless originals are in `assets-src/avatars/`. These are not deployed. All poses and the hero share one face, matched to Ravi's photo (`id-photo.webp`).

To add or replace a pose, export a transparent image, save it as `public/ravi/avatar-<state>.webp`, and map it in `POSES`.

## Voice

Ravi narrates the site with **pre-recorded clips** in an AI clone of his own voice, made from his WhatsApp voice note with his permission (Chatterbox TTS, zero-shot cloning). There is no background music. The footer says the voice is an AI clone.

- **Intro**: when the opening animation ends, he introduces himself automatically.
- **Hover / focus / tap**: pointing at any card, role, stat, stage or nav item for about 0.35 s makes him gesture toward it and explain it aloud. A new item stops the current clip and starts the next.
- **Ask Ravi**: each answer is read aloud.
- **Browser rule**: sound cannot play before the visitor's first click, tap or key press. If the intro is blocked, a "Tap to hear Ravi" button shows; one click plays it, and hover narration works from then on.
- **Controls**: Pause, Resume, Stop and Mute while speaking; a 🔊/🔇 toggle otherwise. Mute is remembered per browser.
- Any text without a clip (for example answers from `VITE_ASK_ENDPOINT`) falls back to a male browser voice.
- **Voice match**: every clip was checked against Ravi's voice note with a speaker-verification model (ECAPA, average similarity about 0.78; his own note scores 0.86 against itself) and transcribed back to confirm the words.
- **Hero photos**: `public/ravi/hero-<n>.webp` (1920×1080, subject on the right, dark space left for text), `hero-<n>-md.webp` (1280×720) and `hero-<n>-m.webp` (portrait, phones). The list is `SLIDES` in `src/sections/Hero.tsx`. `hero-poster.webp` (1200×675) is the social share image.
- **Speed**: all clips play at 1.10x of the cloned voice (sped up with pitch kept, `atempo=1.10`). Apply the same to any new line.
- **Re-recording**: clone from the same voice note, 24 kHz mono MP3, loudness normalised to -16 LUFS, so new lines match the rest.

Clips live in `public/voice/<key>.mp3`; `src/data/voice-manifest.json` maps line keys to files. To change a line:

```bash
# 1. edit the text in src/content.ts (say.*, askRavi) or src/lib/avatar-lines.ts
npm run -s voice:lines > voice-lines.json   # lists every line, its key and the text to record
# 2. record the changed line(s) with the same voice and save as public/voice/<key>.mp3
npm run voice:manifest                       # rebuild the manifest
```

## Content

Every word is in `src/content.ts`. The resume is the only factual source, so do not add dates, metrics, titles or achievements that are not on it.

When the Miles Education logo is supplied, put it in `public/brand/` and set `profile.employerLogo`.

## Run

```bash
npm install
cp .env.example .env     # optional
npm run dev              # http://localhost:5173
npm run build            # type-check + build to dist/
npm run preview          # http://localhost:4173
```

## Environment variables (optional)

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Final domain, e.g. `https://ravikumar.in`. Adds the canonical URL, absolute OG image and `sitemap.xml`. |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Saved contact messages. See `supabase/schema.sql`. Anon key only. |
| `VITE_ASK_ENDPOINT` | Server endpoint for LLM answers in Ask Ravi: POST `{question, context}` → `{answer}`. The LLM key stays on that server. |

Without Supabase, the form opens the visitor's email app. Without `VITE_ASK_ENDPOINT`, Ask Ravi uses the predefined answers.

## Deploy

- **Render (Static Site)**: build `npm ci && npm run build`, publish directory `dist`, add env vars.
- **Vercel / Netlify**: Vite preset, output `dist`.

## Git

```bash
git checkout v3-virtual-guide     # this version
git push -u origin v3-virtual-guide
```

Never commit `.env`, keys or tokens.

## Performance

- Hero photos are about 30–40 KB each; only the first loads eagerly. Reduced-motion users get the first photo without the crossfade.
- There is no WebGL; the globe is a 2D canvas that pauses when off screen.
- Each avatar pose is about 50 KB and loads lazily. Supabase loads only on submit.
- With reduced motion turned on, the intro, smooth scroll and animations are skipped.

## Accessibility

- Skip link, semantic landmarks, visible focus outlines and ARIA labels.
- Every hover interaction also works with keyboard focus and touch.
- The globe rotates with drag or the arrow keys.

## To confirm with Ravi

- Region notes on the globe (US entities · US GAAP, Regional entities) are groupings, not resume quotes
- The Miles Education logo (not yet supplied)
- The final domain, for `VITE_SITE_URL`
- Optional: real testimonials, with permission

Avatar images are AI-generated from his photo. Keep the disclosure in the footer.
