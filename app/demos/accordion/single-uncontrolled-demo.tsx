"use client";

import { Accordion } from "@/ui/accordion";

export default function SingleUncontrolledDemo() {
  return (
    <Accordion className="w-md">
      <Accordion.Item value="item-1" label="What is Litefy?">
        <p className="text-muted-foreground">
          Litefy is a lightweight component library built with React and
          Tailwind CSS. It provides a collection of accessible, customizable
          components for building modern web applications.
        </p>
      </Accordion.Item>
      <Accordion.Item value="item-2" label="How do I install it?">
        <p className="text-muted-foreground">
          Run
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
            npx litefy add accordion
          </code>
          to install the accordion component. Make sure you have Tailwind CSS
          configured in your project.
        </p>
      </Accordion.Item>
      <Accordion.Item value="item-3" label="Is it accessible?">
        <p className="text-muted-foreground">
          Yes! All components follow WAI-ARIA guidelines with proper keyboard
          navigation, screen reader support, and focus management built-in.
        </p>
      </Accordion.Item>
    </Accordion>
  );
}
