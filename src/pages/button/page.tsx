import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyIcon, CheckIcon } from "@/components/ui/icons";
import { toast } from "sonner";
import { Anchor, Title, Description } from "@/components";

import { ShikiCodeBlock } from "@/pages/component/shiki-code-block";
import { t } from "@/pages/i18n";
import {
  ButtonVariants,
  ButtonDisabled,
  ButtonLoading,
  ButtonIconOnly,
  ButtonWithIcons,
  ButtonDirection,
} from "./examples";

import ButtonVariantsRaw from "./examples/ButtonVariants.tsx?raw";
import ButtonDisabledRaw from "./examples/ButtonDisabled.tsx?raw";
import ButtonLoadingRaw from "./examples/ButtonLoading.tsx?raw";
import ButtonIconOnlyRaw from "./examples/ButtonIconOnly.tsx?raw";
import ButtonWithIconsRaw from "./examples/ButtonWithIcons.tsx?raw";
import ButtonDirectionRaw from "./examples/ButtonDirection.tsx?raw";
import buttonDoc from "./doc.mdx?raw";
import buttonSrc from "@/components/ui/button.tsx?raw";

function DemoSection({
  id,
  title,
  description,
  children,
  code,
}: {
  id: string;
  title: string;
  description?: string;
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
        {description && <Description>{description}</Description>}
      </div>
      <div className="border rounded-lg p-6 w-full overflow-x-auto">
        {children}
      </div>
      <ShikiCodeBlock>{code}</ShikiCodeBlock>
    </section>
  );
}

export default function ButtonPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const lang = t(locale as "zh" | "en");

  const handleCopy = () => {
    navigator.clipboard.writeText(buttonDoc);
    setCopied(true);
    toast.success(lang.common.copySuccess);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex">
      <div className="flex-1 w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl xl:mr-64">
        <header className="pb-4 mb-4 border-b">
          <Title as="h1">{lang.button.title}</Title>
          <Description>{lang.button.description}</Description>
        </header>

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{buttonSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="scroll-mt-20">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="variants"
            title={lang.button.variants.title}
            description={lang.button.variants.description}
            code={ButtonVariantsRaw}
          >
            <ButtonVariants />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={lang.button.disabled.title}
            description={lang.button.disabled.description}
            code={ButtonDisabledRaw}
          >
            <ButtonDisabled />
          </DemoSection>

          <DemoSection
            id="loading"
            title={lang.button.loading.title}
            description={lang.button.loading.description}
            code={ButtonLoadingRaw}
          >
            <ButtonLoading />
          </DemoSection>

          <DemoSection
            id="icon-only"
            title={lang.button.iconOnly.title}
            description={lang.button.iconOnly.description}
            code={ButtonIconOnlyRaw}
          >
            <ButtonIconOnly />
          </DemoSection>

          <DemoSection
            id="with-icons"
            title={lang.button.withIcons.title}
            description={lang.button.withIcons.description}
            code={ButtonWithIconsRaw}
          >
            <ButtonWithIcons />
          </DemoSection>

          <DemoSection
            id="direction"
            title={lang.button.direction.title}
            description={lang.button.direction.description}
            code={ButtonDirectionRaw}
          >
            <ButtonDirection />
          </DemoSection>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 scroll-mt-20">
          <div className="space-y-2">
            <Title as="h2">
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
          </div>
          <section
            id="css-classes"
            data-anchor-id="css-classes"
            className="mt-4 space-y-4 scroll-mt-20 prose dark:prose-invert max-w-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {buttonDoc}
            </ReactMarkdown>
          </section>
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section id="installation" title={lang.installation} />
          <Anchor.Section id="examples" title={lang.examples}>
            <Anchor.Item id="#variants">{lang.button.variants.title}</Anchor.Item>
            <Anchor.Item id="#disabled">{lang.button.disabled.title}</Anchor.Item>
            <Anchor.Item id="#loading">{lang.button.loading.title}</Anchor.Item>
            <Anchor.Item id="#icon-only">{lang.button.iconOnly.title}</Anchor.Item>
            <Anchor.Item id="#with-icons">{lang.button.withIcons.title}</Anchor.Item>
            <Anchor.Item id="#direction">{lang.button.direction.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section id="docs" title={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}

