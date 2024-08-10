import React, { useState, useEffect } from "react";
import { GlobalCore } from "@/core/module/module.types";
import templateService, {
  Template,
} from "@/services/genesis/templates.service";
import styles from "./styles/templates.module.css";
import DeleteConfirmation from "@/resources/containers/delete-confirmation";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import MessageHandler from "@/core/message-handler";
import { useRouter } from "next/router";
import Table from "@/resources/table/table";

const messageHandler = MessageHandler.get();

const Templates = () => {
  const router = useRouter();
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
      const data = await templateService.getTemplates();
      if (data) setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setIsModalOpen(true);
    setTemplateToDelete(id);
  };

  const confirmDelete = async () => {
    if (templateToDelete) {
      const resp = await templateService.deleteTemplate(templateToDelete);
      if (resp) {
        setTemplates(
          templates.filter((template) => template.id !== templateToDelete),
        );
        messageHandler.handleSuccess("Template deleted");
      }
    }
    setIsModalOpen(false);
    setTemplateToDelete(null);
  };

  const handleAddTemplate = async () => {
    const newTemplate = {
      ownerId: "9196981c-e26d-4177-98d1-78492a32e292",
      name: "New Template",
      preview: "New template preview",
      fields: {},
    };
    const createdTemplate = await templateService.createTemplate(newTemplate);
    if (createdTemplate) {
      setTemplates([...templates, createdTemplate]);
      setEditingTemplate(createdTemplate);
      messageHandler.handleSuccess("Template added successfully");
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
  };

  const handleSave = async () => {
    if (editingTemplate) {
      const updatedTemplate = await templateService.updateTemplate(
        editingTemplate.id,
        editingTemplate,
      );
      if (updatedTemplate) {
        setTemplates(
          templates.map((t) =>
            t.id === updatedTemplate.id ? updatedTemplate : t,
          ),
        );
        setEditingTemplate(null);
        messageHandler.handleSuccess("Template updated successfully");
      }
    }
  };

  const handleInputChange = (field: keyof Template, value: string) => {
    if (editingTemplate) {
      setEditingTemplate({ ...editingTemplate, [field]: value });
    }
  };

  const columns = [
    {
      title: "Template Name",
      dataIndex: "name",
      render: (name: string, template: Template) =>
        editingTemplate && editingTemplate.id === template.id ? (
          <input
            type="text"
            value={editingTemplate.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={styles.input}
          />
        ) : (
          <span
            onClick={() =>
              router.push(`/app/template-detail?id=${template.id}`)
            }
            style={{ cursor: "pointer" }}
          >
            {name}
          </span>
        ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Preview",
      dataIndex: "preview",
      render: (preview: string, template: Template) =>
        editingTemplate && editingTemplate.id === template.id ? (
          <input
            type="text"
            value={editingTemplate.preview}
            onChange={(e) => handleInputChange("preview", e.target.value)}
            className={styles.input}
          />
        ) : (
          preview
        ),
    },
    {
      title: "Action",
      render: (_: any, template: Template) => (
        <>
          {editingTemplate && editingTemplate.id === template.id ? (
            <button onClick={handleSave} className={styles.actionButton}>
              <FaEdit style={{ color: "#59DBBC" }} />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleEdit(template)}
                className={styles.actionButton}
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
        <h1 className={styles.title}>All Templates</h1>
        <button className={styles.addButton} onClick={handleAddTemplate}>
          <FaPlus /> Add Template
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
