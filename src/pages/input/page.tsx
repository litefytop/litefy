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
  Input,
  ShikiCodeBlock,
  Anatomy,
  Button,
  Docs,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  InputBasic,
  InputPrefixSuffix,
  InputValidation,
  InputDisabled,
} from "./examples";

import InputBasicRaw from "./examples/input-basic.tsx?raw";
import InputPrefixSuffixRaw from "./examples/input-prefix-suffix.tsx?raw";
import InputValidationRaw from "./examples/input-validation.tsx?raw";
import InputDisabledRaw from "./examples/input-disabled.tsx?raw";
import inputDoc from "./doc.mdx?raw";
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
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.props.disabled,
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
          props: "itemProps",
          type: "InputItemProps",
          
          description: l.api.props.itemProps,
        },
      ],
    },
    {
      title: l.api.sectionTitles.itemPropsConfig,

      data: [
        {
          props: "group",
          type: `React.ComponentProps<"div">`,
          description: l.api.itemPropsConfig.group,
        },
        {
          props: "label",
          type: `React.ComponentProps<"label">`,
          description: l.api.itemPropsConfig.label,
        },
        {
          props: "invalid",
          type: `React.ComponentProps<"div">`,
          description: l.api.itemPropsConfig.invalid,
        },
        {
          props: "leading",
          type: `React.ComponentProps<"span">`,
          description: l.api.itemPropsConfig.leading,
        },
        {
          props: "trailing",
          type: `React.ComponentProps<"span">`,
          description: l.api.itemPropsConfig.trailing,
        },
        {
          props: "description",
          type: `React.ComponentProps<"small">`,
          description: l.api.itemPropsConfig.description,
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
          <ShikiCodeBlock>{inputSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={InputBasicRaw}
          >
            <InputBasic />
          </DemoSection>

          <DemoSection
            id="prefix-suffix"
            title={l.prefixSuffix.title}
            code={InputPrefixSuffixRaw}
          >
            <InputPrefixSuffix />
          </DemoSection>

          <DemoSection
            id="validation"
            title={l.validation.title}
            code={InputValidationRaw}
          >
            <InputValidation />
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
              { name: "label", label: l.anatomy.label },
              { name: "input", label: l.anatomy.input },
              { name: "leading", label: l.anatomy.leading },
              { name: "trailing", label: l.anatomy.trailing },
              { name: "description", label: l.anatomy.description },
            ]}
          >
            <Input
              label="域名"
              leading="https://"
              trailing=".com"
              description="用于登记域名"
              placeholder="请输入域名"
              data-anatomy-name="input"
              itemProps={{
                group: { "data-anatomy-name": "group" },
                label: { "data-anatomy-name": "label" },
                leading: { "data-anatomy-name": "leading" },
                trailing: { "data-anatomy-name": "trailing" },
                description: { "data-anatomy-name": "description" },
              }}
            />
          </Anatomy>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={inputSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-full overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
            <Anchor.Item href="#prefix-suffix">{l.prefixSuffix.title}</Anchor.Item>
            <Anchor.Item href="#validation">{l.validation.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{l.disabled.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.docs}/>
     
        </Anchor>
      </aside>
    </div>
  );
}
