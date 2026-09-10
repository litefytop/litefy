# Litefy UI — Component Usage Guide for AI Assistants

This document teaches you how to **use** the Litefy UI components correctly. Generate UI with them instead of hand-writing raw HTML/Tailwind whenever a matching component exists.

```tsx
import { Button, Input, Select } from "@/ui";   // the barrel — everything is exported here
```

- React 19 + Tailwind CSS v4. All components are client components (`"use client"` already set).
- Every component spreads native HTML props through (`{...props}`); `ref` works as a normal prop (React 19, no `forwardRef`).
- `className` accepts a string or array and merges via `tailwind-merge` (`ClassNameValue`).
- Most components expose per-part overrides: `classNames={{ slot: "..." }}` and `styles={{ slot: {} }}`.
- Use **semantic tokens only** (never raw palette colors): `bg-background` `text-foreground` `text-muted-foreground` `bg-primary` `text-primary-foreground` `bg-primary-accent` `bg-muted` `bg-hover` `border` `text-danger` `text-success` `text-warning` `text-info` `ring` `outline` `text-neutral`.
- Form controls follow the same conventions: `value` / `defaultValue` + `onValueChange` (or `checked` / `defaultChecked` + `onCheckedChange`), `disabled`, and `invalid` for the danger styling state.
- Icons come from `lucide-react`, typically `className="size-4"`.
- Full prop tables and behavior details live in `content/docs/component/<name>.mdx` (and `.zh.mdx`) — consult them when a prop you need isn't listed below.

---

## Form Controls

### Input
Text input with leading/trailing slots and `invalid` state. `type` limited to `text | email | url | tel | search`.
```tsx
<Input placeholder="Search" leading={<Search className="size-4" />} trailing={<Kbd>⌘K</Kbd>} invalid={!!error} />
```
`value` / `defaultValue`, `leading`, `trailing`, `invalid`, `classNames.root/leading/trailing`.

### Textarea
Multi-line input with `invalid` state support; form-friendly `onChange`.

### NumberInput
Bordered numeric input; stepping is keyboard-only (up/down), trailing cue is non-interactive. `value` / `defaultValue`, `min`, `max`, `step`, `invalid`. The form-friendly sibling of NumberField.

### NumberField
Compact borderless stepper with a leading `−` and trailing `+` button. `value` / `defaultValue`, `min`, `max`, `step`, thousands separators, `direction`.

### Password
Password input with visibility toggle. `visible` / `defaultVisible`, `onVisibleChange`, `invalid`. Parts: `PasswordRoot` / `PasswordToggle` / `PasswordGroup` for custom assembly.

### InputOtp
One-time-code input with auto-advance, paste support and `mask` mode.
```tsx
<InputOtp length={6} mask value={code} onValueChange={setCode} />
```
Parts: `InputOtpSlot`, `InputOtpGroup`.

### Checkbox
`<Checkbox defaultChecked onCheckedChange={fn} label="..." />`. Parts: `CheckboxRoot` / `CheckboxIndicator` / `CheckboxLabel`. `CheckboxGroup` takes `options` (+ grouped options) and collects values.

### Radio
Radio buttons with a `segment` variant option. `RadioGroup` is options-driven: `options`, `value` / `defaultValue`, `onValueChange`, `name`, `invalid`. Single `Radio` also works with raw inputs.

### Switch
Toggle switch. `checked` / `defaultChecked`, `onCheckedChange`, `disabled`. Parts: `SwitchRoot` / `SwitchTrack` / `SwitchThumb`.

### Toggle
Toggle button; `ToggleGroup` supports multi-select via `options` + `value` / `onValueChange`.

### Segment
Segmented single-select control. Options-driven: `options` (`{ label, value, disabled }`), `value` / `defaultValue`, `onValueChange`, `invalid`.

### Slider
Simulated slider (no native range input) with pointer drag + keyboard. `min`, `max`, `step`, `value` / `defaultValue`, `onChange`, `orientation="horizontal" | "vertical"`, `name` for forms. Parts: `SliderTrack` / `SliderFill` / `SliderThumb`.

### Select
Themeable select on the native popover API + listbox. Options-driven with groups:
```tsx
<Select
  options={[{ label: "A", value: "a" }, { label: "Group", options: [...] }]}
  value={v} onValueChange={setV} placeholder="Pick one" invalid required
/>
```
The value lives in state; for native form submission pair it with `FormItem` (which adds the hidden input).

### Cascader
Multi-level cascading selector driven by a `tree`; breadcrumb-style trigger, CSS-anchor-positioned panels. `CascaderTrigger` usable separately.

### DatePicker
Date picker on the native Temporal API: editable input + month panel popover. `value` / `defaultValue` (Temporal date), `onValueChange`, `isDateDisabled`, `firstDayOfWeek`, `placeholder`, `invalid`.

### Calendar
Standalone calendar panel (Temporal API), parts-based: `CalendarRoot` composes `CalendarHeader` / `CalendarGrid` / `CalendarMonthGrid` / `CalendarYearGrid`. `date` / `defaultValue`, `defaultView`, `isDateDisabled` / `isMonthDisabled` / `isYearDisabled`, `onNavigate`.

### DualPicker
Two-panel picker (source ↔ selected) for single or multiple `mode`. Rows are render-props — `renderOption` / `renderSelected` / `getLabel` — so any content format works. `options`, `value` / `defaultValue`, `onValueChange`, `sourceTitle` / `targetTitle`, `searchPlaceholder`.

### InputGroup
Shell that owns focus/invalid styling for a wrapped control (never a double focus ring). Parts: `InputRoot` / `InputLeading` / `InputTrailing`. `Input` is built on it.

### FormItem
Self-managing form field: renders a finished control per `variant` (`"input" | "textarea" | "select" | "password" | "number-input"`) with label, optional description and built-in validation.
```tsx
<FormItem
  name="email"
  label="Email"
  required
  description="We never share it."
  validate={(v) => v.includes("@") || "Invalid email"}
  controlProps={{ placeholder: "you@example.com" }}
/>
```
- Layout: label → control → one hint line. Description shows by default and is **replaced by the error** while invalid; no space is reserved when empty.
- `validate` returns `string` (hard error) | `{ message, invalid: false }` (message only) | `false` (bare invalid) | `null/undefined/true` (pass). Re-validates on change once invalid; `validateTrigger="onChange" | "onBlur"` (default onBlur).
- Registers with the surrounding `Form`; `controlProps` forwards to the underlying control (custom `onChange`/`onBlur` are wrapped, not replaced). The select variant carries its value in a hidden input for native submission.

### Form
Full form composition: fields, submit handling, validation collection, imperative ref control. Hook `useFieldValidity` for custom wiring.

## Buttons

### Button
`variant`: `"primary"` (default) | `"danger"` | `"outline"` | `"text"`. `loading` swaps in a spinner (`loadingConfig` to customize), icon-only children get square padding automatically.

## Layout & Surfaces

### Card — glassmorphic surface with hover lift and ambient glow.
### Paper — print-ready A4/A5 page surface, portrait or landscape (`variant="a4" | "a5" | "a4-landscape" | "a5-landscape"`).
### Separator
Divider with optional label: `<Separator>or</Separator>`, `orientation="horizontal" | "vertical"`. Parts: `SeparatorLine` / `SeparatorText`.
### Capsule — pill-shaped `overflow-hidden` container that visually joins arbitrary children (tags, segments, links) into one capsule.
### Masonry
Equal-width masonry columns balanced by measured height: `items`, `renderItem`, `getKey`, `columns` (number or responsive config), `gap`.
### Skeleton — pulsing placeholder block for loading states.
### Typography — typographic hierarchy via `variant` (heading / headline / description / inline code).

## Navigation

### Breadcrumb
Data-driven: `<Breadcrumb items={[{ label, href? }, ...]} />`. Parts: `BreadcrumbRoot/List/Item/Link/Page/Separator`.

### Tabs
Options-driven tabs with variants and orientation.
```tsx
<Tabs
  options={[{ label: "One", value: "1", content: <Panel /> }]}
  defaultValue="1"
  onValueChange={fn}
  orientation="horizontal" | "vertical"
/>
```
Parts: `TabsList` / `TabsTrigger` / `TabsContent` for custom assembly.

### Steps
Controlled steps indicator (completed / current / upcoming). `items`, `index`, `maxIndex` (forward-jump lock), `onChange`, `orientation="horizontal" | "vertical"`, `clickable`. The backbone of Wizard.

### Menu
Menu usable in normal document flow: `items` (groups, two-level submenus), keyboard navigation. Parts: `MenuRoot` / `MenuItem` / `MenuLabel` / `MenuSubContent`.

### Sidebar
Collapsible sidebar controlled via ref (`SidebarHandle` — e.g. `ref.current.collapse()`).

## Overlays

### Dialog
Modal on the native `<dialog>`: `open` / `onOpenChange`, `onBackdropClick`. Parts: `DialogRoot` / `DialogContent` / `DialogClose`.

### Drawer
Slide-in panel: `open` / `onOpenChange`, `placement`, `onBackdropClick`, and touch-drag support via the `DrawerDrag` part/API.

### Popover
Button-triggered floating panel on the native popover API + CSS anchor positioning. `trigger`, `open` / `defaultOpen` / `onOpenChange`, `alignX`, `mode`. `PopoverContent` and `usePopoverTrigger` are the building blocks for other popups.

### Tooltip
`<Tooltip content="Hint"><Button /></Tooltip>` — native Popover API + anchor positioning, `delay`, `anchorName` for custom anchoring.

### ContextMenu
Right-click menu: `items` (same shape as Menu), `onOpenMenu` / `onSelect` / `onOpenChange`, custom `anchorName`/`position`. Parts: `ContextMenuTrigger` / `ContextMenuAnchor` / `ContextMenuContent`.

### Toast
Global notifications with a store-based imperative API. Mount `<Toaster />` **once** near the app root, then call methods from anywhere:
```tsx
import { Toaster } from "@/ui";

<Toaster />                                   // mount once
const id = Toaster.success({ title: "Saved" });
Toaster.error({ title: "Failed" });           // also: warning / info / loading
Toaster.promise(() => save(), { success: {...}, error: {...} });  // fn returning a Promise; auto-replaces the loading toast
Toaster.dismiss(id);                          // or Toaster.dismiss() for all
```
Toasts never carry action buttons — use Dialog when interaction is needed. `closable` renders a close button. Parts (`ToastRoot` / `ToastIcon` / `ToastTitle` / `ToastDescription` / `ToastClose`) exist for custom rendering.

## Data Display

### Avatar
`<Avatar src="..." fallback="FL" />` — image with skeleton + fallback states. Parts: `AvatarRoot` / `AvatarImage`.

### Badge
Square slot with a corner marker: put an icon as children, `label` renders a Tag pinned to the top-right.

### Tag — plain single-color chip, zero interaction logic; color it with any `bg-*` utility.
### Kbd — keyboard key visual with pressable hover/active states.

### Table
```tsx
<Table
  columns={[{ key: "name", header: "Name", sortable: true }, ...]}
  data={rows}
  sort={{ key, direction }} onSortChange={fn}   // or omit for remote mode
  empty="No rows" getKey={fn}
/>
```
Column: `{ key, header, render?, sortable?, compare?, align? }`. Clickable sortable headers for local data; remote mode delegates sorting to your backend (`onSortChange`).

### Timeline
Vertical, display-only: `items` with `time` / `title` / `description` / `marker` / `connector`. Parts: `TimelineRoot` / `TimelineItem`.

### Progress
Pure UI progress bar — renders `current` / `duration` only; scheduling/estimation is your job.

### Image
Image with loading placeholder + error fallback: `src`, `alt`, `fallback`, `loadingNode`. Parts: `ImageRoot` / `ImageImage`.

### Watermark
Canvas watermark tiled over content. Parts: `WatermarkRoot` / `WatermarkCanvas` (composable two-part API).

### ChipGroup
Renders chips and auto-collapses the overflow; exposes hidden items via `renderMore` (e.g. "+3" popover) and `onOverflowChange`.

### List
Scrollable list with keyboard navigation and selection:
`items`, `renderItem`, `getKey`, `highlightIndex` / `onHighlightChange`, `onSelect`, `onScrollBottom` (infinite scroll), `getGroup` / `renderGroupHeader`, `empty`. Already wraps ScrollShadow; wraps the hidden scrollbar.

## Scroll & Containers

### ScrollShadow
Scrollable container with gradient shadows on `edges` (`"top" | "bottom" | "left" | "right" | [...]`, default bottom).
- `size` (default `64px`) sets the gradient size; `arrow` (default `true`) renders a chevron as a **small clickable row at the shadow's outer edge — clicking jumps to that end**.
- Inner scrolling is contained (`overscroll-behavior: contain`) so keyboard/wheel never chain-scrolls the page.
- Parts: `ScrollShadowRoot` / `ScrollShadowViewport` / `ScrollShadowEdge` (pass `onClick` to make an edge interactive). Edges carry `data-position` for `data-[position=top]:` targeting.

### Collapse
`<Collapse defaultOpen>` or `items`-driven; `multiple` / accordion modes, `activeKeys` / `onKeyChange` for control. Parts: `CollapseRoot` / `CollapseTrigger` / `CollapsePanel`. `Accordion` is the items-driven convenience export.

### Pager
Single-DOM controlled pager for paged content / manga readers: `index` / `onChange`, `gesture` (touch drag), `loop`, `transition="view-transition"`, `offset`. One child per page.

### Banner
Auto-scrolling marquee: `items`, `speed` / `duration`, `direction`, `pauseOnHover`. Parts: `BannerViewport` / `BannerTrack` / `BannerItem`.

## Composites & Utilities

### Wizard
Steps + Pager wizard that owns index state; visited steps are revisitable, future steps locked.
```tsx
<Wizard steps={[{ title: "Account" }, ...]} onFinish={submit}>
  <Step1Page />
  <Step2Page />
</Wizard>
```
The state machine is exported as `useWizardNavigation({ count, defaultIndex, index, maxIndex, onIndexChange })` → `{ index, maxVisited, maxReachable, isFirst, isLast, go, ... }`.

### Wizard.Inline (also exported as `InlineWizard`)
Same state machine as a vertical steps accordion — only the current step expands, with its own Back/Continue buttons.
```tsx
<InlineWizard
  steps={[{ title, description?, content }, ...]}
  onFinish={fn}
  nextLabel="Continue" backLabel="Back" finishLabel="Finish"
  maxIndex={n} disabled={bool}
/>
```

### Upload
Dropzone upload with local validation: `accept`, `multiple`, `maxSize`, `maxCount`, `onFilesAccepted` / `onFilesRejected` / `onFileRemove`, `dropzone`, `invalid`. Parts: `UploadDropzone` / `UploadItem` / `UploadActions` / `UploadHiddenInput`. Monitoring actual network progress is decoupled — use the `use-upload-monitor` hook.

### Chart
uPlot-based chart composition with automatic canvas theming, responsive width, interactive legend + hover tooltip. Pair with the `use-chart-palette` hook.

### QueryBuilder
Collapsible folder tree of field nodes and nested and/or groups with a live read-only logic-expression preview and Submit/Reset. `fields`, `defaultValue`, `onQueryChange`, `onSubmit` / `onReset`, `showPreview`, `maxDepth`, plus output converters (`natural`, `mongodb`, `cel`, `parameterized`...). Data transforms come from `react-querybuilder`; this is the UI.

### ChatInput
Chat composer: `value` / `defaultValue` + `onValueChange`, `onSend`, `enterToSend`, `attach` slot, `actions`, pasted-screenshot thumbnails (`autoPaste`), `placeholder`, `disabled`.

## Composition Guides (not shipped components)

**Combobox**, **DropdownMenu**, **MultiSelect** and **PreviewCard** have docs pages and demos, but no shipped file — they teach how to assemble shipped primitives (Picker + List, Popover + Menu, Popover + Checkbox, Card + Image + Tooltip). Follow those recipes in `content/docs/component/<name>.mdx` instead of importing them.

## Core Primitives worth knowing

| Export | Role |
|--------|------|
| `Picker` | Generic input + popover container (native popover + CSS anchor positioning) — the base for building custom pickers |
| `PickerRoot` / `PickerInput` / `PickerContent` | Its parts |
| `PopoverContent` / `usePopoverTrigger` | Low-level popover building blocks |
| `use-pagination` | Pagination state hook |
| `use-virtual-scroll`, `use-load-more`, `use-drag`, `use-combobox`, `use-panel-focus`, `use-upload-monitor`, `use-chart-palette`, `use-remote-pagination`, `use-remote-sort`, `use-theme` | Headless hooks in `@/ui/utils` |
| `cn` | `tailwind-merge` itself; `ClassNameValue` is its accepted type |
