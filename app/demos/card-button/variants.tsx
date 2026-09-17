import { CardButton } from "@/ui";

export default function CardButtonVariantsDemo() {
  const variants = [
    { variant: "primary", title: "Upgrade", description: "Unlock the pro plan" },
    { variant: "danger", title: "Delete", description: "Remove this workspace" },
    { variant: "outline", title: "Archive", description: "Move to storage" },
    { variant: "text", title: "Details", description: "View the full report" },
  ] as const;

  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
      {variants.map(({ variant, title, description }) => (
        <CardButton key={variant} variant={variant} className="p-4">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-muted-foreground mt-1 text-xs">{description}</div>
        </CardButton>
      ))}
    </div>
  );
}
