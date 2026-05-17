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
  NumberField,
  ShikiCodeBlock,
  Anatomy,
  Button,
  Docs,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  NumberFieldBasic,
  NumberFieldControlled,
  NumberFieldMinMax,
  NumberFieldStep,
  NumberFieldDisabled,
  NumberFieldValidation,
} from "./examples";

import NumberFieldBasicRaw from "./examples/number-field-basic.tsx?raw";
import NumberFieldControlledRaw from "./examples/number-field-controlled.tsx?raw";
import NumberFieldMinMaxRaw from "./examples/number-field-min-max.tsx?raw";
import NumberFieldStepRaw from "./examples/number-field-step.tsx?raw";
import NumberFieldDisabledRaw from "./examples/number-field-disabled.tsx?raw";
import NumberFieldValidationRaw from "./examples/number-field-validation.tsx?raw";
import numberFieldSrc from "@/component/ui/number-field.tsx?raw";

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

export default function NumberFieldPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang["number-field"];
  const nav = getComponentNav("/components/number-field", locale as "zh" | "en");

  const numberFieldSections = [
    {
      title: l.api.sectionTitles.numberFieldProps,

      data: [
        {
          props: "value",
          type: "number",
          
          description: l.api.props.value,
        },
        {
          props: "defaultValue",
          type: "number",
          default: "0",
          description: l.api.props.defaultValue,
        },
        {
          props: "onValueChange",
          type: "(val: number) => void | { invalid?: string }",
          
          description: l.api.props.onValueChange,
        },
        {
          props: "label",
          type: "ReactNode",
          
          description: l.api.props.label,
        },
        {
          props: "description",
          type: "ReactNode",
          
          description: l.api.props.description,
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
          props: "itemProps",
          type: "NumberFieldItemProps",
          
          description: l.api.props.itemProps,
        },
      ],
    },
    {
      title: l.api.sectionTitles.itemPropsConfig,

      data: [
        {
          props: "root",
          type: `React.ComponentProps<"div">`,
          description: l.api.itemPropsConfig.root,
        },
        {
          props: "label",
          type: `React.ComponentProps<"label">`,
          description: l.api.itemPropsConfig.label,
        },
        {
          props: "group",
          type: `React.ComponentProps<"div">`,
          description: l.api.itemPropsConfig.group,
        },
        {
          props: "btn",
          type: `React.ComponentProps<"button">`,
          description: l.api.itemPropsConfig.btn,
        },
        {
          props: "desc",
          type: `React.ComponentProps<"small">`,
          description: l.api.itemPropsConfig.desc,
        },
        {
          props: "error",
          type: `React.ComponentProps<"small">`,
          description: l.api.itemPropsConfig.error,
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

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{numberFieldSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>

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
            id="min-max"
            title={l.minMax.title}
            code={NumberFieldMinMaxRaw}
          >
            <NumberFieldMinMax />
          </DemoSection>

          <DemoSection
            id="step"
            title={l.step.title}
            code={NumberFieldStepRaw}
          >
            <NumberFieldStep />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={l.disabled.title}
            code={NumberFieldDisabledRaw}
          >
            <NumberFieldDisabled />
          </DemoSection>

          <DemoSection
            id="validation"
            title={l.validation.title}
            code={NumberFieldValidationRaw}
          >
            <NumberFieldValidation />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-48"
            parts={[
              { name: "root", label: l.anatomy.root },
              { name: "label", label: l.anatomy.label },
              { name: "group", label: l.anatomy.group },
              { name: "btn", label: l.anatomy.btn },
              { name: "input", label: l.anatomy.input },
              { name: "desc", label: l.anatomy.desc },
            ]}
          >
            <NumberField
              label="数量"
              description="请选择数量"
              data-anatomy-name="input"
              itemProps={{
                root: { "data-anatomy-name": "root" },
                label: { "data-anatomy-name": "label" },
                group: { "data-anatomy-name": "group" },
                btn: { "data-anatomy-name": "btn" },
                desc: { "data-anatomy-name": "desc" },
              }}
            />
          </Anatomy>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={numberFieldSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-full overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
            <Anchor.Item href="#controlled">{l.controlled.title}</Anchor.Item>
            <Anchor.Item href="#min-max">{l.minMax.title}</Anchor.Item>
            <Anchor.Item href="#step">{l.step.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{l.disabled.title}</Anchor.Item>
            <Anchor.Item href="#validation">{l.validation.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.docs}/>
     
        </Anchor>
      </aside>
    </div>
  );
}
