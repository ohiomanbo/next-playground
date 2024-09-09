import type { OverflowStyles, WidthHeightStyles } from "@/types/style.type";

export const applyStyleWidthHeightOverflow = (styles?: WidthHeightStyles & OverflowStyles) => ({
  ...(styles?.width && { width: styles.width }),
  ...(styles?.minWidth && { minWidth: styles.minWidth }),
  ...(styles?.maxWidth && { maxWidth: styles.maxWidth }),
  ...(styles?.height && { height: styles.height }),
  ...(styles?.minHeight && { minHeight: styles.minHeight }),
  ...(styles?.maxHeight && { maxHeight: styles.maxHeight }),
  ...(styles?.overflowY && { overflowY: styles.overflowY }),
  ...(styles?.overflowX && { overflowY: styles.overflowX }),
});

export const generateFixedSizeHeadCellStyles = (nthType: number) => ({
  [`& th:nth-of-type(${nthType})`]: {
    minWidth: "40px",
    maxWidth: "40px",
    justifyContent: "center",
    alignItems: "center",

    "& .Mui-TableHeadCell-Content": {
      justifyContent: "center",
      alignItems: "center",

      "& .Mui-TableHeadCell-Content-Labels": {
        "& .Mui-TableHeadCell-Content-Wrapper": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      },
    },
  },
});

export const generateFixedSizeBodyCellStyles = (nthType: number) => ({
  [`& td:nth-of-type(${nthType})`]: {
    minWidth: "40px",
    maxWidth: "40px",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const applyStyleFixedSizeCellForCount = (count: number, isHead = false) => {
  const generateStyleFn = isHead ? generateFixedSizeHeadCellStyles : generateFixedSizeBodyCellStyles;
  let styles = {};

  for (let i = 1; i <= count; i++) {
    styles = { ...styles, ...generateStyleFn(i) };
  }

  return styles;
};
