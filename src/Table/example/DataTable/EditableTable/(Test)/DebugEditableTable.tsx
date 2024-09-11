"use client";

import React, { useState, useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable, type MRT_TableOptions } from "material-react-table";

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
};

const initialData: Person[] = [
  { id: 1, firstName: "John", lastName: "Doe", age: 30 },
  { id: 2, firstName: "Jane", lastName: "Smith", age: 25 },
];

const EditableDataTable: React.FC = () => {
  const [tableData, setTableData] = useState(initialData);

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        // Edit: () => null, // Render nothing for Age. 이걸 주석 풀고 실행 후 다시 주석 처리하면 input 상태를 유지하게 됨
      },
      {
        accessorKey: "age",
        header: "Age",
      },
    ],
    []
  );

  const tableOptions: MRT_TableOptions<Person> = useMemo(
    () => ({
      columns,
      data: tableData,
      editDisplayMode: "cell",
      enableEditing: true,
      enableClickToCopy: false,

      // 여기서 각 td에 대한 스타일을 지정
      muiTableBodyCellProps: {
        sx: {
          backgroundColor: "lightyellow", // 셀 전체의 배경색
          border: "1px solid gray", // 셀 테두리
          padding: 0,
          margin: 0,

          "&:hover": {
            backgroundColor: "lightblue", // 마우스 호버 시 배경색
          },

          // div.wrapper에 스타일 적용
          "& .MuiTextField-root": {
            // height: "100%",
            // padding: 0,
            // margin: 0,
          },

          // div.wrapper에 스타일 적용
          "& .MuiInputBase-root": {},

          "& .MuiInputBase-input": {
            backgroundColor: "red", // input의 wrapper에 대한 스타일
            fontWeight: "bold", // input 텍스트의 두께
            color: "blue", // input의 텍스트 색상
            padding: "0 !important",
            height: "100%",
          },
        },
      },
    }),
    [columns, tableData]
  );

  const table = useMaterialReactTable(tableOptions);

  return <MaterialReactTable table={table} />;
};

export default EditableDataTable;
