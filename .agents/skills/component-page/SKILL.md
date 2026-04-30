---
name: "component-page"
description: "Creates component documentation page following anchor page architecture. Invoke when user wants to create a new component documentation page."
---

# Component Page Creator

This skill creates a new component documentation page following the anchor page architecture.

## 页面结构

每个组件文档页面包含 4 个主要章节：

1. **安装** - 展示组件源码导入方式
2. **示例** - 展示组件用法示例
3. **结构** - 使用 Anatomy 组件展示组件内部元素
4. **文档** - 从 doc.mdx 引入的 CSS 类和 API 文档

## 目录结构

```
src/pages/<component-name>/
├── page.tsx           # 主页面文件
├── doc.mdx            # CSS Classes 和 API 文档
├── index.ts           # 导出配置
└── examples/          # 示例目录
    ├── index.ts       # 批量导出所有示例
    ├── Example1.tsx   # 示例1
    └── Example2.tsx   # 示例2
```

## 重要：i18n 变量命名规则

**必须遵守以下规则，否则会出现类型错误：**

- `t` - i18n 工具函数，**不要直接使用**
- `lang` - 完整的 i18n 对象，通过 `t(locale as "zh" | "en")` 获取，用于访问通用翻译
  - 正确：`lang.installation`, `lang.examples`, `lang.anatomy`, `lang.docs`, `lang.common.copySuccess`
- `l` - 当前组件的翻译，通过 `lang.componentName` 获取，用于访问组件特定翻译
  - 正确：`l.title`, `l.description`, `l.basic.title`, `l.anatomy.root`

**禁止：**
- ❌ 禁止使用 `t.installation`、`t.examples` 等
- ❌ 禁止使用 `lang.input.xxx`（应该用 `l.xxx`）
- ❌ 禁止混用变量

## 详细说明

### 1. page.tsx 主页面文件

包含 4 个主要部分：

```tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyIcon, CheckIcon } from "@/components/ui/icons";
import { toast } from "sonner";
import { Anchor, Title, Description, CodeBlock } from "@/components";
import { Anatomy } from "@/pages/component/anatomy";
import { Example1, Example2 } from "./examples";  // 从 examples 导入
import { t } from "@/pages/i18n";

import Example1Raw from "./examples/Example1.tsx?raw";  // 源码
import Example2Raw from "./examples/Example2.tsx?raw";  // 源码
import componentDoc from "./doc.mdx?raw";  // 文档
import componentSrc from "@/components/ui/component-name.tsx?raw";  // 组件源码

// DemoSection 组件：用于包装每个示例
function DemoSection({
  id,
  title,
  children,
  code,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  code: string;
}) {
  return (
    <section
      id={id}
      data-anchor-id={id}
      className="space-y-4 scroll-mt-20 py-4"
    >
      <div>
        <Title as="h3">{title}</Title>
      </div>
      <div className="border rounded-lg p-6 w-full overflow-x-auto">
        {children}
      </div>
      <CodeBlock>{code}</CodeBlock>
    </section>
  );
}

// 【关键】i18n 初始化，必须按这个顺序
export default function ComponentPage({ locale = "zh" }: { locale?: string }) {
  const lang = t(locale as "zh" | "en");  // 通用翻译
  const l = lang.componentName;              // 组件翻译
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(componentDoc);
    setCopied(true);
    toast.success(lang.common.copySuccess);  // 用 lang.common
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex">
      <div className="flex-1 w-full">
        {/* 1. 页面标题 - 用 l 获取组件翻译 */}
        <header className="pb-4 mb-4 border-b">
          <Title as="h1">{l.title}</Title>
          <Description>{l.description}</Description>
        </header>

        {/* 2. 安装章节 - 用 lang 获取通用翻译 */}
        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{componentSrc}</ShikiCodeBlock>
        </section>

        {/* 3. 示例章节 - 用 l 获取组件翻译 */}
        <section id="examples" className=" scroll-mt-20">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={Example1Raw}
          >
            <Example1 />
          </DemoSection>

          <DemoSection
            id="advanced"
            title={l.advanced.title}
            code={Example2Raw}
          >
            <Example2 />
          </DemoSection>
        </section>

        {/* 4. 结构章节 - 用 l 获取组件翻译 */}
        <section id="anatomy" className="mt-8 space-y-4 scroll-mt-20">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            parts={[
              { id: "anatomy-root", label: l.anatomy.root },
              { id: "anatomy-child", label: l.anatomy.child },
            ]}
          >
            <ComponentName id="anatomy-root">
              <ChildComponent id="anatomy-child" />
            </ComponentName>
          </Anatomy>
        </section>

        {/* 5. 文档章节 - 用 lang 获取通用翻译 */}
        <section
          id="docs"
          data-anchor-id="docs"
          className="mt-12 space-y-4 scroll-mt-20"
        >
          <Title as="h2" className="mb-4">
            {lang.docs}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label={lang.common.copy}
            >
              {copied ? (
                <CheckIcon className="size-4 text-green-500" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </button>
          </Title>
          <section
            id="css-classes"
            data-anchor-id="css-classes"
            className="space-y-4 scroll-mt-20 prose dark:prose-invert max-w-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {componentDoc}
            </ReactMarkdown>
          </section>
        </section>
      </div>

      {/* 右侧锚点导航 - 用 lang 获取通用翻译 */}
      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section id="installation" title={lang.installation} />
          <Anchor.Section id="examples" title={lang.examples}>
            <Anchor.Item id="#basic">{l.basic.title}</Anchor.Item>
            <Anchor.Item id="#advanced">{l.advanced.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section id="anatomy" title={lang.anatomy} />
          <Anchor.Section id="docs" title={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
```

### 2. examples/index.ts - 批量导出示例

```ts
export { default as Example1 } from "./Example1";
export { default as Example2 } from "./Example2";
```

### 3. examples/Example1.tsx - 示例组件

```tsx
export default function Example1() {
  return (
    <div>
      {/* 演示代码 */}
    </div>
  );
}
```

### 4. doc.mdx - 文档内容

仅包含 API Reference，如果组件导出了 CSS 类（通过 `Component.class = ...`），则添加 CSS Classes 部分：

```mdx
## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'default' | 样式变体 |
```

如果组件导出了 CSS 类：

```mdx
## CSS Classes

```css
.component {}
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'default' | 样式变体 |
```
```

### 5. index.ts - 页面导出

```ts
import ComponentName from "./page";

export default ComponentName;
```

### 6. i18n 翻译配置 (zh.ts / en.ts)

```ts
componentName: {
  title: "组件名",
  description: "组件描述...",
  basic: {
    title: "基础",
  },
  advanced: {
    title: "高级",
  },
  anatomy: {
    root: "根元素",
    child: "子元素",
  },
},
```

## 关键点总结

| 章节 | id | 内容来源 |
|------|-----|---------|
| 安装 | `installation` | ShikiCodeBlock + 组件源码 |
| 示例 | `examples` | examples 目录 |
| 结构 | `anatomy` | Anatomy 组件 |
| 文档 | `docs` + `css-classes` | doc.mdx 文件 |

## 重要注意事项

1. **安装部分**：
   - 使用 `id="installation"`
   - 使用 `ShikiCodeBlock` 展示组件源码
   - Title 使用 `as="h2"`
2. **示例部分**：
   - 使用 `<section id="examples">` 包裹
   - 章节标题 `<Title as="h2">示例</Title>`
   - 每个 DemoSection 内部使用 `<Title as="h3">` 作为三级标题
   - 描述使用 `<Description>` 组件
3. **DemoSection**：
   - Title 使用 `as="h3"`（示例下的三级目录）
   - children 是渲染的组件
   - code 是源码（通过 `?raw` 导入）
4. **结构部分**：Anatomy 组件需要在组件上添加对应 id，Title 使用 `as="h2"`
5. **文档部分**：使用 ReactMarkdown 渲染 doc.mdx 内容
6. **翻译规则**：
   - `lang` = 通用翻译对象
   - `l` = 组件翻译对象
   - 通用翻译用 `lang.xxx`（installation, examples, anatomy, docs, common）
   - 组件翻译用 `l.xxx`（title, description, basic, advanced, anatomy）
