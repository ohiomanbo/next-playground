import type { FetchTableDataResponse, Pagination } from "@/types/api.type";
import type { ColumnDefArray } from "@/types/column.type";
import type { CsvConfig } from "@/types/common.type";
import { TableColumnIdentify } from "@/types/filter.type";
import type { DataTableStyles } from "@/types/style.type";
import type {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MRT_RowData,
  MRT_RowSelectionState,
  MRT_SortingState,
  MRT_TableInstance,
  MRT_VisibilityState,
} from "material-react-table";

/** ==== material react table 기능 ===== */
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
 * 데이터 테이블의 기본 props를 정의하는 인터페이스
 * @template TData 테이블 데이터의 타입
 * @extends DataTableWidthHeightStyles
 */
export interface DataTableProps<TData extends MRT_RowData> extends DataTableStyles {
  /**
   * @property {boolean} [isLoading] - 데이터가 현재 로딩 중인지 여부를 나타냅니다.
   */
  isLoading?: boolean;

  /**
   * @property {MRT_ColumnDef<TData>[]} columns - 테이블의 각 컬럼을 정의하는 배열입니다.
   */
  columns: MRT_ColumnDef<TData>[];

  /**
   * @property {TableColumnIdentify[]} allColumns - 테이블의 각 컬럼을 정의하는 배열입니다.
   */
  allColumns: TableColumnIdentify[];

  /**
   * @property {MRT_VisibilityState} [hidingColumns] - 현재 숨겨진 컬럼들의 상태를 나타냅니다.
   */
  hidingColumns?: MRT_VisibilityState;

  /**
   * @property {(row: MRT_Row<TData>) => void} [rowClick] - 행이 클릭되었을 때 실행될 함수입니다.
   * @param row 클릭된 행의 데이터
   */
  rowClick?: (row: MRT_Row<TData>) => void;

  /**
   * @property {(row: TData) => string} [getRowId] - 각 행에 대한 고유 ID를 생성하는 함수입니다.
   * @param row 행 데이터
   */
  getRowId?: (row: TData) => string;

  sorting?: {
    /**
     * @property {MRT_SortingState} [sorting] - 현재 테이블의 정렬 상태를 나타냅니다.
     */
    state: MRT_SortingState;

    /**
     * @property {React.Dispatch<React.SetStateAction<MRT_SortingState>>} [setSorting] - 테이블의 정렬 상태를 업데이트하는 함수입니다.
     */
    setState: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
  };

  rowSelection?: {
    /**
     * @property {MRT_RowSelectionState} [rowSelection] - 현재 선택된 행들의 상태를 나타냅니다.
     */
    state: MRT_RowSelectionState;

    /**
     * @property {React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>} [setRowSelection] - 행 선택 상태를 업데이트하는 함수입니다.
     */
    setState: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>;

    /**
     * @property {(newSelection: MRT_RowSelectionState, selectedRows: TData[]) => void} [onRowSelectionChange] - 행 선택 상태가 변경되었을 때 실행될 함수입니다.
     * @param newSelection 새로운 선택 상태
     * @param selectedRows 선택된 행들의 데이터
     */
    onRowSelectionChange?: (newSelection: MRT_RowSelectionState, selectedRows: TData[]) => void;
  };

  /**
   * @property {boolean} [isResetCellSizeClicked] - 셀 리셋 버튼이 클릭되었는지 여부를 나타냅니다.
   */
  isResetCellSizeClicked?: boolean;

  /**
   * @property {boolean} [enableTopToolbar] - 테이블 상단의 툴바를 표시할지 여부를 결정합니다.
   */
  enableTopToolbar?: boolean;

  /**
   * @property {boolean} [enableColumnResizing] - 사용자가 컬럼의 크기를 조정할 수 있는지 여부를 결정합니다.
   */
  enableColumnResizing?: boolean;

  /**
   * @property {boolean} [enableExpanding] - 행을 확장하여 추가 정보를 표시할 수 있는지 여부를 결정합니다.
   */
  enableExpanding?: boolean;

  /**
   * @property {boolean} [enableRowSelection] - 사용자가 행을 선택할 수 있는지 여부를 결정합니다.
   */
  enableRowSelection?: boolean;

  /**
   * @property {boolean} [enableRowNumbering] - 각 행에 번호를 표시할지 여부를 결정합니다.
   */
  enableRowNumbering?: boolean;

  /**
   * @property {boolean} [enableRowOrdering] - 각 행 drag & drop 가능 여부를 결정합니다.
   */
  enableRowOrdering?: boolean;

  /**
   * @property {boolean} [enableColumnOrdering] - 각 열 drag & drop 가능 여부를 결정합니다.
   */
  enableColumnOrdering?: boolean;

  /**
   * @property {boolean} [enableColumnActions] - 각 열의 actions 여부를 결정합니다.
   */
  enableColumnActions?: boolean;

  /**
   * @property {boolean} [enableClickToCopy] - 각 cell의 copyable 여부를 결정합니다.
   */
  enableClickToCopy?: boolean;

  /**
   * @property {React.ReactNode} [topToolbarComponent] - 테이블 상단에 표시할 커스텀 툴바 컴포넌트입니다.
   */
  topToolbarComponent?: React.ReactNode;

  /**
   * @property {React.ComponentType<DetailPanelProps<TData>>} [detailPanelComponent] - 행이 확장되었을 때 표시할 상세 정보 컴포넌트입니다.
   */
  detailPanelComponent?: React.ComponentType<DetailPanelProps<TData>>;

  tableStyle?: {
    cellStyle: {
      /**
       * @property {string} [headCellPadding] - 헤더 셀의 패딩 값을 정의합니다.
       */
      headCellPadding?: string;

      /**
       * @property {string} [bodyCellPadding] - 바디 셀의 패딩 값을 정의합니다.
       */
      bodyCellPadding?: string;
    };
  };
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
  dataResponse: FetchTableDataResponse<TData>;

  /**
   * @property {boolean} [enableBottomToolbar] - 테이블 하단의 툴바를 표시할지 여부를 결정합니다.
   */
  enableBottomToolbar?: boolean;

  pagination: {
    state: MRT_PaginationState;
    setState: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;
    pageSizeArr?: number[];
    style?: {
      dropdownWidth?: string;
      dropdownPadding?: string;
    };
  };
}

/** Component type */
export interface DefaultTableDrawerProps {
  /** @property {React.RefObject<HTMLDivElement>} containerRef - 드로어의 컨테이너 참조 */
  containerRef: React.RefObject<HTMLDivElement>;

  /** @property {Object} drawerInfo - 드로어 정보 */
  drawerInfo: {
    /** @property {boolean} show - 드로어 표시 여부 */
    show: boolean;

    /** @property {number} idx - 드로어 인덱스 */
    idx: number;

    /** @property {string} name - 드로어 이름 */
    name: string;
  };

  /** @property {string} drawerTitle - 드로어의 제목 */
  drawerTitle: string;

  /** @property {string} [nameDescription] - 이름 설명 */
  nameDescription?: string;

  /** @property {() => void} clearingDrawer - 드로어 초기화 함수 */
  clearingDrawer: () => void;
}

/** Common data table configuration props */
export interface CommonDataTableConfigProps<T extends MRT_RowData> {
  /** @property {CsvConfig<T>} [csvConfig] - CSV 구성 설정 */
  csvConfig?: CsvConfig<T>;

  /** @property {Object} [drawerConfig] - 드로어 구성 설정 */
  drawerConfig?: {
    /** @property {React.FC<DefaultTableDrawerProps>} Component - 드로어 컴포넌트 */
    Component: React.FC<DefaultTableDrawerProps>;

    /** @property {string} title - 드로어 제목 */
    title: string;

    /** @property {string} nameDescription - 이름 설명 */
    nameDescription: string;

    /** @property {Object} drawerInfo - 드로어 정보 */
    drawerInfo: {
      show: boolean;
      idx: number;
      name: string;
    };

    /** @property {() => void} clearingDrawer - 드로어 초기화 함수 */
    clearingDrawer: () => void;
  };

  /** @property {Object} [modalConfig] - 모달 구성 설정 */
  modalConfig?: {
    /** @property {Object} [createGroup] - 그룹 생성 모달 설정 */
    createGroup?: {
      /** @property {boolean} show - 모달 표시 여부 */
      show: boolean;

      /** @property {React.Dispatch<React.SetStateAction<boolean>>} setShow - 모달 표시 상태 변경 함수 */
      setShow: React.Dispatch<React.SetStateAction<boolean>>;
    };

    /** @property {Object} [deploy] - 배포 모달 설정 */
    deploy?: {
      show: boolean;
      setShow: React.Dispatch<React.SetStateAction<boolean>>;
    };
  };

  /** @property {Object} [rowSelectionConfig] - 행 선택 구성 설정 */
  rowSelectionConfig?: {
    rowSelection: MRT_RowSelectionState;
    setRowSelection: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>;
  };
}

/** Common data table props */
export interface CommonDataTableProps<T extends MRT_RowData, O extends string | undefined>
  extends CommonDataTableConfigProps<T>,
    DataTableStyles {
  /** @property {string} pageId - 페이지 식별자 */
  pageId: string;

  /** @property {string} searchTerm - 검색어 */
  searchTerm: string;

  /** @property {ColumnDefArray<T>} columns - 테이블 컬럼 정의 */
  columns: ColumnDefArray<T>;

  /** @property {(filters?: string, limit?: number, offset?: number, ordering?: O) => Promise<Pagination<T>>} api - API 호출 함수 */
  api: (filters?: string, limit?: number, offset?: number, ordering?: O) => Promise<Pagination<T>>;

  /** @property {(string | number)[]} [queryKey] - 쿼리 키 */
  queryKey?: (string | number)[];

  /** @property {MRT_SortingState} [initialSorting] - 초기 정렬 */
  initialSorting?: MRT_SortingState;

  /** @property {number} [initialPageSize] - 초기 페이지 크기 */
  initialPageSize?: number;

  /** @property {boolean} [enableColumnResizing] - 셀 크기 조정 활성화 여부 */
  enableColumnResizing?: boolean;

  /** @property {boolean} [enableRowNumbering] - 행 번호 표시 활성화 여부 */
  enableRowNumbering?: boolean;

  /** @property {boolean} [enableTopToolbar] - 상단 툴바 활성화 여부 */
  enableTopToolbar?: boolean;

  /** @property {boolean} [enableItemDelete] - 항목 삭제 활성화 여부 */
  enableItemDelete?: boolean;

  /** @property {() => void} [deleteItemFn] - 항목 삭제 함수 */
  deleteItemFn?: () => void;

  /** @property {boolean} [hideFilter] - 필터 숨김 여부 */
  hideFilter?: boolean;

  /** @property {boolean} [showSelectedRow] - selected row 보여주기 여부 */
  showSelectedRow?: boolean;

  /** @property {React.ReactNode} [tableControlAreaLeftActions] - 테이블 상단 왼쪽 영역 액션 */
  tableControlAreaLeftActions?: React.ReactNode;

  /** @property {React.ReactNode} [tableControlAreaRightActions] - 테이블 상단 오른쪽 영역 액션 */
  tableControlAreaRightActions?: React.ReactNode;

  /** @property {(row: T) => string} [getRowId] - 행 ID 생성 함수 */
  getRowId?: (row: T) => string;

  /** @property {number} [refetchTrigger] - 데이터 재조회 트리거 */
  refetchTrigger?: number;

  /** @property {string} [headCellPadding] - 헤더 셀 패딩 */
  headCellPadding?: string;

  /** @property {string} [bodyCellPadding] - 바디 셀 패딩 */
  bodyCellPadding?: string;

  /** @property {(newSelection: MRT_RowSelectionState, selectedRows: T[]) => void} [onRowSelectionChange] - 행 선택 변경 핸들러 */
  onRowSelectionChange?: (newSelection: MRT_RowSelectionState, selectedRows: T[]) => void;
}

/** Common paginated data table props */
type MergedProps<T extends MRT_RowData, O extends string | undefined> = Omit<
  PaginatedDataTableProps<T>,
  | "columns"
  | "data"
  | "setPagination"
  | "pagination"
  | "isLoading"
  | "sorting"
  | "setSorting"
  | "hidingColumns"
  | "cellResetClicked"
  | "enableExpanding"
  | "enableRowSelection"
> &
  CommonDataTableProps<T, O>;

export interface CommonPaginatedDataTableProps<T extends MRT_RowData, O extends string | undefined>
  extends Readonly<MergedProps<T, O>> {}
