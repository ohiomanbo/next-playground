"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_TableInstance,
  type MRT_SortingState,
  type MRT_RowData,
  type MRT_RowSelectionState,
} from "material-react-table";
import { ThemeProvider } from "@mui/material/styles";
import { MRT_Localization_KO } from "material-react-table/locales/ko";
import { Box, CircularProgress } from "@mui/material";

import { defaultTheme } from "@/component/modulized/MaterialReactTable/mrtTheme";
import { PaginatedDataTableProps } from "@/types/DataTable.type";
import { checkTrueCount } from "@/utils/common";
import EmptyTableBody from "@/component/modulized/MaterialReactTable/defaultAtoms/Empty/EmptyTableBody";
import { PaginationComponent } from "@/component/modulized/MaterialReactTable/defaultAtoms/Pagination/PaginationComponent";

const FadeOverlay = ({ isLoading, top, height }: { top: string; height: string; isLoading: boolean }) => {
  const [shouldRender, setShouldRender] = useState(isLoading);

  useEffect(() => {
    if (isLoading) setShouldRender(true);
  }, [isLoading]);

  const handleTransitionEnd = () => {
    if (!isLoading) setShouldRender(false);
  };

  return shouldRender ? (
    <Box
      sx={{
        position: "absolute",
        height,
        top: top,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        opacity: isLoading ? 1 : 0,
        transition: "opacity 300ms ease-in-out",
        pointerEvents: isLoading ? "auto" : "none",
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      <CircularProgress />
    </Box>
  ) : null;
};

const PaginatedDataTable = <TData extends MRT_RowData>({
  data,
  isLoading,
  // isError,
  // error,
  pagination,
  setPagination,
  columns,
  sorting,
  setSorting,
  hidingColumns,
  pageSizeArr,
  enableTopToolbar = true,
  enableBottomToolbar = true,
  enableCellResizing = true,
  enableRowExpanding = true,
  enableRowSelection = true,
  enableRowNumbering = false,
  cellResetClicked = false,
  rowClick,
  emptyHeight,
  mrtPaperStyles,
  mrtContainerStyles,
  mrtTableBodyStyles,
  headCellPadding,
  bodyCellPadding,
  rowSelection,
  setRowSelection,
  detailPanelComponent: DetailPanelComponent,
  topToolbarComponent: TopToolbarComponent,
  paginationStyle,
  getRowId,
  onRowSelectionChange,
}: PaginatedDataTableProps<TData>) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableBodyPosition, setTableBodyPosition] = useState({ top: 0, height: 0 });

  /**
   * table body에만 Loading 컴포넌트를 그리는 용도
   * 데이터가 변경될 때마다 위치를 다시 계산
   * */
  useEffect(() => {
    if (tableRef.current) {
      const tableElement = tableRef.current;
      const tableBody = tableElement.querySelector(".MuiTableBody-root");
      if (tableBody) {
        const { top, height } = tableBody.getBoundingClientRect();
        const tableTop = tableElement.getBoundingClientRect().top;
        setTableBodyPosition({
          top: top - tableTop,
          height: height,
        });
      }
    }
  }, [data]);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [sortingProps, setSortingProps] = useState<MRT_SortingState>([]);
  const [showSortingModal, setShowSortingModal] = useState<boolean>(false);

  useEffect(() => {
    if (tableContainerRef.current) {
      setRowSelection && setRowSelection({});
    }
  }, [setRowSelection]);

  const resolveRowId = useCallback(
    (row: TData): string => {
      const defaultGetRowId = (row: TData): string => {
        if (row && typeof row === "object" && "idx" in row) {
          const idx = (row as TData & { idx: string | number }).idx;
          return idx !== null ? idx.toString() : `row-${Math.random()}`;
        }
        return `row-${Math.random()}`;
      };

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
          const selectedRows = data.data.filter((row) => newSelection[resolveRowId(row)]);
          onRowSelectionChange?.(newSelection, selectedRows);
          return newSelection;
        });
      }
    },
    [data.data, onRowSelectionChange, resolveRowId, setRowSelection]
  );

  const isRowSelected = (row: TData) => {
    if (!rowSelection) return false;
    const rowId = resolveRowId(row);
    return !!rowSelection[rowId];
  };

  const [columnOrder, setColumnOrder] = useState([
    "mrt-row-select",
    "mrt-row-expand",
    "rowIndex",
    ...(columns.map((ele) => ele.accessorKey).filter((ele): ele is string => ele !== undefined) as string[]),
  ]);

  const [tableData, setTableData] = useState(() => data.data);

  useEffect(() => {
    setTableData(data.data);
  }, [data]);

  const table = useMaterialReactTable({
    initialState: {
      density: "compact",
      columnVisibility: hidingColumns,
      columnOrder,
    },
    columns,
    data: tableData ?? [],
    state: {
      isLoading: false,
      pagination,
      columnOrder,
      ...(sorting && { sorting }),
      rowSelection: rowSelection || {},
    },
    enableRowOrdering: true,

    enableColumnOrdering: true,
    onColumnOrderChange: setColumnOrder,

    enableTopToolbar,
    enableBottomToolbar,
    enableGlobalFilter: false,
    enableColumnFilters: false,
    enableColumnActions: false,
    enableHiding: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    rowCount: data.totalCount,
    manualPagination: true,
    /** NCSM은 0-based page index, material react table은 1-based page index 방식 */
    muiPaginationProps: {
      // 여기서 0-based 페이지네이션으로 설정합니다.
      page: pagination.pageIndex,
      count: Math.ceil(data.count / pagination.pageSize),
      showFirstButton: true,
      showLastButton: true,
      shape: "rounded",
      onChange: (_, newPage) => {
        setPagination((prev) => ({ ...prev, pageIndex: newPage }));
      },
    },
    paginationDisplayMode: "custom",
    manualSorting: Boolean(sorting),
    enableSortingRemoval: true,
    onSortingChange: (props) => {
      if (!sorting && !setSorting) return;

      if (rowSelection && Object.keys(rowSelection).length !== 0) {
        setShowSortingModal(true);
        setSortingProps(props);
      } else {
        setSorting &&
          setSorting((prevSorting) => {
            const newSorting = typeof props === "function" ? props(prevSorting) : props;
            return newSorting;
          });
      }
    },
    enableColumnResizing: enableCellResizing,
    columnResizeMode: "onEnd",
    layoutMode: "grid",
    localization: MRT_Localization_KO,
    enableExpanding: enableRowExpanding,
    renderDetailPanel:
      enableRowExpanding && DetailPanelComponent
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
    enableRowSelection,
    enableMultiRowSelection: true,
    onRowSelectionChange: handleRowSelectionChange,
    getRowId: resolveRowId,
    displayColumnDefOptions: {
      "mrt-row-drag": {
        header: "", // 여기서 컬럼명을 원하는 대로 변경할 수 있습니다.
        size: 40, // 컬럼 크기 조정
      },
      "mrt-row-select": {
        // Cell: ({ row }) => (
        //   <StyledTableCheckbox checked={isRowSelected(row.original)} onChange={row.getToggleSelectedHandler()} />
        // ),
        // Header: ({ table }) => (
        //   <StyledTableCheckbox
        //     isHeadCell={true}
        //     checked={table?.getIsAllRowsSelected?.() ?? false}
        //     onChange={
        //       table?.getToggleAllRowsSelectedHandler?.() ??
        //       (() => {
        //         /** optional chaining */
        //       })
        //     }
        //   />
        // ),
      },
    },
    muiTablePaperProps: {
      sx: {
        ...(mrtPaperStyles &&
          mrtPaperStyles.tableWidth && {
            width: mrtPaperStyles.tableWidth,
          }),
        ...(mrtPaperStyles &&
          mrtPaperStyles.tableMinWidth && {
            minWidth: mrtPaperStyles.tableMinWidth,
          }),
        ...(mrtPaperStyles &&
          mrtPaperStyles.tableMaxWidth && {
            maxWidth: mrtPaperStyles.tableMaxWidth,
          }),
        ...(mrtPaperStyles &&
          mrtPaperStyles.tableHeight && {
            height: mrtPaperStyles.tableHeight,
          }),
        ...(mrtPaperStyles &&
          mrtPaperStyles.tableMinHeight && {
            minHeight: mrtPaperStyles.tableMinHeight,
          }),
        ...(mrtPaperStyles &&
          mrtPaperStyles.tableMaxHeight && {
            maxHeight: mrtPaperStyles.tableMaxHeight,
          }),
        ...(mrtPaperStyles &&
          mrtPaperStyles.tableOverflowY && {
            overflowY: mrtPaperStyles.tableOverflowY,
          }),
      },
    },
    muiTableContainerProps: {
      ref: tableContainerRef,
      sx: {
        minHeight: "600px",
        height: "100%",
        boxShadow: "inset 0 -1px 0 var(--Grey-G-60)",
        ...(mrtContainerStyles &&
          mrtContainerStyles.tableWidth && {
            width: mrtContainerStyles.tableWidth,
          }),
        ...(mrtContainerStyles &&
          mrtContainerStyles.tableMinWidth && {
            minWidth: mrtContainerStyles.tableMinWidth,
          }),
        ...(mrtContainerStyles &&
          mrtContainerStyles.tableMaxWidth && {
            maxWidth: mrtContainerStyles.tableMaxWidth,
          }),
        ...(mrtContainerStyles &&
          mrtContainerStyles.tableHeight && {
            height: mrtContainerStyles.tableHeight,
          }),
        ...(mrtContainerStyles &&
          mrtContainerStyles.tableMinHeight && {
            minHeight: mrtContainerStyles.tableMinHeight,
          }),
        ...(mrtContainerStyles &&
          mrtContainerStyles.tableMaxHeight && {
            maxHeight: mrtContainerStyles.tableMaxHeight,
          }),
        ...(mrtContainerStyles &&
          mrtContainerStyles.tableOverflowY && {
            overflowY: mrtContainerStyles.tableOverflowY,
          }),
      },
    },
    muiTableProps: {
      sx: {
        "& .MuiTableHead-root": {
          opacity: 1,
        },
        "& .MuiTableRow-head": {
          "& .MuiTableCell-head": {
            padding: `${headCellPadding ?? "2px 4px"} !important`,
          },
          /** 셋 중 하나만 가능한 경우 -> first th, td 강제적으로 크기 감소 */
          ...(checkTrueCount([enableRowExpanding, enableRowSelection, enableRowNumbering], 1) && {
            "& th:first-of-type": {
              minWidth: "40px",
              maxWidth: "40px",
              justifyContent: "center",
              alignItems: "center",

              "& .Mui-TableHeadCell-Content": {
                justifyContent: "center",
                alignItems: "center",

                /** expand의 경우, thead 에서 이렇게 감싸져있음 */
                "& .Mui-TableHeadCell-Content-Labels": {
                  "& .Mui-TableHeadCell-Content-Wrapper": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                },
              },
            },
          }),
          /** 셋 중 둘 가능한 경우 -> nth(2) th, td 강제적으로 크기 감소 */
          ...(checkTrueCount([enableRowExpanding, enableRowSelection, enableRowNumbering], 2) && {
            "& th:nth-of-type(2)": {
              minWidth: "40px",
              maxWidth: "40px",
              justifyContent: "center",
              alignItems: "center",

              "& .Mui-TableHeadCell-Content": {
                justifyContent: "center",
                alignItems: "center",

                /** expand의 경우, thead 에서 이렇게 감싸져있음 */
                "& .Mui-TableHeadCell-Content-Labels": {
                  "& .Mui-TableHeadCell-Content-Wrapper": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                },
              },
            },
          }),
          ...(checkTrueCount([enableRowExpanding, enableRowSelection, enableRowNumbering], 3) && {
            "& th:nth-of-type(3)": {
              minWidth: "40px",
              maxWidth: "40px",
              justifyContent: "center",
              alignItems: "center",

              "& .Mui-TableHeadCell-Content": {
                justifyContent: "center",
                alignItems: "center",

                /** expand의 경우, thead 에서 이렇게 감싸져있음 */
                "& .Mui-TableHeadCell-Content-Labels": {
                  "& .Mui-TableHeadCell-Content-Wrapper": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                },
              },
            },
          }),
        },
        "& .MuiTableBody-root": {
          minHeight: "600px",
          display: "flex",
          flexDirection: "column",
          ...(mrtTableBodyStyles &&
            mrtTableBodyStyles.tableWidth && {
              width: mrtTableBodyStyles.tableWidth,
            }),
          ...(mrtTableBodyStyles &&
            mrtTableBodyStyles.tableMinWidth && {
              minWidth: mrtTableBodyStyles.tableMinWidth,
            }),
          ...(mrtTableBodyStyles &&
            mrtTableBodyStyles.tableMaxWidth && {
              maxWidth: mrtTableBodyStyles.tableMaxWidth,
            }),
          ...(mrtTableBodyStyles &&
            mrtTableBodyStyles.tableHeight && {
              height: mrtTableBodyStyles.tableHeight,
            }),
          ...(mrtTableBodyStyles &&
            mrtTableBodyStyles.tableMinHeight && {
              minHeight: mrtTableBodyStyles.tableMinHeight,
            }),
          ...(mrtTableBodyStyles &&
            mrtTableBodyStyles.tableMaxHeight && {
              maxHeight: mrtTableBodyStyles.tableMaxHeight,
            }),
          ...(mrtTableBodyStyles &&
            mrtTableBodyStyles.tableOverflowY && {
              overflowY: mrtTableBodyStyles.tableOverflowY,
            }),

          "& .MuiTableRow-root": {
            flex: "0 0 auto",

            "& .MuiTableCell-body": {
              padding: `${bodyCellPadding ?? "2px 4px"} !important`,
            },
            ...(checkTrueCount([enableRowExpanding, enableRowSelection, enableRowNumbering], 1) && {
              "& td:first-of-type": {
                minWidth: "40px",
                maxWidth: "40px",
                justifyContent: "center",
                alignItems: "center",
              },
            }),
            ...(checkTrueCount([enableRowExpanding, enableRowSelection, enableRowNumbering], 2) && {
              "& td:nth-of-type(2)": {
                minWidth: "40px",
                maxWidth: "40px",
                justifyContent: "center",
                alignItems: "center",
              },
            }),
            ...(checkTrueCount([enableRowExpanding, enableRowSelection, enableRowNumbering], 3) && {
              "& td:nth-of-type(3)": {
                minWidth: "40px",
                maxWidth: "40px",
                justifyContent: "center",
                alignItems: "center",
              },
            }),
          },
          /** DetailPanel은 child 받을 것이기 때문에 maxWidth unset */
          "& .Mui-TableBodyCell-DetailPanel": {
            "& td:first-of-type, td:nth-of-type(2)": {
              maxWidth: "unset !important",
            },
          },
        },
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => rowClick && rowClick(row),
      sx: {
        cursor: rowClick && "pointer", // 마우스 커서를 포인터로 변경
      },
    }),
    renderEmptyRowsFallback: () => <EmptyTableBody height={emptyHeight} />,
    renderTopToolbar: () => {
      if (!(enableTopToolbar && TopToolbarComponent)) return <></>;
      return React.cloneElement(TopToolbarComponent as React.ReactElement, {
        filteredRow: {
          filteredCount: data.count,
          totalCount: data.totalCount,
        },
      });
    },
    renderBottomToolbar: () => {
      if (!enableBottomToolbar) return <></>;

      return (
        <PaginationComponent
          pagination={pagination}
          totalRowCount={data.totalCount}
          paginationStyle={paginationStyle}
          pageSizeArr={pageSizeArr}
          setPagination={setPagination}
        />
      );
    },
  });

  useEffect(() => table.resetColumnSizing(cellResetClicked), [cellResetClicked, table]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box ref={tableRef} position="relative">
        <MaterialReactTable table={table as MRT_TableInstance<TData>} />
        <FadeOverlay
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
