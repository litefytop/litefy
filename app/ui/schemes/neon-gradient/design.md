---
version: alpha
name: Litefy UI — Neon Gradient
description: Design language of the Litefy UI neon gradient style template — two canvas tiers (pale purple day / deep blue night), one saturated neon set for the brand and the semantic families, gradient family fills, a contrast wire border (amber-700 day / yellow-400 night), soft shadows by day and neon glows by night. The YAML block is the sole numeric authority for tokens; the prose states rules and destinations.
colors:
  background: 'oklch(97.5% 0.015 325)'
  foreground: 'oklch(25% 0.09 325)'
  surface: '#e9d5ff'
  surface-fg: 'oklch(38% 0.1 325)'
  surface-raised: 'oklch(99% 0.008 325)'
  surface-raised-fg: '{colors.foreground}'
  disabled: 'oklch(92.2% 0 none)'
  disabled-fg: 'oklch(43.9% 0 none)'
  border: '#b45309'
  accent: '#f472b6'
  accent-fg: '#0f0a1e'
  primary: '#c084fc'
  primary-fg: '#0f0a1e'
  primary-accent: '#ec4899'
  danger: '#f87171'
  danger-fg: '#0f0a1e'
  danger-accent: '#fb7185'
  info: '#38bdf8'
  info-fg: '#0f0a1e'
  info-accent: '#0ea5e9'
  success: '#22c55e'
  success-fg: '#0f0a1e'
  success-accent: '#4ade80'
  warning: '#fbbf24'
  warning-fg: '#0f0a1e'
  warning-accent: '#d97706'
  dark-background: 'oklch(25% 0.07 262)'
  dark-foreground: '#ffffff'
  dark-surface: '#a855f7'
  dark-surface-fg: '#0f0a1e'
  dark-surface-raised: 'oklch(29% 0.075 262)'
  dark-surface-raised-fg: '{colors.dark-foreground}'
  dark-disabled: 'oklch(43.9% 0 none)'
  dark-disabled-fg: '#e9d5ff'
  dark-border: '#fbbf24'
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
  frame: '0 0 10px rgba(236, 72, 153, 0.5)'
  frame-hover: '0 0 14px rgba(236, 72, 153, 0.7)'
  frame-focus: '0 0 10px rgba(34, 211, 238, 0.3)'
  frame-focus-danger: '0 0 10px rgba(244, 63, 94, 0.4)'
  frame-active: 'inset 0 0 10px rgba(255, 255, 255, 0.8)'
  block: '0 0 14px rgba(168, 85, 247, 0.4)'
  block-hover: '0 0 20px rgba(168, 85, 247, 0.6)'
  checked: '0 0 0 2px var(--background), 0 0 0 4px var(--primary), 0 0 10px rgba(168, 85, 247, 0.5)'
  elevated: '0 0 20px rgba(168, 85, 247, 0.6)'
  hint: '0 0 8px rgba(168, 85, 247, 0.3)'
  focus-glow: '0 0 10px rgba(34, 211, 238, 0.3)'
  unchecked: 'var(--shadow-frame), 0 0 0 2px var(--background), 0 0 0 4px var(--surface-fg)'
shadows-light:
  frame: '0 1px 6px rgba(190, 24, 93, 0.35)'
  frame-hover: '0 2px 10px rgba(190, 24, 93, 0.45)'
  frame-focus: '0 1px 6px rgba(14, 116, 144, 0.35)'
  frame-focus-danger: '0 1px 6px rgba(190, 18, 60, 0.4)'
  frame-active: 'inset 0 0 8px rgba(126, 34, 206, 0.35)'
  block: '0 2px 10px rgba(126, 34, 206, 0.28)'
  block-hover: '0 3px 14px rgba(126, 34, 206, 0.38)'
  checked: '0 0 0 2px var(--background), 0 0 0 4px var(--primary), 0 1px 6px rgba(126, 34, 206, 0.35)'
  elevated: '0 3px 14px rgba(126, 34, 206, 0.38)'
  hint: '0 1px 6px rgba(126, 34, 206, 0.25)'
  focus-glow: '0 1px 6px rgba(14, 116, 144, 0.35)'
  unchecked: 'var(--shadow-frame), 0 0 0 2px var(--background), 0 0 0 4px var(--surface-fg)'
gradients:
  brand: 'linear-gradient(90deg, #22d3ee, #ec4899, #22d3ee)'
  primary-accent: 'linear-gradient(90deg, #22d3ee, #ec4899, #22d3ee)'
  surface: 'linear-gradient(135deg, #a855f7, #ec4899, #f43f5e)'
  accent: 'linear-gradient(135deg, #f472b6, #a855f7)'
  danger: 'linear-gradient(135deg, #ec4899, #fb7185, #ef4444)'
  danger-accent: 'linear-gradient(135deg, #ef4444, #fb7185, #ec4899)'
  success: 'linear-gradient(135deg, #22d3ee, #14b8a6, #22c55e)'
  success-accent: 'linear-gradient(135deg, #22c55e, #14b8a6, #22d3ee)'
  warning: 'linear-gradient(135deg, #facc15, #4ade80, #22d3ee)'
  warning-accent: 'linear-gradient(135deg, #22d3ee, #4ade80, #facc15)'
  info: 'linear-gradient(135deg, #22d3ee, #3b82f6)'
  info-accent: 'linear-gradient(135deg, #3b82f6, #22d3ee)'
gradients-light:
  surface: 'linear-gradient(135deg, #e9d5ff, #fbcfe8, #fecdd3)'
focus:
  outline: '#0e7490'
  outline-danger: '#be123c'
  dark-outline: '#22d3ee'
  dark-outline-danger: '#fb7185'
text-independent:
  danger: '#991b1b'
  info: '#075985'
  success: '#166534'
  warning: '#92400e'
  dark-danger: '#f87171'
  dark-info: '#38bdf8'
  dark-success: '#22c55e'
  dark-warning: '#fbbf24'
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
recess:
  shadow: none
  radius-inner: 'max(0px, calc(var(--radius-lg) - var(--spacing)*1.5 - var(--border-width-frame)))'
---

# Neon Gradient — the scheme's own rules

1. **Numeric authority**: the YAML above is the scheme's sole numeric authority; where this prose and a Litefy contract disagree, the Litefy contract (blueprint `ui/schemes.md`) wins and the difference is recorded here.
2. **Two canvas tiers, one brand and semantic set**: the day tier is a pale purple canvas (`oklch(97.5% 0.015 325)`) with deep purple ink; the night tier is a deep blue canvas (`oklch(25% 0.07 262)`) with white ink. The site's day/night toggle is live (`:root` answers `color-scheme: light`, `.dark` answers `color-scheme: dark`) and moves only the canvas ladder — `background` / `foreground` / `surface` / `surface-fg` / `surface-raised` / `border` / `disabled` / `disabled-fg` plus the canvas-side mechanism values (focus, link, scrollbar, shadows, `--fill-surface`). Brand (`primary` / `primary-accent` / `primary-fg`, `accent` / `accent-fg`) and the semantic four answer one saturated neon set in both tiers, so a button, a chip or a status block never repaints when the site switches (blueprint `ui/schemes.md` 第 16 条). The code lane follows the tier through shiki's default light/dark split — no scheme-level or site-entry override; the scheme's own `index.css` does not touch shiki.
3. **Full-gradient paint — fill lane, not the token**: colour tokens stay solid (purple brand, pink accent, red danger, cyan-blue info, green success, yellow warning) because text, borders, focus rings, shadows and derivations read them. The paint happens at the fill lane (blueprint rule 4): every isomorphic `bg-*` utility emits its solid token as `background-color` plus the scheme's fill variable as `background-image` — `--fill-primary` / `--fill-primary-accent` / `--fill-surface` / `--fill-accent` / `--fill-danger` / `--fill-danger-accent` / `--fill-success` / `--fill-success-accent` / `--fill-warning` / `--fill-warning-accent` / `--fill-info` / `--fill-info-accent`, answered from the YAML `gradients` block in both tiers except `--fill-surface`, which re-depths from `gradients-light` by day — buttons flow to-r, cards paint to-br. Variants compose the same utility body, so every state paints the same gradient. `--fill-background` stays undeclared — the canvas colour is solid by definition, the utility's fallback answers `none`, and variants stacking `bg-background` over a family fill (the lattice loader's done/error cells) clear the gradient image with the colour. The lattice wave itself animates OPACITY over the cells' gradient fill — lit cells show the active tier's surface gradient, dim cells let the canvas through. The lone exemption is `bg-primary-solid` (solid `--color-primary` + `background-image: none`), reserved for icon-grade indicators — checkbox / radio boxes and timeline dots — where a gradient needs room the 16px box does not have and the 200% fill compresses into a hard two-colour split (user ruling 2026-11-22).
4. **Fluid Luminescence**: the brand fill (`bg-primary`) is the brand button — a cyclic cyan→pink→cyan gradient at cyan-400 / pink-500 neon depth in both tiers, 200% size parked left; `--fill-primary-accent` answers `var(--fill-primary)` (same image, same size), so the brand hover (`hover:bg-primary-accent`) just slides `background-position` to the right over 500ms ease-out (YAML `motion.duration-flow`). Hover and press never move or scale the button — `lift` / `crush` answer as explicit no-ops (Litefy ruling), the feedback is the glow or soft shadow and the colour flow under the text.
5. **Contrast borders, border-4 floor**: one 4px stroke reads every border-width role; `--border` is the style's contrast wire — amber-700 (`#b45309`, 4.65:1 on the pale canvas) by day, yellow-400 (`#fbbf24`, 9.65:1 on the deep blue canvas) by night — the signature edge against the purple-pink fills, and the only thing that separates a frozen neon block from the light canvas (WCAG 1.4.11). Filled icon-grade indicators (checkbox / radio boxes, timeline dots) drop the border outright: a 4px stroke inside a 16px box leaves only an 8px paint area and drowns the check glyph (user ruling 2026-11-22) — the empty frame keeps the wire, the filled state paints edge to edge under the glow ring.
6. **Family-coloured elevation, tiered**: by night, controls glow pink (`0 0 10px rgba(236,72,153,0.5)`, hover 14px/0.7), cards glow purple (`0 0 14px rgba(168,85,247,0.4)`, hover 20px/0.6), focus glows cyan (`0 0 10px rgba(34,211,238,0.3)`). By day, glows have no physical basis on a light canvas, so the same families answer as offset soft shadows (pink `0 1px 6px rgba(190,24,93,0.35)` for controls, purple `0 2px 10px rgba(126,34,206,0.28)` for cards, cyan-700 `0 1px 6px rgba(14,116,144,0.35)` for focus; values in YAML `shadows-light`). All shadows share one value set across viewports with a 24px visible-footprint ceiling (blueprint `ui/schemes.md` rule 27). The press is electric activation in both tiers — inset purple by day, inset white by night (`frame-active`) — never scaling or displacement.
7. **Large rounding**: buttons md (12px ≈ rounded-xl), cards lg (16px ≈ rounded-2xl), shells xl/2xl; pills and discs fully round. `rounded-none` is a forbidden class in this style.
8. **Labels uppercase**, tracking 0.08em; JetBrains Mono is the mono face; headings ride `--text-h1…h6` at weights 700/900. The headline display tier (`typo-headline`) answers the fluid clamp(2.25rem → 3.75rem) at weight 900 for first-screen titles only — one per screen, never inside the long-form scope. The kicker tier (`typo-kicker`) is the golden display lead-in above the headline — 1.625rem (body × φ, Fibonacci 13/8) / 500 / 0.1em uppercase. The overline tier (`typo-overline`) stays 0.75rem / 500 / 0.1em uppercase for section eyebrow lines, always smaller than the heading it labels.
9. **Motion**: duration-300 across the frame, the brand flow 500ms, `ease-frame` standard ease — no fast or linear motion. Colour transitions are legal in `motion-frame`; reduced-motion zeroes everything through the base contract.
10. **Contrast budget — the canvas is measured twice, the brand and the semantic four once**: deep ink (`#0f0a1e`) answers every family `-fg` on the neon fills in both tiers — white would read only 1.8:1 on the cyan-400 flow stop, 2.7:1 on rose-400 and 3.5-4.0:1 on the 500-depth surface stops, while deep ink reads 4.7-10.4:1 across every stop; measured on the solids, `primary-fg` × `primary` 7.34, `accent-fg` × `accent` 7.32, and the semantic block pairs 7.01 / 9.06 / 8.51 / 11.62 resting and 7.21 / 7.00 / 11.13 / 6.09 on hover (danger / info / success / warning) — the same numbers by day and by night. The canvas ladder is what moves: by day `foreground` reads 15.30:1 on `background` and 16.02:1 on `surface-raised`, `surface-fg` × `surface` 7.74, the amber-700 wire 4.65, the disabled pair 7.48, and the cyan-700 focus and link 4.96 (danger ring `#be123c` 5.82); by night `foreground` reads 16.10:1 on the deep blue canvas and 14.22:1 on `surface-raised`, `surface-fg` × `surface` 4.90, the yellow-400 wire 9.65, the disabled pair 5.73, and the cyan-400 focus and link 8.91 (danger ring `#fb7185` 5.98). The one place a neon solid cannot sit is bare day canvas text: the frozen `primary` / `accent` / semantic solids read only 1.23-2.68 against the three day tiers, so `text-<status>-independent` / `border-<status>-independent` answer 800-depth literals by day — danger 7.69 / 6.10 / 8.05, info 7.00 / 5.56 / 7.33, success 6.60 / 5.24 / 6.91, warning 6.56 / 5.21 / 6.87 across `background` / `surface` / `surface-raised` — and the frozen `<status>` token itself by night (5.82 / 7.52 / 7.07 / 9.65 on the canvas, 5.14 / 6.64 / 6.24 / 8.52 on the raised panel). `surface-fg` is surface text only: canvas, transparent and raised-panel secondary text must use `foreground`, and every surface container must explicitly establish the surface pair. The fills, glows and borders never change to chase contrast — the brand and semantic set is one saturated tier, and the wire plus the canvas-side mechanism values carry the separation. Link colour (`typo-link`) and the scrollbar thumb are mechanism values (same precedent as `--focus-*`, not palette slots) and therefore ride the canvas: `--link` answers `#0e7490` by day and `#22d3ee` by night, `--scrollbar-thumb` / `--scrollbar-thumb-hover` the 700-depth gradient by day and the neon gradient by night (YAML `link` / `dark-link` / `scrollbar-thumb` / `dark-scrollbar-thumb` keys). Scrollbars: webkit lane only — 10px `::-webkit-scrollbar`, transparent track/corner, hidden arrow buttons, gradient thumb — forced-classic and always visible; standard `scrollbar-*` properties live only in the Firefox lane (`@-moz-document`, `thin` + `var(--primary)`), never on Chromium, where a non-initial standard value discards the webkit styling and degrades to auto-hiding overlay scrollbars. Components never set scrollbar styles.
11. Do / Don't stays in scheme language only: no thin borders, no neutral gray cards, no rounded-none, no gradient text, no solid family fills (icon-grade indicator exemption: `bg-primary-solid`, see rule 3), no tier-swapping brand or semantic colour — the toggle moves the canvas ladder only, so a button, a chip or a status block never repaints, and no light-canvas pastel palette is ever authored for them. Disabled controls read the dedicated `disabled` / `disabled-fg` pair; `bg-disabled` clears gradients, and no wrapper remaps theme colours or fills. General bans: delivery `references/skin-rules.md`; a11y floors: the ui-rules skill.
12. **Recessed faces read the `surface` tier**: the fourth "well" tier is retired (user call, 2026-11-25) — `--color-well` and `--padding-well` are deleted, `--shadow-well` became `--shadow-recess` (answered `none` in both tiers, this scheme carries depth with gradients and coloured shadows instead) and `--radius-well-inner` became `--radius-recess-inner`. Field interiors, value areas, textareas and the Segment track therefore hang `bg-surface`, the isomorphic gradient fill — by day the pastel lilac → pink → rose (`gradients-light.surface`), by night the saturated purple → pink → rose (`gradients.surface`). The meter and progress lanes read the `border` wire instead (user call, 2026-11-26): a thin track on the gradient solid disappears, the contrast wire does not. Ink follows: `surface-fg` on every `surface` stop, the pairs rule 10 measures (7.74 by day, 4.90 by night), placeholders included. Neumorphic recesses still belong to other styles. Disabled controls take the fixed neutral gray — `oklch(92.2% 0 none)` with `oklch(43.9% 0 none)` (6.19) by day, `oklch(43.9% 0 none)` with `#e9d5ff` (5.73) by night — so a dead chip never reads as a selected one.
