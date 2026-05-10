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
  ShikiCodeBlock,
  Anatomy,
  Button,
  Docs,
  Toaster
} from "@/component";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/component";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";

import DropdownMenuBasicRaw from "./examples/dropdown-menu-basic.tsx?raw";
import DropdownMenuAlignRaw from "./examples/dropdown-menu-align.tsx?raw";
import DropdownMenuSideRaw from "./examples/dropdown-menu-side.tsx?raw";
import DropdownMenuBasic from "./examples/dropdown-menu-basic";
import DropdownMenuAlign from "./examples/dropdown-menu-align";
import DropdownMenuSide from "./examples/dropdown-menu-side";
import dropdownMenuSrc from "@/component/ui/dropdown-menu.tsx?raw";
import dropdownMenuDoc from "./doc.mdx?raw";

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

export default function DropdownMenuPage({
  locale = "zh",
}: {
  locale?: string;
}) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang["dropdown-menu"];
  const nav = getComponentNav("/components/dropdown-menu", locale as "zh" | "en");

  const dropdownMenuSections = [
    {
      title: l.api.sectionTitles.dropdownMenuProps,
      columns: [
        { key: "prop", header: l.api.headers.prop },
        { key: "type", header: l.api.headers.type },
        { key: "default", header: l.api.headers.default },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "children",
          type: "ReactNode",
          default: "-",
          description: l.api.dropdownMenuProps.children,
        },

      ],
    },
    {
      title: l.api.sectionTitles.dropdownMenuTriggerProps,
      columns: [
        { key: "prop", header: l.api.headers.prop },
        { key: "type", header: l.api.headers.type },
        { key: "default", header: l.api.headers.default },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "children",
          type: "ReactNode",
          default: "-",
          description: l.api.triggerProps.children,
        },

        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.triggerProps.disabled,
        },
        {
          props: "variant",
          type: '"primary" | "secondary" | "ghost" | "link"',
          default: '"primary"',
          description: l.api.triggerProps.variant,
        },
      ],
    },
    {
      title: l.api.sectionTitles.dropdownMenuContentProps,
      columns: [
        { key: "prop", header: l.api.headers.prop },
        { key: "type", header: l.api.headers.type },
        { key: "default", header: l.api.headers.default },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "children",
          type: "ReactNode",
          default: "-",
          description: l.api.contentProps.children,
        },
   
        {
          props: "popover",
          type: '"auto" | "manual"',
          default: '"auto"',
          description: l.api.contentProps.popover,
        },
        {
          props: "side",
          type: '"top" | "bottom" | "left" | "right"',
          default: '"bottom"',
          description: l.api.contentProps.side,
        },
        {
          props: "align",
          type: '"start" | "center" | "end"',
          default: '"center"',
          description: l.api.contentProps.align,
        },
      ],
    },
    {
      title: l.api.sectionTitles.dropdownMenuItemProps,
      columns: [
        { key: "prop", header: l.api.headers.prop },
        { key: "type", header: l.api.headers.type },
        { key: "default", header: l.api.headers.default },
        { key: "description", header: l.api.headers.description },
      ],
      data: [
        {
          props: "children",
          type: "ReactNode",
          default: "-",
          description: l.api.itemProps.children,
        },

        {
          props: "onClick",
          type: "() => void",
          default: "-",
          description: l.api.itemProps.onClick,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.itemProps.disabled,
        },
      ],
    },
    {
      title: l.api.sectionTitles.dropdownMenuSeparatorProps,
      columns: [
        { key: "prop", header: l.api.headers.prop },
        { key: "type", header: l.api.headers.type },
        { key: "default", header: l.api.headers.default },
        { key: "description", header: l.api.headers.description },
      ],
      data: [

      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(dropdownMenuDoc);
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
          <ShikiCodeBlock>{dropdownMenuSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={DropdownMenuBasicRaw}
          >
            <DropdownMenuBasic />
          </DemoSection>

          <DemoSection
            id="align"
            title={l.align.title}
            code={DropdownMenuAlignRaw}
          >
            <DropdownMenuAlign />
          </DemoSection>

          <DemoSection
            id="side"
            title={l.side.title}
            code={DropdownMenuSideRaw}
          >
            <DropdownMenuSide />
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
            ]}
          >
            <DropdownMenu data-anatomy-name="root">
              <DropdownMenuTrigger data-anatomy-name="trigger" variant="ghost">
                打开菜单
              </DropdownMenuTrigger>
              <DropdownMenuContent data-anatomy-name="content" popover="manual">
                <DropdownMenuItem>选项</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Anatomy>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={dropdownMenuSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">
              {l.basic.title}
            </Anchor.Item>
            <Anchor.Item href="#align">
              {l.align.title}
            </Anchor.Item>
            <Anchor.Item href="#side">
              {l.side.title}
            </Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
