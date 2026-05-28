import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Button,
  Docs,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  ButtonVariants,
  ButtonDisabled,
  ButtonLoading,
  ButtonIconOnly,
  ButtonWithIcons,
} from "./examples";
import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

import ButtonVariantsRaw from "./examples/button-variants.tsx?raw";
import ButtonDisabledRaw from "./examples/button-disabled.tsx?raw";
import ButtonLoadingRaw from "./examples/button-loading.tsx?raw";
import ButtonIconOnlyRaw from "./examples/button-icon-only.tsx?raw";
import ButtonWithIconsRaw from "./examples/button-with-icons.tsx?raw";
import buttonDoc from "./doc.mdx?raw";
import buttonSrc from "@/component/ui/button.tsx?raw";

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
    <section id={id} data-anchor-id={id} className="space-y-4 py-4">
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

export default function ButtonPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.button;
  const nav = getComponentNav("/components/button", locale as "zh" | "en");

  const buttonSections = [
    {
      title: l.api.sectionTitles.buttonProps,

      data: [
        {
          props: "variant",
          type: Object.keys(Button.class.variant).join(" | "),
          default: "primary",
          description: l.api.props.variant,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
        {
          props: "loadingConfig",
          type: "ButtonLoadingConfig",
          description: l.api.props.loading,
        },
      ],
    },
    {
      title: l.api.sectionTitles.loadingConfig,

      data: [
        {
          props: "icon",
          type: "React.ReactNode",
          description: l.api.loadingConfig.icon,
        },
        {
          props: "loading",
          type: "boolean",
          default: "false",
          description: l.api.loadingConfig.loading,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(buttonDoc);
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

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{buttonSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="variants"
            title={l.variants.title}
            code={ButtonVariantsRaw}
          >
            <ButtonVariants />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={l.disabled.title}
            code={ButtonDisabledRaw}
          >
            <ButtonDisabled />
          </DemoSection>

          <DemoSection
            id="loading"
            title={l.loading.title}
            code={ButtonLoadingRaw}
          >
            <ButtonLoading />
          </DemoSection>

          <DemoSection
            id="icon-only"
            title={l.iconOnly.title}
            code={ButtonIconOnlyRaw}
          >
            <ButtonIconOnly />
          </DemoSection>

          <DemoSection
            id="with-icons"
            title={l.withIcons.title}
            code={ButtonWithIconsRaw}
          >
            <ButtonWithIcons />
          </DemoSection>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={buttonSections} />
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
            <Anchor.Item href="#variants">{l.variants.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{l.disabled.title}</Anchor.Item>
            <Anchor.Item href="#loading">{l.loading.title}</Anchor.Item>
            <Anchor.Item href="#icon-only">{l.iconOnly.title}</Anchor.Item>
            <Anchor.Item href="#with-icons">{l.withIcons.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
