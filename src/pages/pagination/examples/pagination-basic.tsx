import { useState } from "react";
import { Pagination, Button, usePagination } from "@/component";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

function PaginationButtons() {
  const { current, totalPages, goFirst, goPrev, goNext, goLast } = usePagination();

  return (
    <>
      <Button variant="ghost" onClick={goFirst} disabled={current === 1} iconOnly>
        <ChevronsLeft className="size-4" />
      </Button>
      <Button variant="ghost" onClick={goPrev} disabled={current === 1} iconOnly>
        <ChevronLeft className="size-4" />
      </Button>
      <Button variant="ghost" onClick={goNext} disabled={current === totalPages} iconOnly>
        <ChevronRight className="size-4" />
      </Button>
      <Button variant="ghost" onClick={goLast} disabled={current === totalPages} iconOnly>
        <ChevronsRight className="size-4" />
      </Button>
    </>
  );
}

export default function PaginationBasic() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={100}
      onPageChange={(page) => {
        setCurrent(page);
      }}
      onPageSizeChange={(size) => {
        setPageSize(size);
      }}
    >
      <Pagination.Description />
      <Pagination.Controls>
        <Pagination.Sizer />
        <PaginationButtons />
      </Pagination.Controls>
    </Pagination>
  );
}
