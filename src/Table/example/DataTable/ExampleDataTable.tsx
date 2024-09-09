"use client";

import React, { useEffect, useState } from "react";
import type { PaginatedResponse, User } from "@/app/api/table/users/route";

import { PaginatedDataTable } from "@/Table/modulized/MaterialReactTable/PaginatedDataTable";
import type { ColumnDefArray } from "@/types/column.type";
import withDataTable, { type WithDataTableProps } from "@/hoc/Table/WithDataTable";

import Controls from "@/Table/example/components/Controls";
import { createColumn, createTableIndexNumberColum } from "@/utils/DataTableColumn.util";
import Modal from "@/components/Modal";
import DrawerDeleteColumn from "@/Table/example/components/DrawerDeleteColumn";
import DrawerAddColumn from "@/Table/example/components/DrawerAddColumn";
import ModalHidingColumn from "@/Table/example/components/ModalHidingColumn";

// Define columns
const allColumns = [
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "gender", header: "Gender" },
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
      enableResizing: true,
      showBrowserTooltip: true,
      size: 228,
    }),
    createColumn<User>({
      accessorKey: "age",
      header: "Age",
      type: "number",
      enableResizing: true,
      showBrowserTooltip: true,
      size: 228,
    }),
    createColumn<User>({
      accessorKey: "gender",
      header: "Gender",
      type: "string",
      enableResizing: true,
      showBrowserTooltip: true,
      size: 228,
    }),
  ]);

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
  }, [paginationConfig?.pagination, sortingConfig?.sorting, columns]);

  const [columnVisibility, setColumnVisibility] = useState<{ [key: string]: boolean }>({ gender: false });
  const [showHidingColumnsModal, setShowHidingColumnsModal] = useState(false);

  const hideColumn = (key: string) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [key]: prevVisibility[key] === false ? true : prevVisibility[key], // key가 존재하면 true로 설정
    }));
  };

  const hiddenColumns = Object.keys(columnVisibility).filter((key) => columnVisibility[key] === false);

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
        columnVisibility={{
          state: columnVisibility,
          setState: setColumnVisibility,
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
            <button onClick={() => setShowHidingColumnsModal(true)}>control Hiding Columns</button>
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
      <Modal showModal={showHidingColumnsModal} onClose={() => setShowHidingColumnsModal(false)}>
        <ModalHidingColumn
          columns={columns}
          hiddenColumns={hiddenColumns}
          hideColumn={hideColumn}
          onClose={() => setShowHidingColumnsModal(false)}
        />
      </Modal>

      {/* Drawer */}
      {/*  <Drawer open={drawerInfo.show} onClose={clearingDrawer} anchor="right">
           <div>
             <h2>Drawer Content for {drawerInfo.name}</h2>
             <Button onClick={clearingDrawer}>Close Drawer</Button>
           </div>
         </Drawer> */}

      {drawerInfo && setDrawerInfo && drawerInfo?.name === "addColumn" && (
        <DrawerAddColumn drawerInfo={drawerInfo} clearingDrawer={clearingDrawer} setColumns={setColumns} />
      )}

      {drawerInfo && setDrawerInfo && drawerInfo?.name === "deleteColumn" && (
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
