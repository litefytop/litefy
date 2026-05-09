
import { Title } from "./ui/title";

export interface DocsTableColumn {
  key: string;
  header: string;
}

export interface DocsTableItem {
  props: string;
  type: string;
  default: string;
  description: string;
}

export interface DocsTableItemSimple {
  props: string;
  description: string;
}

export interface DocsSectionData {
  title: string;
  columns: DocsTableColumn[];
  data: DocsTableItem[] | DocsTableItemSimple[];
}

export interface DocsTableSectionProps {
  title: string;
  columns: DocsTableColumn[];
  data: DocsTableItem[] | DocsTableItemSimple[];
}

export function DocsTableSection({
  title,
  columns,
  data,
}: DocsTableSectionProps) {
  const isSimple = data.length > 0 && !("type" in data[0]);

  return (
    <div className="space-y-4">
      <Title as="h3">{title}</Title>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-3 px-4 font-semibold border-r last:border-r-0"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b hover:bg-muted/50 "
              >
                {isSimple ? (
                  <>
                    <td className="py-3 px-4 border-r last:border-r-0">
                      {(row as DocsTableItemSimple).props}
                    </td>
                    <td className="py-3 px-4 last:border-r-0" colSpan={columns.length - 1}>
                      {(row as DocsTableItemSimple).description}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-4 border-r last:border-r-0">
                      {(row as DocsTableItem).props}
                    </td>
                    <td className="py-3 px-4 border-r last:border-r-0">
                      {(row as DocsTableItem).type}
                    </td>
                    <td className="py-3 px-4 border-r last:border-r-0">
                      {(row as DocsTableItem).default}
                    </td>
                    <td className="py-3 px-4 last:border-r-0">
                      {(row as DocsTableItem).description}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface DocsProps {
  sections: DocsSectionData[];
}

export function Docs({ sections }: DocsProps) {
  return (
    <div className="space-y-8">
      <section id="api" data-anchor-id="api" className="space-y-8">
        {sections.map((section, index) => (
          <DocsTableSection
            key={index}
            title={section.title}
            columns={section.columns}
            data={section.data}
          />
        ))}
      </section>
    </div>
  );
}
