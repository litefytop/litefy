import { useState } from "react";
import { Pagination, Button, usePagination } from "@/component";
import { 
  RefreshCw, 
  Download,
  ChevronsLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsRight 
} from "lucide-react";

const buttonStyles = 
  "cursor-pointer outline-none inline-flex items-center justify-center shrink-0 select-none size-8 rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50";

function PaginationButtons() {
  const { current, totalPages, goFirst, goPrev, goNext, goLast } = usePagination();

  return (
    <>
      <button
        onClick={goFirst}
        disabled={current === 1}
        className={buttonStyles}
      >
        <ChevronsLeft className="size-4" />
      </button>
      <button
        onClick={goPrev}
        disabled={current === 1}
        className={buttonStyles}
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        onClick={goNext}
        disabled={current === totalPages}
        className={buttonStyles}
      >
        <ChevronRight className="size-4" />
      </button>
      <button
        onClick={goLast}
        disabled={current === totalPages}
        className={buttonStyles}
      >
        <ChevronsRight className="size-4" />
      </button>
    </>
  );
}

export default function PaginationWithActions() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={100}
      onPageChange={setCurrent}
      onPageSizeChange={setPageSize}
    >
      <Pagination.Description />
      <Pagination.Controls>
        <Pagination.Sizer />
        <div className="flex gap-2 mr-2">
          <Button variant="ghost" iconOnly>
            <RefreshCw className="size-4" />
          </Button>
          <Button variant="ghost" iconOnly>
            <Download className="size-4" />
          </Button>
        </div>
        <PaginationButtons />
      </Pagination.Controls>
    </Pagination>
  );
}
