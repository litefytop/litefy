import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import { Preview } from './preview';
import { ComponentPreview } from './component-preview';
import { Accordion } from './ui/accordion';
import { PackageManagerTabs } from './package-manager-tabs';
import { SourceCode } from './source-code';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    Preview,
    ComponentPreview,
    Accordion,
    PackageManagerTabs,
    SourceCode,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
