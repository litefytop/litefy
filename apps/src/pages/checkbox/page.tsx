import { useState } from "react";
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
import { CheckboxBasic, CheckboxDisabled, CheckboxVariant } from "./examples";

import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,

} from "lucide-react";

import CheckboxBasicRaw from "./examples/checkbox-basic.tsx?raw";
import CheckboxDisabledRaw from "./examples/checkbox-disabled.tsx?raw";
import CheckboxVariantRaw from "./examples/checkbox-variant.tsx?raw";
import checkboxDoc from "@/docs/checkbox.md?raw";
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
    <section id={id} className="space-y-4 py-4">
      <div>
        <Title as="h3">{title}</Title>
      </div>
      <div className="border rounded-lg p-6 w-full overflow-x-auto flex flex-col justify-center min-h-32 items-center">
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
  const l = lang.checkbox ;

  const nav = getComponentNav("/components/checkbox", locale as "zh" | "en");

  const checkboxSections = [
    {
      title: l.api.sectionTitles.checkboxProps,
      data: [
        {
          props: "checked",
          type: "boolean",
          description: l.api.props.checked,
        },
        {
          props: "onValueChange",
          type: "(checked: boolean) => void",
          description: l.api.props.onValueChange,
        },
        {
          props: "value",
          type: "string",
          description: l.api.props.value,
        },
        {
          props: "label",
          type: "ReactNode",
          description: l.api.props.label,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.props.disabled,
        },
        {
          props: "variant",
          type: '"checkbox" | "toggle"',
          default: "checkbox",
          description: l.api.props.variant,
        },
        {
          props: "indicator",
          type: "(checked: boolean) => ReactNode",
          description: l.api.props.indicator,
        },
        {
          props: "name",
          type: "string",
          description: l.api.props.name,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: l.api.props.className,
        },
      ],
    },
    {
      title: l.api.sectionTitles.checkboxGroupProps,
      data: [
        {
          props: "defaultValue",
          type: "T[]",
          description: l.api.groupProps.defaultValue,
        },
        {
          props: "value",
          type: "T[]",
          description: l.api.groupProps.value,
        },
        {
          props: "onValueChange",
          type: "(value: T[]) => void",
          description: l.api.groupProps.onValueChange,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.groupProps.disabled,
        },
        {
          props: "name",
          type: "string",
          description: l.api.groupProps.name,
        },
        {
          props: "invalid",
          type: "boolean",
          description: l.api.groupProps.invalid,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: l.api.groupProps.className,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(checkboxDoc);
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
              <Button variant="ghost" onClick={handlePrev} disabled={!nav.prev} iconOnly>
                <ArrowLeftIcon className="size-4" />
              </Button>
              <Button variant="ghost" onClick={handleNext} disabled={!nav.next} iconOnly>
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>
          </div>
          <Description>{l.description}</Description>
        </header>

        <section className="mb-8">
          <Title as="h2" id="installation" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{checkboxSrc}</ShikiCodeBlock>
        </section>

        <section>
          <Title as="h2" id="examples">{lang.examples}</Title>

          <DemoSection id="basic" title={l.basic.title} code={CheckboxBasicRaw}>
            <CheckboxBasic />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={l.disabled?.title || "Disabled"}
            code={CheckboxDisabledRaw}
          >
            <CheckboxDisabled />
          </DemoSection>

          <DemoSection
            id="variant"
            title={l.variants.title}
            code={CheckboxVariantRaw}
          >
            <CheckboxVariant />
          </DemoSection>
        </section>

        <section className="mt-12 space-y-8">
          <Title as="h2" id="api" className="mb-4">
            {lang.api}
          </Title>
          <APITable sections={checkboxSections} />
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
            <Anchor.Item href="#disabled">{l.disabled.title}</Anchor.Item>
            <Anchor.Item href="#variant">{l.variants.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#api" linkText={lang.api} />
        </Anchor>
      </aside>
    </div>
  );
}
