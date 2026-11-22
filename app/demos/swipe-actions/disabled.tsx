import { SwipeActions } from "@/ui/skins";

const ROWS = [
  { id: "notes", title: "Design review notes", subtitle: "Edited 2 min ago", meta: "9:41", disabled: true },
  { id: "flight", title: "Flight to Lisbon", subtitle: "Gate changes to B12", meta: "Tue", disabled: true },
  { id: "invoice", title: "Invoice #1042", subtitle: "Due in 3 days", meta: "$1,280", disabled: true },
];

export default function Demo() {
  return (
    <div inert className="flex w-full max-w-112 flex-col items-center">
      {ROWS.map((row) => (
        <SwipeActions
          key={row.id}
          danger={{ label: "Delete" }}
          primary={{ label: "Archive", dismiss: true }}
          label={row.title}
          height={64}
          disabled={row.disabled}
          className="mb-2 w-full"
        >
          <div className="flex min-w-0 flex-1 items-center gap-x-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm leading-5 font-field text-foreground">{row.title}</p>
              <p className="truncate text-sm leading-5 text-surface-fg">{row.subtitle}</p>
            </div>
            <span className="shrink-0 text-sm leading-5 text-surface-fg">{row.meta}</span>
          </div>
        </SwipeActions>
      ))}
    </div>
  );
}
