import { createTokenizer } from "@orama/tokenizers/mandarin";
import { createFromSource } from "fumadocs-core/search/server";

const mandarin = createTokenizer();
const zhTokenizer = {
  language: mandarin.language,
  tokenize: (raw: string) => mandarin.tokenize(raw.toLowerCase()),
};

export async function loader() {
  const { source } = await import("@/lib/source");
  const server = createFromSource(source, {
    localeMap: {
      en: { language: "english" },
      zh: {
        components: {
          tokenizer: zhTokenizer,
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
