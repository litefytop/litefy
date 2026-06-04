import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Anatomy,
  Button,
  APITable,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages";
import { getComponentNav } from "@/pages/config/routes";
import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";
import { AnchorBasic } from "./examples";
import AnchorBasicRaw from "./examples/anchor-basic.tsx?raw";
import anchorDoc from "./doc.mdx?raw";
import anchorSrc from "@/component/ui/anchor.tsx?raw";

export default function AnchorPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = React.useState(false);

  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.anchor;
  const nav = getComponentNav("/components/anchor", locale as "zh" | "en");

  const anchorSections = [
    {
      title: l.api.sectionTitles.anchorProps,
      data: [
        {
          props: "className",
          type: "ClassNameValue",

          description: lang.common.className,
        },
        {
          props: "rootMargin",
          type: "string",
          default: '"0px 0px -90% 0px"',
          description: l.api.props.rootMargin,
        },
        {
          props: "root",
          type: "Element | Document | null | RefObject<Element | Document | null>",
          default: "null",
          description: l.api.props.root,
        },
      ],
    },
    {
      title: l.api.sectionTitles.anchorSectionProps,
      data: [
        {
          props: "href",
          type: "string",

          description: l.api.sectionProps.href,
        },
        {
          props: "linkText",
          type: "string",

          description: l.api.sectionProps.linkText,
        },
        {
          props: "children",
          type: "ReactNode",
          description: l.api.sectionProps.children,
        },
        {
          props: "slotProps",
          type: "object",
          description: l.api.sectionProps.slotProps,
        },
      ],
    },
    {
      title: l.api.sectionTitles.sectionSlotPropsConfig,
      data: [
        {
          props: "wrapper",
          type: 'React.ComponentProps<"li">',
          description: l.api.sectionSlotPropsConfig.wrapper,
        },
        {
          props: "link",
          type: 'React.ComponentProps<"a">, "href" | "children"',

          description: l.api.sectionSlotPropsConfig.link,
        },
        {
          props: "subList",
          type: 'React.ComponentProps<"ul">',

          description: l.api.sectionSlotPropsConfig.subList,
        },
      ],
    },
    {
      title: l.api.sectionTitles.anchorItemProps,
      data: [
        {
          props: "href",
          type: "string",

          description: l.api.itemProps.href,
        },
        {
          props: "children",
          type: "ReactNode",

          description: l.api.itemProps.children,
        },
      ],
    },
    {
      title: l.api.sectionTitles.itemSlotPropsConfig,
      data: [
        {
          props: "link",
          type: 'Omit<React.ComponentProps<"a">, "href" | "children">',

          description: l.api.itemSlotPropsConfig.link,
        },
        {
          props: "wrapper",
          type: 'React.ComponentProps<"li">',

          description: l.api.itemSlotPropsConfig.wrapper,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(anchorDoc);
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
          <ShikiCodeBlock>{anchorSrc}</ShikiCodeBlock>
        </section>

        <section>
          <Title as="h2" id="examples">
            {lang.examples}
          </Title>
          <section className="space-y-4 py-4">
            <div className="border rounded-lg p-6 w-full overflow-x-auto h-[600px]">
              <AnchorBasic />
            </div>
            <ShikiCodeBlock>{AnchorBasicRaw}</ShikiCodeBlock>
          </section>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <Title as="h3" className="mb-2 text-lg">
              {l.usageNotes.title}
            </Title>
            <p className="text-muted-foreground mb-2">
              {l.usageNotes.description}
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>{l.usageNotes.points.sameLevel}</li>
              <li>{l.usageNotes.points.discontinuous}</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <Title as="h2" id="anatomy">
            {lang.anatomy}
          </Title>

          <Anatomy
            parts={[
              {
                title: "Section",
                items: [
                  { id: "anatomy-section", label: l.anatomy.section.wrapper },
                  { id: "anatomy-section-link", label: l.anatomy.section.link },
                  {
                    id: "anatomy-section-sub-list",
                    label: l.anatomy.section.subList,
                  },
                ],
              },
              {
                title: "Item",
                items: [
                  { id: "anatomy-item", label: l.anatomy.item.wrapper },
                  { id: "anatomy-item-link", label: l.anatomy.item.link },
                ],
              },
            ]}
          >
            <Anchor className="max-w-xs" inert>
              <Anchor.Section
                href="#section1"
                linkText="section 1"
                slotProps={{
                  wrapper: {
                    id: "anatomy-section",
                    className: "p-1",
                  },
                  link: {
                    id: "anatomy-section-link",
                    className: "p-1",
                  },
                  subList: {
                    id: "anatomy-section-sub-list",
                    className: "p-1",
                  },
                }}
              >
                <Anchor.Item
                  href="#section1"
                  slotProps={{
                    wrapper: {
                      id: "anatomy-item",
                      className: "p-1",
                    },
                    link: {
                      id: "anatomy-item-link",
                      className: "p-1",
                    },
                  }}
                >
                  section 1.1
                </Anchor.Item>
              </Anchor.Section>
            </Anchor>
          </Anatomy>
        </section>

        <section id="api" className="mt-12 space-y-8">
          <Title as="h2"  className="mb-4">
            {lang.api}
          </Title>
          <APITable sections={anchorSections} />
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
          <Anchor.Section href="#examples" linkText={lang.examples} />
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#api" linkText={lang.api} />
        </Anchor>
      </aside>
    </div>
  );
}
