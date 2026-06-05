/// <reference types="vite/client" />

declare module "*.md" {
  const content: string;
  const html: string;
  const markdown: string;
  const toc: { level: string; content: string }[];
  const attributes: Record<string, unknown>;
  export default content;
  export { html, markdown, toc, attributes };
}
