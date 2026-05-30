import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Title,
  Description,
  ShikiCodeBlock,
  Button,
  Docs,
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
          props: "itemProps.slide",
          type: "DivProps",
          default: "-",
          description: l.api.props.itemPropsSlide,
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

        <section id="installation" className="mb-8 scroll-mt-20">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{carouselSrc}</ShikiCodeBlock>
        </section>

        <section id="examples">
          <Title as="h2">{lang.examples}</Title>

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

        <Docs sections={carouselSections} />
      </div>
    </div>
  );
}
