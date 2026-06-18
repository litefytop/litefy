import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Code2 } from "lucide-react";
import { Link } from "react-router";
import { baseOptions } from "@/lib/layout.shared";

export default function Root() {
  return (
    <HomeLayout {...baseOptions("en")}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">Litefy UI.</h1>
        <p className="text-fd-muted-foreground mb-4">
          A lightweight UI library with almost no external dependencies.
        </p>

        <Link
          className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
          to={"/en/docs"}
        >
          Open Docs
        </Link>

        <div className="mt-12 w-full max-w-4xl">
          <div className="border-2 border-dashed rounded-lg p-12 min-h-100 flex items-center justify-center">
            <div className="text-center">
              <Code2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">
                Playground (Coming Soon)
              </h2>
              <p className="text-fd-muted-foreground">
                This will be an interactive demo area for components. Stay
                tuned!
              </p>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
