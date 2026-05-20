import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  DatePicker,
  ShikiCodeBlock,
  Anatomy,
  Button,
  Docs,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  DatePickerBasic,
  DatePickerType,
  DatePickerDisabled,
} from "./examples";
import { CheckIcon, CopyIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import DatePickerBasicRaw from "./examples/date-picker-basic.tsx?raw";
import DatePickerTypeRaw from "./examples/date-picker-type.tsx?raw";
import DatePickerDisabledRaw from "./examples/date-picker-disabled.tsx?raw";
import datePickerSrc from "@/component/ui/date-picker.tsx?raw";

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

export default function DatePickerPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang["date-picker"];
  const nav = getComponentNav("/components/date-picker", locale as "zh" | "en");

  const datePickerSections = [
    {
      title: l.api.sectionTitles.datePickerProps,

      data: [
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
          props: "placeholder",
          type: "string",
          default: '"Select date"',
          description: l.api.props.placeholder,
        },
        {
          props: "type",
          type: "date | time | datetime-local | month | week",
          default: "date",
          description: l.api.props.type,
        },
        {
          props: "onChange",
          type: "(e: ChangeEvent<HTMLInputElement>) => void | { invalid?: string }",
          description: l.api.props.onChange,
        },
        {
          props: "itemProps",
          type: "DateInputItemProps",
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
          props: "description",
          type: `React.ComponentProps<"small">`,
          description: l.api.itemPropsConfig.description,
        },
        {
          props: "invalid",
          type: `React.ComponentProps<"small">`,
          description: l.api.itemPropsConfig.invalid,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(datePickerSrc);
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
          <ShikiCodeBlock>{datePickerSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={DatePickerBasicRaw}
          >
            <DatePickerBasic />
          </DemoSection>

          <DemoSection
            id="type"
            title={l.type.title}
            code={DatePickerTypeRaw}
          >
            <DatePickerType />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={l.disabled.title}
            code={DatePickerDisabledRaw}
          >
            <DatePickerDisabled />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-48"
            parts={[
              { name: "root", label: l.anatomy.root },
              { name: "label", label: l.anatomy.label },
              { name: "input", label: l.anatomy.input },
              { name: "description", label: l.anatomy.description },
            ]}
          >
            <DatePicker
              label="Date"
              description="Description"
              data-anatomy-name="input"
              itemProps={{
                root: { "data-anatomy-name": "root" },
                label: { "data-anatomy-name": "label" },
                description: { "data-anatomy-name": "description" },
              }}
            />
          </Anatomy>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={datePickerSections} />
        </section>

        <section id="value-format" className="mt-8 space-y-4">
          <Title as="h4" className="px-2">{l.valueNote}</Title>
          <div className="border rounded-lg p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">type</th>
                  <th className="text-left py-2">value format</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4 font-mono text-muted-foreground">date</td>
                  <td className="py-2 font-mono">YYYY-MM-DD</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 font-mono text-muted-foreground">time</td>
                  <td className="py-2 font-mono">HH:mm</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 font-mono text-muted-foreground">datetime-local</td>
                  <td className="py-2 font-mono">YYYY-MM-DDTHH:mm</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 font-mono text-muted-foreground">month</td>
                  <td className="py-2 font-mono">YYYY-MM</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">week</td>
                  <td className="py-2 font-mono">YYYY-Wxx</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-full overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
            <Anchor.Item href="#type">{l.type.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{l.disabled.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.docs}/>
        </Anchor>
      </aside>
    </div>
  );
}
