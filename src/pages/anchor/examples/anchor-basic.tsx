import { Anchor } from "@/component";
import { useEffect, useRef } from "react";

export default function AnchorDemoPage() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "theme-change") {
        const root = document.documentElement;
        if (event.data.colorScheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="flex" id="anchor-demo">
      <main ref={mainRef} id="main" className="flex-1 w-full overflow-y-auto h-screen">
        <section
          id="overview"
          className="h-[150vh] bg-red-200 flex flex-col justify-center p-6 border-b-2 border-red-300"
        >
          <h1 className="text-xl font-bold mb-2 text-red-950">🔴 Overview</h1>
          <p className="text-sm text-red-900">
            Anchor navigation component with scroll tracking
          </p>
        </section>

        <section
          id="installation"
          className="h-[150vh] bg-orange-200 flex flex-col justify-center p-6 border-b-2 border-orange-300"
        >
          <h2 className="text-lg font-bold mb-2 text-orange-950">🟠 Installation</h2>
          <code className="text-xs bg-orange-300 text-orange-950 px-2 py-1 w-fit font-mono">
            import &#123; Anchor &#125; from &quot;@/component&quot;
          </code>
        </section>

        <section id="usage">
          <div
            id="basic-usage"
            className="h-[150vh] bg-yellow-200 flex flex-col justify-center p-6 border-b-2 border-yellow-300"
          >
            <h3 className="text-base font-semibold mb-1 text-yellow-950">🟡 Basic Usage</h3>
            <p className="text-xs text-yellow-900">
              Wrap content with Anchor component
            </p>
          </div>

          <div
            id="sections-api"
            className="h-40 bg-green-200 flex flex-col justify-center p-6 border-b-2 border-green-300"
          >
            <h3 className="text-base font-semibold mb-1 text-green-950">🟢 Sections & Items</h3>
            <p className="text-xs text-green-900">
              Anchor.Section and Anchor.Item subcomponents
            </p>
          </div>

          <div
            id="customization"
            className="h-40 bg-cyan-200 flex flex-col justify-center p-6 border-b-2 border-cyan-300"
          >
            <h3 className="text-base font-semibold mb-1 text-cyan-950">🔵 Customization</h3>
            <p className="text-xs text-cyan-900">
              className prop for Tailwind styling
            </p>
          </div>
        </section>

        <section id="api-reference">
          <div
            id="anchor-props"
            className="h-36 bg-blue-200 flex flex-col justify-center p-6 border-b-2 border-blue-300"
          >
            <h3 className="text-base font-semibold mb-1 text-blue-950">
              🔷 Anchor Props
            </h3>
            <p className="text-xs text-blue-900">className, children</p>
          </div>

          <div
            id="section-props"
            className="h-36 bg-indigo-200 flex flex-col justify-center p-6 border-b-2 border-indigo-300"
          >
            <h3 className="text-base font-semibold mb-1 text-indigo-950">
              🟣 Section Props
            </h3>
            <p className="text-xs text-indigo-900">
              href, title, itemProps
            </p>
          </div>
        </section>

        <section
          id="examples"
          className="h-48 bg-purple-200 flex flex-col justify-center p-6 border-b-2 border-purple-300"
        >
          <h2 className="text-lg font-bold mb-2 text-purple-950">🟣 Examples</h2>
          <p className="text-sm text-purple-900">
            Complete usage examples and patterns
          </p>
        </section>

        <section
          id="conclusion"
          className="h-48 bg-pink-200 flex flex-col justify-center p-6"
        >
          <h2 className="text-lg font-bold mb-2 text-pink-950">🩷 Conclusion</h2>
          <p className="text-sm text-pink-900">
            Scroll to see the active section highlight in the sidebar
          </p>
        </section>
      </main>

      <aside className="hidden sm:block w-56 border-l bg-card fixed right-0 h-full overflow-y-auto p-3">
        <Anchor root={mainRef}>
          <Anchor.Section href="#overview" linkText="🔴 Overview" />
          <Anchor.Section href="#installation" linkText="🟠 Installation" />
          <Anchor.Section linkText="🟡 Usage">
            <Anchor.Item href="#basic-usage">Basic Usage</Anchor.Item>
            <Anchor.Item href="#sections-api">Sections API</Anchor.Item>
            <Anchor.Item href="#customization">Customization</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section linkText="🔷 API Reference">
            <Anchor.Item href="#anchor-props">Anchor Props</Anchor.Item>
            <Anchor.Item href="#section-props">Section Props</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#examples" linkText="🟣 Examples" />
          <Anchor.Section href="#conclusion" linkText="🩷 Conclusion" />
        </Anchor>
      </aside>
    </div>
  );
}
