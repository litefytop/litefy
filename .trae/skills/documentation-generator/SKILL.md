---
name: documentation-generator
description: Generate or update component documentation following the Litefy Fuma parts + composite pattern
---

# Documentation Generator Skill

Generate component documentation in both English and Chinese following the Litefy Fuma pattern. Always create English first, then translate to Chinese.

## Approach

Before writing, **read at least 2 existing component docs, their sources, and demos** to understand the project's actual structure, naming conventions, and patterns. Do not assume—inspect the codebase first.

Canonical references to check:

- `app/ui/components/checkbox.tsx` — the exemplar component (parts + composite + static group)
- `content/docs/component/checkbox.mdx` / `checkbox.zh.mdx` — the exemplar doc pair
- `app/demos/checkbox/*.tsx` and registration in `app/demos/index.ts`
- `content/docs/component/combobox.mdx` — an example of a **pattern doc** (composition guide)

## Architecture: parts + composite

Every shipped component follows one architecture. Understand it before documenting anything:

1. **Parts** (零件) are small exported building blocks, e.g. `CheckboxRoot`, `CheckboxIndicator`, `CheckboxLabel`. Each part accepts `className?: ClassNameValue` (the `cn()` input type from tailwind-merge — strings, arrays, falsy values; **not** plain `string`, **not** objects) plus its native element props.
2. **Composite** (成品) is the data-driven, ready-to-use component assembled from the parts, e.g. `Checkbox`. It exposes styling customization ONLY through:
   - `classNames?: { part1?: ClassNameValue; part2?: ClassNameValue; ... }`
   - `styles?: { part1?: React.CSSProperties; part2?: React.CSSProperties; ... }`

   There is no `slots` or `slotProps` prop anywhere in this library—it was replaced by `classNames`/`styles`. If you find one in source or docs, it is a defect.
3. **Statics** attach data-driven sub-components to the composite: `Checkbox.Group = CheckboxGroup`. Group components take an `options` array plus a `common` prop for shared per-option configuration (e.g. `common: { classNames?, styles?, indicator? }`).
4. Composites spread remaining native element props onto their root/part (an `Omit<React.ComponentProps<"element">, ...>` type with a `...props` passthrough) unless there is a specific reason not to.

Some components are atomic (badge, card, kbd, paper...) and ship as a single component with a `className` static exposing base classes—acceptable when there is nothing to split.

### Root styling convention

Every composite has a root (the outermost rendered element; Collapse's root is `CollapseRoot`, not trigger/panel):

1. `className` / `style` ALWAYS apply to the root.
2. `classNames` / `styles` list only non-root parts — a `root` key is forbidden.
3. Fragment composites that render trigger + panel as siblings (Popover, Select, DatePicker, ContextMenu) have no single root element: `className`/`style` apply to the trigger; `classNames`/`styles` cover the panel and inner parts.
4. When a part is itself a root (e.g. `WatermarkRoot`), merge `className`/`style` onto it directly.

## Visual design conventions

Background layering:

- Out-of-flow components (dialog, drawer, toast, banner, popover, menu, tooltip, select/cascader/date-picker panels) carry `bg-background text-foreground`.
- Attention containers (sidebar, card, paper) also carry `bg-background text-foreground`.
- Everything else follows its parent — no self-carried `bg-background`/`bg-muted` on ordinary components. `bg-*` stays only for brand/semantic colors (`bg-primary`, danger fills), functional tracks (slider/progress/segment), occluding markers over connector lines (slider thumb, steps/timeline markers), and `hover:bg-*` feedback.
- Demo containers use `bg-background`; docs pages keep their default page background.

Border-radius scale (by element size/role):

- `rounded-lg` — containers: card, dialog, drawer panel, toast, calendar, tabs content, transfer panels, floating popover/menu/select panels.
- `rounded-md` — standard controls: button, inputs, triggers, toggle, calendar cells.
- `rounded-sm` — components-within-components: input prefix/suffix area, checkbox box, breadcrumb link hover, transfer rows, kbd, inner icon buttons (dialog close, password eye).
- Identity shapes are exempt: pills/avatars/chips/switches keep `rounded-full`.

## Interaction & state conventions

- Disabled styling is GLOBAL: the base stylesheet dims `:disabled`, `[data-disabled]`, `[inert]` and `label:has(:disabled)`. Components carry NO built-in `disabled:` utilities — do not add them when generating components or demos.
- Toast is notification-only: no action buttons, ever. Anything needing interaction (confirm / retry / details) belongs to Dialog. `Toaster.loading` returns an id — dismiss exactly that id, since bare `Toaster.dismiss()` clears every toast.
- Keyboard completeness: virtual-focus listboxes (List-driven panels) support ArrowUp/Down + Enter AND Space to select; real-focus checkboxes toggle with Space natively and Enter via CheckboxRoot; SegmentGroup is a roving-tabindex radio group (arrows + Home/End).
- Form architecture: `Form` + `FormItem` (fixed vertical layout: label → description → input → error) + `Form.Submit`; there are NO `FormField` / `FormFieldset` wrappers and no `direction` prop. Wrapper-free fields use the `useFieldValidity` hook and render their own description/error lines.
- Numeric inputs: `NumberField` = borderless with clickable Minus/Plus steppers; `NumberInput` = bordered shell with the non-interactive suffix cue (used inside `FormItem`).

## Doc categories

There are TWO kinds of pages under `content/docs/component/`. Decide which one you are writing:

1. **Shipped component docs** (most pages): the component source exists at `app/ui/components/<name>.tsx` and is exported from `app/ui/components/index.ts`. Full structure below.
2. **Pattern docs** (composition guides, e.g. chart, combobox, datepicker, dropdown-menu, context-menu, multi-select, preview-card): there is **no shipped source**; the page documents how to compose real exported components into a pattern. State this explicitly in the frontmatter description (e.g. "not a shipped component, only a composition guide with demos"), skip the Installation section, and reference registered demos. (`chat-input` and `dual-picker` used to be patterns — both are shipped components now.)

## Workflow

### Step 1: Analyze the Component

Read the source at `app/ui/components/<name>.tsx` and list:

- Every exported part and its exact props (element type, `className` type, defaults)
- The composite's full props interface, including `classNames`/`styles` keys and defaults
- Static attachments (`X.Group`, `X.Root`, ...) and their option-config types
- Controlled/uncontrolled patterns and callbacks (`onCheckedChange`, `onValueChange`, ...)

Derive every doc table row from this source. Never document a prop that is not in the source; never omit a public one.

Read existing demos in `app/demos/<component>/` to understand usage patterns.

### Step 2: Create or Update Demos

Demo files live at `app/demos/<component>/<variant>.tsx` (kebab-case variant, **no** `-demo` suffix; e.g. `basic.tsx`, `custom.tsx`, `group.tsx`). Each is a default-export function named `PascalCase + Demo` (e.g. `CheckboxBasicDemo`). Include `"use client"` when the demo uses state or effects.

Choose variants that showcase meaningful differences: basic, controlled, custom styling via `classNames`/`styles`, composable parts assembly, etc. Aim for 2-4 demos.

### Step 3: Register Demos in `app/demos/index.ts`

For each demo add an import pair and one entry in the `demos` object:

```ts
import CheckboxBasicDemo from "./checkbox/basic";
import checkboxBasicCode from "./checkbox/basic.tsx?raw";
```

The registry key format is `{component}-{variant}` (e.g. `checkbox-basic`). `<ComponentPreview name="..." />` in the docs must use exactly these keys.

### Step 4: Create English Documentation

Create `content/docs/component/<name>.mdx`:

- Frontmatter with `title` and `description`
- `## Installation` — Tabs with `CLI` (`<PackageManagerTabs command="litefy@latest add <name>" />`) and `Manual` (`<Source type="component" name="<name>" />`). The `Source` component auto-resolves source code from `app/ui/components/`—nothing else to wire up.
- `## Usage` — one `### Variant` subsection per demo, each with a `<ComponentPreview name="{component}-{variant}" />`
- `## API Reference` — split into `### High-level Components` (composite + statics + option-config types) and `### Composable Components` (the parts), each with `#### Name` subsections

API tables use `| Prop | Type | Default | Description |`. Use `-` for optional props without a default. Wrap types in backticks. Document a `...props` row when native props are spread, listing the exclusions. Document statics like `Checkbox.Group` as their own `####` subsections.

### Step 5: Create Chinese Documentation

Create `content/docs/component/<name>.zh.mdx` by translating the English version. Keep component names, prop names, TypeScript types, and code blocks in English. Translate all prose, descriptions, headings, and the frontmatter title/description (frontmatter title uses the Chinese name, e.g. `水印`). The install Tabs use `items={['CLI', '手动']}` with `<Tab value="手动">`.

The ZH doc must stay structurally identical to the EN doc: same sections, same tables, same demo keys.

### Step 6: Add Navigation Entry

Add the component to `content/docs/component/_meta.ts` in alphabetical position:

```ts
watermark: {
  name: "Watermark",
  displayName: {
    en: "Watermark",
    zh: "水印",
  },
},
```

### Step 7: Verify

Check all of the following:

- Every prop in the docs exists in the source; every public source prop is documented; types and defaults match exactly
- No `slots`/`slotProps` anywhere; `classNames`/`styles` values typed `ClassNameValue` / `React.CSSProperties`
- Demo files exist at `app/demos/<component>/<variant>.tsx` and are registered in `app/demos/index.ts` with both `component` and `code` fields
- `<ComponentPreview name="..." />` keys match registered demo keys exactly
- Source exists at `app/ui/components/<name>.tsx` and is exported from the barrel `index.ts`
- Both EN and ZH MDX files exist and are structurally identical
- `_meta.ts` entry added

## Documentation Conventions

- **No top-level heading** in MDX files—Fumadocs generates the title from frontmatter
- **Table format**: `| Prop | Type | Default | Description |`, `-` for no default
- `ClassNameValue` accepts strings, arrays, and falsy values (false, null, undefined, 0, 0n)—not objects, not true. Say so when documenting `className` props.
- Demo keys are kebab-case: `{component}-{variant}`; demo files are `<variant>.tsx` without a suffix

Do not hardcode examples in this skill—always inspect the current state of the project, as patterns may evolve.
