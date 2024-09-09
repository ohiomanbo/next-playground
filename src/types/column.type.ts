import type { ColumnFilterInfo, Operator, TableColumnIdentify } from "@/types/filter.type";
import type {
  MRT_Cell,
  MRT_Column,
  MRT_ColumnDef,
  MRT_Row,
  MRT_RowData,
  MRT_TableInstance,
} from "material-react-table";

/**
 * 테이블 셀의 props를 정의하는 인터페이스
 * @template T 테이블 데이터의 타입
 */
export interface CellProps<T extends MRT_RowData> {
  /** @property {MRT_Cell<T, unknown>} cell - 셀 정보 */
  cell: MRT_Cell<T, unknown>;
  /** @property {MRT_Column<T, unknown>} column - 컬럼 정보 */
  column: MRT_Column<T, unknown>;
  /** @property {React.ReactNode} renderedCellValue - 렌더링된 셀 값 */
  renderedCellValue: React.ReactNode;
  /** @property {MRT_Row<T>} row - 행 정보 */
  row: MRT_Row<T>;
  /** @property {React.RefObject<HTMLTableRowElement>} [rowRef] - 행 ref */
  rowRef?: React.RefObject<HTMLTableRowElement>;
  /** @property {number} [staticColumnIndex] - 정적 컬럼 인덱스 */
  staticColumnIndex?: number;
  /** @property {number} [staticRowIndex] - 정적 행 인덱스 */
  staticRowIndex?: number;
  /** @property {MRT_TableInstance<T>} table - 테이블 인스턴스 */
  table: MRT_TableInstance<T>;
}

/** column hiding property */
export type ColumnHidingProperty = {
  /** @property {boolean} [hide] - 컬럼 숨김 여부 */
  hide?: boolean;
  /** @property {boolean} [hideFilter] - 필터 숨김 여부 */
  hideFilter?: boolean;
};

/** table header column definition */
export type TableHeaderColumn = TableColumnIdentify & ColumnFilterInfo;

/** combined column definition */
export type CombinedColumnDef<T extends MRT_RowData> = MRT_ColumnDef<T> & ColumnFilterInfo & ColumnHidingProperty;

/** array of column definitions */
export type ColumnDefArray<T extends MRT_RowData> = Array<CombinedColumnDef<T>>;

/** @typedef {Object} TableFilterObject - 테이블 필터 객체 */
export type TableFilterObject = {
  /** @property {TableHeaderColumn} column - 필터가 적용될 컬럼 정보 */
  column: TableHeaderColumn & { [key: string]: unknown };
  /** @property {Operator} operator - 필터 연산자 */
  operator: Operator & { accessorKey: string; header: string; [key: string]: unknown };
  /** @property {string | string[]} value - 필터 값 */
  value: string | string[];
};

/** table cell */
export interface CellReplacerProps {
  /** @property {string | string[] | number | number[] | boolean | null} [data] - 셀의 데이터 값 */
  data?: string | string[] | number | number[] | boolean | null;
  /** @property {string | number} [defaultValue] - 기본 값 */
  defaultValue?: string | number;
  /** @property {string} [tailUnit] - 값 뒤에 붙을 단위 (예: % 또는 px) */
  tailUnit?: string;
  /** @property {string | number | boolean | React.ReactNode} [formattedValue] - 포맷팅된 값 */
  formattedValue?: string | number | boolean | React.ReactNode;
  /** @property {(data?: string | string[] | number | number[] | boolean | null) => React.ReactNode} [formatter] - 값 포맷터 함수 */
  formatter?: (data?: string | string[] | number | number[] | boolean | null) => React.ReactNode;
  /** @property {boolean} [passNull] - null 값을 통과시킬지 여부 */
  passNull?: boolean;
  /** @property {boolean} [passUndefined] - undefined 값을 통과시킬지 여부 */
  passUndefined?: boolean;
  /** @property {boolean} [passEmptyString] - 빈 문자열을 통과시킬지 여부 */
  passEmptyString?: boolean;
  /** @property {boolean} [noEllipsis] - 말줄임표 표시 여부 */
  noEllipsis?: boolean;
}
