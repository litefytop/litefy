import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Code2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { i18n } from "@/lib/i18n";
import { baseOptions } from "@/lib/layout.shared";

export function meta() {
  return [
    { title: "Litefy UI" },
    { name: "description", content: "Welcome to Litefy UI!" },
  ];
}

export default function Home() {
  const params = useParams<{ lang: string }>();
  const locale = params.lang || i18n.defaultLanguage;
  const docsPath = `/${locale}/docs`;

  useEffect(() => {
    if (typeof window !== "undefined" && params.lang) {
      localStorage.setItem("preferred-language", params.lang);
    }
  }, [params.lang]);

  return (
    <HomeLayout {...baseOptions(locale)}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">Litefy UI.</h1>
        <p className="text-fd-muted-foreground mb-4">
          {locale === "zh"
            ? "一个几乎没有外部依赖的轻量化 UI 库。"
            : "A lightweight UI library with almost no external dependencies."}
        </p>

        <Link
          className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
          to={docsPath}
        >
          Open Docs
        </Link>

        <div className="mt-12 w-full max-w-4xl">
          <div className="border-2 border-dashed rounded-lg p-12 min-h-100 flex items-center justify-center">
            <div className="text-center">
              <Code2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">
                {locale === "zh"
                  ? "Playground（开发中）"
                  : "Playground (Coming Soon)"}
              </h2>
              <p className="text-fd-muted-foreground">
                {locale === "zh"
                  ? "这里将是组件的交互式演示区域，敬请期待！"
                  : "This will be an interactive demo area for components. Stay tuned!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
