import React from "react";
import styles from "./styles/view-content.module.css";
import Markdown from "react-markdown";

interface ViewContentProps {
  content: string | string[];
  type?: 'markdown'
}

const ViewContent: React.FC<ViewContentProps> = ({ content, type }) => {

  if (type === 'markdown') {
    const markdownContent = Array.isArray(content) ? content.join("\n") : content;
    return (<Markdown>{markdownContent}</Markdown>)
  }

  const htmlContent = Array.isArray(content) ? content.join("<br>") : content;
  return (
    <div
      className={styles.viewContent}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default ViewContent;
