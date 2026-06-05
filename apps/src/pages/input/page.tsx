import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  Input,
  ShikiCodeBlock,
  Anatomy,
  Button,
  APITable,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  InputBasic,
  InputPrefixSuffix,

  InputDisabled,
  InputControlled,
} from "./examples";
import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

import InputBasicRaw from "./examples/input-basic.tsx?raw";
import InputPrefixSuffixRaw from "./examples/input-prefix-suffix.tsx?raw";

import InputDisabledRaw from "./examples/input-disabled.tsx?raw";
import InputControlledRaw from "./examples/input-controlled.tsx?raw";
import inputDoc from "@/docs/input.md?raw";
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
    <section id={id} className="space-y-4 py-4">
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
  const l = lang.input;
  const nav = getComponentNav("/components/input", locale as "zh" | "en");

  const inputSections = [
    {
      title: l.api.sectionTitles.inputProps,

      data: [
        {
          props: "value",
          type: "string",

          description: l.api.props.value,
        },
        {
          props: "defaultValue",
          type: "string",

          description: l.api.props.defaultValue,
        },
        {
          props: "onChange",
          type: "(value: string) => void",

          description: l.api.props.onChange,
        },
        {
          props: "placeholder",
          type: "string",

          description: l.api.props.placeholder,
        },
        {
          props: "type",
          type: "text | email | url | number | tel | search",
          default: "text",
          description: l.api.props.type,
        },
        {
          props: "invalid",
          type: "string",
          description: l.api.props.invalid,
        },
        {
          props: "label",
          type: "string",

          description: l.api.props.label,
        },
        {
          props: "description",
          type: "string",

          description: l.api.props.description,
        },
        {
          props: "leading",
          type: "ReactNode",

          description: l.api.props.leading,
        },
        {
          props: "trailing",
          type: "ReactNode",

          description: l.api.props.trailing,
        },

        {
          props: "slotProps",
          type: "InputItemProps",

          description: l.api.props.slotProps,
        },
      ],
    },
    {
      title: l.api.sectionTitles.slotPropsConfig,

      data: [
        {
          props: "group",
          type: `React.ComponentProps<"div">`,
          description: l.api.slotPropsConfig.group,
        },

        {
          props: "leading",
          type: `React.ComponentProps<"span">`,
          description: l.api.slotPropsConfig.leading,
        },
        {
          props: "trailing",
          type: `React.ComponentProps<"span">`,
          description: l.api.slotPropsConfig.trailing,
        },

      ],
    },
  ];

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
          <ShikiCodeBlock>{inputSrc}</ShikiCodeBlock>
        </section>

        <section>
          <Title as="h2" id="examples">{lang.examples}</Title>

          <DemoSection id="basic" title={l.basic.title} code={InputBasicRaw}>
            <InputBasic />
          </DemoSection>

          <DemoSection
            id="controlled"
            title={l.controlled.title}
            code={InputControlledRaw}
          >
            <InputControlled />
          </DemoSection>

          <DemoSection
            id="prefix-suffix"
            title={l.prefixSuffix.title}
            code={InputPrefixSuffixRaw}
          >
            <InputPrefixSuffix />
          </DemoSection>


          <DemoSection
            id="disabled"
            title={l.disabled.title}
            code={InputDisabledRaw}
          >
            <InputDisabled />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-48"
            parts={[
              { name: "group", label: l.anatomy.group },
              { name: "input", label: l.anatomy.input },
              { name: "leading", label: l.anatomy.leading },
              { name: "trailing", label: l.anatomy.trailing },
            ]}
          >
            <Input
              leading="https://"
              trailing=".com"
              placeholder="Enter domain"
              data-anatomy-name="input"
              slotProps={{
                group: { "data-anatomy-name": "group" },

                leading: { "data-anatomy-name": "leading" },
                trailing: { "data-anatomy-name": "trailing" },
              }}
            />
          </Anatomy>
        </section>

        <section className="mt-12 space-y-8">
          <Title as="h2" id="api" className="mb-4">
            {lang.api}
          </Title>
          <APITable sections={inputSections} />
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
            <Anchor.Item href="#controlled">{l.controlled.title}</Anchor.Item>
            <Anchor.Item href="#prefix-suffix">
              {l.prefixSuffix.title}
            </Anchor.Item>
            <Anchor.Item href="#disabled">{l.disabled.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#api" linkText={lang.api} />
        </Anchor>
      </aside>
    </div>
  );
}
