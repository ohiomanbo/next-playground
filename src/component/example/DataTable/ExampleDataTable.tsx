"use client";

import React, { useEffect, useState } from "react";
import type { PaginatedResponse, User } from "@/app/api/table/users/route";
import { PaginatedDataTable } from "@/component/modulized/MaterialReactTable/PaginatedDataTable";
import withDataTable, { type WithDataTableProps } from "@/hoc/Table/WithDataTable";
import type { MRT_ColumnDef } from "material-react-table";
import { Button, Modal, Drawer } from "@mui/material";

// Define columns
const columns: MRT_ColumnDef<User>[] = [
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "age", header: "Age", size: 100 },
];

interface ExampleDataTableProps extends WithDataTableProps {
  // Additional Props if necessary
}

const ExampleDataTable: React.FC<ExampleDataTableProps> = ({
  rowSelectionConfig,
  modalConfig,
  drawerInfo,
  setDrawerInfo,
  clearingDrawer,
  paginationConfig = { pagination: { pageIndex: 0, pageSize: 20 }, setPagination: () => {} },
  sortingConfig = { sorting: [], setSorting: () => {} },
}) => {
  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data from the API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/table/users?limit=${paginationConfig?.pagination.pageSize}&offset=${
          paginationConfig?.pagination.pageIndex * paginationConfig?.pagination.pageSize
        }`
      );
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationConfig?.pagination, sortingConfig?.sorting]);

  return (
    <>
      {/* Paginated Data Table */}
      <PaginatedDataTable
        data={data || { data: [], count: 0, totalCount: 0, isNext: false }}
        columns={columns}
        isLoading={isLoading}
        pagination={paginationConfig?.pagination}
        setPagination={paginationConfig?.setPagination}
        sorting={sortingConfig?.sorting}
        setSorting={sortingConfig?.setSorting}
        rowSelection={rowSelectionConfig?.rowSelection}
        setRowSelection={rowSelectionConfig?.setRowSelection}
        emptyHeight="300px"
      />

      {/* Create Group Modal */}
      {modalConfig?.createGroup && (
        <Modal open={modalConfig.createGroup.show} onClose={() => modalConfig.createGroup?.setShow(false)}>
          <div>Group Creation Modal</div>
        </Modal>
      )}

      {/* Deploy Modal */}
      {modalConfig?.deploy && (
        <Modal open={modalConfig.deploy.show} onClose={() => modalConfig.deploy?.setShow(false)}>
          <div>Deploy Modal</div>
        </Modal>
      )}

      {/* Drawer */}
      {drawerInfo && setDrawerInfo && (
        <Drawer open={drawerInfo.show} onClose={clearingDrawer} anchor="right">
          <div>
            <h2>Drawer Content for {drawerInfo.name}</h2>
            <Button onClick={clearingDrawer}>Close Drawer</Button>
          </div>
        </Drawer>
      )}
    </>
  );
};

export default withDataTable({
  useRowSelection: true,
  usePagination: true,
  useSorting: true,
  useDrawer: true,
  useCreateGroupModal: true,
  useDeployModal: true,
})(ExampleDataTable);
