import React, { useState } from "react";
import { User } from "@/app/api/table/users/route";

import type { ColumnDefArray } from "@/types/column.type";

import { Drawer } from "@/components/Drawer";

interface DrawerActionProps {
  columns: ColumnDefArray<User>;
  drawerInfo: {
    show: boolean;
    idx: number;
    name: string;
  };
  clearingDrawer: () => void;
  setColumns: React.Dispatch<React.SetStateAction<ColumnDefArray<User>>>;
}

const DrawerDeleteColumn = ({ columns, drawerInfo, clearingDrawer, setColumns }: DrawerActionProps) => {
  const [willDeleteColumns, setWillDeleteColumns] = useState(
    columns.map((ele) => ({
      ...ele,
      willDelete: false,
    }))
  );

  const applyNewColumn = () => {
    const newArr = willDeleteColumns.filter((ele) => !ele.willDelete).map(({ willDelete: _, ...rest }) => rest);

    setColumns(newArr);
    clearingDrawer();
  };

  return (
    <Drawer
      headerTitle={"column 삭제"}
      isOpen={drawerInfo.show}
      onClose={clearingDrawer}
      direction={"right"}
      height="100%"
    >
      <div style={{ display: "flex", flexFlow: "column", height: "100%", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexFlow: "column", gap: "5px" }}>
          {willDeleteColumns
            .filter((ele) => !ele.willDelete)
            .map((ele) => (
              <div
                key={`${ele.accessorKey}`}
                style={{ display: "flex", flexFlow: "row", justifyContent: "space-between" }}
              >
                <div>{ele.header}</div>
                <button
                  onClick={() =>
                    setWillDeleteColumns((prev) =>
                      prev.map((item) => (item.accessorKey === ele.accessorKey ? { ...item, willDelete: true } : item))
                    )
                  }
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
        <div style={{ display: "flex", flexFlow: "column", gap: "5px" }}>
          <div style={{ width: "100%", height: "1px", border: "1px solid grey" }} />
          삭제 예정 columns
          {willDeleteColumns
            .filter((ele) => ele.willDelete)
            .map((ele) => (
              <div
                key={`${ele.accessorKey}`}
                style={{ display: "flex", flexFlow: "row", justifyContent: "space-between" }}
              >
                <div>{ele.header}</div>
                <button
                  onClick={() =>
                    setWillDeleteColumns((prev) =>
                      prev.map((item) => (item.accessorKey === ele.accessorKey ? { ...item, willDelete: false } : item))
                    )
                  }
                >
                  Restore
                </button>
              </div>
            ))}
          <div style={{ width: "100%", height: "1px", border: "1px solid grey" }} />
          <div style={{ display: "flex", flexFlow: "row", justifyContent: "flex-end", gap: "5px" }}>
            <button style={{ width: "40px", height: "30px" }} onClick={clearingDrawer}>
              취소
            </button>
            <button
              disabled={willDeleteColumns.filter((ele) => ele.willDelete).length <= 0}
              style={{ width: "40px", height: "30px", background: "orange", outline: "none", border: "none" }}
              onClick={() => applyNewColumn()}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default DrawerDeleteColumn;
