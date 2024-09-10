"use client";

import { useEffect, useRef, useState } from "react";
import { MRT_RowData, MRT_RowSelectionState } from "material-react-table";
import { FetchTableDataResponse } from "@/types/api.type";

interface UseTableRefProps<T extends MRT_RowData> {
  dataResponse: FetchTableDataResponse<T>;
  setRowSelection?: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>;
}

const useTableRef = <T extends MRT_RowData>({ dataResponse, setRowSelection }: UseTableRefProps<T>) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableBodyPosition, setTableBodyPosition] = useState({ top: 0, height: 0 });

  /**
   * table body에만 Loading 컴포넌트를 그리는 용도
   * 데이터가 변경될 때마다 위치를 다시 계산
   * */
  useEffect(() => {
    if (tableRef.current) {
      const tableElement = tableRef.current;
      const tableBody = tableElement.querySelector(".MuiTableBody-root");
      if (tableBody) {
        const { top, height } = tableBody.getBoundingClientRect();
        const tableTop = tableElement.getBoundingClientRect().top;
        setTableBodyPosition({
          top: top - tableTop,
          height: height,
        });
      }
    }
  }, [dataResponse]);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableContainerRef.current && setRowSelection) {
      setRowSelection({});
    }
  }, [setRowSelection]);

  return {
    tableRef,
    tableContainerRef,
    tableBodyPosition,
  };
};

export default useTableRef;
