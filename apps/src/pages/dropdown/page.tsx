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
  Toaster,
  Dropdown,
} from "@/component";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import { CheckIcon, CopyIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import DropdownBasicRaw from "./examples/dropdown-basic.tsx?raw";
import DropdownAlignRaw from "./examples/dropdown-align.tsx?raw";
import DropdownSideRaw from "./examples/dropdown-side.tsx?raw";
import DropdownBasic from "./examples/dropdown-basic";
import DropdownAlign from "./examples/dropdown-align";
import DropdownSide from "./examples/dropdown-side";
import DropdownSrc from "@/component/ui/dropdown.tsx?raw";
import DropdownDoc from "./doc.mdx?raw";

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

export default function DropdownPage({
  locale = "zh",
}: {
  locale?: string;
}) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang["dropdown"];
  const nav = getComponentNav(
    "/components/dropdown",
    locale as "zh" | "en",
  );

  const dropdownSections = [
    {
      title: l.api.sectionTitles.dropdownTriggerProps,

      data: [
        {
          props: "target",
          type: "string",
          description: l.api.triggerProps.target,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
      ],
    },
    {
      title: l.api.sectionTitles.dropdownContentProps,

      data: [
        {
          props: "alignX",
          type: '"start" | "center" | "end"',
          default: '"center"',
          description: l.api.contentProps.alignX,
        },
        {
          props: "alignY",
          type: '"start" | "center" | "end"',
          default: '"end"',
          description: l.api.contentProps.alignY,
        },
        {
          props: "popover",
          type: '"auto" | "manual" | "hint"',
          default: '"auto"',
          description: l.api.contentProps.popover,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
      ],
    },
    {
      title: l.api.sectionTitles.dropdownItemProps,

      data: [
        {
          props: "onClick",
          type: "() => void",

          description: l.api.slotProps.onClick,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
      ],
    },
    {
      title: l.api.sectionTitles.dropdownSeparatorProps,

      data: [
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
      ],
    },
    {
      title: l.api.sectionTitles.dropdownLabelProps,

      data: [
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(DropdownDoc);
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
          <ShikiCodeBlock>{DropdownSrc}</ShikiCodeBlock>
        </section>

        <section>
          <Title as="h2" id="examples">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={DropdownBasicRaw}
          >
            <DropdownBasic />
          </DemoSection>

          <DemoSection
            id="align"
            title={l.align.title}
            code={DropdownAlignRaw}
          >
            <DropdownAlign />
          </DemoSection>

          <DemoSection
            id="side"
            title={l.side.title}
            code={DropdownSideRaw}
          >
            <DropdownSide />
          </DemoSection>
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-32"
            parts={[
              { name: "root", label: l.anatomy.root },
              {
                name: "trigger",
                label: l.anatomy.trigger,
              },
              {
                name: "content",
                label: l.anatomy.content,
              },
              {
                name: "label",
                label: l.anatomy.label,
              },
              {
                name: "separator",
                label: l.anatomy.separator,
              },
              {
                name: "item",
                label: l.anatomy.item,
              },
            ]}
          >
            <Dropdown data-anatomy-name="root">
              <Dropdown.Trigger
                data-anatomy-name="trigger"
                className="hover:bg-accent hover:text-accent-foreground"
              >
                Open Menu
              </Dropdown.Trigger>
              <Dropdown.Content
                data-anatomy-name="content"
                popover="manual"
              >
                <Dropdown.Label data-anatomy-name="label">My Account</Dropdown.Label>
                <Dropdown.Separator data-anatomy-name="separator" />
                <Dropdown.Item data-anatomy-name="item">Profile</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item>Logout</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </Anatomy>
        </section>

        <section className="mt-12 space-y-8">
          <Title as="h2" id="api" className="mb-4">
            {lang.api}
          </Title>
          <APITable sections={dropdownSections} />
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
            <Anchor.Item href="#align">{l.align.title}</Anchor.Item>
            <Anchor.Item href="#side">{l.side.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#api" linkText={lang.api} />
        </Anchor>
      </aside>
    </div>
  );
}
