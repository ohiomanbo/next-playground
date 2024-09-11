import React from "react";
import ExampleDataTable from "@/Table/example/DataTable/ExampleDataTable";
import EditableDataTable from "@/Table/example/DataTable/EditableTable/EditableDataTable";
import { MRT_ColumnDef, MRT_RowData } from "material-react-table";

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
    <div style={{ width: "100vw", height: "100vh" }}>
      Home
      <div style={{ width: "800px", height: "auto", backgroundColor: "white" }}>
        <ExampleDataTable searchTerm="" />
        <EditableDataTable initialColumns={initialColumns} />
      </div>
    </div>
  );
}
