import { RowOption } from "@/components";
import { useState } from "react";

export function useSelect(
  rowOption: RowOption<Record<string, unknown>> | undefined,
) {
  const [internalSelectedRows, setInternalSelectedRows] = useState<
    Record<string, unknown>[]
  >([]);

  if (!rowOption) {
    return;
  }
  const { mode, rowKey, onSelectionChange } = rowOption;

  const selectedRows = rowOption.selectedRows ?? internalSelectedRows;
  const selectedKeySet = new Set(selectedRows.map((row) => row[rowKey]));

  const handleSelectChange = (row: Record<string, unknown>) => {
    let newSelectedRows: Record<string, unknown>[];

    if (mode === "single") {
      newSelectedRows = [row];
    } else {
      const key = row[rowKey];
      const isSelected = selectedKeySet.has(key);
      newSelectedRows = isSelected
        ? selectedRows.filter(
            (selected) => (selected[rowKey] as number) !== key,
          )
        : [...selectedRows, row];
    }

    setInternalSelectedRows(newSelectedRows);
    onSelectionChange?.(newSelectedRows);
    return newSelectedRows;
  };
  return { handleSelectChange,selectedKeySet };
}


