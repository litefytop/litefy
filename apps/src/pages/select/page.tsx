import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Anatomy,
  Button,
  APITable,
  Select,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  SelectBasic,
  SelectControlled,
  SelectDisabled,
  SelectGroup,
  SelectMultiple,
} from "./examples";
import { CheckIcon, CopyIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import SelectBasicRaw from "./examples/select-basic.tsx?raw";
import SelectControlledRaw from "./examples/select-controlled.tsx?raw";
import SelectDisabledRaw from "./examples/select-disabled.tsx?raw";
import SelectGroupRaw from "./examples/select-group.tsx?raw";
import SelectMultipleRaw from "./examples/select-multiple.tsx?raw";
import selectDoc from "@/docs/select.md?raw";
import selectSrc from "@/component/ui/select.tsx?raw";

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

export default function SelectPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.select;
  const nav = getComponentNav("/components/select", locale as "zh" | "en");

  const selectSections = [
    {
      title: l.api.sectionTitles.selectProps,
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
          type: "(e: ChangeEvent) => void | { invalid?: string }",
          description: l.api.props.onChange,
        },
        {
          props: "options",
          type: "{ label: string; value: string }[] | { group: string; options: SelectOption[] }[]",
          description: l.api.props.options,
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
          props: "multiple",
          type: "boolean",
          default: "false",
          description: l.api.props.multiple,
        },
        {
          props: "invalid",
          type: "ReactNode",
          description: l.api.props.invalid,
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
          type: "SelectItemProps",
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
          props: "label",
          type: `React.ComponentProps<"label">`,
          description: l.api.slotPropsConfig.label,
        },
        {
          props: "invalid",
          type: `React.ComponentProps<"div">`,
          description: l.api.slotPropsConfig.invalid,
        },
        {
          props: "description",
          type: `React.ComponentProps<"small">`,
          description: l.api.slotPropsConfig.description,
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
    navigator.clipboard.writeText(selectDoc);
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
              <Button onClick={handleCopy} variant="text">
                {copied ? (
                  <CheckIcon className="size-4 text-green-500 mr-1" />
                ) : (
                  <CopyIcon className="size-4 mr-1" />
                )}
                {lang.common.copyDocs}
              </Button>
              <Button variant="text" onClick={handlePrev} disabled={!nav.prev} >
                <ArrowLeftIcon className="size-4" />
              </Button>
              <Button variant="text" onClick={handleNext} disabled={!nav.next} >
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>
          </div>
          <Description>{l.description}</Description>
        </header>

        <section id="installation" className="mb-8 ">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{selectSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" >
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={SelectBasicRaw}
          >
            <SelectBasic />
          </DemoSection>

          <DemoSection
            id="controlled"
            title={l.controlled.title}
            code={SelectControlledRaw}
          >
            <SelectControlled />
          </DemoSection>



          <DemoSection
            id="disabled"
            title={l.disabled.title}
            code={SelectDisabledRaw}
          >
            <SelectDisabled />
          </DemoSection>

          <DemoSection
            id="group"
            title={l.group.title}
            code={SelectGroupRaw}
          >
            <SelectGroup />
          </DemoSection>

          <DemoSection
            id="multiple"
            title={l.multiple.title}
            code={SelectMultipleRaw}
          >
            <SelectMultiple />
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
              { name: "select", label: l.anatomy.select },
              { name: "leading", label: l.anatomy.leading },
              { name: "trailing", label: l.anatomy.trailing },
              { name: "invalid", label: l.anatomy.invalid },
              { name: "description", label: l.anatomy.description },
            ]}
          >
            <Select
   
              placeholder="Select an option"
       
              options={[
                { label: "Option 1", value: "1" },
                { label: "Option 2", value: "2" },
              ]}
              data-anatomy-name="root"
  
            />
          </Anatomy>
        </section>

        <section id="api" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.api}
          </Title>
          <APITable sections={selectSections} />
        </section>
        
        <footer className="py-8 border-t mt-8">
          <div className="flex justify-between">
            <Button
              variant="text"
              onClick={handlePrev}
              disabled={!nav.prev}
              className={nav.prev ? "" : "invisible"}
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              {nav.prev?.title}
            </Button>
            <Button
              variant="text"
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
            <Anchor.Item href="#group">{l.group.title}</Anchor.Item>
            <Anchor.Item href="#multiple">{l.multiple.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.api} />
        </Anchor>
      </aside>
    </div>
  );
}
