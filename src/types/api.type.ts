export interface Pagination<T> {
  /** @property {number} [count] - 현재 페이지의 데이터 수 */
  count?: number;
  /** @property {number} [totalCount] - 전체 데이터 수 */
  totalCount?: number;
  /** @property {boolean} [isNext] - 다음 페이지의 데이터 존재 여부 */
  isNext?: boolean;
  /** @property {T[]} [data] - 현재 페이지의 데이터 배열 */
  data?: T[];
}

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
