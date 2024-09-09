"use client";

import React, { useEffect, useState } from "react";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_TableInstance,
  type MRT_SortingState,
  type MRT_RowData,
  MRT_ActionMenuItem,
  MRT_ToggleFullScreenButton,
} from "material-react-table";
import { ThemeProvider } from "@mui/material/styles";
import { MRT_Localization_KO } from "material-react-table/locales/ko";
import { Box, Checkbox, Divider, MenuItem } from "@mui/material";

import EmptyTableBody from "@/Table/modulized/MaterialReactTable/defaultAtoms/Empty/EmptyTableBody";
import FadeLoadingOverlay from "@/Table/modulized/MaterialReactTable/defaultAtoms/Loading/Loading";
import { PaginationComponent } from "@/Table/modulized/MaterialReactTable/defaultAtoms/Pagination/PaginationComponent";
import type { PaginatedDataTableProps } from "@/types/table.type";

import { defaultTheme } from "@/Table/modulized/MaterialReactTable/mrtTheme";
import { getTrueCount } from "@/utils/common.util";
import { applyStyleFixedSizeCellForCount, applyStyleWidthHeightOverflow } from "@/utils/style.util";
import useTableRef from "@/app/hooks/useTableRef";
import useRowSelection from "@/app/hooks/useRowSelection";
import { Email, PersonOffOutlined } from "@mui/icons-material";

const PaginatedDataTable = <TData extends MRT_RowData>({
  dataResponse,
  isLoading,
  columns,
  pagination,
  sorting,
  hidingColumns,
  enableExpanding = false,
  enableRowSelection = true,
  enableCellResizing = true,
  enableRowNumbering = false,
  enableTopToolbar = true,
  enableBottomToolbar = true,
  isResetCellSizeClicked = false,
  rowClick,
  emptyHeight,
  mrtPaperStyles,
  mrtContainerStyles,
  mrtTableBodyStyles,
  rowSelection,
  detailPanelComponent: DetailPanelComponent,
  topToolbarComponent: TopToolbarComponent,
  getRowId,
  tableStyle,
}: PaginatedDataTableProps<TData>) => {
  const { state: paginationState, setState: setPagination, pageSizeArr, style: paginationStyle } = pagination;

  const { data, count, totalCount } = dataResponse;

  const { tableRef, tableContainerRef, tableBodyPosition } = useTableRef({
    dataResponse,
    setRowSelection: rowSelection?.setState,
  });

  const [columnOrder, setColumnOrder] = useState([
    "mrt-row-select",
    "mrt-row-expand",
    "rowIndex",
    ...(columns.map((ele) => ele.accessorKey).filter((ele): ele is string => ele !== undefined) as string[]),
  ]);

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

  const table = useMaterialReactTable({
    localization: MRT_Localization_KO,
    layoutMode: "grid",
    initialState: {
      density: "compact",
    },
    state: {
      isLoading: false,
      pagination: paginationState,
      columnOrder,
      // columnVisibility: hidingColumns, -> enableCellActions랑 충돌
      sorting: sorting?.state ?? [],
      rowSelection: rowSelection?.state ?? {},
    },
    data: tableData ?? [],
    columns,

    /** 변하지 않을 설정 값 */
    enableGlobalFilter: false,
    enableColumnFilters: false,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: true,

    enableColumnActions: true,
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

    enableTopToolbar,
    enableBottomToolbar,

    /** order 변경 여부 */
    enableRowOrdering: true,
    enableColumnOrdering: true,
    onColumnOrderChange: setColumnOrder,

    /** column resize */
    enableColumnResizing: enableCellResizing,
    columnResizeMode: "onEnd",

    /** pagination */
    manualPagination: true,
    paginationDisplayMode: "custom",
    rowCount: totalCount,
    muiPaginationProps: {
      /**
       * NCSM은 0-based page index, material react table은 1-based page index 방식
       * 0-based 페이지네이션으로 로직 설정
       */
      page: paginationState.pageIndex,
      count: Math.ceil(count / paginationState.pageSize),
      showFirstButton: true,
      showLastButton: true,
      shape: "rounded",
      onChange: (_, newPage) => {
        setPagination((prev) => ({ ...prev, pageIndex: newPage }));
      },
    },

    /** sorting */
    enableSorting: Boolean(sorting),
    manualSorting: Boolean(sorting),
    enableSortingRemoval: true,
    onSortingChange: (props) => {
      if (!sorting) return;

      if (rowSelection && Object.keys(rowSelection).length !== 0) {
        setShowSortingModal(true);
        setSortingProps(props);
      } else {
        sorting?.setState &&
          sorting.setState((prevSorting) => {
            const newSorting = typeof props === "function" ? props(prevSorting) : props;
            return newSorting;
          });
      }
    },

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

    /** row click */
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => rowClick && rowClick(row),
      sx: { cursor: rowClick && "pointer" },
    }),

    /** components */
    renderEmptyRowsFallback: () => <EmptyTableBody height={emptyHeight} />,
    renderTopToolbar: () => {
      if (!(enableTopToolbar && TopToolbarComponent)) return <></>;
      return React.cloneElement(TopToolbarComponent as React.ReactElement, {
        filteredRow: {
          filteredCount: count,
          totalCount: totalCount,
        },
      });
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

    /** style */
    muiTablePaperProps: { sx: applyStyleWidthHeightOverflow(mrtPaperStyles) },
    muiTableContainerProps: {
      ref: tableContainerRef,
      sx: applyStyleWidthHeightOverflow(mrtContainerStyles),
    },
    muiTableProps: {
      sx: {
        "& .MuiTableRow-head": {
          "& .MuiTableCell-head": {
            padding: `${tableStyle?.cellStyle?.headCellPadding ?? "2px 4px"} !important`,
          },
          /** 셋 중 n개만 가능한 경우 -> 1~ nth의 th, td 강제적으로 크기 감소 */
          ...applyStyleFixedSizeCellForCount(
            getTrueCount([enableExpanding, enableRowSelection, enableRowNumbering]),
            true
          ),
        },
        "& .MuiTableBody-root": {
          ...applyStyleWidthHeightOverflow(mrtTableBodyStyles),

          "& .MuiTableRow-root": {
            "& .MuiTableCell-body": {
              padding: `${tableStyle?.cellStyle?.bodyCellPadding ?? "2px 4px"} !important`,
            },
            ...applyStyleFixedSizeCellForCount(getTrueCount([enableExpanding, enableRowSelection, enableRowNumbering])),
          },
        },
      },
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

export { PaginatedDataTable, type PaginatedDataTableProps };
