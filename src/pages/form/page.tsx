import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Button,


} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import { CheckIcon, CopyIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import FormBasic from "./examples/form-basic";
import FormBasicRaw from "./examples/form-basic.tsx?raw";
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
      columns: [
        { key: "prop", header: lang.common.prop },
        { key: "type", header: lang.common.type },
        { key: "default", header: lang.common.default },
        { key: "description", header: lang.common.description },
      ],
      data: [
        {
          props: "onSubmit",
          type: "(formData: FormData) => Promise<boolean>",
          default: "-",
          description: l.api.props.onSubmit,
        },
      ],
    },
    {
      title: l.api.sectionTitles.formFieldProps,
      columns: [
        { key: "prop", header: lang.common.prop },
        { key: "type", header: lang.common.type },
        { key: "default", header: lang.common.default },
        { key: "description", header: lang.common.description },
      ],
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
      columns: [
        { key: "prop", header: lang.common.prop },
        { key: "type", header: lang.common.type },
        { key: "default", header: lang.common.default },
        { key: "description", header: lang.common.description },
      ],
      data: [
        {
          props: "loading",
          type: "boolean",
          default: "false",
          description: l.api.props.loading,
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

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={FormBasicRaw}
          >
            <FormBasic />
          </DemoSection>
        </section>

        <section id="anatomy" className="scroll-mt-20 py-4">
          <Title as="h2">{lang.anatomy}</Title>
    
        </section>

        <section id="api" className="scroll-mt-20 py-4">
          <Title as="h2">{lang.api}</Title>
          {formSections.map((section) => (
            <div key={section.title} className="my-6">
              <p className="font-medium mb-3">{section.title}</p>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      {section.columns?.map((col) => (
                        <th
                          key={col.key}
                          className="text-left font-medium p-3 border-b"
                        >
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.data.map((row, index) => (
                      <tr
                        key={row.props}
                        className={index % 2 === 0 ? "bg-muted/30" : ""}
                      >
                        {section.columns?.map((col) => (
                          <td
                            key={col.key}
                            className="p-3 border-b last:border-0 align-top"
                          >
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {row[col.key as keyof typeof row] ?? "-"}
                            </code>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
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
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#api" linkText={lang.api}>
            <Anchor.Item href="#form-props">{l.api.sectionTitles.formProps}</Anchor.Item>
            <Anchor.Item href="#form-field-props">{l.api.sectionTitles.formFieldProps}</Anchor.Item>
            <Anchor.Item href="#form-submit-props">{l.api.sectionTitles.formSubmitProps}</Anchor.Item>
          </Anchor.Section>
        </Anchor>
      </aside>
    </div>
  );
}
