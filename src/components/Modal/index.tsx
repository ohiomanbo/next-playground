import React from "react";
import { Modal as MuiModal } from "@mui/material";

interface ModalProps {
  showModal: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ showModal, onClose, children }: ModalProps) => {
  return (
    <MuiModal open={showModal} onClose={onClose}>
      <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "400px", minHeight: "500px", padding: "15px", background: "white", color: "black" }}>
          {children}
        </div>
      </div>
    </MuiModal>
  );
};

export default Modal;
