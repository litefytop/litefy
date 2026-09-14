"use client";

import * as React from "react";
import { Minus } from "lucide-react";
import { Checkbox } from "./checkbox";
import { Table, type TableColumn, type TableProps } from "./table";

const SELECTION_KEY = "__selection";

export interface SelectableTableProps<T extends object> extends Omit<
  TableProps<T>,
  "getKey" | "classNames" | "styles"
> {
  rowKey: (row: T) => string;
  selected?: string[];
  defaultSelected?: string[];
  onSelectionChange?: (selected: string[]) => void;
  loading?: boolean;
  classNames?: TableProps<T>["classNames"];
  styles?: TableProps<T>["styles"];
}

export function SelectableTable<T extends object>({
  data,
  columns,
  rowKey,
  selected,
  defaultSelected = [],
  onSelectionChange,
  loading,
  empty,
  classNames,
  styles,
  className,
}: SelectableTableProps<T>) {
  const isControlled = selected !== undefined;
  const [internalSelected, setInternalSelected] = React.useState<string[]>(defaultSelected);
  const selected$ = isControlled ? selected : internalSelected;
  const selectedSet = React.useMemo(() => new Set(selected$), [selected$]);

  const pageKeys = React.useMemo(() => data.map(rowKey), [data, rowKey]);
  const selectedOnPage = pageKeys.filter((key) => selectedSet.has(key)).length;
  const allSelected = data.length > 0 && selectedOnPage === data.length;
  const someSelected = selectedOnPage > 0 && !allSelected;

  const notify = (next: string[]) => {
    if (!isControlled) setInternalSelected(next);
    onSelectionChange?.(next);
  };

  const toggleAll = () => {
    if (allSelected) {
      notify(selected$.filter((key) => !pageKeys.includes(key)));
    } else {
      notify([...selected$, ...pageKeys.filter((key) => !selectedSet.has(key))]);
    }
  };

  const toggleRow = (key: string) => {
    notify(selectedSet.has(key) ? selected$.filter((k) => k !== key) : [...selected$, key]);
  };

  const selectionColumn: TableColumn<T> = {
    key: SELECTION_KEY as keyof T & string,
    header: (
      <Checkbox
        aria-label="Select all on this page"
        className="w-fit"
        checked={allSelected || someSelected}
        indicator={someSelected ? <Minus /> : undefined}
        onCheckedChange={toggleAll}
      />
    ),
    render: (row) => {
      const key = rowKey(row);
      return (
        <Checkbox
          aria-label="Select this row"
          className="w-fit"
          checked={selectedSet.has(key)}
          onCheckedChange={() => toggleRow(key)}
        />
      );
    },
  };

  return (
    <Table
      data={data}
      columns={[selectionColumn, ...columns]}
      getKey={(row) => rowKey(row)}
      className={className}
      styles={styles}
      classNames={classNames}
      empty={empty ?? (loading ? "Loading..." : "No data")}
    />
  );
}
