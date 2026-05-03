import { useState } from "react";
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
  Checkbox,
  ShikiCodeBlock,
  Anatomy,
  Button,
} from "@/component";
import { toast } from "sonner";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  CheckboxBasic,
  CheckboxControlled,
  CheckboxDirection,
  CheckboxDisabled,
  CheckboxVariant,
} from "./examples";

import CheckboxBasicRaw from "./examples/checkbox-basic.tsx?raw";
import CheckboxControlledRaw from "./examples/checkbox-controlled.tsx?raw";
import CheckboxDirectionRaw from "./examples/checkbox-direction.tsx?raw";
import CheckboxDisabledRaw from "./examples/checkbox-disabled.tsx?raw";
import CheckboxVariantRaw from "./examples/checkbox-variant.tsx?raw";
import checkboxDoc from "./doc.mdx?raw";
import checkboxSrc from "@/component/ui/checkbox.tsx?raw";

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

export default function CheckboxPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const nav = getComponentNav("/components/checkbox", locale as "zh" | "en");

  const handleCopy = () => {
    navigator.clipboard.writeText(checkboxDoc);
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
            <Title as="h1">{lang.checkbox.title}</Title>
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
          <Description>{lang.checkbox.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{checkboxSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="scroll-mt-20">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={lang.checkbox.basic.title}
            code={CheckboxBasicRaw}
          >
            <CheckboxBasic />
          </DemoSection>

          <DemoSection
            id="controlled"
            title={lang.checkbox.controlled.title}
            code={CheckboxControlledRaw}
          >
            <CheckboxControlled />
          </DemoSection>

          <DemoSection
            id="direction"
            title={lang.checkbox.direction.title}
            code={CheckboxDirectionRaw}
          >
            <CheckboxDirection />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={lang.checkbox.disabled?.title || "Disabled"}
            code={CheckboxDisabledRaw}
          >
            <CheckboxDisabled />
          </DemoSection>

          <DemoSection
            id="variant"
            title={lang.checkbox.variants?.title || "Variant"}
            code={CheckboxVariantRaw}
          >
            <CheckboxVariant />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4 scroll-mt-20">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-32"
            parts={[
              { id: "anatomy-group", label: lang.checkbox.anatomy.group },
              { id: "anatomy-checkbox", label: lang.checkbox.anatomy.checkbox },
              { id: "anatomy-indicator", label: lang.checkbox.anatomy.indicator },
            ]}
          >
            <Checkbox.Group className="flex gap-4" id="anatomy-group">
              <Checkbox
                value="item1"
                id="anatomy-checkbox"
                indicator={{ props: { id: "anatomy-indicator" } }}
              >
                Item 1
              </Checkbox>
            </Checkbox.Group>
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
          <section
            id="css-classes"
            data-anchor-id="css-classes"
            className="space-y-4 scroll-mt-20 prose dark:prose-invert max-w-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {checkboxDoc}
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
            <Anchor.Item href="#basic">{lang.checkbox.basic.title}</Anchor.Item>
            <Anchor.Item href="#controlled">{lang.checkbox.controlled.title}</Anchor.Item>
            <Anchor.Item href="#direction">{lang.checkbox.direction.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{lang.checkbox.disabled?.title || "Disabled"}</Anchor.Item>
            <Anchor.Item href="#variant">{lang.checkbox.variants?.title || "Variant"}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" title={lang.anatomy} />
          <Anchor.Section href="#docs" title={lang.docs}/>

        </Anchor>
      </aside>
    </div>
  );
}
