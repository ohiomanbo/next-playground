import { Theme, createTheme } from "@mui/material/styles";

const defaultTheme: Theme = createTheme({
  typography: {
    fontFamily: "'Noto Sans KR', sans-serif",
  },
  components: {
    MuiPopover: {
      styleOverrides: {
        paper: {
          padding: "0px", // Add padding inside the Popover
          borderRadius: "10px", // Make the corners rounded
          border: "1px solid gray", // Add a border to the Popover
          overflow: "hidden !important",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: "0px", // Padding for the list items
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {},
          "&:hover": {},
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {},
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          overflow: "visible !important",
          borderRadius: 0,
          outline: "none",
          boxShadow: "none", // 그림자 제거
          border: "none", // 테두리 제거
          backgroundColor: "transparent !important", // #fff 주입되어서 강제로 덮어씀
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          borderCollapse: "separate",
          borderSpacing: 0,
          border: "1px solid black",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: 0,
          "& .MuiTableCell-root .MuiTableCell-resizable": {
            "& .MuiTableCell-resizeHandle": {
              position: "absolute",
              right: "0px",
              top: "0px",
              bottom: "0px",
              width: "5px",
              cursor: "col-resize",
              zIndex: 1,
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          width: "32px", // 체크박스의 너비
          height: "30px", // 체크박스의 높이
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          width: "32px", // 아이콘 버튼의 너비
          height: "30px", // 아이콘 버튼의 높이
          fontSize: "160px", // 버튼의 기본 폰트 크기
          color: "var(--Grey-G-10, #3f424a) !important",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          width: "32px", // 아이콘 버튼의 너비
          height: "30px", // 아이콘 버튼의 높이
          fontSize: "16px", // 버튼의 기본 폰트 크기
          padding: "8px 16px",
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          "&.Mui-active": {
            marginLeft: "4px",
            width: "20px !important",
            color: "var(--Grey-G-10, #3f424a)",
            opacity: "1",

            // 정렬된 상태에서 아이콘의 색상과 opacity를 설정
            "&.Mui-active .MuiTableSortLabel-icon[data-testid='ArrowDownwardIcon'], &.Mui-active .MuiTableSortLabel-icon[data-testid='ArrowUpwardIcon']":
              {
                opacity: "1 !important", // 정렬된 상태에서 opacity를 1로 설정
              },

            "& .MuiTableSortLabel-icon": {
              width: "18px",
              height: "18px",
              color: "inherit !important", // 자식에 부모 색 따라가도록 덮어쓰기
              opacity: "0.3 !important", // 기본 상태에서 opacity 설정

              "&:hover": {
                opacity: "1 !important",
              },

              "&:active": {
                opacity: "1 !important",
              },
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          /** thead > tr */
          backgroundColor: "var(--Grey-G-90, #fff) !important", // #fff 주입되어서 강제로 덮어씀
          "&.MuiTableRow-root": {
            /** thead > tr, tbody > tr 에 영향을 미치는 구간*/
            minHeight: "30px",
            boxShadow: "none",
            backgroundColor: "var(--Grey-G-90, #fff) !important", // #fff 주입되어서 강제로 덮어씀
            borderBottom: "1px solid black", // 행 사이의 구분선
            "&:last-child": {
              borderBottom: "none", // 마지막 행의 아래쪽 테두리 제거
            },
            "& td": {
              /** body td */
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          /** tr > th, td */
          minWidth: "40px",
          minHeight: "14px",
          padding: "2px 0px 2px 4px !important", // resize line 맞추기 위해 우측 padding 제거
          color: "var(--Grey-G-10, #3f424a)",
          borderRight: "1px solid black", // 열 사이의 구분선
          "&:last-child": {
            borderRight: "none", // 마지막 열의 오른쪽 테두리 제거
          },
        },
        head: {
          fontWeight: 700,
          borderTop: "1px solid var(--Light-G-40, #d0d0d7)",
          borderBottom: "1px solid black",

          "&.MuiTableCell-head": {
            "& .Mui-TableHeadCell-Content": {
              "& .Mui-TableHeadCell-Content-Wrapper": {
                "&:hover": {
                  textOverflow: "ellipsis",
                },
              },
            },
          },

          /** Table Head Cell ResizeHandle */
          "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
            marginRight: "0px",

            "& .Mui-TableHeadCell-ResizeHandle-Divider": {
              color: "transparent !important",
              borderColor: "transparent !important",
              width: "2px !important",
              borderWidth: "1px !important",
            },
            "&:hover": {
              "& .Mui-TableHeadCell-ResizeHandle-Divider": {
                backgroundColor: "var(--Grey-G-40,#d0d0d7) !important",
              },
            },
          },
        },
        body: {
          borderBottom: "1px solid var(--Grey-G-60,#e8eaed)",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "150%",
          letterSpacing: "-0.3px",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          /** thead */
          minHeight: "30px",
          boxShadow: "none",
          opacity: 1,
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          /** tbody */
          boxShadow: "none",
          opacity: 1,
          minHeight: "600px", // 추가된 부분
          display: "flex !important", // 추가된 부분
          flexDirection: "column", // 추가된 부분

          "& .MuiTableRow-root": {
            /** tbody > tr */
            backgroundColor: "transparent !important", // #fff 주입되어서 강제로 덮어씀
            flex: "0 0 auto !important",

            "& td": {},
          },

          "& .Mui-TableBodyCell-DetailPanel": {
            /** tbody > tr 중 DetailPanel */
            minHeight: "0 !important",
            padding: "0 !important", // MuiTableCell > root, body의 우선순위가 높음
            margin: "0",
            "& td:first-of-type, td:nth-of-type(2)": {
              maxWidth: "unset !important",
            },
          },

          /** tbody > tr hover & selected background color */
          "& .MuiTableRow-root:hover": {
            opacity: 1,
          },
          "& .MuiTableRow-root.Mui-selected": {
            backgroundColor: "var(--Semantic-D-60_L-80,#f4f4f6)",
            opacity: 1,
          },
          "& .MuiTableRow-root.Mui-selected td:hover": {
            backgroundColor: "var(--Semantic-D-60_L-80,#f4f4f6)",
            opacity: 1,
          },
          "& .MuiTableRow-root.Mui-selected td:after": {
            backgroundColor: "var(--Semantic-D-60_L-80,#f4f4f6)",
            opacity: 1,
          },
          "& .MuiTableRow-root td:after": {
            backgroundColor: "var(--Grey-G-80,#F4F4F6) !important",
            opacity: 1,
          },
          "& .MuiTableRow-root td:hover": {
            // backgroundColor: "var(--Grey-G-80,#F4F4F6)",
            opacity: 1,
          },
          "& .MuiTableRow-root.Mui-selected.MuiTableRow-hover": {
            // backgroundColor: "var(--Grey-G-80,#F4F4F6)",
            opacity: 1,
          },
        },
      },
    },
  },
});

export { defaultTheme };
