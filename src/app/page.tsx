import React from "react";
import ExampleDataTable from "@/Table/example/DataTable/ExampleDataTable";
// import ExampleEditableDataTable from "@/Table/example/DataTable/EditableTable/ExampleEditableTable";
import ExampleCustomEditableDataTable from "@/Table/example/DataTable/EditableTable/ExampleCustomEditableTable";
import ExampleBodyEditableDataTable from "@/Table/example/DataTable/EditableTable/ExampleBodyEditableTable";

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      Home
      <div style={{ width: "800px", height: "auto", backgroundColor: "white" }}>
        <ExampleDataTable searchTerm="" />
        {/* <ExampleEditableDataTable /> */}
        <ExampleBodyEditableDataTable />
        <ExampleCustomEditableDataTable />
      </div>
    </div>
  );
}
