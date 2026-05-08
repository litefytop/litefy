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
4. **文档** - 使用 Docs 组件展示 API 文档（多语言支持）

## 目录结构

```
src/pages/<component-name>/
├── page.tsx           # 主页面文件
├── doc.mdx            # 说明页 MD 格式（仅用于复制，不渲染）
├── index.ts           # 导出配置
└── examples/          # 示例目录
    ├── index.ts       # 批量导出所有示例
    ├── Example1.tsx   # 示例 1
    └── Example2.tsx   # 示例 2
```

## 重要：i18n 变量使用规则

**必须遵守以下规则：**

1. 获取翻译对象：
   ```tsx
   const lang = t(locale as "zh" | "en");  // 获取完整 i18n 对象
   const l = lang.componentName;           // 获取当前组件的翻译（如 lang.accordion）
   ```

2. 使用翻译：
   - **通用翻译**：`lang.installation`, `lang.examples`, `lang.anatomy`, `lang.docs`, `lang.common.copySuccess`
   - **组件翻译**：`l.title`, `l.description`, `l.basic.title`, `l.anatomy.root`, `l.api.props.*`

3. **必须在组件函数内部调用**：
   ```tsx
   export default function Page({ locale = "zh" }: { locale?: string }) {
     const lang = t(locale as "zh" | "en");
     const l = lang.componentName;
     // ... 使用 lang 和 l
   }
   ```

## 详细说明

### 1. page.tsx 主页面文件

包含 4 个主要部分：

```tsx
import React from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  CheckIcon,
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Anatomy,
  Button,
  Docs,
} from "@/component";
import { toast } from "sonner";
import { t } from "@/pages";

import Example1Raw from "./examples/Example1.tsx?raw";
import Example2Raw from "./examples/Example2.tsx?raw";
import componentDoc from "./doc.mdx?raw";
import componentSrc from "@/component/component-name.tsx?raw";

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
      className="space-y-4 py-4"
    >
      <div>
        <Title as="h3">{title}</Title>
      </div>
      <div className="border rounded-lg p-6 w-full overflow-x-auto">
        {children}
      </div>
      <ShikiCodeBlock>{code}</ShikiCodeBlock>
    </section>
  );
}

export default function ComponentPage({ locale = "zh" }: { locale?: string }) {
  const lang = t(locale as "zh" | "en");
  const l = lang.componentName;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(componentDoc);
    setCopied(true);
    toast.success(lang.common.copySuccess);
    setTimeout(() => setCopied(false), 2000);
  };

  // API 文档数据（从 i18n 获取翻译）
  const sections = [
    {
      title: l.api.sectionTitles.componentProps,
      columns: [
        { key: "prop", header: l.api.headers.prop },
        { key: "type", header: l.api.headers.type },
        { key: "default", header: l.api.headers.default },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "propName",
          type: "string",
          default: "-",
          description: l.api.props.propName,
        },
      ],
    },
  ];

  return (
    <div className="flex">
      <div className="flex-1 w-full">
        <header className="pb-4 mb-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <Title as="h1">{l.title}</Title>
            <div className="flex items-center gap-2">
              <Button onClick={handleCopy} variant="ghost">
                {copied ? (
                  <CheckIcon className="size-4 text-green-500 mr-1" />
                ) : (
                  <CopyIcon className="size-4 mr-1" />
                )}
                {lang.common.copyDocs}
              </Button>
              <Button variant="ghost">
                <ArrowLeftIcon className="size-4" />
              </Button>
              <Button variant="ghost">
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>
          </div>
          <Description>{l.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-30">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{componentSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
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

        <section id="anatomy" className="mt-8 space-y-4">
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

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={sections} />
        </section>
      </div>

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
export * from "./Example1";
export * from "./Example2";
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

### 4. doc.mdx - 文档内容（仅用于复制）

**重要：** 
- doc.mdx 文件不再在网页中渲染，唯一用途是提供复制文本供 AI 使用
- **文档内容统一使用英语**

```mdx
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

网页渲染使用 `Docs` 组件（在 page.tsx 中定义），支持多语言。

### 5. index.ts - 页面导出

```ts
import ComponentName from "./page";

export default ComponentName;
```

### 6. i18n 翻译配置 (zh.ts / en.ts)

通用翻译 (common)：

```ts
// zh.ts
common: {
  copyDocs: "复制文档",
  copySuccess: "复制成功",
}

// en.ts
common: {
  copyDocs: "Copy docs",
  copySuccess: "Copied!",
}
```

组件翻译：

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
  api: {
    props: {
      propName: "属性描述",
    },
    headers: {
      prop: "Prop",
      type: "Type",
      default: "Default",
      description: "描述",
    },
    sectionTitles: {
      componentProps: "ComponentName Props",
    },
  },
},
```

## 关键点总结

| 章节 | id | 内容来源 |
|------|-----|---------|
| 安装 | `installation` | ShikiCodeBlock + 组件源码 |
| 示例 | `examples` | examples 目录 |
| 结构 | `anatomy` | Anatomy 组件 |
| 文档 | `docs` | Docs 组件 + i18n 配置 |

## 重要注意事项

1. **Header 部分**：
   - 使用 `<header className="pb-4 mb-4 border-b space-y-3">`
   - 第一行：Title + 按钮组（flex justify-between）
   - 第二行：Description 独占一行
   - 按钮组使用 Button 组件，包含：复制文档、后退、前进图标按钮
2. **安装部分**：
   - 使用 `id="installation"`
   - 使用 `ShikiCodeBlock` 展示组件源码
   - Title 使用 `as="h2"`
3. **示例部分**：
   - 使用 `<section id="examples">` 包裹
   - 章节标题 `<Title as="h2">示例</Title>`
   - 每个 DemoSection 内部使用 `<Title as="h3">` 作为三级标题
   - 描述使用 `<Description>` 组件
4. **DemoSection**：
   - Title 使用 `as="h3"`（示例下的三级目录）
   - children 是渲染的组件
   - code 是源码（通过 `?raw` 导入）
5. **结构部分**：Anatomy 组件需要在组件上添加对应 id，Title 使用 `as="h2"`
6. **文档部分**：
   - **不再使用 ReactMarkdown**
   - 使用 `Docs` 组件展示 API 文档
   - `sections` 数据从 i18n 配置获取翻译
   - 支持多语言切换
7. **doc.mdx**：
   - 保持完整内容（包括 API Reference 表格）
   - **仅用于复制和 AI 使用**
   - 不在网页中渲染
8. **翻译规则**：
   - `lang` = 通用翻译对象（`lang.installation`, `lang.examples`, `lang.common.copySuccess` 等）
   - `l` = 组件翻译对象（`l.title`, `l.description`, `l.basic.title`, `l.api.props.*` 等）
   - 所有翻译必须从 i18n 配置获取，禁止硬编码

## 工作流程

1. 创建组件页面结构（page.tsx, doc.mdx, examples/）
2. 在 i18n 配置文件中添加组件翻译（包括 api 部分）
3. 在 page.tsx 中定义 sections 数组（从 i18n 获取翻译）
4. 使用 `<Docs sections={sections} />` 渲染 API 文档
5. 保持 doc.mdx 完整用于复制
