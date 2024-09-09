import { User } from "@/app/api/table/users/route";
import ToggleSwitchButton from "@/components/ToggleSwitch";
import { ColumnDefArray } from "@/types/column.type";
import React from "react";

const ModalHidingColumn = ({
  columns,
  hiddenColumns,
  hideColumn,
  onClose,
}: {
  columns: ColumnDefArray<User>;
  hiddenColumns: string[];
  hideColumn: (key: string) => void;
  onClose: () => void;
}) => {
  return (
    <div style={{ display: "flex", flexFlow: "column", gap: "10px" }}>
      <div style={{ display: "flex", flexFlow: "row", justifyContent: "space-between" }}>
        <div>숨겨진 열</div>
        <button onClick={onClose}>close</button>
      </div>
      <div style={{ width: "100%", height: "1px", border: "1px solid grey" }} />
      {columns.map((ele) => (
        <div key={ele.accessorKey} style={{ display: "flex", flexFlow: "row", justifyContent: "space-between" }}>
          <div>{ele.header}</div>
          <ToggleSwitchButton
            showLabel={false}
            toggleState={hiddenColumns.includes(ele.accessorKey as string)}
            setToggleState={() => hideColumn(ele.accessorKey as string)}
          />
        </div>
      ))}
    </div>
  );
};

export default ModalHidingColumn;
