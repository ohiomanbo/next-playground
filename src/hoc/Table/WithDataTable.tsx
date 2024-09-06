import React, { useState, useCallback, useEffect } from "react";
import type { MRT_SortingState, MRT_PaginationState, MRT_RowSelectionState } from "material-react-table";
import { INITIAL_DRAWER_INFO } from "@/constant/table";

export interface WithDataTableOptions {
  useRowSelection?: boolean;
  useCreateGroupModal?: boolean;
  useDeployModal?: boolean;
  useDrawer?: boolean;
  usePagination?: boolean;
  useSorting?: boolean;
}

export interface WithDataTableProps {
  rowSelectionConfig?: {
    rowSelection: MRT_RowSelectionState;
    setRowSelection: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>;
  };
  paginationConfig?: {
    pagination: MRT_PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;
  };
  sortingConfig?: {
    sorting: MRT_SortingState;
    setSorting: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
  };
  modalConfig?: {
    createGroup?: {
      show: boolean;
      setShow: React.Dispatch<React.SetStateAction<boolean>>;
    };
    deploy?: {
      show: boolean;
      setShow: React.Dispatch<React.SetStateAction<boolean>>;
    };
  };
  drawerInfo?: { show: boolean; idx: number; name: string };
  setDrawerInfo?: React.Dispatch<React.SetStateAction<{ show: boolean; idx: number; name: string }>>;
  clearingDrawer: () => void;
}

function withDataTable(options: WithDataTableOptions = {}) {
  return function <P extends { searchTerm: string }>(
    WrappedComponent: React.ComponentType<P & WithDataTableProps>
  ): React.FC<Omit<P, keyof WithDataTableProps>> {
    return function WithDataTableLogic(props: Omit<P, keyof WithDataTableProps>) {
      const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
      const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 10 });
      const [sorting, setSorting] = useState<MRT_SortingState>([]);
      const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
      const [showDeployModal, setShowDeployModal] = useState(false);
      const [drawerInfo, setDrawerInfo] = useState(INITIAL_DRAWER_INFO);

      const clearingDrawer = useCallback(() => {
        if (options.useDrawer) {
          setDrawerInfo(INITIAL_DRAWER_INFO);
        }
      }, []);

      useEffect(() => {
        // Example useEffect to reset pagination when search term changes
        if (options.usePagination) {
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }
      }, [props.searchTerm]);

      const commonProps: WithDataTableProps = {
        clearingDrawer,
      };

      if (options.useRowSelection) {
        commonProps.rowSelectionConfig = { rowSelection, setRowSelection };
      }

      if (options.usePagination) {
        commonProps.paginationConfig = { pagination, setPagination };
      }

      if (options.useSorting) {
        commonProps.sortingConfig = { sorting, setSorting };
      }

      if (options.useCreateGroupModal || options.useDeployModal) {
        commonProps.modalConfig = {};
        if (options.useCreateGroupModal) {
          commonProps.modalConfig.createGroup = { show: showCreateGroupModal, setShow: setShowCreateGroupModal };
        }
        if (options.useDeployModal) {
          commonProps.modalConfig.deploy = { show: showDeployModal, setShow: setShowDeployModal };
        }
      }

      if (options.useDrawer) {
        commonProps.drawerInfo = drawerInfo;
        commonProps.setDrawerInfo = setDrawerInfo;
      }

      return <WrappedComponent {...(props as P)} {...commonProps} />;
    };
  };
}

export default withDataTable;
