import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib";
import {
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Anatomy,
  Button,
  Tabs,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages";
import { getComponentNav } from "@/pages/config/routes";
import {
  TabsBasic,
  TabsControlled,
  TabsVertical,
  TabsDisabled,
  TabsStyled,
} from "./examples";

import TabsBasicRaw from "./examples/tabs-basic.tsx?raw";
import TabsControlledRaw from "./examples/tabs-controlled.tsx?raw";
import TabsVerticalRaw from "./examples/tabs-vertical.tsx?raw";
import TabsDisabledRaw from "./examples/tabs-disabled.tsx?raw";
import TabsStyledRaw from "./examples/tabs-styled.tsx?raw";
import tabsDoc from "./doc.mdx?raw";
import tabsSrc from "@/component/ui/tabs.tsx?raw";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CopyIcon } from "lucide-react";

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

export default function TabsPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.tabs;

  const tabsSections = [
    {
      title: l.api.sectionTitles.tabsProps,
      data: [
        {
          props: "options",
          type: "Array<{ value: T, label: ReactNode, children: ReactNode, disabled?: boolean }>",
          description: l.api.props.options,
        },
        {
          props: "defaultValue",
          type: "T",
          default: "options[0]?.value",
          description: l.api.props.defaultValue,
        },
        {
          props: "value",
          type: "T",
          description: l.api.props.value,
        },
        {
          props: "onValueChange",
          type: "(value: T) => void",
          description: l.api.props.onValueChange,
        },
        {
          props: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: l.api.props.orientation,
        },
        {
          props: "activationMode",
          type: '"automatic" | "manual"',
          default: '"automatic"',
          description: l.api.props.activationMode,
        },
        {
          props: "className",
          type: "ClassNameValue",
          description: lang.common.className,
        },
        {
          props: "slotProps",
          type: "{ list?: DivProps, trigger?: ButtonProps, content?: DivProps }",
          description: l.api.props.slotProps,
        },
      ],
    },
    {
      title: l.api.sectionTitles.slotPropsConfig,
      data: [
        {
          props: "list",
          type: 'React.ComponentProps<"div">',
          description: l.api.slotPropsConfig.list,
        },
        {
          props: "trigger",
          type: 'React.ComponentProps<"button">',
          description: l.api.slotPropsConfig.trigger,
        },
        {
          props: "content",
          type: 'React.ComponentProps<"div">',
          description: l.api.slotPropsConfig.content,
        },
      ],
    },
  ];

  const nav = getComponentNav("/components/tabs", locale as "zh" | "en");

  const handleCopy = () => {
    navigator.clipboard.writeText(tabsDoc);
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
            <Title as="h1">{lang.tabs.title}</Title>
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
          <Description>{lang.tabs.description}</Description>
        </header>

        <section id="installation" className="mb-8 ">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{tabsSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" >
          <Title as="h2">{lang.examples}</Title>
          <DemoSection
            id="basic"
            title={lang.tabs.basic.title}
            code={TabsBasicRaw}
          >
            <TabsBasic />
          </DemoSection>

          <DemoSection
            id="controlled"
            title={lang.tabs.controlled.title}
            code={TabsControlledRaw}
          >
            <TabsControlled />
          </DemoSection>

          <DemoSection
            id="vertical"
            title={lang.tabs.vertical.title}
            code={TabsVerticalRaw}
          >
            <TabsVertical />
          </DemoSection>

          <DemoSection
            id="disabled"
            title={lang.tabs.disabled.title}
            code={TabsDisabledRaw}
          >
            <TabsDisabled />
          </DemoSection>

          <DemoSection
            id="styled"
            title={lang.tabs.styled.title}
            code={TabsStyledRaw}
          >
            <TabsStyled />
          </DemoSection>
        </section>

        <section id="anatomy" className=" py-4">
          <Title as="h2" className="mb-4">
            {lang.anatomy}
          </Title>
          <Anatomy
            title={lang.tabs.title}
            parts={[
              { id: "anatomy-tabs-root", label: l.anatomy.root },
              { id: "anatomy-tabs-list", label: l.anatomy.list },
              { id: "anatomy-tabs-trigger", label: l.anatomy.trigger },
              { id: "anatomy-tabs-content", label: l.anatomy.content },
            ]}
          >
            <div id="anatomy-tabs-root" className="w-full">
              <Tabs
                className="max-w-sm"
                slotProps={{
                  list: { id: "anatomy-tabs-list" },
                  trigger: { id: "anatomy-tabs-trigger" },
                  content: { id: "anatomy-tabs-content" },
                }}
                options={[
                  { value: "tab1", label: "Tab 1", children: <div className="p-4">Content 1</div> },
                  { value: "tab2", label: "Tab 2", children: <div className="p-4">Content 2</div> },
                ]}
              />
            </div>
          </Anatomy>
        </section>

        <section id="api" className=" py-4">
          <Title as="h2" className="mb-4">
            {lang.api}
          </Title>
          <div className="space-y-8">
            {tabsSections.map((section) => (
              <div key={section.title}>
                <Title as="h3" className="mb-4">
                  {section.title}
                </Title>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">
                          {lang.common.prop}
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          {lang.common.type}
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          {lang.common.default}
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          {lang.common.description}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.data.map((row, index) => (
                        <tr
                          key={row.props}
                          className={cn(
                            "border-t",
                            index % 2 === 0 ? "bg-background" : "bg-muted/20",
                          )}
                        >
                          <td className="px-4 py-3 font-mono text-primary">
                            {row.props}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {row.type}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {row.default || "-"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {row.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        <nav className="flex justify-between py-8 mt-8 border-t">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={!nav.prev}
            className="gap-2"
          >
            <ArrowLeftIcon className="size-4" />
            {nav.prev?.title}
          </Button>
          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={!nav.next}
            className="gap-2"
          >
            {nav.next?.title}
            <ArrowRightIcon className="size-4" />
          </Button>
        </nav>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-full overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#basic">{lang.tabs.basic.title}</Anchor.Item>
            <Anchor.Item href="#controlled">{lang.tabs.controlled.title}</Anchor.Item>
            <Anchor.Item href="#vertical">{lang.tabs.vertical.title}</Anchor.Item>
            <Anchor.Item href="#disabled">{lang.tabs.disabled.title}</Anchor.Item>
            <Anchor.Item href="#styled">{lang.tabs.styled.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#api" linkText={lang.api} />
        </Anchor>
      </aside>
    </div>
  );
}
