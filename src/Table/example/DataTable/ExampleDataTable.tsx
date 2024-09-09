"use client";

import React, { useEffect, useState } from "react";
import type { PaginatedResponse, User } from "@/app/api/table/users/route";

import { PaginatedDataTable } from "@/Table/modulized/MaterialReactTable/PaginatedDataTable";
import type { ColumnDefArray } from "@/types/column.type";
import withDataTable, { type WithDataTableProps } from "@/hoc/Table/WithDataTable";
import { Modal } from "@mui/material";

import Controls from "@/Table/example/DataTable/Controls";
import { createColumn, createTableIndexNumberColum } from "@/utils/DataTableColumn.util";
import DrawerAddColumn from "@/Table/example/DataTable/DrawerAddColumn";
import DrawerDeleteColumn from "@/Table/example/DataTable/DrawerDeleteColumn";

// Define columns
const allColumns = [
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "age", header: "Age" },
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
  const [enableRowNumbering, setEnableRowNumbering] = useState(false);
  const [enableExpanding, setEnableExpanding] = useState(false);
  const [enableRowSelection, setEnableRowSelection] = useState(true);
  const [enableColumnResizing, setEnableColumnResizing] = useState(true);
  const [enableRowOrdering, setEnableRowOrdering] = useState(false);
  const [enableColumnOrdering, setEnableColumnOrdering] = useState(false);
  const [enableColumnActions, setEnableColumnActions] = useState(true);
  const [enableClickToCopy, setEnableClickToCopy] = useState(true);

  // Define columns
  const [columns, setColumns] = useState<ColumnDefArray<User>>(() => [
    ...(enableRowNumbering ? [createTableIndexNumberColum<User>()] : []),
    { accessorKey: "firstName", header: "First Name" },
    createColumn<User>({
      accessorKey: "lastName",
      header: "Last Name",
      type: "string",
      enableResizing: false,
      showBrowserTooltip: true,
      size: 228,
    }),
    createColumn<User>({
      accessorKey: "age",
      header: "Age",
      type: "number",
      enableResizing: false,
      showBrowserTooltip: true,
      size: 228,
    }),
  ]);

  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log(rowSelectionConfig?.rowSelection);
  }, [rowSelectionConfig?.rowSelection]);

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
  }, [paginationConfig?.pagination, sortingConfig?.sorting, columns]);

  return (
    <>
      {/* Paginated Data Table */}
      <PaginatedDataTable
        dataResponse={data || { data: [], count: 0, totalCount: 0, isNext: false }}
        isLoading={isLoading}
        allColumns={allColumns}
        columns={columns}
        pagination={{
          state: paginationConfig.pagination,
          setState: paginationConfig.setPagination,
        }}
        {...(sortingConfig && {
          sorting: {
            state: sortingConfig.sorting,
            setState: sortingConfig.setSorting,
          },
        })}
        enableTopToolbar={true}
        enableBottomToolbar={true}
        enableRowNumbering={enableRowNumbering}
        enableExpanding={enableExpanding}
        enableRowSelection={enableRowSelection}
        enableColumnResizing={enableColumnResizing}
        enableRowOrdering={enableRowOrdering}
        enableColumnOrdering={enableColumnOrdering}
        enableColumnActions={enableColumnActions}
        enableClickToCopy={enableClickToCopy}
        {...(rowSelectionConfig && {
          rowSelection: {
            state: rowSelectionConfig.rowSelection,
            setState: rowSelectionConfig.setRowSelection,
          },
        })}
        topToolbarComponent={
          <div
            style={{
              width: "100%",
              height: "50px",
              display: "flex",
              flexFlow: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "5px",
              gap: "10px",
            }}
          >
            <button
              onClick={() =>
                setDrawerInfo &&
                setDrawerInfo({
                  idx: 0,
                  name: "addColumn",
                  show: true,
                })
              }
            >
              add Column
            </button>
            <button
              onClick={() =>
                setDrawerInfo &&
                setDrawerInfo({
                  idx: 0,
                  name: "deleteColumn",
                  show: true,
                })
              }
            >
              delete Column
            </button>
          </div>
        }
      />

      {/* ===== Table external components ===== */}
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
      {drawerInfo && setDrawerInfo && drawerInfo?.name === "addColumn" && (
        // <Drawer open={drawerInfo.show} onClose={clearingDrawer} anchor="right">
        //   <div>
        //     <h2>Drawer Content for {drawerInfo.name}</h2>
        //     <Button onClick={clearingDrawer}>Close Drawer</Button>
        //   </div>
        // </Drawer>
        <DrawerAddColumn drawerInfo={drawerInfo} clearingDrawer={clearingDrawer} setColumns={setColumns} />
      )}
      {drawerInfo && setDrawerInfo && drawerInfo?.name === "deleteColumn" && (
        // <Drawer open={drawerInfo.show} onClose={clearingDrawer} anchor="right">
        //   <div>
        //     <h2>Drawer Content for {drawerInfo.name}</h2>
        //     <Button onClick={clearingDrawer}>Close Drawer</Button>
        //   </div>
        // </Drawer>
        <DrawerDeleteColumn
          columns={columns}
          drawerInfo={drawerInfo}
          clearingDrawer={clearingDrawer}
          setColumns={setColumns}
        />
      )}
      <Controls
        toggles={[
          { label: "행 넘버링 여부", toggleState: enableRowNumbering, setToggleState: setEnableRowNumbering },
          { label: "행 확장 여부", toggleState: enableExpanding, setToggleState: setEnableExpanding },
          { label: "행 선택 여부", toggleState: enableRowSelection, setToggleState: setEnableRowSelection },
          { label: "행 순서 변경 여부", toggleState: enableRowOrdering, setToggleState: setEnableRowOrdering },
          { label: "열 사이즈 조절", toggleState: enableColumnResizing, setToggleState: setEnableColumnResizing },
          { label: "열 순서 변경 여부", toggleState: enableColumnOrdering, setToggleState: setEnableColumnOrdering },
          { label: "열 행동 여부", toggleState: enableColumnActions, setToggleState: setEnableColumnActions },
          { label: "셀 클릭 복사 여부", toggleState: enableClickToCopy, setToggleState: setEnableClickToCopy },
        ]}
        allColumns={allColumns}
      />
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
