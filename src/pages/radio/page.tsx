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
  Radio,
  ShikiCodeBlock,
  Anatomy,
  Button,
  Docs,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
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
import radioSrc from "@/component/ui/radio.tsx?raw";

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
      <div className="border rounded-lg p-6 w-full overflow-x-auto">
        {children}
      </div>
      <ShikiCodeBlock>{code}</ShikiCodeBlock>
    </section>
  );
}

export default function RadioPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.radio;
  const nav = getComponentNav("/components/radio", locale as "zh" | "en");

  const radioSections = [
    {
      title: l.api.sectionTitles.radioGroupProps,
      columns: [
        { key: "prop", header: l.api.headers.prop },
        { key: "type", header: l.api.headers.type },
        { key: "default", header: l.api.headers.default },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "value",
          type: "string",
          default: "-",
          description: l.api.radioGroupProps.value,
        },
        {
          props: "defaultValue",
          type: "string",
          default: "-",
          description: l.api.radioGroupProps.defaultValue,
        },
        {
          props: "onChange",
          type: "(value: string) => void",
          default: "-",
          description: l.api.radioGroupProps.onChange,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.radioGroupProps.disabled,
        },
        {
          props: "direction",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: l.api.radioGroupProps.direction,
        },
        {
          props: "className",
          type: "ClassNameValue",
          default: "-",
          description: l.api.radioGroupProps.className,
        },
      ],
    },
    {
      title: l.api.sectionTitles.radioProps,
      columns: [
        { key: "prop", header: l.api.headers.prop },
        { key: "type", header: l.api.headers.type },
        { key: "default", header: l.api.headers.default },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "value",
          type: "string",
          default: "-",
          description: l.api.radioProps.value,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.radioProps.disabled,
        },
        {
          props: "className",
          type: "ClassNameValue",
          default: "-",
          description: l.api.radioProps.className,
        },
        {
          props: "indicator",
          type: "RadioIndicatorConfig",
          default: "-",
          description: l.api.radioProps.indicator,
        },
      ],
    },
    {
      title: l.api.sectionTitles.itemPropsConfig,
      columns: [
        { key: "property", header: l.api.headers.property },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "group",
          description: l.api.itemPropsConfig.group,
        },
        {
          props: "radio",
          description: l.api.itemPropsConfig.radio,
        },
        {
          props: "indicator",
          description: l.api.itemPropsConfig.indicator,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(radioDoc);
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
          <ShikiCodeBlock>{radioSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
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
            title={l.variants?.title || "Variants"}
            code={RadioVariantRaw}
          >
            <RadioVariant />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-32"
            parts={[
              { name: "group", label: l.anatomy.group },
              { name: "radio", label: l.anatomy.radio },
              { name: "indicator", label: l.anatomy.indicator },
            ]}
          >
            <Radio.Group className="flex gap-4" id="anatomy-group">
              <Radio
                value="item1"
                id="anatomy-radio"
                indicator={{ props: { id: "anatomy-indicator" as string } }}
              >
                Item 1
              </Radio>
            </Radio.Group>
          </Anatomy>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={radioSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" title={lang.installation} />
          <Anchor.Section href="#examples" title={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
            <Anchor.Item href="#controlled">{l.controlled.title}</Anchor.Item>
            <Anchor.Item href="#direction">{l.direction.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{l.disabled?.title}</Anchor.Item>
            <Anchor.Item href="#variant">{l.variants?.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" title={lang.anatomy} />
          <Anchor.Section href="#docs" title={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
