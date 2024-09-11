/**
 * 너비와 높이 스타일을 정의하는 인터페이스
 */
export interface WidthHeightStyles {
  /** @property {string | number} [width] - 너비 */
  width?: string | number;
  /** @property {string | number} [minWidth] - 최소 너비 */
  minWidth?: string | number;
  /** @property {string | number} [maxWidth] - 최대 너비 */
  maxWidth?: string | number;
  /** @property {string | number} [height] - 높이 */
  height?: string | number;
  /** @property {string | number} [minHeight] - 최소 높이 */
  minHeight?: string | number;
  /** @property {string | number} [maxHeight] - 최대 높이 */
  maxHeight?: string | number;
}

/**
 * 오버플로우 스타일을 정의하는 인터페이스
 */
export interface OverflowStyles {
  /** @property {string} [tableOverflowY] - 수직 오버플로우 스타일 */
  overflowY?: string;
  /** @property {string} [tableOverflowX] - 수평 오버플로우 스타일 */
  overflowX?: string;
}

/**
 * 데이터 테이블의 너비와 높이 관련 스타일을 정의하는 인터페이스
 */
export interface DataTableStyles {
  /**
   * @description 테이블을 감싸는 전체적인 컨테이너의 스타일
   * @property {string | number} [width] - 테이블의 너비
   * @property {string | number} [minWidth] - 테이블의 최소 너비
   * @property {string | number} [maxWidth] - 테이블의 최대 너비
   * @property {string | number} [height] - 테이블의 높이
   * @property {string | number} [minHeight] - 테이블의 최소 높이
   * @property {string | number} [maxHeight] - 테이블의 최대 높이
   * @property {string} [overflowY] - 테이블의 수직 오버플로우 스타일
   * @property {string} [overflowㅌ] - 테이블의 수평 오버플로우 스타일
   */
  mrtPaperStyles?: WidthHeightStyles & OverflowStyles;

  /**
   * @description 테이블 내용(헤더, 바디 등)을 담는 내부 컨테이너(스크롤 처리나 레이아웃 제어를 담당)의 스타일
   * @property {string | number} [tableWidth] - 컨테이너의 너비
   * @property {string | number} [tableMinWidth] - 컨테이너의 최소 너비
   * @property {string | number} [tableMaxWidth] - 컨테이너의 최대 너비
   * @property {string | number} [tableHeight] - 컨테이너의 높이
   * @property {string | number} [tableMinHeight] - 컨테이너의 최소 높이
   * @property {string | number} [tableMaxHeight] - 컨테이너의 최대 높이
   * @property {string} [overflowY] - 컨테이너의 수직 오버플로우 스타일
   * @property {string} [overflowX] - 컨테이너의 수평 오버플로우 스타일
   */
  mrtContainerStyles?: WidthHeightStyles & OverflowStyles;

  /**
   * @description  실제 테이블 컴포넌트(헤더, 행, 셀 등 데이터를 표현)의 스타일
   */
  mrtTableStyles?: {
    tableHeadMargin?: string | number;
  };

  /**
   * Material React Table 테이블 바디 스타일
   * @property {string | number} [width] - 테이블 바디의 너비
   * @property {string | number} [minWidth] - 테이블 바디의 최소 너비
   * @property {string | number} [maxWidth] - 테이블 바디의 최대 너비
   * @property {string | number} [height] - 테이블 바디의 높이
   * @property {string | number} [minHeight] - 테이블 바디의 최소 높이
   * @property {string | number} [maxHeight] - 테이블 바디의 최대 높이
   * @property {string} [overflowY] - 테이블 바디의 수직 오버플로우 스타일
   * @property {string} [overflowX] - 테이블 바디의 수평 오버플로우 스타일
   */
  mrtTableBodyStyles?: WidthHeightStyles & OverflowStyles;

  mrtCellStyles?: {
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

  /**
   * @property {string} [emptyHeight] - 데이터가 없을 때 표시할 빈 테이블의 높이
   */
  emptyHeight?: string;
}
