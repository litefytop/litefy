import { t } from "@/pages/config/i18n";

function Home({ locale = "zh" }: { locale?: string }) {
  const lang = t(locale as "zh" | "en");

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto py-12 px-6">
      <div>
        <h1 className="text-4xl font-bold">{lang.home.title}</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
          {lang.home.description}
        </p>
        <p className="text-muted-foreground mt-4">{lang.home.subDescription}</p>
      </div>
    </div>
  );
}

export default Home;
