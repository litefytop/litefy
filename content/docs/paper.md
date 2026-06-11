---
title: Paper
description: A paper surface component for displaying content
---

# Paper

A paper surface component for displaying content.
# 已内置在项目组件库中
import { PaperProvider, Paper } from "@/component/ui/paper";
```

## Usage

### Basic Example

```tsx
import { PaperProvider, Paper } from "@/component/ui/paper";

function MyDocument() {
  return (
    <PaperProvider>
      <Paper>
        <h1>Document Title</h1>
        <p>Document content goes here...</p>
      </Paper>
    </PaperProvider>
  );
}
```

### Multiple Pages with paginatedViewer

```tsx
import { useState } from "react";
import { paginatedViewer, PaperProvider, Paper, Pagination } from "@/component";

function MultiPageDocument() {
  const [current, setCurrent] = useState(1);
  const totalPages = 3;

  return (
    <div className="space-y-4">
      <PaperProvider totalPages={totalPages}>
        <paginatedViewer activeIndex={current - 1}>
          <Paper variant="a4" countable>
            <h1>Page 1</h1>
            <div data-page-number>Page 1 of {totalPages}</div>
          </Paper>
          <Paper variant="a4" countable>
            <h1>Page 2</h1>
            <div data-page-number>Page 2 of {totalPages}</div>
          </Paper>
          <Paper variant="a4" countable>
            <h1>Page 3</h1>
            <div data-page-number>Page 3 of {totalPages}</div>
          </Paper>
        </paginatedViewer>
      </PaperProvider>

      <Pagination
        current={current}
        pageSize={1}
        total={totalPages}
        onPageChange={(page) => setCurrent(page)}
      >
        <Pagination.Controls />
      </Pagination>
    </div>
  );
}
```

### Different Paper Sizes

```tsx
import { PaperProvider, Paper } from "@/component/ui/paper";

function DocumentWithSizes() {
  return (
    <>
      <PaperProvider>
        <Paper variant="a4" orientation="portrait">
          <h1>A4 Portrait (210mm × 297mm)</h1>
        </Paper>
      </PaperProvider>

      <PaperProvider>
        <Paper variant="a4" orientation="landscape">
          <h1>A4 Landscape (297mm × 210mm)</h1>
        </Paper>
      </PaperProvider>

      <PaperProvider>
        <Paper variant="a5" orientation="portrait">
          <h1>A5 Portrait (148mm × 210mm)</h1>
        </Paper>
      </PaperProvider>
    </>
  );
}
```

### Page Number Display with CSS

```tsx
import { PaperProvider, Paper } from "@/component/ui/paper";

function DocumentWithPageNumbers() {
  return (
    <PaperProvider>
      <Paper countable>
        <h1>Content</h1>
        {/* Page number display using CSS selector */}
        <div className="page-number" data-page-number />
      </Paper>
    </PaperProvider>
  );
}
```

CSS for page number display:

```css
/* Using data-page-index attribute */
.page-number::after {
  content: "Page " attr(data-page-index);
}

/* Or using CSS counters */
.Paper {
  counter-increment: page;
}

.page-number::after {
  content: "Page " counter(page);
}
```

## Anatomy

- **PaperProvider**: 上下文提供者，管理页面索引和内容引用
- **Paper**: 单个纸张页面组件
- **contentRef**: PaperProvider 的 ref，用于打印功能

## API Reference

### PaperProvider

上下文提供者，用于管理多个 Paper 页面的状态。

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | 子组件 |
| `totalPages` | `number` | - | 总页数（可选） |
| `...props` | `React.ComponentProps<"div">` | - | 透传给外层 div 的属性 |

**Ref:** PaperProvider 支持通过 `ref` 获取内容引用，用于打印功能。

### Paper

单个纸张页面组件。

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | 页面内容 |
| `className` | `ClassNameValue` | - | 自定义 CSS 类名 |
| `variant` | `"a4" \| "a5" \| "scroll"` | `"scroll"` | 纸张尺寸变体 |
| `orientation` | `"portrait" \| "landscape"` | `"portrait"` | 页面方向 |
| `countable` | `boolean` | `true` | 是否计入页面索引 |
| `...props` | `React.ComponentProps<"div">` | - | 透传给 div 的属性 |

### Paper.class

静态对象，包含所有 CSS 类定义。

```typescript
Paper.class = {
  base: string,
  variant: {
    a4: { 
      portrait: string, 
      landscape: string 
    },
    a5: { 
      portrait: string, 
      landscape: string 
    },
    scroll: { 
      portrait: string, 
      landscape: string 
    },
  }
}
```

## CSS Classes

### Base Classes

```css
base: "mx-auto print:bg-white shadow-lg border-t print:shadow-none print:border-0 print:mx-0 print:p-0 bg-white dark:bg-zinc-900"
```

### Variant Classes

#### A4

```css
a4.portrait: "w-[210mm] h-[297mm] p-[10mm] page-break-after print:w-[210mm] print:h-[297mm] print:p-[10mm]"
a4.landscape: "w-[297mm] h-[210mm] p-[10mm] page-break-after print:w-[297mm] print:h-[210mm] print:p-[10mm]"
```

#### A5

```css
a5.portrait: "w-[148mm] h-[210mm] p-[5mm] page-break-after print:w-[148mm] print:h-[210mm] print:p-[5mm]"
a5.landscape: "w-[210mm] h-[148mm] p-[5mm] page-break-after print:w-[210mm] print:h-[148mm] print:p-[5mm]"
```

#### Scroll

```css
scroll.portrait: "w-full h-fit flex flex-col overflow-y-auto p-[10mm] print:w-full print:h-fit print:overflow-visible print:p-[10mm]"
scroll.landscape: "h-full w-fit flex flex-col overflow-x-auto p-[10mm] print:h-full print:w-fit print:overflow-visible print:p-[10mm]"
```

## Data Attributes

Paper 组件会自动添加以下数据属性（当 `countable=true` 时）：

- `data-page-index`: 当前页面索引（从 0 开始）
- `data-total-pages`: 总页数

这些属性可以用于自定义页眉页脚或页面导航。

### Displaying Page Numbers with CSS

使用 `data-page-number` 属性配合 CSS 显示页码：

```tsx
<Paper countable>
  <div className="page-footer" data-page-number />
</Paper>
```

```css
/* Method 1: Using data-page-index attribute */
[data-page-number]::after {
  content: "Page " attr(data-page-index);
}

/* Method 2: With total pages */
[data-page-number]::after {
  content: attr(data-page-index) " of " attr(data-total-pages);
}

/* Method 3: Using CSS counters */
[data-page-number] {
  counter-increment: page;
}

[data-page-number]::after {
  content: "Page " counter(page);
}
```

## Best Practices

### Performance

- 对于不需要页面索引的页面（如封面、目录），使用 `countable={false}`
- 避免在 Paper 组件内使用过于复杂的布局
- 大量页面时考虑使用虚拟滚动

### Print Optimization

- 使用 `variant="a4"` 或 `variant="a5"` 确保打印尺寸准确
- 测试不同浏览器的打印效果
- 为打印内容提供合适的页边距

### Accessibility

- 使用语义化 HTML 标签
- 确保打印内容有足够的颜色对比度
- 为图片提供替代文本

## Related Components

- [AspectRatio](/docs/components/aspect-ratio) - 保持图片比例
- [Separator](/docs/components/separator) - 内容分隔线
- [Image](/docs/components/image) - 图片展示
- [Pagination](/docs/components/pagination) - 分页导航
