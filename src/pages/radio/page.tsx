import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyIcon, CheckIcon } from "@/components/ui/icons";
import { toast } from "sonner";
import { Anchor, Title, Description, Radio } from "@/components";
import { Anatomy } from "@/pages/component/anatomy";

import { ShikiCodeBlock } from "@/pages/component/shiki-code-block";
import { t } from "@/pages/i18n";
import {
  RadioBasic,
  RadioControlled,
  RadioDirection,
  RadioDisabled,
  RadioVariant,
} from "./examples";

import RadioBasicRaw from "./examples/radio-basic.tsx?raw";
import RadioControlledRaw from "./examples/radio-controlled.tsx?raw";
import RadioDirectionRaw from "./examples/radio-direction.tsx?raw";
import RadioDisabledRaw from "./examples/radio-disabled.tsx?raw";
import RadioVariantRaw from "./examples/radio-variant.tsx?raw";
import radioDoc from "./doc.mdx?raw";
import radioSrc from "@/components/ui/radio.tsx?raw";

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

export default function RadioPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const lang = t(locale as "zh" | "en");
  const l = lang.radio;

  const handleCopy = () => {
    navigator.clipboard.writeText(radioDoc);
    setCopied(true);
    toast.success(lang.common.copySuccess);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex">
      <div className="flex-1 w-full">
        <header className="pb-4 mb-4 border-b">
          <Title as="h1">{l.title}</Title>
          <Description>{l.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{radioSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="scroll-mt-20">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={RadioBasicRaw}
          >
            <RadioBasic />
          </DemoSection>

          <DemoSection
            id="controlled"
            title={l.controlled.title}
            code={RadioControlledRaw}
          >
            <RadioControlled />
          </DemoSection>

          <DemoSection
            id="direction"
            title={l.direction.title}
            code={RadioDirectionRaw}
          >
            <RadioDirection />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={l.disabled?.title || "Disabled"}
            code={RadioDisabledRaw}
          >
            <RadioDisabled />
          </DemoSection>

          <DemoSection
            id="variant"
            title={l.variant?.title || "Variant"}
            code={RadioVariantRaw}
          >
            <RadioVariant />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4 scroll-mt-20">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-32"
            parts={[
              { id: "anatomy-group", label: l.anatomy.group },
              { id: "anatomy-radio", label: l.anatomy.radio },
              { id: "anatomy-indicator", label: l.anatomy.indicator },
            ]}
          >
            <Radio.Group className="flex gap-4" id="anatomy-group">
              <Radio
                value="item1"
                id="anatomy-radio"
                indicator={{ props: { id: "anatomy-indicator" } }}
              >
                Item 1
              </Radio>
            </Radio.Group>
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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {radioDoc}
            </ReactMarkdown>
          </section>
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section id="installation" title={lang.installation} />
          <Anchor.Section id="examples" title={lang.examples}>
            <Anchor.Item id="#basic">{l.basic.title}</Anchor.Item>
            <Anchor.Item id="#controlled">{l.controlled.title}</Anchor.Item>
            <Anchor.Item id="#direction">{l.direction.title}</Anchor.Item>
            <Anchor.Item id="#disabled">{l.disabled?.title}</Anchor.Item>
            <Anchor.Item id="#variant">{l.variant?.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section id="anatomy" title={lang.anatomy} />
          <Anchor.Section id="docs" title={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
