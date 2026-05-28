import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
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
  RadioDisabled,
  RadioVariant,

} from "./examples";
import { CheckIcon, CopyIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import RadioBasicRaw from "./examples/radio-basic.tsx?raw";
import RadioControlledRaw from "./examples/radio-controlled.tsx?raw";
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
      <div className="border rounded-lg p-6 w-full overflow-x-auto flex flex-col justify-center min-h-32 items-center">
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
      title: l.api.sectionTitles.radioProps,

      data: [
        {
          props: "defaultValue",
          type: "string",
          description: l.api.props.defaultValue,
        },
        {
          props: "value",
          type: "string",
          description: l.api.props.value,
        },
        {
          props: "onValueChange",
          type: "(value: string) => void | { invalid?: string }",
          description: l.api.props.onValueChange,
        },
        {
          props: "invalid",
          type: "boolean ",
          description: l.api.props.invalid,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.props.disabled,
        },
        {
          props: "name",
          type: "string",
          description: l.api.props.name,
        },

        {
          props: "itemProps",
          type: "object",
          description: l.api.props.itemProps,
        },
        {
          props: "options",
          type: "Omit<RadioItemProps, 'checked'>[]",
          description: l.api.props.options,
        },
      ],
    },
    {
      title: l.api.sectionTitles.radioItemProps,

      data: [
        {
          props: "value",
          type: "string",
          description: l.api.item.value,
        },
        {
          props: "onCheckedChange",
          type: "(checked: boolean) => void",
          description: l.api.item.onCheckedChange,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.item.disabled,
        },
        {
          props: "variant",
          type: "'radio' | 'segment'",
          default: "radio",
          description: l.api.item.variant,
        },
        {
          props: "indicator",
          type: "RadioIndicatorConfig",
          description: l.api.item.indicator,
        },
      ],
    },
    {
      title: l.api.sectionTitles.itemProps,

      data: [
  
        {
          props: "content",
          type: 'ComponentProps<"div">',
          description: l.api.itemProps.content,
        },
       
        {
          props: "options",
          type: 'Omit<RadioItemProps, "checked" | "value" | "label">',
          description: l.api.itemProps.options,
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
            id="disabled"
            title={l.disabled?.title || "Disabled"}
            code={RadioDisabledRaw}
          >
            <RadioDisabled />
          </DemoSection>

          <DemoSection
            id="variant"
            title={l.variant.title}
            code={RadioVariantRaw}
          >
            <RadioVariant />
          </DemoSection>

 
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-40"
            parts={[
              { id: "anatomy-group", label: l.anatomy.group },
              { id: "anatomy-label", label: l.anatomy.label },
              { id: "anatomy-description", label: l.anatomy.description },
              { id: "anatomy-item", label: l.anatomy.item },
              { id: "anatomy-indicator", label: l.anatomy.indicator },
            ]}
          >
            <Radio 
    
              itemProps={{
   
          
          
                content: {
                  className: "flex flex-col gap-2",
                },
              }}
              options={[
                {
                  value: "item1",
                  label: "Item 1",
                  id: "anatomy-item",
                  indicator: { props: { id: "anatomy-indicator" } },
                },
              ]}
            />
          </Anatomy>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={radioSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-full overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
            <Anchor.Item href="#controlled">{l.controlled.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{l.disabled.title}</Anchor.Item>
            <Anchor.Item href="#variant">{l.variant.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
