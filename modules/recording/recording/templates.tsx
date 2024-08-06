import React, { useState, useEffect } from "react";
import { GlobalCore } from "@/core/module/module.types";
import templateService, {
  Template,
} from "@/services/genesis/templates.service";
import styles from "./styles/templates.module.css";
import DeleteConfirmation from "@/resources/containers/delete-confirmation";
import { FaTrash, FaRegPenToSquare } from "react-icons/fa6";
import MessageHandler from "@/core/message-handler";
import { useRouter } from "next/router";

const messageHandler = MessageHandler.get();

const Templates = () => {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [templateId, setTemplateId] = useState<number>();
  const [isLeavingPage, setIsLeavingPage] = useState<boolean>(false);

  useEffect(() => {
    fetchTemplates();

    const handleLeavePage = (event: BeforeUnloadEvent | PopStateEvent) => {
      if (event.type === "beforeunload") {
        event.preventDefault();
        event.returnValue = "";
      }
      setIsLeavingPage(true);
      setIsModalOpen(true);
    };

    window.addEventListener("beforeunload", handleLeavePage);
    window.addEventListener("popstate", handleLeavePage);

    router.beforePopState(() => {
      setIsLeavingPage(true);
      setIsModalOpen(true);
      return false;
    });

    return () => {
      window.removeEventListener("beforeunload", handleLeavePage);
      window.removeEventListener("popstate", handleLeavePage);
      router.beforePopState(() => true);
    };
  }, [router]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await templateService.getTemplates();
      setTemplates(data as Template[]);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setIsModalOpen(true);
    setTemplateId(id);
    setIsLeavingPage(false);
  };

  const confirmAction = async () => {
    setIsModalOpen(false);

    if (isLeavingPage) {
      router.back();
    } else {
      const resp = await templateService.deleteTemplate(templateId as number);
      if (resp) {
        setTemplates(
          templates.filter((template) => template.id !== templateId),
        );
        return messageHandler.handleSuccess("Template deleted");
      }
    }
  };

  const cancelAction = () => {
    setIsModalOpen(false);
    setIsLeavingPage(false);
  };

  const handleAddTemplate = async () => {
    // Implement add template functionality
    const data = await templateService.createTemplate({
      ownerId: "9196981c-e26d-4177-98d1-78492a32e292",
      name: "Template 1",
      preview: "First template",
      fields: {},
    });

    if (data) {
      setTemplates(templates.concat([data]));
      return messageHandler.handleSuccess("Template added successfully");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>All Template</h1>
        <button className={styles.addButton} onClick={handleAddTemplate}>
          Add Template
        </button>
      </div>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>Template Name</th>
            <th>Date</th>
            <th>Preview</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {templates.map((template) => (
            <tr key={template.id}>
              <td>{template.name}</td>
              <td>{new Date(template.createdAt).toLocaleDateString()}</td>
              <td>{template.preview}</td>
              <td>
                <button
                  className={styles.actionButton}
                  onClick={() => handleDelete(template.id)}
                  style={{ marginRight: "3vh" }}
                >
                  <FaRegPenToSquare style={{ color: "#59DBBC" }} />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleDelete(template.id)}
                >
                  <FaTrash style={{ color: "#e53e3e" }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button className={styles.paginationButton} disabled>
          &lt;
        </button>
        <button className={styles.paginationButton}>1</button>
        <button className={styles.paginationButton}>2</button>
        <button className={styles.paginationButton}>3</button>
        <button className={styles.paginationButton}>&gt;</button>
      </div>
      <DeleteConfirmation
        isOpen={isModalOpen}
        onRequestClose={cancelAction}
        onConfirm={confirmAction}
        isLeavingPage={isLeavingPage}
      />
    </div>
  );
};

GlobalCore.manager.app("templates", Templates);
