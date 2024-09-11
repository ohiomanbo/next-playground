"use client";

import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Cell,
  type MRT_Row,
  type MRT_TableOptions,
} from "material-react-table";

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
};

const data: Person[] = [
  { id: 1, firstName: "John", lastName: "Doe", age: 30 },
  { id: 2, firstName: "Jane", lastName: "Smith", age: 25 },
  // Add more data as needed
];

const ExampleEditableDataTable: React.FC = () => {
  const [tableData, setTableData] = useState<Person[]>(data);

  const handleSaveCell = (cell: MRT_Cell<Person>, value: string | number) => {
    setTableData((prev) =>
      prev.map((row) => {
        if (row.id === cell.row.original.id) {
          return {
            ...row,
            [cell.column.id]: value,
          };
        }
        return row;
      })
    );
  };

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
        // muiTableBodyCellEditTextFieldProps: {
        //   onBlur: (event: React.FocusEvent<HTMLInputElement>, cell: MRT_Cell<Person>) => {
        //     handleSaveCell(cell, event.target.value);
        //   },
        // },
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        // muiTableBodyCellEditTextFieldProps: {
        //   onBlur: (event: React.FocusEvent<HTMLInputElement>, cell: MRT_Cell<Person>) => {
        //     handleSaveCell(cell, event.target.value);
        //   },
        // },
      },
      {
        accessorKey: "age",
        header: "Age",
        // muiTableBodyCellEditTextFieldProps: {
        //   type: "number",
        //   onBlur: (event: React.FocusEvent<HTMLInputElement>, cell: MRT_Cell<Person>) => {
        //     // handleSaveCell(cell, event.target.value);
        //   },
        //   style: {
        //     backgroundColor: "red !important", // 편집 중일 때 배경색 변경
        //     padding: "8px",
        //     borderRadius: "4px",
        //   },
        // },
      },
    ],
    []
  );

  const tableOptions: MRT_TableOptions<Person> = {
    columns,
    data: tableData,
    enableEditing: true,
    editDisplayMode: "cell",
    // muiTableHeadCellProps: {
    //   onClick: (event) => {
    //     // 이벤트 기본 동작 방지
    //     event.preventDefault();

    //     // 클릭한 요소 내부에서 Sort Label을 찾음
    //     const targetElement = event.target as HTMLElement;
    //     const sortIconElement = targetElement.querySelector(".MuiTableSortLabel-root");

    //     if (sortIconElement) {
    //       console.log("Sorting icon clicked");
    //       // 정렬 로직 실행
    //       column.toggleSorting?.(); // column 객체에 접근할 수 있는지 확인
    //     } else {
    //       console.log("Header text clicked");
    //       // 정렬 아이콘 이외의 클릭은 무시
    //       event.stopPropagation();
    //     }
    //   },
    //   sx: {
    //     cursor: "default",
    //     "& .Mui-TableHeadCell-Content": {
    //       justifyContent: "space-between",
    //     },
    //     "& .Mui-TableHeadCell-Content-Labels": {
    //       pointerEvents: "none", // 텍스트는 클릭 불가
    //     },
    //     "& .Mui-TableHeadCell-Content-Actions": {
    //       pointerEvents: "auto", // 정렬 아이콘만 클릭 가능
    //     },
    //   },
    // },
    muiTableHeadCellProps: ({ column }) => ({
      onClick: (event) => {
        // 이벤트 기본 동작 방지
        event.preventDefault();

        // 클릭한 요소 내부에서 Sort Label을 찾음
        const targetElement = event.target as HTMLElement;
        const sortIconElement = targetElement.closest(".MuiTableSortLabel-root");

        if (sortIconElement) {
          console.log("Sorting icon clicked");
          // 정렬 로직 실행
          column.toggleSorting?.();
        } else {
          console.log("Header text clicked");
          // 정렬 아이콘 이외의 클릭은 무시하고 정렬 방지
          event.stopPropagation();
        }
      },
      sx: {
        cursor: "default",
        "& .MuiTableSortLabel-root": {
          pointerEvents: "auto", // Sort Label만 클릭 가능
        },
        "& .MuiTableHeadCell-Content": {
          justifyContent: "space-between",
        },
        "& .Mui-TableHeadCell-Content-Labels": {
          pointerEvents: "none", // 헤더 텍스트에 대한 클릭 차단
        },
        "& .MuiTableHeadCell-Content-Actions": {
          pointerEvents: "auto", // 정렬 아이콘 클릭 가능
        },
      },
    }),
    muiTableBodyCellProps: {
      sx: {
        // 여기서 직접 스타일을 적용할 수 있습니다
      },
    },
  };

  const table = useMaterialReactTable(tableOptions);

  return <MaterialReactTable table={table} />;
};

export default ExampleEditableDataTable;
