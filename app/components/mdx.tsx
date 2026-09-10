import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Link } from "react-router";
import { ComponentPreview } from "./component-preview";
import { CssSource } from "./css-source";
import { Installation } from "./installation";
import { PackageManagerTabs } from "./package-manager-tabs";
import { PresetTabs } from "./preset-tabs";
import { Source } from "./source";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    ComponentPreview,
    PackageManagerTabs,
    PresetTabs,
    Source,
    CssSource,
    Installation,
    Link,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
