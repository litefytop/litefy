import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Title,
  Description,
  ShikiCodeBlock,
  Button,
  APITable,
  Anchor,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

import { SeparatorBasic, SeparatorVertical, SeparatorWithText } from "./examples/index";
import SeparatorBasicRaw from "./examples/separator-basic.tsx?raw";
import SeparatorVerticalRaw from "./examples/separator-vertical.tsx?raw";
import SeparatorTextRaw from "./examples/separator-text.tsx?raw";
import separatorDoc from "./doc.mdx?raw";
import separatorSrc from "@/component/ui/separator.tsx?raw";

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

export default function SeparatorPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.separator;
  const nav = getComponentNav("/components/separator", locale as "zh" | "en");

  const separatorSections = [
    {
      title: l.api.sectionTitles.separatorProps,
      data: [
        {
          props: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: l.api.props.orientation,
        },
        {
          props: "children",
          type: "ReactNode",
          default: "-",
          description: l.api.props.children,
        },
        {
          props: "className",
          type: "ClassNameValue",
          default: "-",
          description: lang.common.className,
        },
        {
          props: "lineClassName",
          type: "ClassNameValue",
          default: "-",
          description: l.api.props.lineClassName,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(separatorDoc);
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

        <section id="installation" className="mb-8 ">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{separatorSrc}</ShikiCodeBlock>
        </section>

        <section id="examples">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={SeparatorBasicRaw}
          >
            <SeparatorBasic />
          </DemoSection>

          <DemoSection
            id="vertical"
            title={l.vertical.title}
            code={SeparatorVerticalRaw}
          >
            <SeparatorVertical />
          </DemoSection>

          <DemoSection
            id="with-text"
            title={l.withText.title}
            code={SeparatorTextRaw}
          >
            <SeparatorWithText />
          </DemoSection>
        </section>

        <section id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <APITable sections={separatorSections} />
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
            <Anchor.Item href="#vertical">{l.vertical.title}</Anchor.Item>
            <Anchor.Item href="#with-text">{l.withText.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
