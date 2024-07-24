import React from "react";
import styles from "./styles/view-content.module.css";

interface ViewContentProps {
  content: string | string[];
}

const ViewContent: React.FC<ViewContentProps> = ({ content }) => {
  const htmlContent = Array.isArray(content) ? content.join("<br>") : content;

  return (
    <div
      className={styles.viewContent}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default ViewContent;
