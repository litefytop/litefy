import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyIcon, CheckIcon } from "@/components/ui/icons";
import { toast } from "sonner";
import { Anchor, Title, Description } from "@/components";
import { CodeBlock } from "@/pages/component/code-block";
import { ShikiCodeBlock } from "@/pages/component/shiki-code-block";
import { Anatomy } from "@/pages/component/anatomy";
import { AnchorBasic, AnchorWithSections } from "./examples";
import { zh } from "@/pages/i18n";

import AnchorBasicRaw from "./examples/anchor-basic.tsx?raw";
import AnchorWithSectionsRaw from "./examples/anchor-with-sections.tsx?raw";
import anchorDoc from "./doc.mdx?raw";
import anchorSrc from "@/components/ui/anchor.tsx?raw";

const t = zh;

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

export default function AnchorPage() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(anchorDoc);
    setCopied(true);
    toast.success(t.common.copySuccess);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex">
      <div className="flex-1 w-full">
        <header className="pb-4 mb-4 border-b">
          <Title as="h1">{t.anchor.title}</Title>
          <Description>{t.anchor.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {t.installation}
          </Title>
          <ShikiCodeBlock>{anchorSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className=" scroll-mt-20">
          <Title as="h2">{t.examples}</Title>

          <DemoSection
            id="basic"
            title={t.anchor.basic.title}
            code={AnchorBasicRaw}
          >
            <AnchorBasic />
          </DemoSection>

          <DemoSection
            id="sections"
            title={t.anchor.withSections.title}
            code={AnchorWithSectionsRaw}
          >
            <AnchorWithSections />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4 scroll-mt-20">
          <Title as="h2">{t.anatomy}</Title>
          <Anatomy
            parts={[
              { id: "anatomy-anchor", label: t.anchor.anatomy.anchor },
              { id: "anatomy-section", label: t.anchor.anatomy.section },
              { id: "anatomy-item", label: t.anchor.anatomy.item },
              { id: "anatomy-link", label: t.anchor.anatomy.link },
            ]}
          >
            <Anchor className="max-w-xs" id="anatomy-anchor">
              <Anchor.Section id="anatomy-section" title="Section 1">
                <Anchor.Item id="anatomy-item" href="#section1">
                  <span id="anatomy-link">Section 1.1</span>
                </Anchor.Item>
                <Anchor.Item id="anatomy-item-2" href="#section2">
                  Section 1.2
                </Anchor.Item>
              </Anchor.Section>
            </Anchor>
          </Anatomy>
        </section>

        <section
          id="docs"
          data-anchor-id="docs"
          className="mt-12 space-y-4 scroll-mt-20"
        >
          <Title as="h2" className="mb-4">
            {t.docs}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label={t.common.copy}
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
              {anchorDoc}
            </ReactMarkdown>
          </section>
          <section
            id="api"
            data-anchor-id="api"
            className="space-y-4 scroll-mt-20 prose dark:prose-invert max-w-none"
          ></section>
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
          <Anchor>
            <Anchor.Section id="installation" title={t.installation} />
            <Anchor.Section id="examples" title={t.examples}>
              <Anchor.Item id="#basic">{t.anchor.basic.title}</Anchor.Item>
              <Anchor.Item id="#sections">{t.anchor.withSections.title}</Anchor.Item>
            </Anchor.Section>
            <Anchor.Section id="anatomy" title={t.anatomy} />
            <Anchor.Section id="docs" title={t.docs}/>

          </Anchor>
      </aside>
    </div>
  );
}
