import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyIcon, CheckIcon } from "@/components/ui/icons";
import { toast } from "sonner";
import { Anchor, Title, Description, Input } from "@/components";
import { Anatomy } from "@/pages/component/anatomy";

import { ShikiCodeBlock } from "@/pages/component/shiki-code-block";
import { t } from "@/pages/i18n";
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
import inputSrc from "@/components/ui/input.tsx?raw";

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
  const lang = t(locale as "zh" | "en");

  const handleCopy = () => {
    navigator.clipboard.writeText(inputDoc);
    setCopied(true);
    toast.success(lang.common.copySuccess);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex">
      <div className="flex-1 w-full">
        <header className="pb-4 mb-4 border-b">
          <Title as="h1">{lang.input.title}</Title>
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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {inputDoc}
            </ReactMarkdown>
          </section>
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section id="installation" title={lang.installation} />
          <Anchor.Section id="examples" title={lang.examples}>
            <Anchor.Item id="#basic">{lang.input.basic.title}</Anchor.Item>
            <Anchor.Item id="#prefix-suffix">{lang.input.prefixSuffix.title}</Anchor.Item>
            <Anchor.Item id="#error">{lang.input.error.title}</Anchor.Item>
            <Anchor.Item id="#disabled">{lang.input.disabled.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section id="anatomy" title={lang.anatomy} />
          <Anchor.Section id="docs" title={lang.docs}/>
     
        </Anchor>
      </aside>
    </div>
  );
}
