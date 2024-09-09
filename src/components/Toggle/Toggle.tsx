import React, { useState } from "react";
import styles from "./Toggle.module.css";

const Toggle = ({ title, children }: { title?: string; children?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleContent = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className={styles.toggleButton} onClick={toggleContent}>
        {`${title} ${isOpen ? "접기" : "열기"}`}
      </button>
      {isOpen && <div className={styles.toggleContent}>{children}</div>}
    </div>
  );
};

const NotionLikeToggle = ({
  data,
}: {
  data: {
    title: string;
    content: React.ReactNode;
  };
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleContent = () => setIsOpen(!isOpen);

  return (
    <div>
      <b
        onClick={toggleContent}
        style={{
          cursor: "pointer",
        }}
      >
        <span
          style={{
            display: "inline-block",
            cursor: "pointer",
            transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.3s ease",
          }}
        >
          {"▼"}
        </span>{" "}
        {data.title}
      </b>
      <br />
      {isOpen && <pre>{data.content}</pre>}
    </div>
  );
};

export { Toggle, NotionLikeToggle };
