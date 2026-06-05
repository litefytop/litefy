import { ReactNode } from "react";
import { Title } from "@/component";

export interface APITableColumn {
  key: string;
  header: string;
}

export interface APITableItem {
  props: string;
  type: string;
  default?: string;
  description: ReactNode;
  id?: string;
}

export interface APITableSectionProps {
  id?: string;
  title: string;
  columns?: APITableColumn[];
  data: APITableItem[];
}

const defaultColumns: APITableColumn[] = [
  { key: "prop", header: "Prop" },
  { key: "type", header: "Type" },
  { key: "default", header: "Default" },
  { key: "description", header: "Description" },
];

export function APITableSection({
  id,
  title,
  columns = defaultColumns,
  data,
}: APITableSectionProps) {
  return (
    <div id={id} className="space-y-4">
      <Title as="h4" className="py-2 px-3">
        {title}
      </Title>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted ">
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
                id={row.id}
                className="border-b hover:bg-muted/50 "
              >
                <td className="py-3 px-4 border-r last:border-r-0">
                  <code>{row.props}</code>
                </td>
                <td className="py-3 px-4 border-r last:border-r-0">
                  <code>{row.type}</code>
                </td>
                <td className="py-3 px-4 border-r last:border-r-0">
                  <code>{row.default || "-"}</code>
                </td>
                <td className="py-3 px-4 last:border-r-0">
                  <code>{row.description}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface APITableProps {
  sections: APITableSectionProps[];
}

export function APITable({ sections }: APITableProps) {
  return (
    <div className="space-y-8">
      <section id="api" className="space-y-8">
        {sections.map((section, index) => (
          <APITableSection
            key={index}
            id={section.id}
            title={section.title}
            columns={section.columns}
            data={section.data}
          />
        ))}
      </section>
    </div>
  );
}
