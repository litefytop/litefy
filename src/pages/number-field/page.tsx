import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  NumberField,
  ShikiCodeBlock,
  Anatomy,
  Button,
  APITable,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  NumberFieldBasic,
  NumberFieldControlled,
  NumberFieldDisabled,
} from "./examples";

import NumberFieldBasicRaw from "./examples/number-field-basic.tsx?raw";
import NumberFieldControlledRaw from "./examples/number-field-controlled.tsx?raw";
import NumberFieldDisabledRaw from "./examples/number-field-disabled.tsx?raw";
import numberFieldSrc from "@/component/ui/number-field.tsx?raw";
import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

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

export default function NumberFieldPage({
  locale = "zh",
}: {
  locale?: string;
}) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang["number-field"];
  const nav = getComponentNav(
    "/components/number-field",
    locale as "zh" | "en",
  );

  const numberFieldSections = [
    {
      title: l.api.sectionTitles.numberFieldProps,

      data: [
        {
          props: "value",
          type: "string",
          description: l.api.props.value,
        },
        {
          props: "defaultValue",
          type: "string|number",
          default: "0",
          description: l.api.props.defaultValue,
        },
        {
          props: "onValueChange",
          type: "(val: string) => void ",
          description: l.api.props.onValueChange,
        },

        {
          props: "invalid",
          type: "string",
          description: l.api.props.invalid,
        },
        {
          props: "min",
          type: "number",
          default: "-Infinity",
          description: l.api.props.min,
        },
        {
          props: "max",
          type: "number",
          default: "Infinity",
          description: l.api.props.max,
        },
        {
          props: "step",
          type: "number",
          default: "1",
          description: l.api.props.step,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.props.disabled,
        },
        {
          props: "slotProps",
          type: "NumberFieldItemProps",

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
          props: "btn",
          type: `React.ComponentProps<"button">`,
          description: l.api.slotPropsConfig.btn,
        },
        {
          props: "desc",
          type: `React.ComponentProps<"small">`,
          description: l.api.slotPropsConfig.desc,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(numberFieldSrc);
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

        <section className="mb-8">
          <Title as="h2" id="installation" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{numberFieldSrc}</ShikiCodeBlock>
        </section>

        <section>
          <Title as="h2" id="examples">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={NumberFieldBasicRaw}
          >
            <NumberFieldBasic />
          </DemoSection>

          <DemoSection
            id="controlled"
            title={l.controlled.title}
            code={NumberFieldControlledRaw}
          >
            <NumberFieldControlled />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={l.disabled.title}
            code={NumberFieldDisabledRaw}
          >
            <NumberFieldDisabled />
          </DemoSection>
        </section>

        <section className="mt-12 space-y-8">
          <Title as="h2" id="api" className="mb-4">
            {lang.api}
          </Title>
          <APITable sections={numberFieldSections} />
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
            <Anchor.Item href="#disabled">{l.disabled.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#api" linkText={lang.api} />
        </Anchor>
      </aside>
    </div>
  );
}
