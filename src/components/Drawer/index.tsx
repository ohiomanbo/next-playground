import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./Drawer.module.css";

type DrawerDirection = "left" | "right" | "top" | "bottom";

interface DrawerProps {
  headerTitle: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  direction: DrawerDirection;
  marginTop?: string;
  width?: string;
  height?: string;
  hasCloseIcon?: boolean;
  allowOverlayDismiss?: boolean;
  containerRef?: React.RefObject<HTMLElement>;
  backgroundOverflowAllow?: boolean;
  overlayColor?: string;
  boxShadow?: string;
  transition?: string;
  contentPadding?: string;
  zIndex?: number;
}

const Drawer: React.FC<DrawerProps> = ({
  headerTitle,
  isOpen,
  onClose,
  children,
  direction = "right",
  marginTop,
  width = "300px",
  height = "300px",
  hasCloseIcon = true,
  allowOverlayDismiss = false,
  containerRef,
  overlayColor = "rgba(0, 0, 0, 0.5)",
  backgroundOverflowAllow = false,
  boxShadow = "-4px 0px 24px 0px rgba(23, 23, 25, 0.12)",
  transition = "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
  contentPadding = "16px 24px 40px",
  zIndex = 1000,
}) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(containerRef?.current || (typeof window !== "undefined" ? document.body : null));
  }, [containerRef]);

  useEffect(() => {
    if (backgroundOverflowAllow) {
      const targetContainer = container;
      if (!targetContainer) return;

      const originalOverflow = targetContainer.style.overflow;
      if (isOpen) {
        targetContainer.style.overflow = "hidden";
      }

      return () => {
        targetContainer.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, container, backgroundOverflowAllow]);

  const handleOverlayClick = () => allowOverlayDismiss && onClose();

  const renderDrawer = useCallback(() => {
    const baseDrawerClass = `${styles.drawerBase} ${isOpen ? styles.drawerOpen : ""}`;
    const directionClassMap = {
      left: styles.drawerLeft,
      right: styles.drawerRight,
      top: styles.drawerTop,
      bottom: styles.drawerBottom,
    };
    const visibleClassMap = {
      left: styles.drawerVisibleLeft,
      right: styles.drawerVisibleRight,
      top: styles.drawerVisibleTop,
      bottom: styles.drawerVisibleBottom,
    };

    const drawerClass = `${baseDrawerClass} ${directionClassMap[direction]} ${
      isOpen ? visibleClassMap[direction] : ""
    }`;

    return (
      <div
        className={drawerClass}
        style={{
          marginTop,
          width,
          height,
          boxShadow,
          transition,
          padding: contentPadding,
          zIndex,
        }}
      >
        <div className={styles.drawerHeaderWrapper}>
          <div style={{ fontWeight: "bold" }}>{headerTitle}</div>
          {hasCloseIcon && <div onClick={onClose}>Close</div>}
        </div>
        <div className={styles.drawerContent}>{children}</div>
      </div>
    );
  }, [
    boxShadow,
    children,
    contentPadding,
    direction,
    hasCloseIcon,
    headerTitle,
    height,
    isOpen,
    marginTop,
    onClose,
    transition,
    width,
    zIndex,
  ]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (typeof window === "undefined" || !container) return null;

  return createPortal(
    <>
      <div
        className={`${styles.drawerOverlay} ${isOpen ? styles.drawerOverlayOpen : ""}`}
        onClick={handleOverlayClick}
        style={{ backgroundColor: overlayColor, zIndex: zIndex - 1 }}
      />
      {renderDrawer()}
    </>,
    container
  );
};

export { Drawer, type DrawerProps };
