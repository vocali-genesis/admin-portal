import React from "react";
import styles from "./styles/view-content.module.css";

interface ViewContentProps {
  content: object | string[];
}

const renderObject = (obj: object) => {
  return Object.entries(obj).map(([key, val]) => (
    <div key={key}>
      {key}:{" "}
      {typeof val === "object" && val !== null
        ? renderObject(val)
        : String(val)}
      <br />
    </div>
  ));
};

const ViewContent: React.FC<ViewContentProps> = ({ content }) => {
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
            <p>
              {typeof value === "object" && value !== null
                ? renderObject(value)
                : String(value)}
            </p>
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.viewContent}>
      <p>{content}</p>
    </div>
  );
};

export default ViewContent;
