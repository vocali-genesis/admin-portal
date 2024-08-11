import React, { useState, useEffect } from "react";
import templateService, {
  Template,
} from "@/services/genesis/templates.service";
import styles from "./styles/templates.module.css";

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await templateService.deleteTemplate(id);
        fetchTemplates();
      } catch (error) {
        console.error("Error deleting template:", error);
      }
    }
  };

  const handleAddTemplate = () => {
    // Implement add template functionality
    console.log("Add new template");
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
                >
                  <i className="fas fa-trash"></i>
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
    </div>
  );
};

export default Templates;
