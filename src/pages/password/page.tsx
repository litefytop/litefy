import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Title,
  Description,
  Password,
  ShikiCodeBlock,
  Anatomy,
  Button,
  Docs,
} from "@/component";
import { Toaster } from "@/component/ui/toast";
import { t } from "@/pages/config/i18n";
import { getComponentNav } from "@/pages/config/routes";
import {
  PasswordBasic,

  PasswordControlled,
} from "./examples";
import {
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

import PasswordBasicRaw from "./examples/password-basic.tsx?raw";

import PasswordControlledRaw from "./examples/password-controlled.tsx?raw";
import passwordDoc from "./doc.mdx?raw";
import passwordSrc from "@/component/ui/password.tsx?raw";

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

export default function PasswordPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.password;
  const nav = getComponentNav("/components/password", locale as "zh" | "en");

  const passwordSections = [
    {
      title: l.api.sectionTitles.passwordProps,

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
          type: "(e: React.ChangeEvent<HTMLInputElement>) => void | { invalid?: string }",
          description: l.api.props.onChange,
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
          props: "invalid",
          type: "ReactNode",
          description: l.api.props.invalid,
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
          props: "slotProps",
          type: "object",
          description: l.api.props.slotProps,
        },
      ],
    },
    {
      title: l.api.sectionTitles.slotPropsConfig,

      data: [
        {
          props: "group",
          type: 'ComponentProps<"div">',
          description: l.api.slotPropsConfig.group,
        },

        {
          props: "toggle",
          type: 'ComponentProps<"button">',
          description: l.api.slotPropsConfig.toggle,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(passwordDoc);
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
          <ShikiCodeBlock>{passwordSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" className="">
          <Title as="h2">{lang.examples}</Title>

          <DemoSection id="basic" title={l.basic.title} code={PasswordBasicRaw}>
            <PasswordBasic />
          </DemoSection>

          <DemoSection
            id="controlled"
            title={l.controlled.title}
            code={PasswordControlledRaw}
          >
            <PasswordControlled />
          </DemoSection>


        </section>

        <section id="anatomy" className="mt-8 space-y-4">
          <Title as="h2">{lang.anatomy}</Title>
          <Anatomy
            className="h-32"
            parts={[
              { name: "group", label: l.anatomy.group },
              { name: "input", label: l.anatomy.input },
              { name: "toggle", label: l.anatomy.toggle },
            ]}
          >
            <Password
              data-anatomy-name="input"
              placeholder="请输入密码"
              slotProps={{
                toggle: { "data-anatomy-name": "toggle" },
                group: { "data-anatomy-name": "group" },
              }}
            />
          </Anatomy>
        </section>

        <section id="docs" data-anchor-id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <Docs sections={passwordSections} />
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
          </Anchor.Section>
          <Anchor.Section href="#anatomy" linkText={lang.anatomy} />
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
