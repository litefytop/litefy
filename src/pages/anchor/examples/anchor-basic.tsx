import { Anchor } from "@/component";
import { useRef } from "react";

export default function AnchorDemoPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full w-full" id="anchor-demo">
      <div
        ref={mainRef}
        id="anchor-content"
        className="flex-1 w-full overflow-y-auto"
      >
        <section
          id="anchor-overview"
          className="h-64 bg-red-200 flex flex-col justify-center p-6 border-b-2 border-red-300"
        >
          <h1 className="text-xl font-bold mb-2 text-red-950">🔴 Overview</h1>
          <p className="text-sm text-red-900">
            Anchor navigation component with scroll tracking
          </p>
        </section>

        <section
          id="anchor-installation"
          className="h-64 bg-orange-200 flex flex-col justify-center p-6 border-b-2 border-orange-300"
        >
          <h2 className="text-lg font-bold mb-2 text-orange-950">
            🟠 Installation
          </h2>
          <code className="text-xs bg-orange-300 text-orange-950 px-2 py-1 w-fit font-mono">
            import &#123; Anchor &#125; from &quot;@/component&quot;
          </code>
        </section>

        <section id="anchor-usage">
          <div
            id="anchor-basic-usage"
            className="h-64 bg-yellow-200 flex flex-col justify-center p-6 border-b-2 border-yellow-300"
          >
            <h3 className="text-base font-semibold mb-1 text-yellow-950">
              🟡 Basic Usage
            </h3>
            <p className="text-xs text-yellow-900">
              Wrap content with Anchor component
            </p>
          </div>

          <div
            id="anchor-sections-api"
            className="h-40 bg-green-200 flex flex-col justify-center p-6 border-b-2 border-green-300"
          >
            <h3 className="text-base font-semibold mb-1 text-green-950">
              🟢 Sections & Items
            </h3>
            <p className="text-xs text-green-900">
              Anchor.Section and Anchor.Item subcomponents
            </p>
          </div>

          <div
            id="anchor-customization"
            className="h-40 bg-cyan-200 flex flex-col justify-center p-6 border-b-2 border-cyan-300"
          >
            <h3 className="text-base font-semibold mb-1 text-cyan-950">
              🔵 Customization
            </h3>
            <p className="text-xs text-cyan-900">
              className prop for Tailwind styling
            </p>
          </div>
        </section>

        <section id="anchor-api-reference">
          <div
            id="anchor-props-ref"
            className="h-36 bg-indigo-200 flex flex-col justify-center p-6 border-b-2 border-indigo-300"
          >
            <h3 className="text-base font-semibold mb-1 text-indigo-950">
              🟣 Anchor Props
            </h3>
            <p className="text-xs text-indigo-900">className, children</p>
          </div>
        </section>

        <section
          id="anchor-examples"
          className="h-48 bg-purple-200 flex flex-col justify-center p-6 border-b-2 border-purple-300"
        >
          <h2 className="text-lg font-bold mb-2 text-purple-950">
            💜 Examples
          </h2>
          <p className="text-sm text-purple-900">
            Complete usage examples and patterns
          </p>
        </section>
      </div>

      <aside className="hidden sm:block w-56 border-l bg-card h-full overflow-y-auto p-3">
        <Anchor root={mainRef}>
          <Anchor.Section href="#anchor-overview" linkText="🔴 Overview" />
          <Anchor.Section
            href="#anchor-installation"
            linkText="🟠 Installation"
          />
          <Anchor.Section linkText="Usage">
            <Anchor.Item href="#anchor-basic-usage">🟡 Basic Usage</Anchor.Item>
            <Anchor.Item href="#anchor-sections-api">
              🟢 Sections & Items
            </Anchor.Item>
            <Anchor.Item href="#anchor-customization">
              🔵 Customization
            </Anchor.Item>
          </Anchor.Section>
          <Anchor.Section linkText="API Reference">
            <Anchor.Item href="#anchor-section-props">
              🟣 Section Props
            </Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#anchor-examples" linkText="💜 Examples" />
        </Anchor>
      </aside>
    </div>
  );
}
