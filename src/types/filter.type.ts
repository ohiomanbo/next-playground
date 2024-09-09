import type { DropdownOption } from "@/components/Dropdown/Dropdown";

/** ===== filter 정의 ====== */
export const operatorSet = [
  {
    header: "",
    accessorKey: "",
  },
  {
    header: "포함",
    accessorKey: "LIKE",
  },
  {
    header: "미포함",
    accessorKey: "NOT_LIKE",
  },
  {
    header: "같음",
    accessorKey: "EQ",
  },
  {
    header: "같지 않음",
    accessorKey: "NOT_EQ",
  },
  {
    header: "보다 큰",
    accessorKey: "GT",
  },
  {
    header: "크거나 같은",
    accessorKey: "GTE",
  },
  {
    header: "보다 작은",
    accessorKey: "LT",
  },
  {
    header: "작거나 같은",
    accessorKey: "LTE",
  },
  {
    header: "사이",
    accessorKey: "BETWEEN",
  },
] as const;

/**
 * @property {string[]} OperatorAccessorKeySet - 필터 연산자의 접근자 키 배열
 */
const OperatorAccessorKeySet = [...operatorSet.map((ele) => ele.accessorKey)] as const;

/**
 * @typedef {Object} Operator
 * @property {string} header - 연산자 헤더
 * @property {string} accessorKey - 연산자 접근자 키
 */
export type Operator = (typeof operatorSet)[number];

/** @typedef {string} OperatorAccessorKey - 연산자 접근자 키 */
export type OperatorAccessorKey = (typeof OperatorAccessorKeySet)[number];

/** ===== filter with table 정의 ===== */
export interface TableColumnIdentify {
  /** @property {string} accessorKey - 컬럼의 접근자 키 */
  accessorKey: string;
  /** @property {string} header - 컬럼 헤더 */
  header: string;
}

/** table column define */
export type ColumnFilterInfo = {
  /** @property {"string" | "number" | "date" | "boolean"} [type] - 컬럼 필터의 데이터 타입 */
  type?: "string" | "number" | "date" | "boolean";
  /** @property {string} [placeholder] - 필터 입력의 플레이스홀더 */
  placeholder?: string;
  /** @property {OperatorAccessorKey[]} [disabledOperators] - 비활성화된 연산자 목록 */
  disabledOperators?: OperatorAccessorKey[];
  /** @property {OperatorAccessorKey[]} [enabledOperators] - 활성화된 연산자 목록 */
  enabledOperators?: OperatorAccessorKey[];
  /** @property {DropdownOption[]} [booleanValueOptions] - boolean 타입 필터의 드롭다운 옵션 */
  booleanValueOptions?: DropdownOption<string>[];
  /** @property {boolean} [showBrowserTooltip] - 브라우저 툴팁 표시 여부 */
  showBrowserTooltip?: boolean;
};
