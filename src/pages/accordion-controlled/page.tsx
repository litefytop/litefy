import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Anatomy,
  Button,
  Docs,
  AccordionControlled,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages";
import { getComponentNav } from "@/pages/config/routes";
import {
  AccordionControlledBasic,
  AccordionControlledUsage,
  AccordionControlledMultiple,
  AccordionControlledIcon,
  AccordionControlledDisabled,
} from "./examples";
import AccordionControlledBasicRaw from "./examples/accordion-controlled-basic.tsx?raw";
import AccordionControlledUsageRaw from "./examples/accordion-controlled-usage.tsx?raw";
import AccordionControlledMultipleRaw from "./examples/accordion-controlled-multiple.tsx?raw";
import AccordionControlledIconRaw from "./examples/accordion-controlled-icon.tsx?raw";
import AccordionControlledDisabledRaw from "./examples/accordion-controlled-disabled.tsx?raw";
import accordionControlledDoc from "./doc.mdx?raw";
import accordionControlledSrc from "@/component/ui/accordion-controlled.tsx?raw";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CopyIcon } from "lucide-react";

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

export default function AccordionControlledPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.accordionControlled;

  const accordionControlledSections = [
    {
      title: l.api.sectionTitles.accordionProps,
      data: [
        {
          props: "defaultOpenKeys",
          type: "string[]",
          default: "[]",
          description: l.api.props.defaultOpenKeys,
        },
        {
          props: "openKeys",
          type: "string[]",
          description: l.api.props.openKeys,
        },
        {
          props: "onOpenChange",
          type: "(keys: string[]) => void",
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
        {
          props: "icon",
          type: "ReactNode | ((open: boolean) => ReactNode)",
          description: l.api.props.icon,
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
        {
          props: "icon",
          type: "ReactNode | ((open: boolean) => ReactNode)",
          description: l.api.itemProps.icon,
        },
      ],
    },
    {
      title: l.api.sectionTitles.itemPropsConfig,
      data: [
        {
          props: "root",
          type: 'React.ComponentProps<"div">',
          description: l.api.itemPropsConfig.root,
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

  const nav = getComponentNav("/components/accordion-controlled", locale as "zh" | "en");

  const handleCopy = () => {
    navigator.clipboard.writeText(accordionControlledDoc);
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
            <Title as="h1">{lang.accordionControlled.title}</Title>
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
          <Description>{lang.accordionControlled.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-30">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{accordionControlledSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>
          <DemoSection
            id="basic"
            title={lang.accordionControlled.basic.title}
            code={AccordionControlledBasicRaw}
          >
            <AccordionControlledBasic />
          </DemoSection>

          <DemoSection
            id="controlled"
            title={lang.accordionControlled.controlled.title}
            code={AccordionControlledUsageRaw}
          >
            <AccordionControlledUsage />
          </DemoSection>

          <DemoSection
            id="multiple"
            title={lang.accordionControlled.multiple.title}
            code={AccordionControlledMultipleRaw}
          >
            <AccordionControlledMultiple />
          </DemoSection>

          <DemoSection
            id="icon"
            title={lang.accordionControlled.icon.title}
            code={AccordionControlledIconRaw}
          >
            <AccordionControlledIcon />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={lang.accordionControlled.disabled.title}
            code={AccordionControlledDisabledRaw}
          >
            <AccordionControlledDisabled />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.accordionControlled.anatomy.title}</Title>
          <Anatomy
            className="h-32"
            parts={[
              {
                id: "anatomy-accordion",
                label: lang.accordionControlled.anatomy.accordion,
              },
              { id: "anatomy-item", label: lang.accordionControlled.anatomy.item },
              { id: "anatomy-label", label: lang.accordionControlled.anatomy.label },
              { id: "anatomy-content", label: lang.accordionControlled.anatomy.content },
            ]}
          >
            <AccordionControlled
              id="anatomy-accordion"
              className="max-w-sm"
              openKeys={["item-1"]}
            >
              <AccordionControlled.Item
                value="item-1"
                label={lang.accordionControlled.basic.title}
                id="anatomy-item"
                itemProps={{
                  label: { id: "anatomy-label" },
                  content: { id: "anatomy-content" },
                }}
              >
                {lang.accordionControlled.anatomy.content}
              </AccordionControlled.Item>
            </AccordionControlled>
          </Anatomy>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-4">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={accordionControlledSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-full overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">
              {lang.accordionControlled.basic.title}
            </Anchor.Item>
            <Anchor.Item href="#controlled">
              {lang.accordionControlled.controlled.title}
            </Anchor.Item>
            <Anchor.Item href="#multiple">
              {lang.accordionControlled.multiple.title}
            </Anchor.Item>
            <Anchor.Item href="#icon">
              {lang.accordionControlled.icon.title}
            </Anchor.Item>
          </Anchor.Section>
          <Anchor.Section
            href="#anatomy"
            linkText={lang.accordionControlled.anatomy.title}
          />
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
