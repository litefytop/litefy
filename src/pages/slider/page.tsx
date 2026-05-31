import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
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
  SliderBasic,
  SliderControlled,
  SliderOrientation,
} from "./examples";

import SliderBasicRaw from "./examples/slider-basic.tsx?raw";
import SliderControlledRaw from "./examples/slider-controlled.tsx?raw";
import SliderOrientationRaw from "./examples/slider-orientation.tsx?raw";
import sliderSrc from "@/component/ui/slider.tsx?raw";
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
    <section
      id={id}
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

export default function SliderPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang["slider"];
  const nav = getComponentNav("/components/slider", locale as "zh" | "en");

  const sliderSections = [
    {
      title: l.api.sectionTitles.sliderProps,

      data: [
        {
          props: "value",
          type: "number",
          description: l.api.props.value,
        },
        {
          props: "defaultValue",
          type: "number",
          default: "0",
          description: l.api.props.defaultValue,
        },
        {
          props: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: l.api.props.orientation,
        },
        {
          props: "disabled",
          type: "boolean",
          default: "false",
          description: l.api.props.disabled,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(sliderSrc);
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

        <section id="installation" className="mb-8 ">
          <Title as="h2" className="mb-4">
            {lang.installation}
          </Title>
          <ShikiCodeBlock>{sliderSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" >
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="basic"
            title={l.basic.title}
            code={SliderBasicRaw}
          >
            <SliderBasic />
          </DemoSection>

          <DemoSection
            id="controlled"
            title={l.controlled.title}
            code={SliderControlledRaw}
          >
            <SliderControlled />
          </DemoSection>

          <DemoSection
            id="orientation"
            title={l.orientation.title}
            code={SliderOrientationRaw}
          >
            <SliderOrientation />
          </DemoSection>
        </section>



        <section id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={sliderSections} />
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
            <Anchor.Item href="#controlled">{l.controlled.title}</Anchor.Item>
            <Anchor.Item href="#orientation">{l.orientation.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.docs}/>
        </Anchor>
      </aside>
    </div>
  );
}
