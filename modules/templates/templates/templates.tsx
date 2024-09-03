import React, { useState, useEffect } from "react";
import { GlobalCore } from "@/core/module/module.types";
import {
  GenesisTemplate,
  GenesisTemplateField,
} from "@/core/module/core.types";
import styles from "./styles/templates.module.css";
import DeleteConfirmation from "@/resources/containers/delete-confirmation";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaSave,
  FaRegEye,
  FaTimes,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import MessageHandler from "@/core/message-handler";
import { useRouter } from "next/router";
import Table from "@/resources/table/table";
import Service from "@/core/module/service.factory";
import Pagination from "@/resources/table/pagination";
import BasicInput from "@/resources/inputs/basic-input";
import Button from "@/resources/containers/button";
import IconButton from "@/resources/containers/icon-button";
import NewTemplateModal from "@/modules/templates/templates/components/new-template-modal";

const messageHandler = MessageHandler.get();

const Templates = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const templateService = Service.require("templates");
  const [templates, setTemplates] = useState<GenesisTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState<GenesisTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] =
    useState<GenesisTemplate | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  }>({ currentPage: 1, totalPages: 1, totalRecords: 0 });

  useEffect(() => {
    void fetchTemplates(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchTemplates = async (page: number) => {
    setIsLoading(true);
    const response = await templateService.getTemplates(page, 7);
    if (!response) return;

    setTemplates(response.data);
    setPagination({
      ...pagination,
      totalPages: response.totalPages,
      totalRecords: response.totalCount,
    });

    setIsLoading(false);
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handleDelete = (id: string) => {
    setTemplateToDelete(id);
  };

  const confirmDelete = async () => {
    if (!templateToDelete) return;

    const resp = await templateService.deleteTemplate(templateToDelete);
    if (!resp) return;

    setTemplates(
      templates.filter((template) => template.id !== templateToDelete)
    );
    messageHandler.handleSuccess(t("templates.deleteSuccess"));

    setPagination({
      ...pagination,
      totalRecords: pagination.totalRecords - 1,
    });
    setIsModalOpen(false);
    setTemplateToDelete(null);
  };

  const handleAddTemplate = () => {
    setIsNewTemplateModalOpen(true);
  };

  const handleEdit = (template: GenesisTemplate) => {
    setEditingTemplate(template);
  };

  const handleSave = async () => {
    if (!editingTemplate) return;

    try {
      const savedTemplate = await templateService.updateTemplate(
        editingTemplate.id,
        editingTemplate
      );

      if (!savedTemplate) {
        messageHandler.handleError(t("templates.updateError"));
        return;
      }

      setTemplates(
        templates.map((t) => (t.id === savedTemplate.id ? savedTemplate : t))
      );
      setEditingTemplate(null);
      messageHandler.handleSuccess(t("templates.updateSuccess"));
    } catch (error) {
      console.error("Error updating template:", error);
      messageHandler.handleError(t("templates.updateError"));
    }
  };

  const handleNewTemplateSubmit = async (
    template: Omit<GenesisTemplate, "id" | "owner_id" | "created_at">
  ) => {
    setIsNewTemplateModalOpen(false);

    const createdTemplate = await templateService.createTemplate(template);
    if (!createdTemplate) return;

    setTemplates([...templates, createdTemplate]);
    setPagination({
      ...pagination,
      totalRecords: pagination.totalRecords + 1,
    });
    messageHandler.handleSuccess(t("templates.createSuccess"));
  };

  const handleCancel = () => {
    if (newTemplate) {
      setTemplates(templates.filter((t) => t.id !== newTemplate.id));
      setNewTemplate(null);
    }
    setEditingTemplate(null);
  };

  const formatPreview = (
    fields: { [key: string]: GenesisTemplateField },
    maxLength: number = 25
  ) => {
    const previewString = Object.entries(fields)
      .map(([key, value]) => `${key}: ${value.type}`)
      .join(", ");

    if (previewString.length > maxLength) {
      return `${previewString.substring(0, maxLength - 3)}...`;
    }

    return previewString;
  };

  const columns: ColumnConfig<GenesisTemplate>[] = [
    {
      title: t("templates.title"),
      dataIndex: "name",
      render: (template: GenesisTemplate) =>
        editingTemplate?.id === template.id ? (
          <BasicInput
            value={editingTemplate.name}
            onChange={(value) =>
              setEditingTemplate({
                ...editingTemplate,
                name: value.target.value,
              })
            }
            placeholder={t("templates.namePlaceholder")}
            testId="templates.name-edit-field"
          />
        ) : (
          <div
            className="flex items-center"
            style={{ gap: "1vh", cursor: "pointer" }}
            data-testId="templates.title-cell"
          >
            <span>{template.name}</span>
          </div>
        ),
    },
    {
      title: t("templates.date"),
      dataIndex: "created_at",
      render: (template: GenesisTemplate) => (
        <span>{new Date(template.created_at).toLocaleDateString()}</span>
      ),
    },
    {
      title: t("templates.preview"),
      dataIndex: "preview",
      render: (template: GenesisTemplate) => (
        <span>{formatPreview(template.fields)}</span>
      ),
    },
    {
      title: t("templates.action"),
      dataIndex: "id",
      render: (template: GenesisTemplate) => (
        <>
          {editingTemplate && editingTemplate.id === template.id ? (
            <div style={{ display: "flex", gap: "3vh" }}>
              <IconButton
                onClick={handleSave}
                size="small"
                testId="templates.save-template"
              >
                <FaSave style={{ color: "#59DBBC" }} />
              </IconButton>
              <IconButton
                onClick={handleCancel}
                size="small"
                testId="templates.cancel-edit"
              >
                <FaTimes style={{ color: "var(--danger)" }} />
              </IconButton>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "3vh" }}>
              <IconButton
                onClick={() =>
                  router.push(`/app/template-detail?id=${template.id}`)
                }
                size="small"
                testId="templates.view-template"
              >
                <FaRegEye style={{ color: "var(--primary)" }} />
              </IconButton>
              <IconButton
                onClick={() => handleEdit(template)}
                size="small"
                testId="templates.edit"
              >
                <FaEdit style={{ color: "var(--primary)" }} />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(template.id)}
                size="small"
                testId="templates.delete"
              >
                <FaTrash style={{ color: "var(--danger)" }} />
              </IconButton>
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title} data-testid="templates.title">
          {t("templates.all_templates")}
        </h1>
        <Button
          onClick={
            editingTemplate
              ? () => messageHandler.handleError(t("templates.finish-editing"))
              : handleAddTemplate
          }
          variant="primary"
          className={styles.addButton}
          testId="templates.new-template"
        >
          <FaPlus /> {t("templates.create")}
        </Button>
      </div>
      <Table
        data={templates}
        columns={columns}
        isLoading={isLoading}
        testId="templates.table"
      />
      <Pagination
        currentPage={pagination.totalPages === 0 ? 0 : pagination.currentPage}
        totalPages={pagination.totalPages}
        totalRecords={pagination.totalRecords}
        onPageChange={handlePageChange}
      />
      <NewTemplateModal
        isOpen={isNewTemplateModalOpen}
        onClose={() => setIsNewTemplateModalOpen(false)}
        onSubmit={handleNewTemplateSubmit}
      />
      <DeleteConfirmation
        isOpen={templateToDelete ? true : isModalOpen}
        onRequestClose={() => setTemplateToDelete(null)}
        onConfirm={confirmDelete}
        testId="templates.delete-confirmation"
      />
    </div>
  );
};

GlobalCore.manager.app("templates", Templates);
GlobalCore.manager.menu({
  label: "templates.menu",
  icon: "/templates.svg",
  url: "templates",
  order: 0,
});
