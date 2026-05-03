import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
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
} from "@/component";
import { toast } from "sonner";
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

export default function AnchorPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = React.useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const nav = getComponentNav("/components/anchor", locale as "zh" | "en");

  const handleCopy = () => {
    navigator.clipboard.writeText(anchorDoc);
    setCopied(true);
    toast.success(lang.common.copySuccess);
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
            <Title as="h1">{lang.anchor.title}</Title>
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
          <Description>{lang.anchor.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{anchorSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className=" scroll-mt-20">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={lang.anchor.basic.title}
            code={AnchorBasicRaw}
          >
            <AnchorBasic />
          </DemoSection>

          <DemoSection
            id="sections"
            title={lang.anchor.withSections.title}
            code={AnchorWithSectionsRaw}
          >
            <AnchorWithSections />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4 scroll-mt-20">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            parts={[
              { id: "anatomy-anchor", label: lang.anchor.anatomy.anchor },
              { id: "anatomy-section", label: lang.anchor.anatomy.section },
              { id: "anatomy-item", label: lang.anchor.anatomy.item },
              { id: "anatomy-link", label: lang.anchor.anatomy.link },
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

        <section
          id="docs"
          data-anchor-id="docs"
          className="mt-12 space-y-4 scroll-mt-20"
        >
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
          <section
            id="css-classes"
            data-anchor-id="css-classes"
            className="space-y-4 scroll-mt-20 prose dark:prose-invert max-w-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
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
            <Anchor.Section href="#installation" title={lang.installation} />
            <Anchor.Section href="#examples" title={lang.examples}>
              <Anchor.Item href="#basic">{lang.anchor.basic.title}</Anchor.Item>
              <Anchor.Item href="#sections">{lang.anchor.withSections.title}</Anchor.Item>
            </Anchor.Section>
            <Anchor.Section href="#anatomy" title={lang.anatomy} />
            <Anchor.Section href="#docs" title={lang.docs}/>

          </Anchor>
      </aside>
    </div>
  );
}
