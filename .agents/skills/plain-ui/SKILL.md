---
name: "plain-ui"
description: "Plain UI 组件库使用指南。Invoke when user asks about UI components, Button, Input, or needs to use components from this project."
user-invocable: false
allowed-tools: 
---

# Plain UI

一套轻量化、高复用的基础 UI 组件库。

## Current Project Context

```json
{
  "project": {
    "framework": "Vite",
    "srcDirectory": true,
    "typescript": true,
    "tailwindVersion": "v4",
    "tailwindCss": "src/assets/styles/valuable.css",
    "importAlias": "@",
    "theme": "blue",
    "colorScheme": "light"
  },
  "components": [
    "button", "input", "checkbox", "slider", "textarea",
    "select", "loading", "empty", "skeleton", "separator", "theme"
  ],
  "paths": {
    "components": "src/components/ui/",
    "pages": "src/pages/",
    "layouts": "src/layouts/",
    "styles": "src/assets/styles/"
  }
}
```

## Project Structure

```
src/
├── components/ui/      # UI 组件目录
├── pages/             # Demo 页面
├── layouts/           # 布局组件
├── config/            # 配置
└── assets/styles/     # CSS 样式
```

## Principles

1. **Use existing components first.** Check if a component already exists before building custom UI.
2. **Use semantic colors.** `bg-primary`, `text-muted-foreground` — never raw values like `bg-blue-500`.
3. **Use Tailwind utilities for layout.** Use `flex`, `gap-*`, `grid` instead of custom styles.
4. **Keep components simple.** Each component should do one thing well.

## Critical Rules

### Styling & Tailwind

- **`className` for layout and spacing.** Let Tailwind handle positioning.
- **Use `size-*` when width and height are equal.** `size-10` not `w-10 h-10`.
- **Use semantic tokens.** `bg-background`, `text-foreground`, `bg-primary`, etc.

### Component Structure

- **Export components from index.** All UI components should be exported from `@/component`.
- **Use variants for different styles.** `variant="primary"`, `variant="outline"`, etc.
- **Loading states use `loading` prop.** Not separate `Spinner` component.

### Forms & Inputs

- **Validation uses `invalid` prop.** `invalid` on Input/Textarea shows error state.
- **Disabled uses `disabled` prop.** Standard HTML disabled attribute.

## Key Patterns

```tsx
// Button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

// Loading state
<Button loading={{ loading: true }}>Loading</Button>

// Input with validation
<Input invalid placeholder="Invalid input" />
<Input disabled placeholder="Disabled input" />

// Select composition
<Select placeholder="Select...">
  <Select.Option label="Option A" value="a" />
  <Select.Option label="Option B" value="b" />
</Select>
```

## Component Selection

| Need                       | Use                          |
| -------------------------- | ---------------------------- |
| Button/action              | `Button`                     |
| Text input                 | `Input`                      |
| Textarea                   | `Textarea`                   |
| Checkbox                   | `Checkbox`                   |
| Slider                     | `Slider`                     |
| Select                     | `Select`                     |
| Loading state              | `Loading`                    |
| Empty state                | `Empty`                      |
| Skeleton                   | `Skeleton`                   |
| Separator                  | `Separator`                  |

## Theme System

See [theming.md](./theming.md) for detailed documentation.

```tsx
// Theme Provider
<ThemeProvider defaultTheme="blue" defaultColorScheme="light">
  <App />
</ThemeProvider>

// Use theme in components
const { theme, colorScheme, setTheme, toggleColorScheme } = useTheme();
```

### Available Themes

zinc, slate, stone, gray, neutral, red, rose, orange, green, blue, yellow, violet

## Component Development

See [rules/component.md](./rules/component.md) for detailed page development rules.

### Page Structure

- 页面中 title 后紧跟的描述文本必须使用 Description 组件，而不是手动写 p 标签
- 禁止 div 直接嵌套 div 的写法

**错误示例：**
```tsx
<div className="class1">
  <div className="class2">
    <element />
  </div>
</div>
```

**正确示例：**
```tsx
<div className="class1 class2">
  <element />
</div>
```

**除外情况：**
```tsx
<div className="class0">
  <div className="class1">
    <element />
  </div>
  <div className="class2">
    <element />
  </div>
</div>
```

### Add New Component

1. Create component in `src/components/ui/`
2. Export from `src/components/ui/index.ts`
3. Create demo page in `src/pages/`
4. Add route to `src/main.tsx`
5. Add navigation item to `navItems` in `main.tsx`

## CSS Variables

TODO: 待完善

Theme colors are defined in CSS using OKLCH format.
See `src/assets/styles/valuable.css` for all variables.

## Quick Reference

```bash
# TODO: 添加 CLI 命令
# Add a component
plain-ui add button

# Initialize project
plain-ui init

# Update theme
plain-ui theme set blue
```

## Detailed References

- [theming.md](./theming.md) — 主题系统、颜色变量、OKLCH 格式
