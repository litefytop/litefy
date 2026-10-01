import type { ReactNode } from "react";
import type { MetaDescriptor } from "react-router";
import { appName, gitConfig, siteUrl } from "./shared";

/** GitHub 自动生成的仓库社交卡片，无需自备图片资产 */
export const ogImage = `https://opengraph.githubassets.com/1/${gitConfig.user}/${gitConfig.repo}`;

type SocialTag = { name?: string; property?: string; content: string };

type SocialOptions = {
  title: string;
  description: string;
  url: string;
  locale: "en" | "zh";
};

function socialTags(options: SocialOptions): SocialTag[] {
  const { title, description, url, locale } = options;
  const ogLocale = locale === "zh" ? "zh_CN" : "en_US";
  const altLocale = locale === "zh" ? "en_US" : "zh_CN";
  return [
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: appName },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: `${appName} on GitHub` },
    { property: "og:locale", content: ogLocale },
    { property: "og:locale:alternate", content: altLocale },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
}

/** 给路由 meta() 导出用的描述符数组 */
export function socialMeta(options: SocialOptions): MetaDescriptor[] {
  return socialTags(options);
}

/** 给组件树渲染用的 <meta> 元素（React 19 会 hoist 到 <head>） */
export function socialMetaTags(options: SocialOptions): ReactNode {
  return socialTags(options).map((tag, i) => (
    <meta
      key={i}
      {...(tag.name ? { name: tag.name } : { property: tag.property })}
      content={tag.content}
    />
  ));
}

/** JSON-LD <script> 内容；转义 < 防 </script> 提前闭合 */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function jsonLdScript(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}
