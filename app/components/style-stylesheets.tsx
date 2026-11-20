import { STYLE_TEMPLATES } from "@/lib/style-templates";
import { FileSource, UI_ROOT } from "./source";

interface StyleStylesheetsProps {
  className?: string;
}

export function StyleStylesheets({ className }: StyleStylesheetsProps) {
  return (
    <FileSource
      className={className}
      paths={STYLE_TEMPLATES.map((tpl) => `${UI_ROOT}schemes/${tpl.slug}/index.css`)}
    />
  );
}
