import React from "react";
import ExampleDataTable from "@/Table/example/DataTable/ExampleDataTable";

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      Home
      <div style={{ width: "800px", height: "auto", backgroundColor: "white" }}>
        <ExampleDataTable searchTerm="" />
      </div>
    </div>
  );
}
