---
name: documentation-generator
description: Generate component documentation following Litefy Fuma pattern
---

# Documentation Generator Skill

Generate component documentation in both English and Chinese following the Litefy Fuma pattern. Always create English first, then translate to Chinese.

## Approach

Before writing, **read at least 2 existing component docs and demos** to understand the project's actual structure, naming conventions, and patterns. Do not assume—inspect the codebase first.

Good references to check:
- `content/docs/select.mdx` and `content/docs/select.zh.mdx`
- `app/demos/accordion/*` (3 demos) and `app/demos/index.ts` registration
- `app/demos/button/*`, `app/demos/checkbox/*`, `app/demos/tabs/*`

## Workflow

### Step 1: Analyze the Component

Read the component source at `app/ui/{component}.tsx` to understand:
- Main component props and types
- Sub-components (e.g., `Component.SubComponent`)
- Controlled/uncontrolled patterns
- Slot props structure
- Default values

Read existing demos in `app/demos/{component}/` to understand usage patterns and naming.

### Step 2: Create or Update Demos

Create demo files in `app/demos/{component}/{variant}-demo.tsx`. Naming follows kebab-case with `-demo` suffix. Each demo is a default export function with `PascalCase + Demo` naming.

Include `"use client"` directive for demos with state or effects.

Choose variants that showcase meaningful differences: basic, controlled, uncontrolled, invalid state, custom styling, etc. Aim for 2-4 demos that cover the key use cases.

### Step 3: Register Demos in `app/demos/index.ts`

For each demo, add two imports (component + `?raw` code) and one entry in the `demos` object. Follow the existing pattern in `app/demos/index.ts`. The key format is `{component}-{variant}`.

### Step 4: Create English Documentation

Create `content/docs/{component}.mdx`. Follow the structure of existing docs like `content/docs/select.mdx`.

Required sections:
- Frontmatter with `title` and `description`
- `## Installation` with CLI and Manual tabs
- `## Usage` with one `### Variant` subsection per demo, each containing a `<ComponentPreview name="..." />`
- `## API Reference` with tables for main component, sub-components, and slotProps

### Step 5: Create Chinese Documentation

Create `content/docs/{component}.zh.mdx` by translating the English version. Keep component names, prop names, TypeScript types, and code blocks in English. Translate all prose, descriptions, and section headings.

### Step 6: Verify

Check that all of the following are correct:
- Demo files exist and use the `-demo` suffix
- Demos are registered in `app/demos/index.ts` with both `component` and `code` fields
- `<ComponentPreview name="..." />` keys match registered demo keys
- Source code at `app/ui/{component}.tsx` exists
- Both English and Chinese MDX files are created
- All public props are documented in the API reference

## Documentation Conventions

- **No top-level heading** in MDX files—Fumadocs generates the title from frontmatter
- **API tables** use format: `| Prop | Type | Default | Description |`
- Use `-` (plain dash) for optional props without a default value
- Wrap TypeScript types in backticks, use union syntax for literals
- Demo keys are kebab-case: `{component}-{variant}`
- Demo file names end with `-demo.tsx`

## Key Patterns

Refer to existing files in the codebase for the actual patterns:
- Demo file structure: see `app/demos/accordion/*.tsx`
- Registration format: see `app/demos/index.ts`
- MDX structure: see `content/docs/select.mdx`
- Chinese translation: see `content/docs/select.zh.mdx`

Do not hardcode examples in this skill—always inspect the current state of the project, as patterns may evolve.
