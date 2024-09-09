"use client";

import { useCallback } from "react";
import { MRT_RowData, MRT_RowSelectionState } from "material-react-table";

interface UseRowSelectionProps<T extends MRT_RowData> {
  data: T[];
  rowSelection?: MRT_RowSelectionState;
  getRowId?: (row: T) => string;
  setRowSelection?: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>;
  onRowSelectionChange?: (newSelection: MRT_RowSelectionState, selectedRows: T[]) => void;
}

const useRowSelection = <T extends MRT_RowData>({
  data,
  rowSelection,
  getRowId,
  setRowSelection,
  onRowSelectionChange,
}: UseRowSelectionProps<T>) => {
  const isRowSelected = (row: T) => {
    if (!rowSelection) return false;
    const rowId = resolveRowId(row);
    return !!rowSelection[rowId];
  };

  const defaultGetRowId = (row: T): string => {
    if (row && typeof row === "object" && "idx" in row) {
      const idx = (row as T & { idx: string | number }).idx;
      return idx !== null ? idx.toString() : `row-${Math.random()}`;
    }
    return `row-${Math.random()}`;
  };

  const resolveRowId = useCallback(
    (row: T): string => {
      if (getRowId) {
        try {
          const id = getRowId(row);
          return id != null ? id.toString() : defaultGetRowId(row);
        } catch (error) {
          console.error("Error in getRowId:", error);
          return defaultGetRowId(row);
        }
      }
      return defaultGetRowId(row);
    },
    [getRowId]
  );

  const handleRowSelectionChange = useCallback(
    (updaterOrValue: MRT_RowSelectionState | ((prev: MRT_RowSelectionState) => MRT_RowSelectionState)) => {
      if (setRowSelection) {
        setRowSelection((prev) => {
          const newSelection = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;
          const selectedRows = data.filter((row) => newSelection[resolveRowId(row)]);
          onRowSelectionChange?.(newSelection, selectedRows);
          return newSelection;
        });
      }
    },
    [data, onRowSelectionChange, resolveRowId, setRowSelection]
  );

  return {
    isRowSelected,
    resolveRowId,
    handleRowSelectionChange,
  };
};

export default useRowSelection;
