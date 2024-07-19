import React from "react";
import styles from "./styles/view-content.module.css";

interface ViewContentProps {
  content: string;
}

const ViewContent: React.FC<ViewContentProps> = ({ content }) => {
  return (
    <div
      className={styles.viewContent}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default ViewContent;
