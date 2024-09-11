import React, { useState } from "react";
import styles from "./styles/view-content.module.css";
import IconButton from "./icon-button";
import { FaCopy, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Editor from "../inputs/text-editor";
import MessageHandler from "@/core/message-handler";
import { useTranslation } from "react-i18next";

interface ViewContentProps {
  title: string;
  content: string;
  onEdit: (title: string, content: string) => void;
  hideIcons: boolean
}

const ViewContentEditable: React.FC<ViewContentProps> = ({
  title,
  content,
  onEdit,
  hideIcons
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState(content);
  const { t } = useTranslation();
  function renderViewButtons() {
    return (
      <>
        <IconButton
          onClick={() => {
            setEditingContent(content);
            setIsEditing(true);
          }}
          size="small"
          title={t("common.edit")}
          testId="editable.edit"
        >
          <FaEdit style={{ color: "var(--primary)" }} size={10} />
        </IconButton>
        <IconButton
          onClick={() => {
            void navigator.clipboard.writeText(content);
            MessageHandler.get().info(t("common.copy-success"));
          }}
          title={t("common.copy")}
          size="small"
          testId="editable.copy"
        >
          <FaCopy style={{ color: "var(--primary)" }} size={10} />
        </IconButton>
      </>
    );
  }
  function renderEditButtons() {
    return (
      <>
        <IconButton
          onClick={() => {
            onEdit(title, editingContent);
            setIsEditing(false);
          }}
          size="small"
          title={t("common.save")}
          testId="editable.save"
        >
          <FaSave style={{ color: "var(--primary)" }} size={10} />
        </IconButton>
        <IconButton
          onClick={() => {
            setIsEditing(false);
            setEditingContent(content);
          }}
          size="small"
          title={t("common.cancel")}
          testId="editable.cancel"
        >
          <FaTimes style={{ color: "var(--danger)" }} size={10} />
        </IconButton>
      </>
    );
  }
  return (
    <div className={styles.viewContent}>
      <div className="editable-wrapper">
        <div className="flex gap-4 items-center">
          <h2 className="mr-4">{title}</h2>
          {isEditing ? (
            renderEditButtons()
          ) : (
            !hideIcons && renderViewButtons() // Conditionally render buttons based on hideIcons
          )}
        </div>
        {!isEditing ? (
          <p
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          ></p>
        ) : (
          <Editor
            height="200px"
            content={editingContent}
            onContentChange={(content) => setEditingContent(content)}
          />
        )}
      </div>
    </div>
  );
};

export default ViewContentEditable;
