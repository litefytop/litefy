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
      <main ref={mainRef} id="main" className="flex-1 w-full overflow-y-auto  h-screen">
        <section
          id="overview"
          className="h-48 bg-blue-50 dark:bg-blue-950/30  flex flex-col justify-center p-6"
        >
          <h1 className="text-xl font-bold mb-2">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Anchor navigation component with scroll tracking
          </p>
        </section>

        <section
          id="installation"
          className="h-48 bg-green-50 dark:bg-green-950/30  flex flex-col justify-center p-6"
        >
          <h2 className="text-lg font-bold mb-2">Installation</h2>
          <code className="text-xs bg-muted text-muted-foreground px-2 py-1 w-fit">
            import &#123; Anchor &#125; from &quot;@/component&quot;
          </code>
        </section>

        <section id="usage" >
          <div
            id="basic-usage"
            className="h-40 bg-yellow-50 dark:bg-yellow-950/30  flex flex-col justify-center p-6"
          >
            <h3 className="text-base font-semibold mb-1">Basic Usage</h3>
            <p className="text-xs text-muted-foreground">
              Wrap content with Anchor component
            </p>
          </div>

          <div
            id="sections-api"
            className="h-40 bg-orange-50 dark:bg-orange-950/30  flex flex-col justify-center p-6"
          >
            <h3 className="text-base font-semibold mb-1">Sections & Items</h3>
            <p className="text-xs text-muted-foreground">
              Anchor.Section and Anchor.Item subcomponents
            </p>
          </div>

          <div
            id="customization"
            className="h-40 bg-purple-50 dark:bg-purple-950/30  flex flex-col justify-center p-6"
          >
            <h3 className="text-base font-semibold mb-1">Customization</h3>
            <p className="text-xs text-muted-foreground">
              className prop for Tailwind styling
            </p>
          </div>
        </section>

        <section id="api-reference" >
          <div
            id="anchor-props"
            className="h-36 bg-pink-50 dark:bg-pink-950/30  flex flex-col justify-center p-6"
          >
            <h3 className="text-base font-semibold mb-1 text-pink-600 dark:text-pink-400">
              Anchor Props
            </h3>
            <p className="text-xs text-muted-foreground">className, children</p>
          </div>

          <div
            id="section-props"
            className="h-36 bg-cyan-50 dark:bg-cyan-950/30  flex flex-col justify-center p-6"
          >
            <h3 className="text-base font-semibold mb-1 text-cyan-600 dark:text-cyan-400">
              Section Props
            </h3>
            <p className="text-xs text-muted-foreground">
              href, title, itemProps
            </p>
          </div>
        </section>

        <section
          id="examples"
          className="h-48 bg-emerald-50 dark:bg-emerald-950/30  flex flex-col justify-center p-6"
        >
          <h2 className="text-lg font-bold mb-2">Examples</h2>
          <p className="text-sm text-muted-foreground">
            Complete usage examples and patterns
          </p>
        </section>
      </main>

      <aside className="hidden sm:block w-56 border-l bg-card fixed  right-0 h-full overflow-y-auto p-3">
        <Anchor root={mainRef}>
          <Anchor.Section href="#overview" linkText="Overview" />
          <Anchor.Section href="#installation" linkText="Installation" />
          <Anchor.Section  linkText="Usage">
            <Anchor.Item href="#basic-usage">Basic Usage</Anchor.Item>
            <Anchor.Item href="#sections-api">Sections API</Anchor.Item>
            <Anchor.Item href="#customization">Customization</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section linkText="API Reference">
            <Anchor.Item href="#anchor-props">Anchor Props</Anchor.Item>
            <Anchor.Item href="#section-props">Section Props</Anchor.Item>
          </Anchor.Section>
          <Anchor.Section href="#examples" linkText="Examples" />
        </Anchor>
      </aside>
    </div>
  );
}
