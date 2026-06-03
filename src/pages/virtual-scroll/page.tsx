import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Button,
  APITable,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  VirtualScrollBasic,
} from "./examples";
import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

import VirtualScrollBasicRaw from "./examples/virtual-scroll-basic.tsx?raw";
import virtualScrollDoc from "./doc.mdx?raw";
import virtualScrollSrc from "@/component/ui/virtual-scroll.tsx?raw";

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
    <section id={id} className="space-y-4 py-4">
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

export default function VirtualScrollPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.virtualScroll;
  const nav = getComponentNav("/components/virtual-scroll", locale as "zh" | "en");

  const virtualScrollSections = [
    {
      title: l.api.sectionTitles.virtualScrollProps,
      data: [
        {
          props: "items",
          type: "T[]",
          description: l.api.props.items,
        },
        {
          props: "itemHeight",
          type: "number",
          description: l.api.props.itemHeight,
        },
        {
          props: "containerHeight",
          type: "number",
          description: l.api.props.containerHeight,
        },
        {
          props: "renderItem",
          type: "(item: T, index: number) => React.ReactNode",
          description: l.api.props.renderItem,
        },
        {
          props: "overscan",
          type: "number",
          default: "2",
          description: l.api.props.overscan,
        },
        {
          props: "onScroll",
          type: "(scrollTop: number) => void",
          description: l.api.props.onScroll,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: l.api.props.className,
        },
        {
          props: "containerClassName",
          type: "ClassNameValue",
          description: l.api.props.containerClassName,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(virtualScrollDoc);
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

        <section className="mb-8 ">
          <Title as="h2" id="installation" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{virtualScrollSrc}</ShikiCodeBlock>
        </section>

        <section>
          <Title as="h2" id="examples">
            {lang.examples}
          </Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={VirtualScrollBasicRaw}
          >
            <VirtualScrollBasic />
          </DemoSection>
        </section>

        <section id="api" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.api}
          </Title>
          <APITable sections={virtualScrollSections} />
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
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#api" linkText={lang.api} />
        </Anchor>
      </aside>
    </div>
  );
}
