import { useState } from "react";
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
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

import { FormRefExample, FormBasic } from "./examples/index";
import FormBasicRaw from "./examples/form-basic.tsx?raw";
import FormRefExampleRaw from "./examples/form-ref.tsx?raw";
import formDoc from "./doc.mdx?raw";
import formSrc from "@/component/ui/form.tsx?raw";

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

export default function FormPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.form;
  const nav = getComponentNav("/components/form", locale as "zh" | "en");

  const formSections = [
    {
      title: l.api.sectionTitles.formProps,
      data: [
        {
          props: "onSubmit",
          type: "(formData: FormData) => Promise<boolean>",
          default: "-",
          description: l.api.props.onSubmit,
        },
        {
          props: "autoReset",
          type: "boolean",
          default: "true",
          description: l.api.props.autoReset,
        },
        {
          props: "ref",
          type: "FormRef",
          default: "-",
          description: l.api.props.ref,
        },
      ],
    },
    {
      title: l.api.sectionTitles.formFieldProps,
      data: [
        {
          props: "label",
          type: "ReactNode",
          default: "-",
          description: l.api.props.label,
        },
        {
          props: "name",
          type: "string",
          default: "-",
          description: l.api.props.name,
        },
        {
          props: "description",
          type: "ReactNode",
          default: "-",
          description: l.api.props.description,
        },
        {
          props: "invalid",
          type: "ReactNode",
          default: "-",
          description: l.api.props.invalid,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.props.disabled,
        },
        {
          props: "direction",
          type: '"vertical" | "horizontal"',
          default: '"vertical"',
          description: l.api.props.direction,
        },
      ],
    },
    {
      title: l.api.sectionTitles.formSubmitProps,
      data: [
        {
          props: "loading",
          type: "boolean",
          default: "false",
          description: l.api.props.loading,
        },
      ],
    },
    {
      title: l.api.sectionTitles.formFieldsetProps,
      data: [
        {
          props: "name",
          type: "string",
          default: "-",
          description: l.api.props.name,
        },
        {
          props: "label",
          type: "ReactNode",
          default: "-",
          description: l.api.props.label,
        },
        {
          props: "description",
          type: "ReactNode",
          default: "-",
          description: l.api.props.description,
        },
        {
          props: "invalid",
          type: "ReactNode",
          default: "-",
          description: l.api.props.invalid,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.props.disabled,
        },
        {
          props: "direction",
          type: '"vertical" | "horizontal"',
          default: '"vertical"',
          description: l.api.props.direction,
        },
      ],
    },
    {
      title: l.api.sectionTitles.formRef,
      data: [
        {
          props: "setValue",
          type: "(name: string, value: string | number) => void",
          default: "-",
          description: l.api.props.setValue,
        },
        {
          props: "setValues",
          type: "(values: Record<string, string | number>) => void",
          default: "-",
          description: l.api.props.setValues,
        },
        {
          props: "reset",
          type: "() => void",
          default: "-",
          description: l.api.props.reset,
        },
        {
          props: "submit",
          type: "() => void",
          default: "-",
          description: l.api.props.submit,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(formDoc);
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
          <ShikiCodeBlock>{formSrc}</ShikiCodeBlock>
        </section>

        <section id="examples">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection id="basic" title={l.basic.title} code={FormBasicRaw}>
            <FormBasic />
          </DemoSection>

          <DemoSection
            id="ref-example"
            title={l.refExample.title}
            code={FormRefExampleRaw}
          >
            <FormRefExample />
          </DemoSection>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={formSections} />
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
            <Anchor.Item href="#ref-example">{l.refExample.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
