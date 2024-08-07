import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GlobalCore } from "@/core/module/module.types";
import templateService, {
  Template,
  TemplateField,
} from "@/services/genesis/templates.service";
import template_styles from "./styles/template-detail.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import MessageHandler from "@/core/message-handler";

const messageHandler = MessageHandler.get();

const TemplateDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log(template);

  useEffect(() => {
    if (id) {
      fetchTemplateDetails();
    }
  }, [id]);

  const fetchTemplateDetails = async () => {
    setIsLoading(true);
    try {
      const data = await templateService.getTemplate(Number(id));
      setTemplate(data);
    } catch (error) {
      console.error("Error fetching template details:", error);
      messageHandler.handleError("Failed to load template details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/app/templates/edit/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className={template_styles.container}>
      <div className={template_styles.header}>
        <h1 className={template_styles.title}>Template Detail</h1>
        <button className={template_styles.editButton} onClick={handleEdit}>
          Edit Template
        </button>
      </div>
      <table className={template_styles.table}>
        <thead className={template_styles.tableHeader}>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Explanation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className={template_styles.tableBody}>
          {Object.entries(template.fields).map(
            ([key, field]: [string, TemplateField]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{field.type}</td>
                <td>{field.description}</td>
                <td>
                  <button className={template_styles.actionButton}>
                    <FaEdit style={{ color: "#59DBBC" }} />
                  </button>
                  <button className={template_styles.actionButton}>
                    <FaTrash style={{ color: "#e53e3e" }} />
                  </button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};

GlobalCore.manager.app("template-detail", TemplateDetail);
