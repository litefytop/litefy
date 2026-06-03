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
  PaginationBasic,
  PaginationCustomIcons,
  PaginationWithActions,
  PaginationWithIndicator,
} from "./examples";
import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

import PaginationBasicRaw from "./examples/pagination-basic.tsx?raw";

import PaginationCustomIconsRaw from "./examples/pagination-custom-icons.tsx?raw";
import PaginationWithActionsRaw from "./examples/pagination-with-actions.tsx?raw";
import PaginationWithIndicatorRaw from "./examples/pagination-with-indicator.tsx?raw";
import paginationDoc from "./doc.mdx?raw";
import paginationSrc from "@/component/ui/pagination.tsx?raw";

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

export default function PaginationPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.pagination;
  const nav = getComponentNav("/components/pagination", locale as "zh" | "en");

  const paginationSections = [
    {
      title: l.api.sectionTitles.paginationProps,
      data: [
        {
          props: "current",
          type: "number",
          default: "1",
          description: l.api.props.current,
        },
        {
          props: "pageSize",
          type: "number",
          default: "10",
          description: l.api.props.pageSize,
        },
        {
          props: "total",
          type: "number",
          default: "0",
          description: l.api.props.total,
        },
        {
          props: "onChange",
          type: "(current: number, pageSize: number) => void",
          description: l.api.props.onChange,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
        {
          props: "children",
          type: "ReactNode",
          description: l.api.props.children,
        },
      ],
    },
    {
      title: l.api.sectionTitles.description,
      data: [
        {
          props: "format",
          type: "(total: number, current: number, totalPages: number) => string",
          description: l.api.description.format,
        },
      ],
    },
    {
      title: l.api.sectionTitles.sizer,
      data: [
        {
          props: "options",
          type: "number[]",
          default: "[10, 20, 50, 100]",
          description: l.api.sizer.options,
        },
        {
          props: "format",
          type: "(size: number) => string",
          description: l.api.sizer.format,
        },
      ],
    },
    {
      title: l.api.sectionTitles.controls,
      data: [
        {
          props: "children",
          type: "ReactNode",
          description: l.api.controls.children,
        },
      ],
    },
    {
      title: l.api.sectionTitles.use,
      data: [
        {
          props: "use()",
          type: "() => PaginationContextValue",
          description: l.api.use,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(paginationDoc);
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
          <ShikiCodeBlock>{paginationSrc}</ShikiCodeBlock>
        </section>

        <section>
          <Title as="h2" id="examples">
            {lang.examples}
          </Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={PaginationBasicRaw}
          >
            <PaginationBasic />
          </DemoSection>

          <DemoSection
            id="custom-icons"
            title={l.customIcons.title}
            code={PaginationCustomIconsRaw}
          >
            <PaginationCustomIcons />
          </DemoSection>

          <DemoSection
            id="with-actions"
            title={l.withActions.title}
            code={PaginationWithActionsRaw}
          >
            <PaginationWithActions />
          </DemoSection>

          <DemoSection
            id="with-indicator"
            title={l.withIndicator.title}
            code={PaginationWithIndicatorRaw}
          >
            <PaginationWithIndicator />
          </DemoSection>
        </section>

        <section id="api" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.api}
          </Title>
          <APITable sections={paginationSections} />
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
            <Anchor.Item href="#custom-icons">
              {l.customIcons.title}
            </Anchor.Item>
            <Anchor.Item href="#with-actions">
              {l.withActions.title}
            </Anchor.Item>
            <Anchor.Item href="#with-indicator">
              {l.withIndicator.title}
            </Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#api" linkText={lang.api} />
        </Anchor>
      </aside>
    </div>
  );
}
