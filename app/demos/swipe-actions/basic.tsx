"use client";

import { useEffect, useRef, useState } from "react";
import { SwipeActions } from "@/ui/skins";

const ROWS = [
  { id: "notes", title: "Design review notes", subtitle: "Edited 2 min ago", meta: "9:41" },
  { id: "flight", title: "Flight to Lisbon", subtitle: "Gate changes to B12", meta: "Tue" },
  { id: "invoice", title: "Invoice #1042", subtitle: "Due in 3 days", meta: "$1,280" },
];

const ACTIONS = {
  danger: { label: "Delete" },
  primary: { label: "Archive", dismiss: true },
};

const RETURN_MS = 1200;
const ROW_HEIGHT = 64;

export default function Demo() {
  const [rows, setRows] = useState(() => ROWS.map((row) => ({ ...row, returning: false })));
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

  const remove = (id: string) => {
    const index = rows.findIndex((row) => row.id === id);
    setRows((current) => current.filter((row) => row.id !== id));
    timers.current.push(window.setTimeout(() => {
      setRows((current) => {
        const next = current.filter((row) => row.id !== id);
        const at = Math.min(Math.max(0, index), next.length);
        next.splice(at, 0, { ...ROWS.find((row) => row.id === id)!, returning: true });
        return next;
      });
    }, RETURN_MS));
  };

  return (
    <div className="flex w-full max-w-112 flex-col items-center">
      {rows.map((row) => (
        <SwipeActions
          key={row.id}
          enter={row.returning}
          danger={ACTIONS.danger}
          primary={ACTIONS.primary}
          label={row.title}
          height={ROW_HEIGHT}
          onCommit={() => remove(row.id)}
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
