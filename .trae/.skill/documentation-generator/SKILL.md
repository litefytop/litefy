---
name: documentation-generator
displayName: Documentation Generator
description: Generate component documentation following Litefy Fuma pattern
version: 1.1.0
author: Litefy Team
---

# Documentation Generator Skill

Generate component documentation in both English and Chinese following the Litefy Fuma pattern.

## Usage

Create two files for each component:
- `content/docs/{component}.mdx` (English)
- `content/docs/{component}.zh.mdx` (Chinese)

## Document Structure

### English Template (`component.mdx`)

```markdown
---
title: ComponentName
description: Component description
---

## Installation

<Tabs items={['CLI', 'Manual']} >

<Tab value="CLI">

<PackageManagerTabs command="litefy add componentname" />

</Tab>

<Tab value="Manual">

<SourceCode component="componentname" />

</Tab>

</Tabs>

## Usage

### Usage Title

Description.

<ComponentPreview 
  name="componentname-variant"
  title="Usage Title"
/>

## API Reference

### ComponentName

Description.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `prop` | `type` | `default` | Description |

### slotProps

| Slot | Type | Description |
|------|------|-------------|
| `slot` | `type` | Description |
```

### Chinese Template (`component.zh.mdx`)

```markdown
---
title: ComponentName 中文名
description: 中文描述
---

## 安装

<Tabs items={['CLI', 'Manual']} >

<Tab value="CLI">

<PackageManagerTabs command="litefy add componentname" />

</Tab>

<Tab value="Manual">

<SourceCode component="componentname" />

</Tab>

</Tabs>

## 用法

### 用法标题

描述。

<ComponentPreview 
  name="componentname-variant"
  title="用法标题示例"
/>

## API 参考

### ComponentName

描述。

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `prop` | `type` | `default` | 中文描述 |

### slotProps

| Slot | Type | Description |
|------|------|-------------|
| `slot` | `type` | 中文描述 |
```

## Key Patterns

### File Naming
- English: `content/docs/{component}.mdx`
- Chinese: `content/docs/{component}.zh.mdx`

### Frontmatter
```yaml
---
title: ComponentName          # English
title: ComponentName 中文名   # Chinese  
description: Description
---
```

### Sections
| English | Chinese | Required | Notes |
|---------|---------|----------|-------|
| `## Installation` | `## 安装` | Yes | |
| `## Usage` | `## 用法` | Yes | |
| `## API Reference` | `## API 参考` | Yes | |

### Components Used
| Component | Purpose | Notes |
|-----------|---------|-------|
| `<Tabs>` | Tab container | |
| `<Tab>` | Tab panel | |
| `<PackageManagerTabs>` | Install commands | |
| `<SourceCode>` | Show source | Must register in `app/components/source-code.tsx` |
| `<ComponentPreview>` | Demo preview | Must register in `app/demos/index.ts` |

### Table Format
```markdown
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `type` | `value` | desc |
```

## Example

### Button Example

**English (`button.mdx`):**
```markdown
---
title: Button
description: A button component with multiple variants and loading states
---

## Installation

<Tabs items={['CLI', 'Manual']} >

<Tab value="CLI">

<PackageManagerTabs command="litefy add button" />

</Tab>

<Tab value="Manual">

<SourceCode component="button" />

</Tab>

</Tabs>

## Usage

### Basic Variants

Different button variants for various use cases.

<ComponentPreview 
  name="button-basic"
  title="Basic Variants"
/>

## API Reference

### Button

The button component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'destructive' \| 'outline' \| 'text'` | `'primary'` | Button visual variant |
```

**Chinese (`button.zh.mdx`):**
```markdown
---
title: Button 按钮
description: 支持多种变体和加载状态的按钮组件
---

## 安装

<Tabs items={['CLI', 'Manual']} >

<Tab value="CLI">

<PackageManagerTabs command="litefy add button" />

</Tab>

<Tab value="Manual">

<SourceCode component="button" />

</Tab>

</Tabs>

## 用法

### 基础变体

不同的按钮变体适用于各种场景。

<ComponentPreview 
  name="button-basic"
  title="基础变体示例"
/>

## API 参考

### Button

按钮组件。

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'destructive' \| 'outline' \| 'text'` | `'primary'` | 按钮视觉变体 |
```

## Steps to Create Documentation

1. **Create demo files** in `app/demos/{component}/`
2. **Register demos** in `app/demos/index.ts`
3. **Create English documentation** at `content/docs/{component}.mdx`
4. **Create Chinese documentation** at `content/docs/{component}.zh.mdx`
5. **Verify** that `<ComponentPreview name="..." />` matches registered demo names

> **Note:** Source code is automatically loaded from `app/components/ui/{component}.tsx`, no manual registration required.

## Common Pitfalls

### Pitfall 1: Adding redundant heading
**Problem:** Adding `# ComponentName` at the top of the MDX file.
**Solution:** Do NOT add a top-level heading. Fumadocs automatically generates the title from the frontmatter `title` field.

### Pitfall 2: Demo name mismatch
**Problem:** `<ComponentPreview name="button-basic" />` shows "Demo not found".
**Solution:** Ensure the `name` prop matches the key in `app/demos/index.ts`.

### Pitfall 3: Missing Chinese documentation
**Problem:** Users cannot switch to Chinese language.
**Solution:** Always create both English and Chinese documentation files.

### Pitfall 4: Component file not found
**Problem:** `<SourceCode component="button" />` shows "Source code not found".
**Solution:** Ensure the component exists at `app/components/ui/{component}.tsx`.

## Best Practices

1. **Keep descriptions concise**: Use short, clear descriptions for props and sections
2. **Use consistent naming**: Follow `component-variant` pattern for demo names
3. **Include multiple examples**: Show different use cases (basic, advanced, custom)
4. **Document all props**: Include TypeScript types and default values
5. **Use proper formatting**: Wrap prop names and types in backticks
6. **Test demos**: Ensure all `<ComponentPreview>` components render correctly
