import { useState } from "react";
import { PaginatedView, Paper, PaperProvider, Pagination } from "@/component";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

export default function PaginatedViewBasic() {
  const [current, setCurrent] = useState(1);

  return (
    <PaperProvider>
      <PaginatedView activeIndex={current - 1}>
        {Array.from({ length: 100 }, (_, i) => (
          <Paper variant="a5" key={i}>
            <div className="h-40 flex items-center justify-center">
              <h2 className="text-2xl font-bold">Page {i + 1}</h2>
            </div>
          </Paper>
        ))}
      </PaginatedView>
      <Pagination
        current={current}
        pageSize={1}
        total={100}
        onPageChange={setCurrent}
      >
        <Pagination.Description />
        <div className="flex items-center gap-2">
          <Pagination.Controls variant="first">
            <ChevronsLeft className="size-4" />
          </Pagination.Controls>
          <Pagination.Controls variant="prev">
            <ChevronLeft className="size-4" />
          </Pagination.Controls>
          <Pagination.Controls variant="next">
            <ChevronRight className="size-4" />
          </Pagination.Controls>
          <Pagination.Controls variant="last">
            <ChevronsRight className="size-4" />
          </Pagination.Controls>
        </div>
      </Pagination>
    </PaperProvider>
  );
}
