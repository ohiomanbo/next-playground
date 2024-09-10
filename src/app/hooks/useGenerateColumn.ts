import React from "react";
import type { MRT_RowData } from "material-react-table";
import type { ColumnDefArray } from "@/types/column.type";
import { createTableIndexNumberColum } from "@/utils/DataTableColumn.util";

interface UseTableColumnGenProps<T extends MRT_RowData> {
  startCustomColumns?: ColumnDefArray<T>;
  middleCustomColumns?: ColumnDefArray<T>;
  endCustomColumns?: ColumnDefArray<T>;
  preExcludeColumnKeys?: string[];
  postExcludeColumnKeys?: string[];
  columnSizes?: Partial<Record<keyof T, number>>;
  enableRowNumbering?: boolean;
}

const useGenerateColumn = <T extends MRT_RowData>({
  startCustomColumns = [],
  middleCustomColumns = [],
  endCustomColumns = [],
  preExcludeColumnKeys = [],
  postExcludeColumnKeys = [],
  // columnSizes = {},
  enableRowNumbering = false,
}: UseTableColumnGenProps<T>) => {
  const createBasicPreColumns = React.useMemo((): ColumnDefArray<T> => {
    const columns: ColumnDefArray<T> = [];

    return columns.filter((column) => !preExcludeColumnKeys.includes(column.accessorKey as string));
  }, [preExcludeColumnKeys]);

  const createBasicPostColumns = React.useMemo((): ColumnDefArray<T> => {
    const columns: ColumnDefArray<T> = [];

    return columns.filter((column) => !postExcludeColumnKeys.includes(column.accessorKey as string));
  }, [postExcludeColumnKeys]);

  const columns = React.useMemo(
    () => [
      ...(enableRowNumbering ? [createTableIndexNumberColum<T>()] : []),
      ...startCustomColumns,
      ...createBasicPreColumns,
      ...middleCustomColumns,
      ...createBasicPostColumns,
      ...endCustomColumns,
    ],
    [
      enableRowNumbering,
      startCustomColumns,
      createBasicPreColumns,
      middleCustomColumns,
      createBasicPostColumns,
      endCustomColumns,
    ]
  );

  return { columns };
};

export default useGenerateColumn;
