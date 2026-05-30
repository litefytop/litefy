import { useState } from "react";
import {
  PaginatedView,
  Paper,
  PaperProvider,
  Pagination,
  Button,
  usePagination,
} from "@/component";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

const PAGE_COUNT = 100;

function PaginationControls() {
  const { current, totalPages, goFirst, goPrev, goNext, goLast } = usePagination();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        onClick={goFirst}
        disabled={current === 1}
        iconOnly
      >
        <ChevronsLeft className="size-4" />
      </Button>
      <Button
        variant="ghost"
        onClick={goPrev}
        disabled={current === 1}
        iconOnly
      >
        <ChevronLeft className="size-4" />
      </Button>
      <Pagination.Jumper
      
        format={(page) => `Page ${page}`}
      />
      <Button
        variant="ghost"
        onClick={goNext}
        disabled={current === totalPages}
        iconOnly
      >
        <ChevronRight className="size-4" />
      </Button>
      <Button
        variant="ghost"
        onClick={goLast}
        disabled={current === totalPages}
        iconOnly
      >
        <ChevronsRight className="size-4" />
      </Button>
    </div>
  );
}

export default function PaginatedViewBasic() {
  const [current, setCurrent] = useState(1);
  const totalPages = PAGE_COUNT;

  return (
    <div className="space-y-4">
      <PaperProvider>
        <PaginatedView activeIndex={current - 1}>
          {Array.from({ length: PAGE_COUNT }, (_, i) => (
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
          total={totalPages}
          onPageChange={setCurrent}
        >
          <Pagination.Description />
          <Pagination.Controls>
            <PaginationControls />
          </Pagination.Controls>
        </Pagination>
      </PaperProvider>
    </div>
  );
}
