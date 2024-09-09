import React from "react";
import styles from "./ToggleSwitchButton.module.css"; // CSS 모듈 임포트

const ToggleSwitchButton = ({
  label,
  toggleState,
  setToggleState,
  showLabel = true,
}: {
  label: string;
  toggleState: boolean;
  setToggleState: React.Dispatch<React.SetStateAction<boolean>>;
  showLabel?: boolean;
}) => {
  const handleToggle = () => setToggleState((prev) => !prev);

  return (
    <label className={styles.switch}>
      <input type="checkbox" checked={toggleState} onChange={handleToggle} className={styles.checkbox} />
      <span className={styles.slider}></span>
      {showLabel && <span className={styles.label}>{label}</span>}
    </label>
  );
};

export default ToggleSwitchButton;
