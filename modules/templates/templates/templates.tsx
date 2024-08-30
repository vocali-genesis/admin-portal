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
  FaRegFolderOpen,
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

const messageHandler = MessageHandler.get();

const Templates = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const templateService = Service.require("templates");
  const [templates, setTemplates] = useState<GenesisTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
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
      created_at: new Date().toISOString(),
      fields: {},
    };
    const createdTemplate = await templateService.createTemplate(newTemplate);

    if (!createdTemplate) return;
    setTemplates([...templates, createdTemplate]);
    setEditingTemplate(createdTemplate);
    messageHandler.handleSuccess(t("templates.createSuccess"));
  };

  const handleEdit = (template: GenesisTemplate) => {
    setEditingTemplate(template);
  };

  const handleSave = async () => {
    if (!editingTemplate) return;

    const savedTemplate = await templateService.updateTemplate(
      editingTemplate.id,
      editingTemplate,
    );
    if (!savedTemplate) return;

    setTemplates(
      templates.map((t) => (t.id === savedTemplate.id ? savedTemplate : t)),
    );
    setEditingTemplate(null);
    messageHandler.handleSuccess(t("templates.editSuccess"));
  };

  const formatPreview = (
    fields: { [key: string]: GenesisTemplateField },
    maxLength: number = 25,
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
            <IconButton onClick={handleSave} size="small">
              <FaSave style={{ color: "#59DBBC" }} />
            </IconButton>
          ) : (
            <div style={{ display: "flex", gap: "3vh" }}>
              <IconButton onClick={() => handleEdit(template)} size="small">
                <FaEdit style={{ color: "var(--primary)" }} />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(template.id)}
                size="small"
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
        <h1 className={styles.title}>{t("templates.all_templates")}</h1>
        <Button
          onClick={handleAddTemplate}
          variant="primary"
          className={styles.addButton}
        >
          <FaPlus /> {t("templates.create")}
        </Button>
      </div>
      <Table data={templates} columns={columns} isLoading={isLoading} />
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalRecords={pagination.totalRecords}
        onPageChange={handlePageChange}
      />
      <DeleteConfirmation
        isOpen={templateToDelete ? true : isModalOpen}
        onRequestClose={() => setTemplateToDelete(null)}
        onConfirm={confirmDelete}
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
