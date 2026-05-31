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
  ComboboxBasic,
  ComboboxAsync,
  ComboboxWithForm,
  ComboboxDisabled,
  ComboboxClearable,
} from "./examples";
import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

import ComboboxBasicRaw from "./examples/combobox-basic.tsx?raw";
import ComboboxAsyncRaw from "./examples/combobox-async.tsx?raw";
import ComboboxWithFormRaw from "./examples/combobox-with-form.tsx?raw";
import ComboboxDisabledRaw from "./examples/combobox-disabled.tsx?raw";
import ComboboxClearableRaw from "./examples/combobox-clearable.tsx?raw";
import comboboxDoc from "./doc.mdx?raw";
import comboboxSrc from "@/component/ui/combobox.tsx?raw";

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

export default function ComboboxPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.combobox;
  const nav = getComponentNav("/components/combobox", locale as "zh" | "en");

  const comboboxSections = [
    {
      title: l.api.sectionTitles.comboboxProps,
      data: [
        {
          props: "value",
          type: "string",
          description: l.api.props.value,
        },
        {
          props: "defaultValue",
          type: "string",
          default: '""',
          description: l.api.props.defaultValue,
        },
        {
          props: "onChange",
          type: "(e: ComboboxChangeEvent) => void",
          description: l.api.props.onChange,
        },
        {
          props: "onSelect",
          type: "(option: ComboboxOption) => void",
          description: l.api.props.onSelect,
        },
        {
          props: "options",
          type: "ComboboxOption[]",
          description: l.api.props.options,
        },
        {
          props: "fetchOptions",
          type: "(input: string) => Promise<ComboboxOption[]>",
          description: l.api.props.fetchOptions,
        },
        {
          props: "placeholder",
          type: "string",
          default: '"Select or type..."',
          description: l.api.props.placeholder,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.props.disabled,
        },
        {
          props: "invalid",
          type: "boolean",
          default: "false",
          description: l.api.props.invalid,
        },
        {
          props: "clearable",
          type: "boolean",
          default: "true",
          description: l.api.props.clearable,
        },
        {
          props: "debounceMs",
          type: "number",
          default: "300",
          description: l.api.props.debounceMs,
        },
        {
          props: "maxHeight",
          type: "number",
          default: "256",
          description: l.api.props.maxHeight,
        },
      ],
    },
    {
      title: l.api.sectionTitles.slotProps,
      data: [
        {
          props: "container",
          type: "HTMLAttributes<HTMLDivElement>",
          description: l.api.slotProps.container,
        },
        {
          props: "input",
          type: "InputHTMLAttributes<HTMLInputElement>",
          description: l.api.slotProps.input,
        },
        {
          props: "list",
          type: "HTMLAttributes<HTMLUListElement>",
          description: l.api.slotProps.list,
        },
        {
          props: "option",
          type: "LiHTMLAttributes<HTMLLIElement>",
          description: l.api.slotProps.option,
        },
        {
          props: "clearButton",
          type: "ButtonHTMLAttributes<HTMLButtonElement>",
          description: l.api.slotProps.clearButton,
        },
        {
          props: "triggerButton",
          type: "ButtonHTMLAttributes<HTMLButtonElement>",
          description: l.api.slotProps.triggerButton,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(comboboxDoc);
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
          <ShikiCodeBlock>{comboboxSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={ComboboxBasicRaw}
          >
            <ComboboxBasic />
          </DemoSection>

          <DemoSection
            id="async"
            title={l.async.title}
            code={ComboboxAsyncRaw}
          >
            <ComboboxAsync />
          </DemoSection>

          <DemoSection
            id="with-form"
            title={l.withForm.title}
            code={ComboboxWithFormRaw}
          >
            <ComboboxWithForm />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={l.disabled.title}
            code={ComboboxDisabledRaw}
          >
            <ComboboxDisabled />
          </DemoSection>

          <DemoSection
            id="clearable"
            title={l.clearable.title}
            code={ComboboxClearableRaw}
          >
            <ComboboxClearable />
          </DemoSection>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={comboboxSections} />
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
            <Anchor.Item href="#async">{l.async.title}</Anchor.Item>
            <Anchor.Item href="#with-form">{l.withForm.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{l.disabled.title}</Anchor.Item>
            <Anchor.Item href="#clearable">{l.clearable.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
