import React from "react";

export interface DropdownOption<T> {
  accessorKey: T;
  header: string;
}

export interface DropdownProps<T> {
  options: DropdownOption<T>[];
  onSelect: (key: T | null) => void;
  valueAccessorKey: T | null; // null 허용
  dropdownWidth?: string;
  dropdownHeight?: string;
  dropdownPadding?: string;
}

export const Dropdown = <T extends string | number>({
  options,
  onSelect,
  valueAccessorKey,
  dropdownWidth = "100%",
  dropdownHeight = "32px",
  dropdownPadding = "8px",
}: DropdownProps<T>) => (
  <select
    onChange={(e) => {
      const value = e.target.value;
      onSelect(value ? (value as T) : null); // null 처리
    }}
    value={valueAccessorKey ?? ""} // null일 경우 빈 값 처리
    style={{ width: dropdownWidth, height: dropdownHeight, padding: dropdownPadding }}
  >
    <option value="">선택 안함</option> {/* 기본 빈 값 옵션 */}
    {options.map((option) => (
      <option key={option.accessorKey} value={option.accessorKey}>
        {option.header}
      </option>
    ))}
  </select>
);
