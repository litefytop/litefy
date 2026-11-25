---
version: alpha
name: Litefy UI — Neon Gradient
description: Design language of the Litefy UI neon gradient style template — two tiers (pale purple day / deep blue night), gradient family fills re-depthed per tier, contrast borders (amber-700 day / yellow-400 night), family-coloured soft shadows by day and neon glows by night. The YAML block is the sole numeric authority for tokens; the prose states rules and destinations.
colors:
  background: 'oklch(97.5% 0.015 325)'
  foreground: 'oklch(25% 0.09 325)'
  surface: '#e9d5ff'
  surface-fg: 'oklch(38% 0.1 325)'
  disabled: '#e9d5ff'
  disabled-fg: 'oklch(38% 0.1 325)'
  accent: '#f9a8d4'
  accent-fg: '#0f0a1e'
  border: '#b45309'
  primary: '#7e22ce'
  primary-fg: '#ffffff'
  primary-accent: '#be185d'
  danger-fg: '#ffffff'
  danger: '#b91c1c'
  danger-accent: '#991b1b'
  info-fg: '#ffffff'
  info: '#0369a1'
  info-accent: '#075985'
  success-fg: '#ffffff'
  success: '#15803d'
  success-accent: '#166534'
  warning-fg: '#ffffff'
  warning: '#b45309'
  warning-accent: '#92400e'
  dark-background: 'oklch(25% 0.07 262)'
  dark-foreground: '#ffffff'
  dark-surface: '#a855f7'
  dark-surface-fg: '#0f0a1e'
  dark-disabled: '#3b2457'
  dark-disabled-fg: '#d8b4fe'
  dark-accent: '#f472b6'
  dark-accent-fg: '#0f0a1e'
  dark-border: '#fbbf24'
  dark-primary: '#c084fc'
  dark-primary-fg: '#0f0a1e'
  dark-primary-accent: '#ec4899'
  dark-danger-fg: '#0f0a1e'
  dark-danger: '#f87171'
  dark-danger-accent: '#fb7185'
  dark-info-fg: '#0f0a1e'
  dark-info: '#38bdf8'
  dark-info-accent: '#0ea5e9'
  dark-success-fg: '#0f0a1e'
  dark-success: '#22c55e'
  dark-success-accent: '#4ade80'
  dark-warning-fg: '#0f0a1e'
  dark-warning: '#fbbf24'
  dark-warning-accent: '#d97706'
typography:
  sans:
    fontFamily: '"Segoe UI", "Helvetica Neue", system-ui, sans-serif'
  mono:
    fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  headline:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 'clamp(2.25rem, 1.5rem + 3vw, 3.75rem)'
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: -0.01em
  h1:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 2.25rem
    fontWeight: 900
    lineHeight: 1.15
  h2:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1.75rem
    fontWeight: 900
    lineHeight: 1.15
  h3:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.2
  h4:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.3
  h5:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1.125rem
    fontWeight: 700
    lineHeight: 1.35
  h6:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1rem
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1rem
    lineHeight: 1.7
  label:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 0.875rem
    fontWeight: 700
    letterSpacing: 0.08em
    textTransform: uppercase
  overline:
    fontFamily: '{typography.mono.fontFamily}'
    fontSize: 0.75rem
    fontWeight: 500
    letterSpacing: 0.1em
    textTransform: uppercase
  kicker:
    fontFamily: '{typography.mono.fontFamily}'
    fontSize: 1.625rem
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: 0.1em
    textTransform: uppercase
layout:
  spacing-base: 0.25rem
  height-control: 2.75rem
  height-field: 2.75rem
  stroke: 4px
  padding-control-x: 0.75rem
  padding-pill-x: 1.375rem
  padding-panel: 1.5rem
  radius-md: 0.75rem
  radius-lg: 1rem
  radius-2xl: 1.5rem
motion:
  duration-sm: 150ms
  duration-md: 300ms
  duration-lg: 300ms
  duration-frame: 300ms
  duration-flow: 500ms
  ease-frame: 'cubic-bezier(0.4, 0, 0.2, 1)'
  translate-lift: 0rem
  translate-crush: 0rem
shadows:
  frame: '0 0 20px rgba(236, 72, 153, 0.5)'
  frame-hover: '0 0 30px rgba(236, 72, 153, 0.7)'
  frame-active: 'inset 0 0 20px rgba(255, 255, 255, 0.8)'
  block: '0 0 30px rgba(168, 85, 247, 0.4)'
  block-hover: '0 0 40px rgba(168, 85, 247, 0.6)'
  elevated: '0 0 40px rgba(168, 85, 247, 0.6)'
  focus-glow: '0 0 20px rgba(34, 211, 238, 0.3)'
  unchecked: 'var(--shadow-frame), 0 0 0 2px var(--background), 0 0 0 4px var(--surface-fg)'
shadows-light:
  frame: '0 2px 12px rgba(190, 24, 93, 0.35)'
  frame-hover: '0 4px 18px rgba(190, 24, 93, 0.45)'
  frame-active: 'inset 0 0 16px rgba(126, 34, 206, 0.35)'
  block: '0 4px 20px rgba(126, 34, 206, 0.28)'
  block-hover: '0 6px 26px rgba(126, 34, 206, 0.38)'
  elevated: '0 6px 26px rgba(126, 34, 206, 0.38)'
  focus-glow: '0 2px 10px rgba(14, 116, 144, 0.35)'
  unchecked: 'var(--shadow-frame), 0 0 0 2px var(--background), 0 0 0 4px var(--surface-fg)'
gradients:
  brand: 'linear-gradient(90deg, #22d3ee, #ec4899, #22d3ee)'
  primary-accent: 'linear-gradient(90deg, #22d3ee, #ec4899, #22d3ee)'
  surface: 'linear-gradient(135deg, #a855f7, #ec4899, #f43f5e)'
  accent: 'linear-gradient(135deg, #f472b6, #a855f7)'
  danger: 'linear-gradient(135deg, #ec4899, #fb7185, #ef4444)'
  success: 'linear-gradient(135deg, #22d3ee, #14b8a6, #22c55e)'
  warning: 'linear-gradient(135deg, #facc15, #4ade80, #22d3ee)'
  info: 'linear-gradient(135deg, #22d3ee, #3b82f6)'
gradients-light:
  brand: 'linear-gradient(90deg, #0e7490, #be185d, #0e7490)'
  primary-accent: 'linear-gradient(90deg, #0e7490, #be185d, #0e7490)'
  surface: 'linear-gradient(135deg, #e9d5ff, #fbcfe8, #fecdd3)'
  accent: 'linear-gradient(135deg, #f9a8d4, #d8b4fe)'
  danger: 'linear-gradient(135deg, #be185d, #be123c, #b91c1c)'
  success: 'linear-gradient(135deg, #0e7490, #0f766e, #15803d)'
  warning: 'linear-gradient(135deg, #b45309, #15803d, #0e7490)'
  info: 'linear-gradient(135deg, #0e7490, #1d4ed8)'
scrollbar-thumb: 'linear-gradient(180deg, #0e7490, #be185d)'
scrollbar-thumb-hover: 'linear-gradient(180deg, #be185d, #0e7490)'
dark-scrollbar-thumb: 'linear-gradient(180deg, #22d3ee, #ec4899)'
dark-scrollbar-thumb-hover: 'linear-gradient(180deg, #ec4899, #22d3ee)'
link: '#0e7490'
dark-link: '#22d3ee'
glow:
  color: 'rgba(34, 211, 238, 0.7)'
  size: 12rem
  width: 2px
well:
  color: '{colors.surface}'
  dark-color: '#3b2457'
  padding: 0rem
  shadow: none
  dark-shadow: none
---

# Neon Gradient — the scheme's own rules

1. **Numeric authority**: the YAML above is the scheme's sole numeric authority; where this prose and a Litefy contract disagree, the Litefy contract (blueprint `ui/schemes.md`) wins and the difference is recorded here.
2. **Two tiers, one gradient language**: the day tier is a pale purple canvas (`oklch(97.5% 0.015 325)`) with deep purple ink; the night tier is a deep blue canvas (`oklch(25% 0.07 262)`) with white ink. The site's day/night toggle is live (`:root` answers `color-scheme: light`, `.dark` answers `color-scheme: dark`), and the code lane follows the tier through shiki's default light/dark split — no scheme-level override. Hue families and the gradient language survive both tiers; only depth and canvas shift (blueprint `ui/schemes.md` rule 16).
3. **Full-gradient paint — fill lane, not the token**: colour tokens stay solid (purple brand, pink accent, red danger, cyan-blue info, green success, yellow warning) because text, borders, focus rings, shadows and derivations read them. The paint happens at the fill lane (blueprint rule 4): every isomorphic `bg-*` utility emits its solid token as `background-color` plus the scheme's fill variable as `background-image` — `--fill-primary` / `--fill-primary-accent` / `--fill-surface` / `--fill-accent` / `--fill-danger` / `--fill-danger-accent` / `--fill-success` / `--fill-success-accent` / `--fill-warning` / `--fill-warning-accent` / `--fill-info` / `--fill-info-accent`, answered per tier from the YAML `gradients-light` (day) / `gradients` (night) blocks — buttons flow to-r, cards paint to-br. Variants compose the same utility body, so every state paints the same gradient. `--fill-background` stays undeclared — the canvas colour is solid by definition, the utility's fallback answers `none`, and variants stacking `bg-background` over a family fill (the lattice loader's done/error cells) clear the gradient image with the colour. The lattice wave itself animates OPACITY over the cells' gradient fill — lit cells show the active tier's full surface gradient, dim cells let the canvas through. The lone exemption is `bg-primary-solid` (solid `--color-primary` + `background-image: none`), reserved for icon-grade indicators — checkbox / radio boxes and timeline dots — where a gradient needs room the 16px box does not have and the 200% fill compresses into a hard two-colour split (user ruling 2026-11-22).
4. **Fluid Luminescence**: the brand fill (`bg-primary`) is the brand button — a cyclic cyan→pink→cyan gradient (700 depth by day, 400/500 neon by night) at 200% size parked left; `--fill-primary-accent` answers `var(--fill-primary)` (same image, same size), so the brand hover (`hover:bg-primary-accent`) just slides `background-position` to the right over 500ms ease-out (YAML `motion.duration-flow`). Hover and press never move or scale the button — `lift` / `crush` answer as explicit no-ops (Litefy ruling), the feedback is the glow or soft shadow and the colour flow under the text.
5. **Contrast borders, border-4 floor**: one 4px stroke reads every border-width role; `--border` is the style's contrast wire — amber-700 (`#b45309`, 4.7:1 on the pale canvas) by day, yellow-400 by night — the signature edge against the purple-pink fills. Filled icon-grade indicators (checkbox / radio boxes, timeline dots) drop the border outright: a 4px stroke inside a 16px box leaves only an 8px paint area and drowns the check glyph (user ruling 2026-11-22) — the empty frame keeps the wire, the filled state paints edge to edge under the glow ring.
6. **Family-coloured elevation, tiered**: by night, controls glow pink (`0 0 20px rgba(236,72,153,0.5)`, hover 30px/0.7), cards glow purple (`0 0 30px rgba(168,85,247,0.4)`, hover 40px/0.6), focus glows cyan (`0 0 20px rgba(34,211,238,0.3)`). By day, glows have no physical basis on a light canvas, so the same families answer as offset soft shadows (pink `0 2px 12px rgba(190,24,93,0.35)` for controls, purple `0 4px 20px rgba(126,34,206,0.28)` for cards, cyan-700 `0 2px 10px rgba(14,116,144,0.35)` for focus; values in `shadows-light`). The press is electric activation in both tiers — inset purple by day, inset white by night (`frame-active`) — never scaling or displacement.
7. **Large rounding**: buttons md (12px ≈ rounded-xl), cards lg (16px ≈ rounded-2xl), shells xl/2xl; pills and discs fully round. `rounded-none` is a forbidden class in this style.
8. **Labels uppercase**, tracking 0.08em; JetBrains Mono is the mono face; headings ride `--text-h1…h6` at weights 700/900. The headline display tier (`typo-headline`) answers the fluid clamp(2.25rem → 3.75rem) at weight 900 for first-screen titles only — one per screen, never inside the long-form scope. The kicker tier (`typo-kicker`) is the golden display lead-in above the headline — 1.625rem (body × φ, Fibonacci 13/8) / 500 / 0.1em uppercase. The overline tier (`typo-overline`) stays 0.75rem / 500 / 0.1em uppercase for section eyebrow lines, always smaller than the heading it labels.
9. **Motion**: duration-300 across the frame, the brand flow 500ms, `ease-frame` standard ease — no fast or linear motion. Colour transitions are legal in `motion-frame`; reduced-motion zeroes everything through the base contract.
10. **Contrast budget, tiered — ink depth swaps with the tier**: by day, white ink passes on every jewel-depth (700/800) action and status gradient stop (5.0:1 and up), deep purple ink (`surface-fg`) passes on the pastel surface gradient, and dark ink answers the pink-300 accent solid; the amber-700 border reads 4.7:1 on the pale canvas and the cyan-700 focus ring 5.1:1 (cyan-400 would read only 1.8:1 there). Independent status text, icons and borders use `text-<status>-independent` / `border-<status>-independent`; both tiers read the solid `<status>` token, so day text stays jewel-deep instead of taking the white fill foreground. By night, deep ink (`#0f0a1e`) answers every family `-fg` on the neon fills — white would read only 1.8:1 on the cyan-400 flow stop, 2.7:1 on rose-400 and 3.5-4.0:1 on the 500-depth surface stops, while deep ink reads 4.7-10.4:1 across every stop; the canvas `foreground` stays white on the deep blue canvas. Night `primary` and independent `danger` / `info` / `success` foregrounds use 400-depth tokens so normal text on the raised panel also clears 4.5:1; their `-accent` fills keep the same deep-ink pairing. `surface-fg` is surface text only: canvas, transparent and raised-panel secondary text must use `foreground`, and every surface container must explicitly establish the surface pair. Gradients, glows and borders do not change for contrast — only ink depth swaps. Link colour (`typo-link`) and the scrollbar thumb are mechanism values (same precedent as `--focus-*`, not palette slots): `--link` answers `#0e7490` by day and `#22d3ee` by night; `--scrollbar-thumb` / `--scrollbar-thumb-hover` answer 700-depth gradients by day and the neon gradients by night (YAML `link` / `scrollbar-thumb` keys). Scrollbars: webkit lane only — 10px `::-webkit-scrollbar`, transparent track/corner, hidden arrow buttons, gradient thumb — forced-classic and always visible; standard `scrollbar-*` properties live only in the Firefox lane (`@-moz-document`, `thin` + `var(--primary)`), never on Chromium, where a non-initial standard value discards the webkit styling and degrades to auto-hiding overlay scrollbars. Components never set scrollbar styles.
11. Do / Don't stays in scheme language only: no thin borders, no neutral gray cards, no rounded-none, no gradient text, no solid family fills (icon-grade indicator exemption: `bg-primary-solid`, see rule 3), no saturated neon fills on the light canvas. Disabled controls read the dedicated `disabled` / `disabled-fg` pair; `bg-disabled` clears gradients, and no wrapper remaps theme colours or fills. General bans: delivery `references/skin-rules.md`; a11y floors: the ui-rules skill.
12. **Field-group wells share the recessed tier by day, answer deeper by night**: `--padding-well` 0, `--color-well` answers `surface` in the light tier (pastel lilac `#e9d5ff`, well text reads 12.11:1) and its own deep purple `#3b2457` at night (one step below the `oklch(25% 0.07 262)` canvas, well text reads 13.33:1), `--shadow-well` `none` — this scheme has no neutral step below the canvas, so answering `background` would make the track lanes match the demo stage exactly and vanish, while answering `surface` at night would put a saturated purple *brighter* than the canvas under white ink at 4.17:1 (placeholder 3.96:1), under the AA floor. Neumorphic recesses still belong to other styles. Well text and placeholders therefore use `foreground`, never `surface-fg`.
