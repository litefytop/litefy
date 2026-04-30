import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyIcon, CheckIcon } from "@/components/ui/icons";
import { toast } from "sonner";
import { Anchor, Title, Description } from "@/components";

import { ShikiCodeBlock } from "@/pages/component/shiki-code-block";
import { Anatomy } from "@/pages/component/anatomy";
import { Accordion } from "@/components";
import { t } from "@/pages/i18n";
import {
  AccordionBasic,
  AccordionMultiple,
  AccordionControlled,
} from "./examples";

import AccordionBasicRaw from "./examples/accordion-basic.tsx?raw";
import AccordionMultipleRaw from "./examples/accordion-multiple.tsx?raw";
import AccordionControlledRaw from "./examples/accordion-controlled.tsx?raw";
import accordionDoc from "./doc.mdx?raw";
import accordionSrc from "@/components/ui/accordion.tsx?raw";

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
      <ShikiCodeBlock>{code}</ShikiCodeBlock>
    </section>
  );
}

export default function AccordionPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const lang = t(locale as "zh" | "en");

  const handleCopy = () => {
    navigator.clipboard.writeText(accordionDoc);
    setCopied(true);
    toast.success(lang.common.copySuccess);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex">
      <div className="flex-1 w-full">
        <header className="pb-4 mb-4 border-b">
          <Title as="h1">{lang.accordion.title}</Title>
          <Description>{lang.accordion.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{accordionSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className=" scroll-mt-20">
          <Title as="h2">{lang.examples}</Title>
          <DemoSection
            id="basic"
            title={lang.accordion.basic.title}
            code={AccordionBasicRaw}
          >
            <AccordionBasic />
          </DemoSection>

          <DemoSection
            id="multiple"
            title={lang.accordion.multiple.title}
            code={AccordionMultipleRaw}
          >
            <AccordionMultiple />
          </DemoSection>

          <DemoSection
            id="controlled"
            title={lang.accordion.controlled.title}
            code={AccordionControlledRaw}
          >
            <AccordionControlled />
          </DemoSection>
        </section>
        <section id="anatomy" className="mt-8 space-y-4 scroll-mt-20">
          <Title as="h2">{lang.accordion.anatomy.title}</Title>
          <Anatomy
            className="h-32"
            parts={[
              {
                id: "anatomy-accordion",
                label: lang.accordion.anatomy.accordion,
              },
              { id: "anatomy-item", label: lang.accordion.anatomy.item },
              { id: "anatomy-trigger", label: lang.accordion.anatomy.trigger },
              { id: "anatomy-title", label: lang.accordion.anatomy.titleLabel },
              { id: "anatomy-content", label: lang.accordion.anatomy.content },
            ]}
          >
            <Accordion
              defaultOpenKeys={["item1"]}
              id="anatomy-accordion"
              className="max-w-sm"
              itemProps={{
                trigger: { id: "anatomy-trigger" },
                title: { id: "anatomy-title" },
                content: { id: "anatomy-content" },
              }}
            >
              <Accordion.Item
                value="item1"
                title={lang.accordion.basic.title}
                id="anatomy-item"
              >
                {lang.accordion.anatomy.content}
              </Accordion.Item>
              <Accordion.Item value="item2" title={lang.accordion.basic.title}>
                {lang.accordion.anatomy.content}
              </Accordion.Item>
            </Accordion>
          </Anatomy>
        </section>
        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-4 scroll-mt-20">
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
          <Description>{lang.common.copyDocs}</Description>

          <section
            id="css-classes"
            data-anchor-id="css-classes"
            className="mt-12 space-y-4 scroll-mt-20 prose dark:prose-invert max-w-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {accordionDoc}
            </ReactMarkdown>
          </section>

          <section
            id="api"
            data-anchor-id="api"
            className="mt-12 space-y-4 scroll-mt-20 prose dark:prose-invert max-w-none"
          ></section>
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section id="installation" title={lang.installation} />
          <Anchor.Section id="examples" title={lang.examples}>
            <Anchor.Item id="#basic">{lang.accordion.basic.title}</Anchor.Item>
            <Anchor.Item id="#multiple">
              {lang.accordion.multiple.title}
            </Anchor.Item>
            <Anchor.Item id="#controlled">
              {lang.accordion.controlled.title}
            </Anchor.Item>
          </Anchor.Section>
          <Anchor.Section id="anatomy" title={lang.accordion.anatomy.title} />
          <Anchor.Section id="docs" title={lang.docs}/>

        </Anchor>
      </aside>
    </div>
  );
}
