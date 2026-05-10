import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Accordion,
  Button,
  Docs,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages";
import { getComponentNav } from "@/pages/config/routes";
import {
  AccordionBasic,
  AccordionMultiple,
  AccordionControlled,
} from "./examples";

import AccordionBasicRaw from "./examples/accordion-basic.tsx?raw";
import AccordionMultipleRaw from "./examples/accordion-multiple.tsx?raw";
import AccordionControlledRaw from "./examples/accordion-controlled.tsx?raw";
import accordionDoc from "./doc.mdx?raw";
import accordionSrc from "@/component/ui/accordion.tsx?raw";

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
    <section id={id} data-anchor-id={id} className="space-y-4 py-4">
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
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.accordion;

  const accordionSections = [
    {
      title: l.api.sectionTitles.accordionProps,
      data: [
        {
          props: "defaultOpenKeys",
          type: "Record<string, boolean>",
          default: "{}",
          description: l.api.props.defaultOpenKeys,
        },
        {
          props: "openKeys",
          type: "Record<string, boolean>",
          
          description: l.api.props.openKeys,
        },
        {
          props: "onOpenChange",
          type: "(keys: Record<string, boolean>) => void",
          
          description: l.api.props.onOpenChange,
        },
        {
          props: "allowMultiple",
          type: "boolean",
          default: "false",
          description: l.api.props.allowMultiple,
        },
        {
          props: "className",
          type: "ClassNameValue",
          
          description: lang.common.className,
        },

      ],
    },
    {
      title: l.api.sectionTitles.accordionItemProps,
      data: [
        {
          props: "value",
          type: "string",
          
          description: l.api.itemProps.value,
        },
        {
          props: "label",
          type: "ReactNode",
          
          description: l.api.itemProps.label,
        },
        {
          props: "itemProps",
          type: "object",
          
          description: l.api.itemProps.itemProps,
        },
        {
          props: "className",
          type: "ClassNameValue",
          
          description: lang.common.className,
        },
      ],
    },
    {
      title: l.api.sectionTitles.itemPropsConfig,
      data: [
        {
          props: "trigger",
          type: 'React.ComponentProps<"button">',
          
          description: l.api.itemPropsConfig.trigger,
        },
        {
          props: "label",
          type: 'React.ComponentProps<"span">',
          
          description: l.api.itemPropsConfig.label,
        },
        {
          props: "content",
          type: 'React.ComponentProps<"div">',
          
          description: l.api.itemPropsConfig.content,
        },
      ],
    },
  ];

  const nav = getComponentNav("/components/accordion", locale as "zh" | "en");

  const handleCopy = () => {
    navigator.clipboard.writeText(accordionDoc);
    setCopied(true);
    Toaster.success({ title: lang.common.copySuccess });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrev = () => {
    if (nav.prev) navigate(`/${locale}${nav.prev.href}`);
  };

  const handleNext = () => {
    if (nav.next) navigate(`/${locale}${nav.next.href}`);
  };

  return (
    <div className="flex">
      <div className="flex-1 w-full">
        <header className="pb-4 mb-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <Title as="h1">{lang.accordion.title}</Title>
            <div className="flex items-center gap-2">
              <Button onClick={handleCopy} variant="ghost">
                {copied ? (
                  <CheckIcon className="size-4 text-green-500 mr-1" />
                ) : (
                  <CopyIcon className="size-4 mr-1" />
                )}
                {lang.common.copyDocs}
              </Button>
              <Button variant="ghost" onClick={handlePrev} disabled={!nav.prev}>
                <ArrowLeftIcon className="size-4" />
              </Button>
              <Button variant="ghost" onClick={handleNext} disabled={!nav.next}>
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>
          </div>
          <Description>{lang.accordion.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-30">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{accordionSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
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
        <section id="anatomy" className="mt-8 space-y-4">
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
              defaultOpenKeys={{"item1":true}}
              id="anatomy-accordion"
              className="max-w-sm"
            >
              <Accordion.Item
                value="item1"
                label={lang.accordion.basic.title}
                id="anatomy-item"
                itemProps={{
                  trigger: { id: "anatomy-trigger" },
                  label: { id: "anatomy-title" },
                  content: { id: "anatomy-content" },
                }}
              >
                {lang.accordion.anatomy.content}
              </Accordion.Item>
              <Accordion.Item value="item2" label={lang.accordion.basic.title}>
                {lang.accordion.anatomy.content}
              </Accordion.Item>
            </Accordion>
          </Anatomy>
        </section>
        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-4">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>

          <Docs sections={accordionSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">
              {lang.accordion.basic.title}
            </Anchor.Item>
            <Anchor.Item href="#multiple">
              {lang.accordion.multiple.title}
            </Anchor.Item>
            <Anchor.Item href="#controlled">
              {lang.accordion.controlled.title}
            </Anchor.Item>
          </Anchor.Section>
          <Anchor.Section
            href="#anatomy"
            linkText={lang.accordion.anatomy.title}
          />
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
