import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Anatomy,
  Button,
  Docs,
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

import AnchorBasicRaw from "./examples/anchor-basic.tsx?raw";
import anchorDoc from "./doc.mdx?raw";
import anchorSrc from "@/component/ui/anchor.tsx?raw";
import { useTheme } from "@/component";

export default function AnchorPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = React.useState(false);
  const { colorScheme } = useTheme();
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.anchor;
  const nav = getComponentNav("/components/anchor", locale as "zh" | "en");
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "theme-change", colorScheme },
        window.location.origin,
      );
    }
  }, [colorScheme]);

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
          default: '"0px 0px -80% 0px"',
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
          props: "slotProps",
          type: "object",

          description: l.api.sectionProps.slotProps,
        },
      ],
    },
    {
      title: l.api.sectionTitles.anchorItemProps,

      data: [
        {
          props: "href",
          type: "string",

          description: l.api.slotProps.href,
        },
        {
          props: "className",
          type: "ClassNameValue",

          description: lang.common.className,
        },
      ],
    },
    {
      title: l.api.sectionTitles.slotPropsConfig,

      data: [
        {
          props: "link",
          type: 'Omit<React.ComponentProps<"a">, "href" | "onClick">',

          description: l.api.slotPropsConfig.link,
        },
        {
          props: "nav",
          type: 'Omit<React.ComponentProps<"nav">, "aria-label">',

          description: l.api.slotPropsConfig.nav,
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

        <section id="installation" className="mb-8 scroll-mt-30">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{anchorSrc}</ShikiCodeBlock>
        </section>

        <section id="scroll-behavior" className="mb-8">
          <Title as="h2">{l.scrollBehavior.title}</Title>
          <div className="space-y-4 text-sm">
            <p>{l.scrollBehavior.description}</p>
            <ShikiCodeBlock>{`<section id="installation" className="scroll-mt-[80px]">
  {/* Adjust the value based on your header height */}
</section>`}</ShikiCodeBlock>
            <p className="text-muted-foreground">{l.scrollBehavior.note}</p>
          </div>
        </section>
        <section
          id="examples"
          data-anchor-id="examples"
          className="space-y-4 py-4"
        >
          <div>
            <Title as="h2">{lang.examples}</Title>
          </div>
          <div className="border rounded-lg p-6 w-full overflow-x-auto">
            <iframe
              ref={iframeRef}
              src="/components/anchor/demo"
              title="Anchor Demo"
              className="w-full border border-gray-200 rounded-lg overflow-hidden h-[400px]"
            />
          </div>
          <ShikiCodeBlock>{AnchorBasicRaw}</ShikiCodeBlock>
          <Description>{l.examples.description}</Description>
        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>

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
            <Anchor className="max-w-xs" id="anatomy-anchor" inert>
              <Anchor.Section
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

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={anchorSections} />
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
          <Anchor.Section
            href="#scroll-behavior"
            linkText={l.scrollBehavior.title}
          />
          <Anchor.Section href="#examples" linkText={lang.examples} />
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
