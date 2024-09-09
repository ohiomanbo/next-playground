import React from "react";
import styles from "./PageMoveButton.module.css";

interface PageMoveButtonProps {
  $direction: "left" | "right";
  $disabled?: boolean;
  onClick?: () => void;
}

const PageMoveButton: React.FC<PageMoveButtonProps> = ({ $direction, $disabled, onClick }) => (
  <div
    className={`${styles.pageMoveButton} ${styles[$direction]} ${$disabled ? styles.disabled : ""}`}
    onClick={onClick}
  >
    <span className={`${styles.chevron} ${$direction === "right" ? styles.rotate : ""}`}>{"<"}</span>
  </div>
);

export default PageMoveButton;
