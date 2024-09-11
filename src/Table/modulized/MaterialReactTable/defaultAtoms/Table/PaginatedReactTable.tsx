"use client";

import React, { useCallback, useEffect, useState } from "react";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_TableInstance,
  type MRT_SortingState,
  type MRT_RowData,
  type MRT_ColumnDef,
} from "material-react-table";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Checkbox, Divider, MenuItem } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";

import EmptyTableBody from "@/Table/modulized/MaterialReactTable/defaultAtoms/Empty/EmptyTableBody";
import FadeLoadingOverlay from "@/Table/modulized/MaterialReactTable/defaultAtoms/Loading/Loading";
import { PaginationComponent } from "@/Table/modulized/MaterialReactTable/defaultAtoms/Pagination/PaginationComponent";
import type { PaginatedDataTableProps } from "@/types/table.type";
import useRowSelection from "@/app/hooks/useRowSelection";
import useTableRef from "@/app/hooks/useTableRef";

import { defaultTheme } from "@/Table/modulized/MaterialReactTable/mrtTheme";
import useTableOptions from "@/app/hooks/useTableOptions";

const PaginatedReactTable = <TData extends MRT_RowData>({
  dataResponse,
  isLoading,
  allColumns,
  columns,
  pagination,
  columnVisibility,
  sorting,
  enableExpanding = false,
  enableRowOrdering = true,
  enableColumnOrdering = true,
  enableColumnActions = true,
  enableRowSelection = true,
  enableColumnResizing = true,
  enableRowNumbering = false,
  enableTopToolbar = true,
  enableBottomToolbar = true,
  enableClickToCopy = true,
  isResetCellSizeClicked = false,
  rowClick,
  emptyHeight,
  mrtPaperStyles,
  mrtContainerStyles,
  mrtTableStyles,
  mrtTableBodyStyles,
  mrtCellStyles,
  rowSelection,
  detailPanelComponent: DetailPanelComponent,
  topToolbarComponent: TopToolbarComponent,
  getRowId,
}: PaginatedDataTableProps<TData>) => {
  const { state: paginationState, setState: setPagination, pageSizeArr, style: paginationStyle } = pagination;

  const { data, count, totalCount } = dataResponse;

  const { tableRef, tableContainerRef, tableBodyPosition } = useTableRef({
    dataResponse,
    setRowSelection: rowSelection?.setState,
  });

  // 추후 열 순서 변경 기능을 사용할 때 추적하기 위해서 우선은 남겨두는 상태.
  const [columnOrder, setColumnOrder] = useState([
    "mrt-row-select",
    "mrt-row-expand",
    "rowIndex",
    ...(columns.map((ele) => ele.accessorKey).filter((ele): ele is string => ele !== undefined) as string[]),
  ]);

  const getColumnOrder = useCallback((cols: MRT_ColumnDef<TData>[]) => {
    const defaultOrder = ["mrt-row-select", "mrt-row-expand", "rowIndex"];
    const accessorKeys = cols.map((col) => col.accessorKey || col.id).filter((key): key is string => key !== undefined);
    return [...defaultOrder, ...accessorKeys];
  }, []);

  useEffect(() => {
    const newColumnOrder = getColumnOrder(columns);
    setColumnOrder(newColumnOrder);
  }, [columns, getColumnOrder]);

  const [tableData, setTableData] = useState(() => data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const [sortingProps, setSortingProps] = useState<MRT_SortingState>([]);
  const [showSortingModal, setShowSortingModal] = useState<boolean>(false);

  const { isRowSelected, resolveRowId, handleRowSelectionChange } = useRowSelection({
    data,
    rowSelection: rowSelection?.state,
    getRowId,
    setRowSelection: rowSelection?.setState,
    onRowSelectionChange: rowSelection?.onRowSelectionChange,
  });

  const { tableImmutableOptions, tablePaginationOptions, tableStyleOptions } = useTableOptions<TData>({
    tableContainerRef,
    tableFeatures: { enableExpanding, enableRowNumbering, enableRowSelection },
    pagination: {
      count,
      totalCount,
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      setPagination,
    },
    style: { mrtPaperStyles, mrtContainerStyles, mrtTableStyles, mrtTableBodyStyles, mrtCellStyles },
  });

  const table = useMaterialReactTable({
    ...tableImmutableOptions,
    ...tableStyleOptions, // styles
    state: {
      isLoading: false,
      pagination: paginationState,
      columnOrder: getColumnOrder(columns), // 매번 새롭게 값을 넣어줘야 테이블에 반영이 되는중
      columnVisibility: columnVisibility?.state ?? {},
      sorting: sorting?.state ?? [],
      rowSelection: rowSelection?.state ?? {},
    },
    data: tableData ?? [],
    columns,

    // optional features
    /** toolbar */
    enableTopToolbar,
    enableBottomToolbar,

    /** pagination */
    ...tablePaginationOptions,

    /** order(순서) 변경 여부 */
    enableRowOrdering,
    enableColumnOrdering,
    onColumnOrderChange: setColumnOrder,

    /** cell copy 여부 */
    enableClickToCopy,
    muiCopyButtonProps: {
      sx: {
        margin: "0",
        padding: "0",
        width: "auto",
        cursor: "default",
      },
      startIcon: <ContentCopy />,
    },

    /** row click */
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => rowClick && rowClick(row),
      sx: { cursor: rowClick && "pointer" },
    }),

    /** row expanding */
    enableExpanding,
    renderDetailPanel:
      enableExpanding && DetailPanelComponent
        ? ({ row, table }) => <DetailPanelComponent row={row} table={table} />
        : undefined,
    muiExpandButtonProps: ({ row, table }) => ({
      size: "small",
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),

    /** row Selection */
    enableRowSelection,
    enableMultiRowSelection: enableRowSelection,
    onRowSelectionChange: handleRowSelectionChange,
    getRowId: resolveRowId,
    displayColumnDefOptions: {
      /** drag */
      "mrt-row-drag": {
        header: "",
        size: 40,
      },
      /** select */
      "mrt-row-select": {
        Cell: ({ row }) => <Checkbox checked={isRowSelected(row.original)} onChange={row.getToggleSelectedHandler()} />,
        Header: ({ table }) => (
          <Checkbox
            checked={table?.getIsAllRowsSelected?.() ?? false}
            onChange={table?.getToggleAllRowsSelectedHandler()}
          />
        ),
      },
    },

    /** column show & hide handler */
    ...(columnVisibility?.setState && {
      onColumnVisibilityChange: columnVisibility.setState,
    }),

    /** column resize */
    enableColumnResizing,

    /** column sorting */
    enableSorting: Boolean(sorting),
    manualSorting: Boolean(sorting),
    onSortingChange: (props) => {
      if (!sorting) return;

      if (rowSelection && Object.keys(rowSelection).length !== 0) {
        setShowSortingModal(true);
        setSortingProps(props);
      } else {
        sorting.setState((prevSorting) => {
          const newSorting = typeof props === "function" ? props(prevSorting) : props;
          return newSorting;
        });
      }
    },

    // column actions
    enableColumnActions,
    renderColumnActionsMenuItems: ({ column, table }) => {
      // Move these checks inside the render function
      const isAnyColumnHidden = table.getAllColumns().some((col) => !col.getIsVisible());
      const hasColumnSizeChanged = column.getSize() !== column.columnDef.size;

      return [
        // 정렬 초기화
        <MenuItem key="clear-sort" onClick={() => column.clearSorting()} disabled={!column.getIsSorted()}>
          정렬 초기화
        </MenuItem>,
        // 오름차순 정렬
        <MenuItem key="sort-asc" onClick={() => column.toggleSorting(false)}>
          오름차순 정렬
        </MenuItem>,
        // 내림차순 정렬
        <MenuItem key="sort-desc" onClick={() => column.toggleSorting(true)}>
          내림차순 정렬
        </MenuItem>,
        // 구분선
        <Divider key="divider-1" />,
        // 열 크기 초기화
        <MenuItem key="reset-size" onClick={() => column.resetSize()} disabled={!hasColumnSizeChanged}>
          열 크기 초기화
        </MenuItem>,
        // 숨기기
        <MenuItem key="hide" onClick={() => column.toggleVisibility(false)}>
          숨기기
        </MenuItem>,
        // 모든 열 보이기
        <MenuItem key="show-all" onClick={() => table.setColumnVisibility({})} disabled={!isAnyColumnHidden}>
          모든 열 보이기
        </MenuItem>,
        // 구분선
        <Divider key="divider-2" />,
        // 여기서부터 커스텀 버튼
        <MenuItem
          key="custom-action-1"
          onClick={() => {
            // 커스텀 액션 1 로직
            console.log("Custom action 1 for column:", column.id);
          }}
        >
          커스텀 액션 1
        </MenuItem>,
        <MenuItem
          key="custom-action-2"
          onClick={async () => {
            // 커스텀 액션 2 로직 (비동기)
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Custom action 2 for column:", column.id);
          }}
        >
          커스텀 액션 2
        </MenuItem>,
      ];
    },

    /** components */
    renderEmptyRowsFallback: () => <EmptyTableBody height={emptyHeight} />,
    renderTopToolbar: () => {
      if (!(enableTopToolbar && TopToolbarComponent)) return <></>;
      return TopToolbarComponent;
      // return React.cloneElement(TopToolbarComponent as React.ReactElement, {
      //   filteredRow: {
      //     filteredCount: count,
      //     totalCount: totalCount,
      //   },
      // });
    },
    renderBottomToolbar: () => {
      if (!enableBottomToolbar) return <></>;

      return (
        <PaginationComponent
          pagination={paginationState}
          totalRowCount={totalCount}
          paginationStyle={paginationStyle}
          pageSizeArr={pageSizeArr}
          setPagination={setPagination}
        />
      );
    },
  });

  useEffect(() => table.resetColumnSizing(isResetCellSizeClicked), [isResetCellSizeClicked, table]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box ref={tableRef} position="relative">
        <MaterialReactTable table={table as MRT_TableInstance<TData>} />
        <FadeLoadingOverlay
          isLoading={!!isLoading}
          top={`${tableBodyPosition.top}px`}
          height={`${tableBodyPosition.height}px`}
        />
      </Box>
      {/* {showSortingModal && sorting && setSorting && (
        <SortingModal
          setIsSortingModal={setShowSortingModal}
          setRowSelection={setRowSelection}
          sortingProps={sortingProps}
          setSorting={setSorting}
        />
      )} */}
    </ThemeProvider>
  );
};

export { PaginatedReactTable, type PaginatedDataTableProps };

// renderColumnActionsMenuItems: ({ closeMenu, internalColumnMenuItems}) => [
//   ...internalColumnMenuItems,
//   <MenuItem
//     key="custom-1"
//     onClick={() => {
//       console.log("Custom Action 1");
//       closeMenu();
//     }}
//   >
//     Custom Action 1
//   </MenuItem>,
//   <MenuItem
//     key="custom-2"
//     onClick={() => {
//       console.log("Custom Action 2");
//       closeMenu();
//     }}
//   >
//     Custom Action 2
//   </MenuItem>,
// ],
