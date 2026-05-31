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
  Accordion,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages";
import { getComponentNav } from "@/pages/config/routes";
import {
  AccordionBasic,
  AccordionControlledUsage,
  AccordionMultiple,
  AccordionIcon,
  AccordionDisabled,
} from "./examples";
import AccordionBasicRaw from "./examples/accordion-basic.tsx?raw";
import AccordionControlledUsageRaw from "./examples/accordion-controlled-usage.tsx?raw";
import AccordionMultipleRaw from "./examples/accordion-multiple.tsx?raw";
import AccordionIconRaw from "./examples/accordion-icon.tsx?raw";
import AccordionDisabledRaw from "./examples/accordion-disabled.tsx?raw";
import accordionDoc from "./doc.mdx?raw";
import accordionSrc from "@/component/ui/accordion.tsx?raw";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
} from "lucide-react";

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
          type: "string",
          description: l.api.itemProps.label,
        },
        {
          props: "icon",
          type: "ReactNode",
          description: l.api.itemProps.icon,
        },
        {
          props: "slotProps",
          type: "object",
          description: l.api.itemProps.slotProps,
        },
        {
          props: "children",
          type: "ReactNode",
          description: l.api.itemProps.children,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.itemProps.disabled,
        },
      ],
    },
    {
      title: l.api.sectionTitles.slotPropsConfig,
      data: [
        {
          props: "wrapper",
          type: 'React.ComponentProps<"div">',
          description: l.api.slotPropsConfig.wrapper,
        },
        {
          props: "trigger",
          type: 'React.ComponentProps<"span">',
          description: l.api.slotPropsConfig.trigger,
        },
        {
          props: "content",
          type: 'React.ComponentProps<"div">',
          description: l.api.slotPropsConfig.content,
        },
      ],
    },
  ];

  const nav = getComponentNav(
    "/components/accordion",
    locale as "zh" | "en",
  );

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
            id="controlled"
            title={lang.accordion.controlled.title}
            code={AccordionControlledUsageRaw}
          >
            <AccordionControlledUsage />
          </DemoSection>

          <DemoSection
            id="multiple"
            title={lang.accordion.multiple.title}
            code={AccordionMultipleRaw}
          >
            <AccordionMultiple />
          </DemoSection>

          <DemoSection
            id="icon"
            title={lang.accordion.icon.title}
            code={AccordionIconRaw}
          >
            <AccordionIcon />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={lang.accordion.disabled.title}
            code={AccordionDisabledRaw}
          >
            <AccordionDisabled />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-32"
            parts={[
              { id: "anatomy-wrapper", label: lang.accordion.anatomy.wrapper },
              { id: "anatomy-trigger", label: lang.accordion.anatomy.trigger },
              { id: "anatomy-content", label: lang.accordion.anatomy.content },
            ]}
          >
            <Accordion className="max-w-sm" openKeys={["item-1"]}>
              <Accordion.Item
                value="item-1"
                label={lang.accordion.basic.title}
                slotProps={{
                  wrapper: { id: "anatomy-wrapper", className:"p-1" },
                  content: { id: "anatomy-content", className:"p-1" },
                  trigger: { id: "anatomy-trigger", className:"p-1" },
                }}
              >
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

        <footer className="py-8 border-t mt-8">
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={!nav.prev}
              className={nav.prev ? "" : "invisible"}
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              {nav.prev?.title}
            </Button>
            <Button
              variant="ghost"
              onClick={handleNext}
              disabled={!nav.next}
              className={nav.next ? "" : "invisible"}
            >
              {nav.next?.title}
              <ArrowRightIcon className="size-4 ml-2" />
            </Button>
          </div>
        </footer>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-full overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">
              {lang.accordion.basic.title}
            </Anchor.Item>
            <Anchor.Item href="#controlled">
              {lang.accordion.controlled.title}
            </Anchor.Item>
            <Anchor.Item href="#multiple">
              {lang.accordion.multiple.title}
            </Anchor.Item>
            <Anchor.Item href="#icon">{lang.accordion.icon.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{lang.accordion.disabled.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
