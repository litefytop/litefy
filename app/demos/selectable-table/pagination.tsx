"use client";

import * as React from "react";
import { Button, Pagination, SelectableTable, usePagination } from "@/ui";
import { Download } from "lucide-react";

interface Resident {
  id: string;
  name: string;
  village: string;
}

const TOTAL = 23;
const PAGE_SIZE = 5;
const names = ["Ada", "Linus", "Grace", "Edsger", "Hopper", "Dijkstra"];
const villages = ["Eastwood", "Riverside", "Hillcrest", "Lakeside"];

const residents: Resident[] = Array.from({ length: TOTAL }, (_, i) => ({
  id: `r-${String(i + 1).padStart(2, "0")}`,
  name: names[i % names.length],
  village: villages[i % villages.length],
}));

const totalPages = Math.ceil(TOTAL / PAGE_SIZE);

export default function Demo() {
  const pagination = usePagination({ base: 1, total: totalPages });
  const [data, setData] = React.useState(() => residents.slice(0, PAGE_SIZE));
  const [loading, setLoading] = React.useState(false);
  const skipFirst = React.useRef(true);

  React.useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    setLoading(true);
    const timer = window.setTimeout(() => {
      setData(residents.slice((pagination.index - 1) * PAGE_SIZE, pagination.index * PAGE_SIZE));
      setLoading(false);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [pagination.index]);

  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <SelectableTable
        data={data}
        rowKey={(row) => row.id}
        selected={selected}
        onSelectionChange={setSelected}
        loading={loading}
        columns={[
          { key: "id", header: "ID" },
          { key: "name", header: "Name" },
          { key: "village", header: "Village" },
        ]}
      />
      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span className="min-w-0 truncate">{selected.length} selected · {TOTAL} total</span>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="text" aria-label="Export selected" disabled={selected.length === 0}>
            <Download />
          </Button>
          <Pagination
            page={pagination.index}
            totalPages={totalPages}
            onPageChange={pagination.goTo}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
