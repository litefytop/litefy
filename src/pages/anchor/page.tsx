import React from "react";
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
  Button,
  Docs,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages";
import { getComponentNav } from "@/pages/config/routes";

import { AnchorBasic, AnchorWithSections } from "./examples";

import AnchorBasicRaw from "./examples/anchor-basic.tsx?raw";
import AnchorWithSectionsRaw from "./examples/anchor-with-sections.tsx?raw";
import anchorDoc from "./doc.mdx?raw";
import anchorSrc from "@/component/ui/anchor.tsx?raw";

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

export default function AnchorPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = React.useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.anchor;
  const nav = getComponentNav("/components/anchor", locale as "zh" | "en");

  const anchorSections = [
    {
      title: l.api.sectionTitles.anchorProps,
      columns: [
        { key: "prop", header: l.api.headers.prop },
        { key: "type", header: l.api.headers.type },
        { key: "default", header: l.api.headers.default },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "className",
          type: "ClassNameValue",
          default: "-",
          description: l.api.props.className,
        },
        {
          props: "children",
          type: "ReactNode",
          default: "-",
          description: l.api.props.children,
        },
      ],
    },
    {
      title: l.api.sectionTitles.anchorSectionProps,
      columns: [
        { key: "prop", header: l.api.headers.prop },
        { key: "type", header: l.api.headers.type },
        { key: "default", header: l.api.headers.default },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "href",
          type: "string",
          default: "-",
          description: l.api.sectionProps.href,
        },
        {
          props: "title",
          type: "string",
          default: "-",
          description: l.api.sectionProps.title,
        },
        {
          props: "children",
          type: "ReactNode",
          default: "-",
          description: l.api.sectionProps.children,
        },
        {
          props: "className",
          type: "ClassNameValue",
          default: "-",
          description: l.api.sectionProps.className,
        },
        {
          props: "itemProps",
          type: "object",
          default: "-",
          description: l.api.sectionProps.itemProps,
        },
      ],
    },
    {
      title: l.api.sectionTitles.anchorItemProps,
      columns: [
        { key: "prop", header: l.api.headers.prop },
        { key: "type", header: l.api.headers.type },
        { key: "default", header: l.api.headers.default },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "href",
          type: "string",
          default: "-",
          description: l.api.itemProps.href,
        },
        {
          props: "children",
          type: "ReactNode",
          default: "-",
          description: l.api.itemProps.children,
        },
        {
          props: "className",
          type: "ClassNameValue",
          default: "-",
          description: l.api.itemProps.className,
        },
        {
          props: "onClick",
          type: "() => void",
          default: "-",
          description: l.api.itemProps.onClick,
        },
      ],
    },
    {
      title: l.api.sectionTitles.itemPropsConfig,
      columns: [
        { key: "property", header: l.api.headers.property },
        { key: "type", header: l.api.headers.type },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "title",
          type: 'Omit<React.ComponentProps<"a">, "href" | "onClick">',
          default: "-",
          description: l.api.itemPropsConfig.title,
        },
        {
          props: "nav",
          type: 'Omit<React.ComponentProps<"nav">, "aria-label">',
          default: "-",
          description: l.api.itemPropsConfig.nav,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(anchorDoc);
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
              <Button variant="ghost" onClick={handlePrev} disabled={!nav.prev}>
                <ArrowLeftIcon className="size-4" />
              </Button>
              <Button variant="ghost" onClick={handleNext} disabled={!nav.next}>
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
          <ShikiCodeBlock>{anchorSrc}</ShikiCodeBlock>
        </section>

        <section id="scroll-behavior" className="mb-8">
          <Title as="h2">{l.scrollBehavior.title}</Title>
          <div className="space-y-4 text-sm">
            <p>
              {l.scrollBehavior.description}
            </p>
            <ShikiCodeBlock>{`<section id="installation" className="scroll-mt-[80px]">
  {/* Adjust the value based on your header height */}
</section>`}</ShikiCodeBlock>
            <p className="text-muted-foreground">
              {l.scrollBehavior.note}
            </p>
          </div>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={AnchorBasicRaw}
          >
            <AnchorBasic />
          </DemoSection>

          <DemoSection
            id="sections"
            title={l.withSections.title}
            code={AnchorWithSectionsRaw}
          >
            <AnchorWithSections />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            parts={[
              { id: "anatomy-anchor", label: l.anatomy.anchor },
              { id: "anatomy-section", label: l.anatomy.section },
              { id: "anatomy-item", label: l.anatomy.item },
              { id: "anatomy-link", label: l.anatomy.link },
            ]}
          >
            <Anchor className="max-w-xs" id="anatomy-anchor">
              <Anchor.Section href="#anatomy-section" title="Section 1">
                <Anchor.Item href="#section1">
                  <span id="anatomy-link">Section 1.1</span>
                </Anchor.Item>
                <Anchor.Item href="#section2">
                  Section 1.2
                </Anchor.Item>
              </Anchor.Section>
            </Anchor>
          </Anatomy>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={anchorSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
          <Anchor>
            <Anchor.Section href="#installation" title={lang.installation} />
            <Anchor.Section href="#scroll-behavior" title={l.scrollBehavior.title} />
            <Anchor.Section href="#examples" title={lang.examples}>
              <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
              <Anchor.Item href="#sections">{l.withSections.title}</Anchor.Item>
            </Anchor.Section>
            <Anchor.Section href="#anatomy" title={lang.anatomy} />
            <Anchor.Section href="#docs" title={lang.docs}/>
          </Anchor>
      </aside>
    </div>
  );
}
