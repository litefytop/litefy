import { useState } from "react";
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
  Docs,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  CheckboxBasic,
  CheckboxControlled,
  CheckboxDisabled,
  CheckboxVariant,
  CheckboxInvalid,
} from "./examples";

import CheckboxBasicRaw from "./examples/checkbox-basic.tsx?raw";
import CheckboxControlledRaw from "./examples/checkbox-controlled.tsx?raw";
import CheckboxDisabledRaw from "./examples/checkbox-disabled.tsx?raw";
import CheckboxVariantRaw from "./examples/checkbox-variant.tsx?raw";
import CheckboxInvalidRaw from "./examples/checkbox-invalid.tsx?raw";
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
      className="space-y-4 py-4"
    >
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
  const l = lang.checkbox;
  const nav = getComponentNav("/components/checkbox", locale as "zh" | "en");

  const checkboxSections = [
    {
      title: l.api.sectionTitles.checkboxGroupProps,

      data: [
        {
          props: "defaultValue",
          type: "string[]",
          description: l.api.groupProps.defaultValue,
        },
        {
          props: "value",
          type: "string[]",
          description: l.api.groupProps.value,
        },
        {
          props: "onValueChange",
          type: "(value: string[]) => void | Promise<void>",
          description: l.api.groupProps.onValueChange,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.groupProps.disabled,
        },
        {
          props: "invalid",
          type: "boolean",
          description: l.api.groupProps.invalid,
        },
        {
          props: "name",
          type: "string",
          description: l.api.groupProps.name,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
      ],
    },
    {
      title: l.api.sectionTitles.checkboxProps,

      data: [
        {
          props: "value",
          type: "string",
          description: l.api.props.value,
        },
        {
          props: "onCheckedChange",
          type: "(checked: boolean) => void",
          description: l.api.props.onCheckedChange,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.props.disabled,
        },
        {
          props: "variant",
          type: "'checkbox' | 'toggle'",
          default: "checkbox",
          description: l.api.props.variant,
        },
        {
          props: "indicator",
          type: "object",
          description: l.api.props.indicator,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
      ],
    },
    {
      title: l.api.sectionTitles.indicatorConfig,

      data: [
        {
          props: "checked",
          type: "ReactNode",
          default: "<CheckIcon />",
          description: l.api.indicator.checked,
        },
        {
          props: "unchecked",
          type: "ReactNode",
          description: l.api.indicator.unchecked,
        },
        {
          props: "hidden",
          type: "boolean",
          default: "false",
          description: l.api.indicator.hidden,
        },
        {
          props: "props",
          type: 'Omit<ComponentProps<"span">, "className"> & { className?: ClassNameValue }',
          description: l.api.indicator.props,
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
          <ShikiCodeBlock>{checkboxSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={CheckboxBasicRaw}
          >
            <CheckboxBasic />
          </DemoSection>

          <DemoSection
            id="controlled"
            title={l.controlled.title}
            code={CheckboxControlledRaw}
          >
            <CheckboxControlled />
          </DemoSection>



          <DemoSection
            id="disabled"
            title={l.disabled.title}
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

          <DemoSection
            id="invalid"
            title={l.invalid.title}
            code={CheckboxInvalidRaw}
          >
            <CheckboxInvalid />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-32"
            parts={[
              { id: "anatomy-group", label: l.anatomy.group },
              { id: "anatomy-checkbox", label: l.anatomy.checkbox },
              { id: "anatomy-indicator", label: l.anatomy.indicator },
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

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={checkboxSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
            <Anchor.Item href="#controlled">{l.controlled.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{l.disabled.title}</Anchor.Item>
            <Anchor.Item href="#variant">{l.variants.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
