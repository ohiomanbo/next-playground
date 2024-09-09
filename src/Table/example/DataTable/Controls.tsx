import { NotionLikeToggle, Toggle } from "@/components/Toggle/Toggle";
import ToggleSwitchButton from "@/components/ToggleSwitch";
import React from "react";

interface AllColumn {
  accessorKey: string;
  header: string;
}

interface EnableFeatures {
  label: string;
  toggleState: boolean;
  setToggleState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ControlsProps {
  toggles: EnableFeatures[];
  allColumns: AllColumn[];
}

const Controls = ({ allColumns, toggles }: ControlsProps) => {
  const getStateByLabel = (searchLabel: string) => {
    const state = toggles.filter((ele) => ele.label === searchLabel)[0]?.toggleState;

    return state ?? false;
  };

  return (
    <Toggle title="Table JSON">
      <div
        style={{
          width: "100%",
          display: "flex",
          flexFlow: "row",
        }}
      >
        <div
          style={{
            flex: "1",
          }}
        >
          <NotionLikeToggle
            data={{
              title: "All columns",
              content: JSON.stringify(allColumns, null, 2),
            }}
          />
          <NotionLikeToggle
            data={{
              title: "Activation Default Features",
              content: JSON.stringify(
                {
                  enableTopToolbar: true,
                  enableBottomToolbar: true,
                },
                null,
                2
              ),
            }}
          />
          <NotionLikeToggle
            data={{
              title: "Activation Controllable Features",
              content: JSON.stringify(
                {
                  enableRowNumbering: getStateByLabel("행 넘버링 여부"),
                  enableExpanding: getStateByLabel("행 확장 여부"),
                  enableRowSelection: getStateByLabel("행 선택 여부"),
                  enableColumnResizing: getStateByLabel("행 순서 변경 여부"),
                  enableRowOrdering: getStateByLabel("열 사이즈 조절 여부"),
                  enableColumnOrdering: getStateByLabel("열 순서 변경 여부"),
                  enableColumnActions: getStateByLabel("열 행동 여부"),
                  enableClickToCopy: getStateByLabel("셀 클릭 복사 여부"),
                },
                null,
                2
              ),
            }}
          />
        </div>
        <div
          style={{
            flex: "1",
          }}
        >
          <b>Controls</b>
          {toggles.map((ele, index) => (
            <ToggleSwitchButton
              key={`${ele.label}${index}`}
              label={ele.label}
              toggleState={ele.toggleState}
              setToggleState={ele.setToggleState}
            />
          ))}
        </div>
      </div>
    </Toggle>
  );
};

export default Controls;
