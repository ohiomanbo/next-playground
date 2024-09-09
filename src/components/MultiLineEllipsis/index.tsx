import React from "react";
import styles from "./MultiLineEllipsis.module.css";

interface MultiLineEllipsisProps {
  content: React.ReactNode;
  maxLines?: number;
  noEllipsis?: boolean;
  showTitle?: boolean;
}

const MultiLineEllipsis: React.FC<MultiLineEllipsisProps> = ({
  content,
  maxLines = 1,
  noEllipsis = false,
  showTitle = false,
}) => {
  if (typeof content === "string") {
    const hasNewLine = content.includes("\n");

    // 동적 클래스를 설정하는 부분
    const classNames = [
      styles.styledText, // 기본 텍스트 스타일
      !noEllipsis && styles.ellipsis, // 말줄임표 처리 여부
      hasNewLine ? styles.preWrap : styles.nowrap, // 줄바꿈 여부
      !noEllipsis && hasNewLine && styles.multiline, // 여러 줄 처리
    ]
      .filter(Boolean) // undefined 또는 false 값 제거
      .join(" "); // 클래스를 결합

    // 동적으로 인라인 스타일을 생성하여 maxLines 적용
    const dynamicStyles = !noEllipsis && maxLines > 1 ? { WebkitLineClamp: maxLines } : {};

    return (
      <div
        className={classNames}
        style={dynamicStyles} // 인라인 스타일로 동적으로 줄 수 설정
        title={showTitle ? content : undefined}
      >
        {content}
      </div>
    );
  }

  return <>{content}</>;
};

export default MultiLineEllipsis;
