# doc.md 说明

## 用途

- **不再在网页中渲染**
- 唯一用途：提供复制文本供 AI 使用
- **文档内容统一使用英语**

## 内容结构

```md
## Installation

```bash
npm install @your-org/ui
```

## Usage

```tsx
import { Component } from "@/component/ui/component";
```

## Examples

### Basic

```tsx
<Component>Content</Component>
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'default' | Style variant |
```

## 注意事项

- 保持完整内容（包括 API Reference 表格）
- 仅用于复制和 AI 使用
- 不在网页中渲染
- 网页渲染使用 `Docs` 组件（在 page.tsx 中定义）
- **原生 HTML 属性不需要重复**（如 `children`、`ref` 等）- 继承自原生元素，不需要额外文档
