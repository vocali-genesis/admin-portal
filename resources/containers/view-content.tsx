import React from "react";
import styles from "./styles/view-content.module.css";

interface ViewContentProps {
  content: object | string[];
}

const parseText = (text: string) => text.replaceAll("\n", "<br/>");
const renderObject = (obj: object | string) => {
  if (!obj) {
    return "";
  }
  if (typeof obj === "string") {
    return parseText(obj);
  }
  return Object.entries(obj).map(([key, value]) => (
    <div key={key}>
      {key}: {renderObject(value as object | string)}
      <br />
    </div>
  ));
};

const ViewContent: React.FC<ViewContentProps> = ({ content }) => {
  if (content === null) {
    return null;
  }
  if (Array.isArray(content)) {
    return (
      <div className={styles.viewContent}>
        {content.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  }

  if (typeof content === "object") {
    return (
      <div className={styles.viewContent}>
        {Object.entries(content).map(([key, value], index) => (
          <React.Fragment key={index}>
            <h2>{key}</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: renderObject(value as string | object),
              }}
            ></p>
            
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.viewContent}>
      <p>{parseText(content)}</p>
    </div>
  );
};

export default ViewContent;
