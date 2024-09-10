import React from "react";
import MultiLineEllipsis from "@/components/MultiLineEllipsis";
import { CellProps, CellReplacerProps, CombinedColumnDef } from "@/types/column.type";
import { MRT_Cell, MRT_Column, MRT_Row, MRT_RowData, MRT_TableInstance } from "material-react-table";

/**
 * @description 셀의 값을 대체할 기본 로직을 처리합니다.
 * @param data 원시형 param
 * @param defaultValue 값이 없을 경우 대체할 기본값
 * @param tailUnit tailUnit 있는 경우, 반환 값은 data + tailUnit
 * @param formattedValue data와 별개로 이미 전처리된 값이 있는 경우 그대로 반환
 * @param formatter formatter 함수를 통해서 내부적으로 함수 실행해서 리턴
 * @param passNull default value : false
 * @param passUndefined default value : false
 * @param passEmptyString default value : true
 * @returns {string | number | boolean | React.ReactNode} - 처리된 셀 값
 */
export const cellEmptyValueReplacer = ({
  data,
  defaultValue = "-",
  tailUnit,
  formattedValue,
  formatter,
  passNull = false,
  passUndefined = false,
  passEmptyString = true,
}: CellReplacerProps): string | number | boolean | React.ReactNode => {
  if (
    (data === null && !passNull) ||
    (data === undefined && !passUndefined) ||
    (typeof data === "string" && data === "" && !passEmptyString) ||
    (Array.isArray(data) && data.length === 0 && (!passNull || !passUndefined))
  ) {
    return defaultValue;
  }

  if (formattedValue) return formattedValue;

  if (formatter) return formatter(data);

  if (tailUnit) return `${data}${tailUnit}`;

  return `${data}`;
};

/**
 * @description 셀을 생성하는 헬퍼 함수로, 셀의 기본 값을 대체하여 반환합니다.
 * @template T - 행 데이터 타입
 * @param {CellReplacerProps} props - 셀 대체와 관련된 속성들
 * @returns {(cell: CellProps<T>) => React.ReactNode} - 셀 컴포넌트
 */
export const createCell =
  <T extends MRT_RowData>(props: CellReplacerProps) =>
  ({ cell }: CellProps<T>) => {
    const value = cell.getValue();
    return cellEmptyValueReplacer({
      ...props,
      data: value as "string" | "number" | "boolean" | null,
    });
  };

/**
 * @description 문자열 내 개행 문자의 수를 계산합니다.
 * @param {unknown} value - 체크할 값
 * @returns {number} - 개행 문자의 수
 */
function checkLineCount(value: unknown): number {
  if (typeof value !== "string") {
    return 1;
  }

  const newlineCount = (value.match(/\n/g) || []).length;

  return newlineCount + 1;
}

/**
 * @description 테이블 컬럼을 생성하는 함수로, 셀 포맷팅 및 다중 라인 처리 등을 담당합니다.
 * @template T - 행 데이터 타입
 * @returns {CombinedColumnDef<T>} - 생성된 컬럼 정의
 */
export const createColumn = <T extends MRT_RowData>({
  size,
  defaultValue,
  tailUnit,
  formattedValue,
  formatter,
  passNull,
  passUndefined,
  noEllipsis,
  showBrowserTooltip,
  ...props
}: CombinedColumnDef<T> & Omit<CellReplacerProps, "data">): CombinedColumnDef<T> => {
  const cellContent =
    "Cell" in props
      ? props.Cell
      : createCell<T>({ defaultValue, tailUnit, formattedValue, formatter, passNull, passUndefined });

  /**
   *
   * @description memo 까지 처리하기 위해서 multiLine에 대해서 ... 처리를 하지만 string 타입이 아닌 경우는 처리해주지 않음
   * @returns
   */
  const wrappedCell = ({
    cell,
    row,
    column,
    table,
    renderedCellValue,
  }: {
    cell: MRT_Cell<T, unknown>;
    row: MRT_Row<T>;
    column: MRT_Column<T, unknown>;
    table: MRT_TableInstance<T>;
    renderedCellValue: React.ReactNode;
    [key: string]: unknown;
  }) => {
    let content: React.ReactNode;

    if (typeof cellContent === "function") {
      content = cellContent({ cell, row, column, table, renderedCellValue }) as React.ReactNode;
    } else {
      content = cell.getValue() as React.ReactNode;
    }

    return (
      <MultiLineEllipsis
        content={content}
        maxLines={checkLineCount(content)}
        noEllipsis={noEllipsis}
        showTitle={showBrowserTooltip}
      />
    );
  };

  return {
    Cell: wrappedCell,
    sortDescFirst: false, // 기본값
    ...(size && { size }),
    ...props,
  };
};

/**
 * @description 테이블 컬럼을 생성하는 함수를 이용한 데이터와 무관한 Index Column 공용 컴포넌트.
 * @template T - 행 데이터 타입
 * @returns {CombinedColumnDef<T>} - 생성된 컬럼 정의
 */
export const createTableIndexNumberColum = <T extends MRT_RowData>() =>
  createColumn<T>({
    accessorKey: "rowIndex",
    header: "No",
    type: "string",
    hideFilter: true,
    enableSorting: false,
    enableResizing: false,
    enableColumnActions: false,
    enableClickToCopy: false,
    enableEditing: false,
    enableColumnDragging: false,
    enableColumnOrdering: false,
    Cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex; // 현재 페이지 인덱스
      const pageSize = table.getState().pagination.pageSize; // 한 페이지당 행 수
      return pageIndex * pageSize + row.index + 1; // 전체 테이블 내에서의 행 번호
    },
  });
