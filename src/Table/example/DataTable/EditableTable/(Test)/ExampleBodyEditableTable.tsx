"use client";

import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowData,
  useMaterialReactTable,
  type MRT_Cell,
  type MRT_TableOptions,
} from "material-react-table";

// Person 데이터 타입 정의
type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
};

// data 배열 예시
const data: Person[] = [
  { id: 1, firstName: "John", lastName: "Doe", age: 30 },
  { id: 2, firstName: "Jane", lastName: "Smith", age: 25 },
];

// 사용자 정의 컬럼 타입 확장
interface CustomColumnDef<TData extends MRT_RowData> extends MRT_ColumnDef<TData> {
  editable?: boolean; // editable 속성 추가
}

const CustomEditComponent = React.memo(
  ({ cell, onSave, onCancel }: { cell: MRT_Cell<Person>; onSave: (value: string) => void; onCancel: () => void }) => {
    const [value, setValue] = useState<string | number>(cell.getValue<string | number>());

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSave(value.toString());
      } else if (e.key === "Escape") {
        onCancel();
      }
    };

    return (
      <div style={{ backgroundColor: "yellow" }}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => onSave(value.toString())}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    );
  }
);

CustomEditComponent.displayName = "CustomEditComponent";

const ExampleBodyEditableDataTable: React.FC = () => {
  const [tableData, setTableData] = useState<Person[]>(data);
  const [editingCell, setEditingCell] = useState<MRT_Cell<Person> | null>(null);
  const [isCustomEdit, setIsCustomEdit] = useState(false);
  const customEditRef = useRef<HTMLDivElement>(null);

  const handleSaveCell = useCallback((cell: MRT_Cell<Person>, value: string | number) => {
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
    setIsCustomEdit(false);
    setEditingCell(null);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsCustomEdit(false);
    setEditingCell(null);
  }, []);

  const cellRenderer = useCallback(
    ({ cell }: { cell: MRT_Cell<Person> }) => {
      if (editingCell?.id === cell.id && isCustomEdit) {
        return (
          <CustomEditComponent
            cell={cell}
            onSave={(value) => handleSaveCell(cell, value)}
            onCancel={handleCancelEdit}
          />
        );
      }
      return cell.getValue<string | number>();
    },
    [editingCell, isCustomEdit, handleSaveCell, handleCancelEdit]
  );

  // 컬럼 정의에 editable 속성을 추가하여 확장된 타입을 사용
  const columns = useMemo<CustomColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
        editable: true, // First Name 열은 편집 가능
        Cell: cellRenderer,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        editable: true, // Last Name 열은 편집 가능
        Cell: cellRenderer,
      },
      {
        accessorKey: "age",
        header: "Age",
        editable: false, // Age 열은 편집 불가
        Cell: cellRenderer,
      },
    ],
    [cellRenderer]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editingCell &&
        isCustomEdit &&
        customEditRef.current &&
        !customEditRef.current.contains(event.target as Node)
      ) {
        handleCancelEdit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingCell, isCustomEdit, handleCancelEdit]);

  const tableOptions: MRT_TableOptions<Person> = {
    columns,
    data: tableData,
    enableEditing: false,
    muiTableBodyCellProps: ({ cell }) => ({
      onDoubleClick: () => {
        // editable 속성을 확인하여 편집 가능할 때만 편집 모드로 진입
        if ((cell.column.columnDef as CustomColumnDef<Person>).editable) {
          setEditingCell(cell);
          setIsCustomEdit(true);
        }
      },
    }),
  };

  const table = useMaterialReactTable(tableOptions);

  return <MaterialReactTable table={table} />;
};

export default ExampleBodyEditableDataTable;
