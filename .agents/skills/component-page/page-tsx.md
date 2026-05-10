# page.tsx 结构说明

## 组件模板

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
import componentDoc from "./doc.mdx?raw";
import componentSrc from "@/component/ui/component-name.tsx?raw";

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

          {/* 更多示例... */}
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
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
            {/* 更多锚点项... */}
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
```

## 注意事项

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

4. **DemoSection**：
   - Title 使用 `as="h3"`（示例下的三级目录）
   - children 是渲染的组件
   - code 是源码（通过 `?raw` 导入）

5. **结构部分**：
   - Anatomy 组件需要在组件上添加对应 id
   - Title 使用 `as="h2"`

6. **文档部分**：
   - 使用 `Docs` 组件展示 API 文档
   - `sections` 数据从 i18n 配置获取翻译

7. **侧边栏 Anchor**：
   - 使用 `href` 属性（带 # 前缀）
   - 使用 `linkText` 属性作为链接文本
