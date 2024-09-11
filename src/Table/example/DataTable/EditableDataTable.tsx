"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowData,
  useMaterialReactTable,
  type MRT_Cell,
  type MRT_TableOptions,
} from "material-react-table";

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

interface CustomColumnDef<TData extends MRT_RowData> extends MRT_ColumnDef<TData> {
  editable?: boolean;
}

interface EditComponentProps {
  cell: MRT_Cell<Person>;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const CustomEditComponent: React.FC<EditComponentProps> = React.memo(({ cell, onSave, onCancel }) => {
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
});

CustomEditComponent.displayName = "CustomEditComponent";

interface ExampleCustomEditableDataTableProps {
  initialColumns: CustomColumnDef<Person>[];
}

const EditableDataTable: React.FC<ExampleCustomEditableDataTableProps> = ({ initialColumns }) => {
  const [tableData, setTableData] = useState<Person[]>(initialData);
  const [editingCell, setEditingCell] = useState<MRT_Cell<Person> | null>(null);
  const [isCustomEdit, setIsCustomEdit] = useState(false);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const customEditRef = useRef<HTMLDivElement>(null);

  const handleSaveCell = useCallback((cell: MRT_Cell<Person>, value: string | number) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === cell.row.original.id ? { ...row, [cell.column.id]: value } : row))
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

  const handleSaveHeader = useCallback((columnId: string, value: string) => {
    setColumns((prev) => prev.map((col) => (col.accessorKey === columnId ? { ...col, header: value } : col)));
    setEditingHeader(null);
  }, []);

  const headerRenderer = useCallback(
    (columnId: string, header: string) => {
      if (editingHeader === columnId) {
        return (
          <input
            value={header}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleSaveHeader(columnId, e.target.value)}
            onBlur={() => setEditingHeader(null)}
            autoFocus
          />
        );
      }

      return (
        <div
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={() => setEditingHeader(columnId)}
          style={{ cursor: "pointer", backgroundColor: "lightblue", padding: "5px" }}
        >
          {header}
        </div>
      );
    },
    [editingHeader, handleSaveHeader]
  );

  const [columns, setColumns] = useState<CustomColumnDef<Person>[]>(initialColumns);

  const memoizedColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      Cell: cellRenderer,
      Header: () => headerRenderer(col.accessorKey as string, col.header as string),
    }));
  }, [columns, cellRenderer, headerRenderer]);

  const handleCellCopy = (cell: MRT_Cell<Person>) => {
    navigator.clipboard.writeText(cell.getValue<string | number>() as string);
    console.log("Copied to clipboard: ", cell.getValue());
  };

  const tableOptions: MRT_TableOptions<Person> = useMemo(
    () => ({
      columns: memoizedColumns,
      data: tableData,
      enableEditing: false,
      muiTableBodyCellProps: ({ cell }) => ({
        onDoubleClick: () => {
          if ((cell.column.columnDef as CustomColumnDef<Person>).editable) {
            setEditingCell(cell);
            setIsCustomEdit(true);
          }
        },
        // onClick: () => {
        //   handleCellCopy(cell); // 클릭 시 셀의 값을 클립보드로 복사
        // },
      }),
    }),
    [memoizedColumns, tableData]
  );

  const table = useMaterialReactTable(tableOptions);

  return (
    <div ref={customEditRef}>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default EditableDataTable;
