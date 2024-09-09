import React from "react";

export interface DropdownOption<T> {
  accessorKey: T;
  header: string;
}

export interface DropdownProps<T> {
  options: DropdownOption<T>[];
  onSelect: (key: T | null) => void;
  valueAccessorKey: T;
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
    onChange={(e) => onSelect(e.target.value as T)}
    value={valueAccessorKey}
    style={{ width: dropdownWidth, height: dropdownHeight, padding: dropdownPadding }}
  >
    {options.map((option) => (
      <option key={option.accessorKey} value={option.accessorKey}>
        {option.header}
      </option>
    ))}
  </select>
);
