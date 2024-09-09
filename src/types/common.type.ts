export type WithIsLocal<T> = T & { isLocal: boolean };

/**
 * CSV 구성 설정
 * @template T CSV 데이터의 타입
 */
export type CsvConfig<T> = {
  /**
   * @property {string} fileName - 생성될 CSV 파일의 이름
   */
  fileName: string;

  /**
   * @property {{ key: keyof T; label: string; format?: (value: unknown) => string }[]} convertFields - CSV로 변환할 필드 배열
   * @description 변환할 필드의 키, 라벨, 포맷팅 함수를 정의한 배열
   * @property {keyof T} key - 변환할 필드의 키
   * @property {string} label - CSV에서 필드의 라벨
   * @property {(value: unknown) => string} [format] - 값 포맷팅 함수 (선택 사항)
   */
  convertFields: { key: keyof T; label: string; format?: (value: unknown) => string }[];

  /**
   * @property {string} [targetAt] - 대상 위치 (선택 사항)
   */
  targetAt?: string;
};
