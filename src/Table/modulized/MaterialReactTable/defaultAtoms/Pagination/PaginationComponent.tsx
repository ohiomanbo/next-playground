import React, { useCallback, useMemo } from "react";
import type { MRT_PaginationState } from "material-react-table";

import { Dropdown, DropdownOption } from "@/components/Dropdown/Dropdown";
import PageMoveButton from "@/Table/modulized/MaterialReactTable/defaultAtoms/Pagination/(components)/Button/PageMove/PageMoveButton";

import styles from "./PaginationComponent.module.css";

interface SeparatorProps {
  $isFirstPage?: boolean;
  $isLastPage?: boolean;
  $color?: string;
}

const Separator: React.FC<SeparatorProps> = React.memo(({ $isFirstPage = false, $isLastPage = false, $color }) => (
  <div
    className={styles.separator}
    style={{
      backgroundColor: $color || ($isFirstPage && $isLastPage ? "var(--Grey-G-40)" : "var(--Grey-G-20)"),
    }}
  />
));

interface DefaultPaginationComponentProps {
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  paginationStyle?: {
    dropdownWidth?: string;
    dropdownPadding?: string;
  };
  pageSizeArr?: number[];
  totalRowCount: number;
  setPagination: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;
}

const DEFAULT_PAGE_SIZE_ARRAY = [5, 10, 15, 20, 25];

export const PaginationComponent = ({
  pagination,
  paginationStyle,
  pageSizeArr,
  totalRowCount,
  setPagination,
}: DefaultPaginationComponentProps) => {
  const pageSizeList: DropdownOption<string>[] = useMemo(
    () =>
      (pageSizeArr ?? DEFAULT_PAGE_SIZE_ARRAY).map((ele) => ({
        accessorKey: String(ele),
        header: String(ele),
      })),
    [pageSizeArr]
  );

  const isFirstPage = pagination.pageIndex === 0;
  const isLastPage = (pagination.pageIndex + 1) * pagination.pageSize >= totalRowCount;

  const totalPage = useMemo(
    () => Math.max(1, Math.ceil(totalRowCount / pagination.pageSize)),
    [pagination.pageSize, totalRowCount]
  );

  const changePageSize = useCallback(
    (newPageSize: number) => {
      setPagination((prev) => {
        const currentFirstItemIndex = prev.pageIndex * prev.pageSize;
        const newPageIndex = Math.floor(currentFirstItemIndex / newPageSize);
        return {
          ...prev,
          pageSize: newPageSize,
          pageIndex: newPageIndex,
        };
      });
    },
    [setPagination]
  );

  const moveFn = useCallback(
    (count: number) => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + count })),
    [setPagination]
  );

  const handleSelect = useCallback(
    (key: string | null) => {
      const numberKey = Number(key);
      if (key && !isNaN(numberKey)) changePageSize(numberKey);
    },
    [changePageSize]
  );

  return (
    <div className={styles.customPaginationWrapper}>
      <div className={styles.pageInfoCationWrapper}>
        <span>{pagination.pageIndex + 1}</span>
        <span>/{totalPage} Pages</span>
      </div>
      <div className={styles.pageMoveButtonWrapper}>
        <PageMoveButton
          $direction="left"
          onClick={!isFirstPage ? () => moveFn(-1) : undefined}
          $disabled={isFirstPage}
        />
        <Separator $isFirstPage={isFirstPage} $isLastPage={isLastPage} />
        <PageMoveButton
          $direction="right"
          onClick={!isLastPage ? () => moveFn(+1) : undefined}
          $disabled={isLastPage}
        />
      </div>
      <Separator $color="var(--Grey-G-40)" />
      <div className={styles.pageSizeControlWrapper}>
        <span>Rows per page</span>
        <Dropdown
          valueAccessorKey={String(pagination.pageSize)}
          dropdownWidth={paginationStyle?.dropdownWidth ?? "54px"}
          dropdownHeight={"32px"}
          dropdownPadding={paginationStyle?.dropdownPadding ?? "8px"}
          options={pageSizeList}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
};
