import { useState } from "react";
import { Pagination, Button } from "@/component";
import { 
  RefreshCw, 
  Download,
  ChevronsLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsRight 
} from "lucide-react";

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
      <div className="flex items-center gap-2">
        <Pagination.Sizer />
        <div className="flex gap-2 mr-2">
          <Button variant="ghost" iconOnly>
            <RefreshCw className="size-4" />
          </Button>
          <Button variant="ghost" iconOnly>
            <Download className="size-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Pagination.Controls variant="first">
            <ChevronsLeft className="size-4" />
          </Pagination.Controls>
          <div className="flex gap-2">
            <Pagination.Controls variant="prev">
              <ChevronLeft className="size-4" />
            </Pagination.Controls>
            <Pagination.Controls variant="next">
              <ChevronRight className="size-4" />
            </Pagination.Controls>
          </div>
          <Pagination.Controls variant="last">
            <ChevronsRight className="size-4" />
          </Pagination.Controls>
        </div>
      </div>
    </Pagination>
  );
}
