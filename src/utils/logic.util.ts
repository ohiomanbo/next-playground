import { camelToSnakeConverter } from "@/utils/common.util";
import type { MRT_SortingState } from "material-react-table";

export const orderDecomposer = <T>(sorting: MRT_SortingState) => {
  let orderingText = undefined;

  if (sorting.length > 0) {
    const id = sorting[0]?.id;
    // Single sort 이므로 sorting[0]만 조회
    const commonSortText = `${camelToSnakeConverter(id)}`;
    orderingText = `${sorting[0]?.desc ? "-" : ""}${commonSortText}`;
  }

  return orderingText as T | undefined;
};
