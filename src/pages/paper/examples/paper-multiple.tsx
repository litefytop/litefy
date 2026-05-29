import { useState } from "react";
import { PaginatedView, PaperProvider, Paper, Pagination, Button } from "@/component";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PaperContent({ title, description, page, total }: { title: string; description: string; page: number; total: number }) {
  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
      <div 
        className="absolute bottom-4 right-4 text-sm text-muted-foreground print:hidden"
        data-page-number
      >
        Page {page} of {total}
      </div>
    </div>
  );
}

export default function PaperMultiple() {
  const [current, setCurrent] = useState(1);
  const totalPages = 3;

  return (
    <div className="space-y-4">
      <PaperProvider totalPages={totalPages}>
        <PaginatedView activeIndex={current - 1}>
          <Paper variant="a4" orientation="portrait" countable>
            <PaperContent 
              title="Page 1" 
              description="This is the first page of the document."
              page={1}
              total={totalPages}
            />
          </Paper>
          <Paper variant="a4" orientation="portrait" countable>
            <PaperContent 
              title="Page 2" 
              description="This is the second page of the document."
              page={2}
              total={totalPages}
            />
          </Paper>
          <Paper variant="a4" orientation="portrait" countable>
            <PaperContent 
              title="Page 3" 
              description="This is the third and final page."
              page={3}
              total={totalPages}
            />
          </Paper>
        </PaginatedView>
      </PaperProvider>

      <Pagination
        current={current}
        pageSize={1}
        total={totalPages}
        onPageChange={(page) => setCurrent(page)}
      >
        <Pagination.Description />
        <Pagination.Controls>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setCurrent((c) => Math.max(1, c - 1))}
              disabled={current === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium">
              {current} / {totalPages}
            </span>
            <Button
              variant="ghost"
              onClick={() => setCurrent((c) => Math.min(totalPages, c + 1))}
              disabled={current === totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </Pagination.Controls>
      </Pagination>
    </div>
  );
}
