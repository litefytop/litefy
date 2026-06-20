import { createTokenizer } from "@orama/tokenizers/mandarin";
import { createFromSource } from "fumadocs-core/search/server";

export async function loader() {
  const { source } = await import("@/lib/source");
  const server = createFromSource(source, {
    localeMap: {
      en: { language: "english" },
      zh: {
        components: {
          tokenizer: createTokenizer(),
        },
        search: {
          threshold: 0,
          tolerance: 0,
        },
      },
    },
  });
  return server.staticGET();
}
