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
  ProgressBasic,
  ProgressDynamic,
} from "./examples";
import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

import ProgressBasicRaw from "./examples/progress-basic.tsx?raw";
import ProgressDynamicRaw from "./examples/progress-dynamic.tsx?raw";
import progressDoc from "./doc.mdx?raw";
import progressSrc from "@/component/ui/progress.tsx?raw";

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

export default function ProgressPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.progress;
  const nav = getComponentNav("/components/progress", locale as "zh" | "en");

  const progressSections = [
    {
      title: l.api.sectionTitles.progressProps,
      data: [
        {
          props: "value",
          type: "number",
          default: "0",
          description: l.api.props.value,
        },
        {
          props: "getCurrent",
          type: "() => number | Promise<number>",
          description: l.api.props.getCurrent,
        },
        {
          props: "totalDuration",
          type: "number",
          default: "5",
          description: l.api.props.totalDuration,
        },
        {
          props: "checkpoints",
          type: "number[]",
          default: "[0.25, 0.5, 0.75, 1]",
          description: l.api.props.checkpoints,
        },
        {
          props: "reverse",
          type: "boolean",
          default: "false",
          description: l.api.props.reverse,
        },
        {
          props: "transitionDuration",
          type: "number",
          default: "0.2",
          description: l.api.props.transitionDuration,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: l.api.props.className,
        },
        {
          props: "barClassName",
          type: "ClassNameValue",
          description: l.api.props.barClassName,
        },
        {
          props: "rootProps",
          type: "React.HTMLAttributes<HTMLDivElement>",
          description: l.api.props.rootProps,
        },
        {
          props: "barProps",
          type: "React.HTMLAttributes<HTMLDivElement>",
          description: l.api.props.barProps,
        },
        {
          props: "onComplete",
          type: "() => void",
          description: l.api.props.onComplete,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(progressDoc);
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
          <ShikiCodeBlock>{progressSrc}</ShikiCodeBlock>
        </section>

        <section>
          <Title as="h2" id="examples">
            {lang.examples}
          </Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={ProgressBasicRaw}
          >
            <ProgressBasic />
          </DemoSection>

          <DemoSection
            id="dynamic"
            title={l.dynamic.title}
            code={ProgressDynamicRaw}
          >
            <ProgressDynamic />
          </DemoSection>
        </section>

        <section id="api" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.api}
          </Title>
          <APITable sections={progressSections} />
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
            <Anchor.Item href="#dynamic">{l.dynamic.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#api" linkText={lang.api} />
        </Anchor>
      </aside>
    </div>
  );
}
