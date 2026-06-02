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
import { CheckIcon, CopyIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import {
  ToastTypes,
  ToastWithDescription,
  ToastDuration,
  ToastWithIcon,
  ToastWithActions,
  ToastDismiss,
  ToastWithCallbacks,
} from "./examples";
import ToastTypesRaw from "./examples/toast-types.tsx?raw";
import ToastWithDescriptionRaw from "./examples/toast-description.tsx?raw";
import ToastDurationRaw from "./examples/toast-duration.tsx?raw";
import ToastWithIconRaw from "./examples/toast-icon.tsx?raw";
import ToastWithActionsRaw from "./examples/toast-actions.tsx?raw";
import ToastDismissRaw from "./examples/toast-dismiss.tsx?raw";
import ToastWithCallbacksRaw from "./examples/toast-callbacks.tsx?raw";
import toastDoc from "./doc.mdx?raw";
import toastSrc from "@/component/ui/toast.tsx?raw";

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

export default function ToastPage({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lang = t(locale as "zh" | "en");
  const l = lang.toast;
  const nav = getComponentNav("/components/toast", locale as "zh" | "en");

  const toastSections = [
    {
      title: l.api.sectionTitles.toastOptions,
      columns: [
        { key: "prop", header: lang.common.prop },
        { key: "type", header: lang.common.type },
        { key: "default", header: lang.common.default },
        { key: "description", header: lang.common.description },
      ],
      data: [
        {
          props: "type",
          type: `'success' | 'error' | 'warning' | 'info' | 'loading'`,
          default: "-",
          description: l.api.toastOptions.type,
        },
        {
          props: "title",
          type: "ReactNode",
          default: "-",
          description: l.api.toastOptions.title,
        },
        {
          props: "description",
          type: "ReactNode",
          default: "-",
          description: l.api.toastOptions.description,
        },
        {
          props: "icon",
          type: "ReactNode",
          default: "-",
          description: l.api.toastOptions.icon,
        },
        {
          props: "duration",
          type: "number",
          default: "3000",
          description: l.api.toastOptions.duration,
        },
        {
          props: "onDismiss",
          type: "(toast: Toast) => void",
          default: "-",
          description: l.api.toastOptions.onDismiss,
        },
        {
          props: "onAutoClose",
          type: "(toast: Toast) => void",
          default: "-",
          description: l.api.toastOptions.onAutoClose,
        },
        {
          props: "actions",
          type: "Array<ButtonProps & { onClick?: (dismiss: () => void) => void }>",
          default: "-",
          description: l.api.toastOptions.actions,
        },
      ],
    },
    {
      title: l.api.sectionTitles.toasterProps,
      columns: [
        { key: "prop", header: lang.common.prop },
        { key: "type", header: lang.common.type },
        { key: "default", header: lang.common.default },
        { key: "description", header: lang.common.description },
      ],
      data: [
        {
          props: "position",
          type: `"top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"`,
          default: '"top-right"',
          description: l.api.toasterProps.position,
        },
        {
          props: "visibleToasts",
          type: "number",
          default: "3",
          description: l.api.toasterProps.visibleToasts,
        },
      ],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(toastDoc);
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
          <ShikiCodeBlock>{toastSrc}</ShikiCodeBlock>
        </section>

        <section id="examples" >
          <Title as="h2">{lang.examples}</Title>

          <DemoSection
            id="types"
            title={l.types.title}
            code={ToastTypesRaw}
          >
            <ToastTypes />
          </DemoSection>

          <DemoSection
            id="description"
            title={l.descriptionText.title}
            code={ToastWithDescriptionRaw}
          >
            <ToastWithDescription />
          </DemoSection>

          <DemoSection
            id="duration"
            title={l.duration.title}
            code={ToastDurationRaw}
          >
            <ToastDuration />
          </DemoSection>

          <DemoSection
            id="icon"
            title={l.icon.title}
            code={ToastWithIconRaw}
          >
            <ToastWithIcon />
          </DemoSection>

          <DemoSection
            id="actions"
            title={l.actions.title}
            code={ToastWithActionsRaw}
          >
            <ToastWithActions />
          </DemoSection>

          <DemoSection
            id="dismiss"
            title={l.dismiss.title}
            code={ToastDismissRaw}
          >
            <ToastDismiss />
          </DemoSection>

          <DemoSection
            id="callbacks"
            title={l.callbacks.title}
            code={ToastWithCallbacksRaw}
          >
            <ToastWithCallbacks />
          </DemoSection>
        </section>

        <section id="docs" className="mt-12 space-y-8">
          <Title as="h2" className="mb-4">
            {lang.docs}
          </Title>
          <APITable sections={toastSections} />
        </section>
      </div>

      <aside className="hidden xl:block w-64 border-l bg-card fixed top-14 right-0 h-full overflow-y-auto p-4">
        <Anchor>
          <Anchor.Section href="#installation" linkText={lang.installation} />
          <Anchor.Section href="#examples" linkText={lang.examples}>
            <Anchor.Item href="#types">{l.types.title}</Anchor.Item>
            <Anchor.Item href="#description">{l.descriptionText.title}</Anchor.Item>
            <Anchor.Item href="#duration">{l.duration.title}</Anchor.Item>
            <Anchor.Item href="#icon">{l.icon.title}</Anchor.Item>
            <Anchor.Item href="#actions">{l.actions.title}</Anchor.Item>
            <Anchor.Item href="#dismiss">{l.dismiss.title}</Anchor.Item>
            <Anchor.Item href="#callbacks">{l.callbacks.title}</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#docs" linkText={lang.docs} />
        </Anchor>
      </aside>
    </div>
  );
}
