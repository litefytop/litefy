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
  Combobox,
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

import ComboboxBasicRaw from "./examples/combobox-basic.tsx?raw";
import ComboboxAsyncRaw from "./examples/combobox-async.tsx?raw";
import ComboboxDisabledRaw from "./examples/combobox-disabled.tsx?raw";
import ComboboxClearableRaw from "./examples/combobox-clearable.tsx?raw";
import comboboxDoc from "./doc.mdx?raw";
import comboboxSrc from "@/component/ui/combobox.tsx?raw";

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

export default function ComboboxPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.combobox;
  const nav = getComponentNav("/components/combobox", locale as "zh" | "en");

  const comboboxSections = [
    {
      title: l.api.sectionTitles.comboboxProps,
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
          type: "(e: ComboboxChangeEvent) => void",
          description: l.api.props.onChange,
        },
        {
          props: "onBlur",
          type: "React.FocusEventHandler<HTMLInputElement>",
          description: l.api.props.onBlur,
        },
        {
          props: "onSelect",
          type: "(option: string) => void",
          description: l.api.props.onSelect,
        },
        {
          props: "options",
          type: "string[] | ((keyword: string) => Promise<string[]>)",
          description: l.api.props.options,
        },
        {
          props: "placeholder",
          type: "string",
          default: '"Search or type..."',
          description: l.api.props.placeholder,
        },
        {
          props: "disabled",
          type: "boolean",
          description: l.api.props.disabled,
        },
        {
          props: "invalid",
          type: "boolean",
          description: l.api.props.invalid,
        },
        {
          props: "clearable",
          type: "boolean",
          default: "true",
          description: l.api.props.clearable,
        },
        {
          props: "debounceMs",
          type: "number",
          default: "300",
          description: l.api.props.debounceMs,
        },
        {
          props: "skeleton",
          type: "React.ReactNode",
          description: l.api.props.skeleton,
        },
        {
          props: "optionHeight",
          type: "number",
          default: "36",
          description: l.api.props.optionHeight,
        },
        {
          props: "overscan",
          type: "number",
          default: "2",
          description: l.api.props.overscan,
        },
        {
          props: "slotProps",
          type: "ComboboxSlotProps",
          description: l.api.props.slotProps,
        },
      ],
    },
    {
      title: l.api.sectionTitles.slotProps,
      data: [
        {
          props: "container",
          type: `Omit<React.ComponentProps<"div">, "ref">`,
          description: l.api.slotProps.container,
        },
        {
          props: "input",
          type: `Omit<React.ComponentProps<"input">, "ref" | "value" | "defaultValue" | ...>`,
          description: l.api.slotProps.input,
        },
        {
          props: "list",
          type: `Omit<React.ComponentProps<"ul">, "ref">`,
          description: l.api.slotProps.list,
        },
        {
          props: "option",
          type: `React.ComponentProps<"li">`,
          description: l.api.slotProps.option,
        },
        {
          props: "clearButton",
          type: `React.ComponentProps<"button">`,
          description: l.api.slotProps.clearButton,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(comboboxDoc);
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
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={!nav.prev}
              >
                <ArrowLeftIcon className="size-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleNext}
                disabled={!nav.next}
              >
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
          <ShikiCodeBlock>{comboboxSrc}</ShikiCodeBlock>
        </section>

        <section>
          <Title id="examples" as="h2">
            {lang.examples}
          </Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={ComboboxBasicRaw}
          >
            <Combobox options={["Apple", "Banana", "Cherry"]} />
          </DemoSection>

          <DemoSection
            id="async"
            title={l.async.title}
            code={ComboboxAsyncRaw}
          >
            <Combobox
              options={async (keyword) => {
                await new Promise((resolve) => setTimeout(resolve, 500));
                return ["React", "Vue", "Angular", "Svelte"].filter((item) =>
                  item.toLowerCase().includes(keyword.toLowerCase())
                );
              }}
            />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={l.disabled.title}
            code={ComboboxDisabledRaw}
          >
            <div className="space-y-4">
              <Combobox
                options={["Option 1", "Option 2", "Option 3"]}
                disabled
                placeholder="Disabled"
              />
              <Combobox
                options={["Option 1", "Option 2", "Option 3"]}
                invalid
                placeholder="Invalid"
              />
            </div>
          </DemoSection>

          <DemoSection
            id="clearable"
            title={l.clearable.title}
            code={ComboboxClearableRaw}
          >
            <Combobox
              options={["Option 1", "Option 2", "Option 3"]}
              defaultValue="Option 1"
              clearable
            />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-48"
            parts={[
              { id: "anatomy-container", label: l.anatomy.container },
              { id: "anatomy-input", label: l.anatomy.input },
              { id: "anatomy-clear", label: l.anatomy.clear },
              { id: "anatomy-dropdown", label: l.anatomy.dropdown },
              { id: "anatomy-option", label: l.anatomy.option },
            ]}
          >
            <Combobox
              options={["Option 1", "Option 2", "Option 3"]}
              defaultValue="Option 1"
              slotProps={{
                container: {
                  style: { width: "256px" },
                },
              }}
            />
          </Anatomy>
        </section>

        <section id="api" data-anchor-id="api" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.api}
          </Title>
          <APITable sections={comboboxSections} />
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
          <Anchor.Section
            href="#installation"
            linkText={lang.installation}
          />
          <Anchor.Section
            href="#examples"
            linkText={lang.examples}
          >
            <Anchor.Item href="#basic">{l.basic.title}</Anchor.Item>
            <Anchor.Item href="#async">{l.async.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{l.disabled.title}</Anchor.Item>
            <Anchor.Item href="#clearable">{l.clearable.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section
            href="#anatomy"
            linkText={lang.anatomy}
          />
          <Anchor.Section
            href="#api"
            linkText={lang.api}
          />
        </Anchor>
      </aside>
    </div>
  );
}
