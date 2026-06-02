import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  ShikiCodeBlock,
  Button,
  APITable,
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

import { CarouselBasic, CarouselAutoPlay, CarouselLoop } from "./examples/index";
import CarouselBasicRaw from "./examples/carousel-basic.tsx?raw";
import CarouselAutoPlayRaw from "./examples/carousel-autoplay.tsx?raw";
import CarouselLoopRaw from "./examples/carousel-loop.tsx?raw";
import carouselDoc from "./doc.mdx?raw";
import carouselSrc from "@/component/ui/carousel.tsx?raw";

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

export default function CarouselPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.carousel;
  const nav = getComponentNav("/components/carousel", locale as "zh" | "en");

  const carouselSections = [
    {
      title: l.api.sectionTitles.carouselProps,
      data: [
        {
          props: "activeIndex",
          type: "number",
          default: "-",
          description: l.api.props.activeIndex,
        },
        {
          props: "autoPlay",
          type: "boolean",
          default: "false",
          description: l.api.props.autoPlay,
        },
        {
          props: "autoPlayInterval",
          type: "number",
          default: "3000",
          description: l.api.props.autoPlayInterval,
        },
        {
          props: "loop",
          type: "boolean",
          default: "false",
          description: l.api.props.loop,
        },
        {
          props: "onChange",
          type: "(index: number) => void",
          default: "-",
          description: l.api.props.onChange,
        },
        {
          props: "slotProps.slide",
          type: "DivProps",
          default: "-",
          description: l.api.props.slotPropsSlide,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(carouselDoc);
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

        <section className="mb-8">
          <Title as="h2" id="installation" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{carouselSrc}</ShikiCodeBlock>
        </section>

        <section>
          <Title as="h2" id="examples">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={CarouselBasicRaw}
          >
            <CarouselBasic />
          </DemoSection>

          <DemoSection
            id="autoplay"
            title={l.autoPlay.title}
            code={CarouselAutoPlayRaw}
          >
            <CarouselAutoPlay />
          </DemoSection>

          <DemoSection
            id="loop"
            title={l.loop.title}
            code={CarouselLoopRaw}
          >
            <CarouselLoop />
          </DemoSection>
        </section>

        <section className="mt-12 space-y-8">
          <Title as="h2" id="api" className="mb-4">
            {lang.api}
          </Title>
          <APITable sections={carouselSections} />
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
            <Anchor.Item href="#autoplay">{l.autoPlay.title}</Anchor.Item>
            <Anchor.Item href="#loop">{l.loop.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#api" linkText={lang.api} />
        </Anchor>
      </aside>
    </div>
  );
}
