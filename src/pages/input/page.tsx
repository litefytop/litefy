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
  Input,
  ShikiCodeBlock,
  Anatomy,
  Button,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  InputBasic,
  InputPrefixSuffix,
  InputError,
  InputDisabled,
} from "./examples";

import InputBasicRaw from "./examples/input-basic.tsx?raw";
import InputPrefixSuffixRaw from "./examples/input-prefix-suffix.tsx?raw";
import InputErrorRaw from "./examples/input-error.tsx?raw";
import InputDisabledRaw from "./examples/input-disabled.tsx?raw";
import inputDoc from "./doc.mdx?raw";
import inputSrc from "@/component/ui/input.tsx?raw";

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

export default function InputPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const nav = getComponentNav("/components/input", locale as "zh" | "en");

  const handleCopy = () => {
    navigator.clipboard.writeText(inputDoc);
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
            <Title as="h1">{lang.input.title}</Title>
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
          <Description>{lang.input.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{inputSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="scroll-mt-20">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={lang.input.basic.title}
            code={InputBasicRaw}
          >
            <InputBasic />
          </DemoSection>

          <DemoSection
            id="prefix-suffix"
            title={lang.input.prefixSuffix.title}
            code={InputPrefixSuffixRaw}
          >
            <InputPrefixSuffix />
          </DemoSection>

          <DemoSection
            id="error"
            title={lang.input.error.title}
            code={InputErrorRaw}
          >
            <InputError />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={lang.input.disabled.title}
            code={InputDisabledRaw}
          >
            <InputDisabled />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4 scroll-mt-20">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-48"
            parts={[
              { id: "anatomy-group", label: lang.input.anatomy.group },
              { id: "anatomy-label", label: lang.input.anatomy.label },
              { id: "anatomy-input", label: lang.input.anatomy.input },
              { id: "anatomy-leading", label: lang.input.anatomy.leading },
              { id: "anatomy-trailing", label: lang.input.anatomy.trailing },
              { id: "anatomy-description", label: lang.input.anatomy.description },
            ]}
          >
            <Input
              label="域名"
              leading="https://"
              trailing=".com"
              description="用于登记域名"
              placeholder="请输入域名"
              id="anatomy-input"
              itemProps={{
                group: { id: "anatomy-group" },
                label: { id: "anatomy-label" },
                leading: { id: "anatomy-leading" },
                trailing: { id: "anatomy-trailing" },
                description: { id: "anatomy-description" },
              }}
            />
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
              {inputDoc}
            </ReactMarkdown>
          </section>
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" title={lang.installation} />
          <Anchor.Section href="#examples" title={lang.examples}>
            <Anchor.Item href="#basic">{lang.input.basic.title}</Anchor.Item>
            <Anchor.Item href="#prefix-suffix">{lang.input.prefixSuffix.title}</Anchor.Item>
            <Anchor.Item href="#error">{lang.input.error.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{lang.input.disabled.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" title={lang.anatomy} />
          <Anchor.Section href="#docs" title={lang.docs}/>
     
        </Anchor>
      </aside>
    </div>
  );
}
