import React from "react";
import { MRT_ColumnDef, MRT_RowData } from "material-react-table";
import DataTable from "@/Table/example/DataTable";
import EditableDataTable from "@/Table/example/DataTable/EditableTable/EditableDataTable";

interface CustomColumnDef<TData extends MRT_RowData> extends MRT_ColumnDef<TData> {
  editable?: boolean;
}

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
};

const initialColumns: CustomColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    editable: true,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    editable: true,
  },
  {
    accessorKey: "age",
    header: "Age",
    editable: false,
  },
];

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "lightgray" }}>
      Home
      <div style={{ width: "100%", height: "auto", backgroundColor: "lightgray" }}>
        <DataTable searchTerm="" />
        <EditableDataTable initialColumns={initialColumns} />
      </div>
    </div>
  );
}
