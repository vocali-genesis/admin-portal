import React, { useState, useEffect } from "react";
import { GlobalCore } from "@/core/module/module.types";
import { Template } from "@/services/templates/templates.service";
import styles from "./styles/templates.module.css";
import DeleteConfirmation from "@/resources/containers/delete-confirmation";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaSave,
  FaRegFolderOpen,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import MessageHandler from "@/core/message-handler";
import { useRouter } from "next/router";
import Table from "@/resources/table/table";
import { useService } from "@/core/module/service.factory";

const messageHandler = MessageHandler.get();

const Templates = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const templateService = useService("templates");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await templateService?.getTemplates();
      if (data) setTemplates(data);
    } catch (error) {
      messageHandler.handleError(t("templates.fetchError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setIsModalOpen(true);
    setTemplateToDelete(id);
  };

  const confirmDelete = async () => {
    if (!templateToDelete) return;

    const resp = await templateService?.deleteTemplate(templateToDelete);
    if (!resp) return;

    setTemplates(
      templates.filter((template) => template.id !== templateToDelete),
    );
    messageHandler.handleSuccess(t("templates.deleteSuccess"));
    setIsModalOpen(false);
    setTemplateToDelete(null);
  };

  const handleAddTemplate = async () => {
    const newTemplate = {
      name: "New Template",
      preview: "New template preview",
      createdAt: new Date().toISOString(),
      fields: {},
    };
    const createdTemplate = await templateService?.createTemplate(newTemplate);

    if (!createdTemplate) return;
    setTemplates([...templates, createdTemplate]);
    setEditingTemplate(createdTemplate);
    messageHandler.handleSuccess(t("templates.createSuccess"));
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
  };

  const handleSave = async () => {
    if (!editingTemplate) return;

    const updatedTemplate = { ...editingTemplate };

    // Ensure the date is in the correct format
    if (updatedTemplate.createdAt) {
      try {
        const date = new Date(updatedTemplate.createdAt);
        updatedTemplate.createdAt = date.toISOString();
      } catch (error) {
        messageHandler.handleError(t("templates.editError"));
        return;
      }
      updatedTemplate.createdAt = new Date(
        updatedTemplate.createdAt,
      ).toISOString();
    }

    const savedTemplate = await templateService?.updateTemplate(
      updatedTemplate.id,
      updatedTemplate,
    );
    if (!savedTemplate) return;

    setTemplates(
      templates.map((t) => (t.id === savedTemplate.id ? savedTemplate : t)),
    );
    setEditingTemplate(null);
    messageHandler.handleSuccess(t("templates.editSuccess"));
  };

  const handleInputChange = (field: keyof Template, value: string) => {
    if (!editingTemplate) return;

    setEditingTemplate({ ...editingTemplate, [field]: value });
  };

  const columns: ColumnConfig<Template>[] = [
    {
      title: t("templates.title"),
      dataIndex: "name",
      render: (template: Template) =>
        editingTemplate && editingTemplate.id === template.id ? (
          <input
            type="text"
            value={editingTemplate.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={styles.input}
          />
        ) : (
          <div
            onClick={() =>
              router.push(`/app/template-detail?id=${template.id}`)
            }
            className="flex items-center"
            style={{ gap: "1vh", cursor: "pointer" }}
          >
            <span>{template.name}</span>
            <FaRegFolderOpen size={17.5} />
          </div>
        ),
    },
    {
      title: t("templates.date"),
      dataIndex: "createdAt",
      render: (template: Template) =>
        editingTemplate && editingTemplate.id === template.id ? (
          <input
            type="date"
            value={
              new Date(editingTemplate.createdAt).toISOString().split("T")[0]
            }
            onChange={(e) => handleInputChange("createdAt", e.target.value)}
            className={styles.input}
          />
        ) : (
          <span>{new Date(template.createdAt).toLocaleDateString()}</span>
        ),
    },
    {
      title: t("templates.preview"),
      dataIndex: "preview",
      render: (template: Template) =>
        editingTemplate && editingTemplate.id === template.id ? (
          <input
            type="text"
            value={editingTemplate.preview}
            onChange={(e) => handleInputChange("preview", e.target.value)}
            className={styles.input}
          />
        ) : (
          <span>{template.preview}</span>
        ),
    },
    {
      title: t("templates.action"),
      dataIndex: "id",
      render: (template: Template) => (
        <>
          {editingTemplate && editingTemplate.id === template.id ? (
            <button onClick={handleSave} className={styles.actionButton}>
              <FaSave style={{ color: "#59DBBC" }} />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleEdit(template)}
                className={styles.actionButton}
                style={{ marginRight: "4vh" }}
              >
                <FaEdit style={{ color: "#59DBBC" }} />
              </button>
              <button
                onClick={() => handleDelete(template.id)}
                className={styles.actionButton}
              >
                <FaTrash style={{ color: "#e53e3e" }} />
              </button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("templates.all_templates")}</h1>
        <button className={styles.addButton} onClick={handleAddTemplate}>
          <FaPlus /> {t("templates.create")}
        </button>
      </div>
      <Table data={templates} columns={columns} isLoading={isLoading} />
      <DeleteConfirmation
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        isLeavingPage={false}
      />
    </div>
  );
};

GlobalCore.manager.app("templates", Templates);
