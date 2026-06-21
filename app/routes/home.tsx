import { useParams } from "react-router";
import { content, HomeContent, type Locale } from "@/components/home-content";
import { i18n } from "@/lib/i18n";

export function meta({ params }: { params: { lang?: string } }) {
  const locale = (params.lang || i18n.defaultLanguage) as Locale;
  const t = content[locale] ?? content.en;
  return [{ title: t.title }, { name: "description", content: t.description }];
}

export default function Home() {
  const params = useParams<{ lang: string }>();
  const locale = (params.lang || i18n.defaultLanguage) as Locale;
  return <HomeContent locale={locale} />;
}
