import React from "react";
import styles from "./EmptyTableBody.module.css";

interface EmptyTableProps {
  height?: string;
}

const EmptyTable: React.FC<EmptyTableProps> = ({ height = "600px" }) => (
  <div className={styles.emptyTableWrapper} style={{ height }}>
    <span className={styles.emptyTableText}>해당하는 데이터가 없습니다.</span>
  </div>
);

export default React.memo(EmptyTable);
