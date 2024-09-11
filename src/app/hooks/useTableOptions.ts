import { DataTableStyles } from "@/types/style.type";
import { getTrueCount } from "@/utils/common.util";
import { applyStyleFixedSizeCellForCount, applyStyleWidthHeightOverflow } from "@/utils/style.util";
import { MRT_PaginationState, MRT_RowData, MRT_TableOptions } from "material-react-table";
import { MRT_Localization_KO } from "material-react-table/locales/ko";
import { useMemo } from "react";

interface UseTableStyleOptionsProps extends DataTableStyles {}

interface UseTableFeatures {
  enableExpanding: boolean;
  enableRowSelection: boolean;
  enableRowNumbering: boolean;
}

interface UseTablePaginationOptionsProps {
  count: number;
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  setPagination: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;
}

interface UseTableOptionsProps {
  tableContainerRef: React.RefObject<HTMLDivElement>;
  tableFeatures: UseTableFeatures;
  pagination: UseTablePaginationOptionsProps;
  style: UseTableStyleOptionsProps;
}

const useTableOptions = <TData extends MRT_RowData>({
  tableContainerRef,
  tableFeatures: { enableExpanding, enableRowNumbering, enableRowSelection },
  pagination: { count, totalCount, pageIndex, pageSize, setPagination },
  style: { mrtPaperStyles, mrtContainerStyles, mrtTableStyles, mrtTableBodyStyles, mrtCellStyles },
}: UseTableOptionsProps) => {
  const tableImmutableOptions: Partial<MRT_TableOptions<TData>> = useMemo(
    () => ({
      localization: MRT_Localization_KO,
      layoutMode: "grid",
      initialState: {
        density: "compact",
      },

      enableGlobalFilter: false,
      enableColumnFilters: false,
      enableFullScreenToggle: false,
      enableDensityToggle: false,
      enableHiding: true,
      manualPagination: true,

      columnResizeMode: "onChange", // resize
      paginationDisplayMode: "custom", //pagination
      enableSortingRemoval: true, //sorting
    }),
    []
  );

  const tablePaginationOptions: Partial<MRT_TableOptions<TData>> = useMemo(
    () => ({
      rowCount: totalCount,
      muiPaginationProps: {
        /**
         * NCSM은 0-based page index, material react table은 1-based page index 방식
         * 0-based 페이지네이션으로 로직 설정
         */
        page: pageIndex,
        count: Math.ceil(count / pageSize),
        showFirstButton: true,
        showLastButton: true,
        shape: "rounded",
        onChange: (_, newPage) => {
          setPagination((prev) => ({ ...prev, pageIndex: newPage }));
        },
      },
    }),
    [count, pageIndex, pageSize, setPagination, totalCount]
  );

  const tableStyleOptions: Partial<MRT_TableOptions<TData>> = useMemo(
    () => ({
      muiTablePaperProps: {
        sx: applyStyleWidthHeightOverflow(mrtPaperStyles),
      },
      muiTableContainerProps: {
        ref: tableContainerRef,
        sx: applyStyleWidthHeightOverflow(mrtContainerStyles),
      },
      muiTableProps: {
        sx: {
          "& .MuiTableRow-head": {
            ...(mrtTableStyles?.tableHeadMargin && { margin: mrtTableStyles.tableHeadMargin }),
            "& .MuiTableCell-head": {
              padding: `${mrtCellStyles?.cellStyle?.headCellPadding ?? "2px 4px"} !important`,
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
                padding: `${mrtCellStyles?.cellStyle?.bodyCellPadding ?? "2px 4px"} !important`,
              },
              ...applyStyleFixedSizeCellForCount(
                getTrueCount([enableExpanding, enableRowSelection, enableRowNumbering])
              ),
            },
          },
        },
      },
    }),
    [
      enableExpanding,
      enableRowNumbering,
      enableRowSelection,
      mrtCellStyles,
      mrtContainerStyles,
      mrtPaperStyles,
      mrtTableBodyStyles,
      mrtTableStyles,
      tableContainerRef,
    ]
  );

  return {
    tableImmutableOptions,
    tablePaginationOptions,
    tableStyleOptions,
  };
};

export default useTableOptions;
