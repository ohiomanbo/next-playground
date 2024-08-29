import type {
  MRT_Cell,
  MRT_Column,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MRT_RowData,
  MRT_RowSelectionState,
  MRT_SortingState,
  MRT_TableInstance,
  MRT_VisibilityState,
} from "material-react-table";

/** ============= DataTable api 정의 ============= */
export type FetchTableDataRequest<TData> = ({
  limit,
  offset,
  filters,
  ordering,
}: {
  limit: number;
  offset: number;
  filters?: string;
  ordering?: string;
}) => Promise<FetchTableDataResponse<TData>>;

export interface FetchTableDataResponse<TData> {
  data: TData[];
  count: number;
  totalCount: number;
  isNext: boolean;
}

/** ============= DataTable Modulized Component 정의 ============= */
export type RenderDetailPanel<TData extends MRT_RowData> = {
  renderDetailPanel?: (props: { row?: MRT_Row<TData>; table?: MRT_TableInstance<TData> }) => React.ReactNode;
};

/**
 * 상세 패널 컴포넌트의 props를 정의하는 인터페이스
 * @template TData 테이블 데이터의 타입
 */
interface DetailPanelProps<TData extends MRT_RowData> {
  /** @description 현재 행의 데이터 */
  row?: MRT_Row<TData>;
  /** @description 테이블 인스턴스 */
  table?: MRT_TableInstance<TData>;
}

/**
 * 테이블의 너비와 높이 스타일을 정의하는 인터페이스
 */
export interface TableWidthHeightStyles {
  /** @property {string | number} [tableWidth] - 테이블의 너비 */
  tableWidth?: string | number;
  /** @property {string | number} [tableMinWidth] - 테이블의 최소 너비 */
  tableMinWidth?: string | number;
  /** @property {string | number} [tableMaxWidth] - 테이블의 최대 너비 */
  tableMaxWidth?: string | number;
  /** @property {string | number} [tableHeight] - 테이블의 높이 */
  tableHeight?: string | number;
  /** @property {string | number} [tableMinHeight] - 테이블의 최소 높이 */
  tableMinHeight?: string | number;
  /** @property {string | number} [tableMaxHeight] - 테이블의 최대 높이 */
  tableMaxHeight?: string | number;
}

/**
 * 테이블의 오버플로우 스타일을 정의하는 인터페이스
 */
export interface TableOverflowStyles {
  /** @property {string} [tableOverflowY] - 테이블의 수직 오버플로우 스타일 */
  tableOverflowY?: string;
}

/**
 * 데이터 테이블의 너비와 높이 관련 스타일을 정의하는 인터페이스
 */
export interface DataTableWidthHeightStyles {
  /**
   * Material React Table 페이퍼 스타일
   * @property {string | number} [tableWidth] - 테이블의 너비
   * @property {string | number} [tableMinWidth] - 테이블의 최소 너비
   * @property {string | number} [tableMaxWidth] - 테이블의 최대 너비
   * @property {string | number} [tableHeight] - 테이블의 높이
   * @property {string | number} [tableMinHeight] - 테이블의 최소 높이
   * @property {string | number} [tableMaxHeight] - 테이블의 최대 높이
   * @property {string} [tableOverflowY] - 테이블의 수직 오버플로우 스타일
   */
  mrtPaperStyles?: TableWidthHeightStyles & TableOverflowStyles;

  /**
   * Material React Table 컨테이너 스타일
   * @property {string | number} [tableWidth] - 컨테이너의 너비
   * @property {string | number} [tableMinWidth] - 컨테이너의 최소 너비
   * @property {string | number} [tableMaxWidth] - 컨테이너의 최대 너비
   * @property {string | number} [tableHeight] - 컨테이너의 높이
   * @property {string | number} [tableMinHeight] - 컨테이너의 최소 높이
   * @property {string | number} [tableMaxHeight] - 컨테이너의 최대 높이
   * @property {string} [tableOverflowY] - 컨테이너의 수직 오버플로우 스타일
   */
  mrtContainerStyles?: TableWidthHeightStyles & TableOverflowStyles;

  mrtTableStyles?: {
    tableHeadMargin?: string | number;
  };

  /**
   * Material React Table 테이블 바디 스타일
   * @property {string | number} [tableWidth] - 테이블 바디의 너비
   * @property {string | number} [tableMinWidth] - 테이블 바디의 최소 너비
   * @property {string | number} [tableMaxWidth] - 테이블 바디의 최대 너비
   * @property {string | number} [tableHeight] - 테이블 바디의 높이
   * @property {string | number} [tableMinHeight] - 테이블 바디의 최소 높이
   * @property {string | number} [tableMaxHeight] - 테이블 바디의 최대 높이
   * @property {string} [tableOverflowY] - 테이블 바디의 수직 오버플로우 스타일
   */
  mrtTableBodyStyles?: TableWidthHeightStyles & TableOverflowStyles;

  /**
   * @property {string} [emptyHeight] - 데이터가 없을 때 표시할 빈 테이블의 높이
   */
  emptyHeight?: string;
}

/**
 * 데이터 테이블의 기본 props를 정의하는 인터페이스
 * @template TData 테이블 데이터의 타입
 * @extends DataTableWidthHeightStyles
 */
export interface DataTableProps<TData extends MRT_RowData> extends DataTableWidthHeightStyles {
  /**
   * @property {boolean} [isLoading] - 데이터가 현재 로딩 중인지 여부를 나타냅니다.
   */
  isLoading?: boolean;

  /**
   * @property {MRT_ColumnDef<TData>[]} columns - 테이블의 각 컬럼을 정의하는 배열입니다.
   */
  columns: MRT_ColumnDef<TData>[];

  /**
   * @property {MRT_SortingState} [sorting] - 현재 테이블의 정렬 상태를 나타냅니다.
   */
  sorting?: MRT_SortingState;

  /**
   * @property {React.Dispatch<React.SetStateAction<MRT_SortingState>>} [setSorting] - 테이블의 정렬 상태를 업데이트하는 함수입니다.
   */
  setSorting?: React.Dispatch<React.SetStateAction<MRT_SortingState>>;

  /**
   * @property {MRT_VisibilityState} [hidingColumns] - 현재 숨겨진 컬럼들의 상태를 나타냅니다.
   */
  hidingColumns?: MRT_VisibilityState;

  /**
   * @property {boolean} [enableTopToolbar] - 테이블 상단의 툴바를 표시할지 여부를 결정합니다.
   */
  enableTopToolbar?: boolean;

  /**
   * @property {boolean} [enableCellResizing] - 사용자가 셀의 크기를 조정할 수 있는지 여부를 결정합니다.
   */
  enableCellResizing?: boolean;

  /**
   * @property {boolean} [enableRowExpanding] - 행을 확장하여 추가 정보를 표시할 수 있는지 여부를 결정합니다.
   */
  enableRowExpanding?: boolean;

  /**
   * @property {boolean} [enableRowSelection] - 사용자가 행을 선택할 수 있는지 여부를 결정합니다.
   */
  enableRowSelection?: boolean;

  /**
   * @property {boolean} [enableRowNumbering] - 각 행에 번호를 표시할지 여부를 결정합니다.
   */
  enableRowNumbering?: boolean;

  /**
   * @property {boolean} [cellResetClicked] - 셀 리셋 버튼이 클릭되었는지 여부를 나타냅니다.
   */
  cellResetClicked?: boolean;

  /**
   * @property {(row: MRT_Row<TData>) => void} [rowClick] - 행이 클릭되었을 때 실행될 함수입니다.
   * @param row 클릭된 행의 데이터
   */
  rowClick?: (row: MRT_Row<TData>) => void;

  /**
   * @property {string} [emptyHeight] - 데이터가 없을 때 표시할 빈 테이블의 높이를 정의합니다.
   */
  emptyHeight?: string;

  /**
   * @property {string} [headCellPadding] - 헤더 셀의 패딩 값을 정의합니다.
   */
  headCellPadding?: string;

  /**
   * @property {string} [bodyCellPadding] - 바디 셀의 패딩 값을 정의합니다.
   */
  bodyCellPadding?: string;

  /**
   * @property {MRT_RowSelectionState} [rowSelection] - 현재 선택된 행들의 상태를 나타냅니다.
   */
  rowSelection?: MRT_RowSelectionState;

  /**
   * @property {React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>} [setRowSelection] - 행 선택 상태를 업데이트하는 함수입니다.
   */
  setRowSelection?: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>;

  /**
   * @property {React.ReactNode} [topToolbarComponent] - 테이블 상단에 표시할 커스텀 툴바 컴포넌트입니다.
   */
  topToolbarComponent?: React.ReactNode;

  /**
   * @property {React.ComponentType<DetailPanelProps<TData>>} [detailPanelComponent] - 행이 확장되었을 때 표시할 상세 정보 컴포넌트입니다.
   */
  detailPanelComponent?: React.ComponentType<DetailPanelProps<TData>>;

  /**
   * @property {(row: TData) => string} [getRowId] - 각 행에 대한 고유 ID를 생성하는 함수입니다.
   * @param row 행 데이터
   */
  getRowId?: (row: TData) => string;

  /**
   * @property {(newSelection: MRT_RowSelectionState, selectedRows: TData[]) => void} [onRowSelectionChange] - 행 선택 상태가 변경되었을 때 실행될 함수입니다.
   * @param newSelection 새로운 선택 상태
   * @param selectedRows 선택된 행들의 데이터
   */
  onRowSelectionChange?: (newSelection: MRT_RowSelectionState, selectedRows: TData[]) => void;
}

/**
 * 무한 스크롤 데이터 테이블의 props를 정의하는 인터페이스
 * @template TData 테이블 데이터의 타입
 * @extends DataTableProps<TData>
 */
export interface InfiniteScrollDataTableProps<TData extends MRT_RowData> extends DataTableProps<TData> {
  /**
   * @property {TData[]} data - 현재 테이블에 표시될 데이터 배열입니다.
   */
  data: TData[];

  /**
   * @property {() => Promise<unknown>} fetchNextPage - 무한 스크롤 시 다음 페이지의 데이터를 가져오는 함수입니다.
   * @returns 다음 페이지 데이터를 가져오는 Promise
   */
  fetchNextPage: () => Promise<unknown>;

  /**
   * @property {boolean} hasNextPage - 더 가져올 데이터가 있는지 여부를 나타냅니다.
   */
  hasNextPage: boolean;
}

/**
 * 페이지네이션된 데이터 테이블의 props를 정의하는 인터페이스
 * @template TData 테이블 데이터의 타입
 * @extends DataTableProps<TData>
 */
export interface PaginatedDataTableProps<TData extends MRT_RowData> extends DataTableProps<TData> {
  /**
   * @property {{data: TData[], totalCount: number, count: number, isNext: boolean}} data - 현재 페이지의 데이터와 관련 정보를 포함합니다.
   */
  data: {
    data: TData[];
    totalCount: number;
    count: number;
    isNext: boolean;
  };

  /**
   * @property {MRT_PaginationState} pagination - 현재 페이지네이션의 상태를 나타냅니다.
   */
  pagination: MRT_PaginationState;

  /**
   * @property {React.Dispatch<React.SetStateAction<MRT_PaginationState>>} setPagination - 페이지네이션 상태를 업데이트하는 함수입니다.
   */
  setPagination: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;

  /**
   * @property {{dropdownWidth?: string, dropdownPadding?: string}} [paginationStyle] - 페이지네이션 컴포넌트의 스타일을 정의합니다.
   */
  paginationStyle?: {
    dropdownWidth?: string;
    dropdownPadding?: string;
  };

  /**
   * @property {boolean} [enableBottomToolbar] - 테이블 하단의 툴바를 표시할지 여부를 결정합니다.
   */
  enableBottomToolbar?: boolean;

  /**
   * @property {number[]} [pageSizeArr] - 사용자가 선택할 수 있는 페이지 크기 옵션들을 정의합니다.
   */
  pageSizeArr?: number[];
}

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

/**
 * 테이블 연산자 컬럼을 정의하는 인터페이스
 */
export interface TableOperatorColumn {
  /** @property {string} accessorKey - 컬럼의 접근자 키 */
  accessorKey: string;
  /** @property {string} header - 컬럼 헤더 */
  header: string;
}

/**
 * CSV 호환 가능한 타입을 정의하는 타입
 * @template T 원본 데이터 타입
 */
export type CsvCompatible<T> = {
  [K in keyof T]: string | number | boolean | null | undefined | Array<string | number | boolean | object>;
};

/**
 * CSV 필드를 정의하는 타입
 * @template T 데이터 타입
 * @template U 커스텀 필드 타입
 * @property {keyof T} key - CSV 필드의 키
 * @property {string} label - CSV 필드의 라벨
 * @property {(value: T[keyof T] | U, item?: CsvCompatible<T>) => string | number | boolean} [format] - 필드 값을 포맷팅하는 함수
 * @property {boolean} [passNull] - null 값을 포함할지 여부
 */
export type CsvField<T, U> = {
  key: keyof T;
  label: string;
  format?: (value: T[keyof T] | U, item?: CsvCompatible<T>) => string | number | boolean;
  passNull?: boolean;
};
