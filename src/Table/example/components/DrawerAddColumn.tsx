import React, { useCallback, useState } from "react";
import { User } from "@/app/api/table/users/route";

import { createColumn } from "@/utils/DataTableColumn.util";
import type { CellProps, ColumnDefArray } from "@/types/column.type";
import type { ColumnType } from "@/types/filter.type";

import { Drawer } from "@/components/Drawer";
import { NotionLikeToggle } from "@/components/Toggle/Toggle";
import { Dropdown } from "@/components/Dropdown/Dropdown";
import ToggleSwitchButton from "@/components/ToggleSwitch";

const LabelSwitchToggle = ({
  label,
  toggleState,
  setToggleState,
}: {
  label: string;
  toggleState: boolean;
  setToggleState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div>
      <div>{label}</div>
      <ToggleSwitchButton showLabel={false} label={label} toggleState={toggleState} setToggleState={setToggleState} />
    </div>
  );
};

const LabelInput = ({
  label,
  text,
  setText,
}: {
  label: string;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);
  return (
    <div>
      <div>{label}</div>
      <input value={text} onChange={handleInput} style={{ background: "white", color: "black" }} />
    </div>
  );
};

const ColumnTypeOptions = [
  {
    accessorKey: "number",
    header: "숫자",
  },
  {
    accessorKey: "string",
    header: "문자열",
  },
  {
    accessorKey: "boolean",
    header: "불리언",
  },
  {
    accessorKey: "date",
    header: "날짜",
  },
];

interface DrawerActionProps {
  drawerInfo: {
    show: boolean;
    idx: number;
    name: string;
  };
  clearingDrawer: () => void;
  setColumns: React.Dispatch<React.SetStateAction<ColumnDefArray<User>>>;
}

const DrawerAddColumn = ({ drawerInfo, clearingDrawer, setColumns }: DrawerActionProps) => {
  const [accessorKey, setAccessorKey] = useState("");
  const [header, setHeader] = useState("");

  const [selectedType, setSelectedType] = useState<(typeof ColumnTypeOptions)[number] | null>(null);
  const [typeInitialValue, setTypeInitialValue] = useState("");

  const handleSelect = useCallback((key: string | null) => {
    const selected = ColumnTypeOptions.find((ele) => ele.accessorKey === key);
    if (selected) {
      setSelectedType(selected);
    }
  }, []);

  const [order, setOrder] = useState("");
  const [cellSize, setCellSize] = useState("");

  const [enableColumnResizing, setEnableColumnResizing] = useState(true);
  const [enableColumnActions, setEnableColumnActions] = useState(true);
  const [enableClickToCopy, setEnableClickToCopy] = useState(true);

  const allClear = useCallback(() => {
    setAccessorKey("");
    setHeader("");
    setSelectedType(null);
    setTypeInitialValue("");
    setOrder("");
    setCellSize("");
    setEnableColumnResizing(true);
    setEnableColumnActions(true);
    setEnableClickToCopy(true);
    clearingDrawer();
  }, [clearingDrawer]);

  const appendNewColumn = () => {
    const newColumn = createColumn<User>({
      accessorKey: accessorKey,
      header: header,
      type: (selectedType?.accessorKey ?? "string") as ColumnType,
      enableResizing: enableColumnResizing,
      enableColumnActions: enableColumnActions,
      enableClickToCopy: enableClickToCopy,
      ...(typeInitialValue && {
        Cell: ({ cell }: CellProps<User>) => {
          const value = (cell.getValue() ?? typeInitialValue) as string;
          return value;
        },
      }),
      ...(!isNaN(Number(cellSize)) && {
        size: Number(cellSize),
      }),
    });

    setColumns((prev) => {
      const sliceIndex =
        !isNaN(Number(order)) && order !== "" ? (Number(order) - 1 < 0 ? 0 : Number(order) - 1) : prev.length;
      return [...prev.slice(0, sliceIndex), newColumn, ...prev.slice(sliceIndex)];
    });

    allClear();
  };

  return (
    <Drawer headerTitle={"column 추가"} isOpen={drawerInfo.show} onClose={allClear} direction={"right"} height="100%">
      <div style={{ display: "flex", flexFlow: "column", height: "100%", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexFlow: "column", gap: "10px" }}>
          <LabelInput label="AccessorKey" text={accessorKey} setText={setAccessorKey} />
          <LabelInput label="Header" text={header} setText={setHeader} />

          <div style={{ width: "100%", height: "1px", border: "1px solid grey" }} />
          <div style={{ display: "flex", flexFlow: "column", gap: "5px" }}>
            <div>Type</div>
            <Dropdown
              valueAccessorKey={selectedType?.accessorKey ?? null}
              options={ColumnTypeOptions}
              onSelect={handleSelect}
            />
            {selectedType && <LabelInput label="default Value" text={typeInitialValue} setText={setTypeInitialValue} />}
          </div>
          <div style={{ width: "100%", height: "1px", border: "1px solid grey" }} />
          <NotionLikeToggle
            data={{
              title: "Additional",
              content: (
                <div style={{ display: "flex", flexFlow: "column", gap: "10px" }}>
                  <LabelInput label="column order" text={order} setText={setOrder} />
                  <LabelInput label="cell size" text={cellSize} setText={setCellSize} />
                  <LabelSwitchToggle
                    label={"열 사이즈 조절 여부"}
                    toggleState={enableColumnResizing}
                    setToggleState={setEnableColumnResizing}
                  />
                  <LabelSwitchToggle
                    label={"열 행동 여부"}
                    toggleState={enableColumnActions}
                    setToggleState={setEnableColumnActions}
                  />
                  <LabelSwitchToggle
                    label={"셀 클릭 복사 여부"}
                    toggleState={enableClickToCopy}
                    setToggleState={setEnableClickToCopy}
                  />
                </div>
              ),
            }}
          />
        </div>
        <div style={{ display: "flex", flexFlow: "row", justifyContent: "flex-end", gap: "5px" }}>
          <button style={{ width: "40px", height: "30px" }} onClick={allClear}>
            취소
          </button>
          <button
            disabled={!(accessorKey !== "" && header !== "" && selectedType !== null)}
            style={{ width: "40px", height: "30px", background: "orange", outline: "none", border: "none" }}
            onClick={() => appendNewColumn()}
          >
            확인
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default DrawerAddColumn;
