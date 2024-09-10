import React, { useState } from "react";
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
  FaEye,
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
import store, { RootState } from "@/core/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  setPagination,
  setTemplates,
} from "@/resources/utils/templates-store/actions";
import { useTemplates } from "@/core/components/use-templates";
const messageHandler = MessageHandler.get();

const Templates = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { pagination } = useSelector((state: RootState) => state.templates);
  const {
    templates,
    isLoading,
    createTemplate,
    deleteTemplate,
    updateTemplate,
  } = useTemplates(7);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState<GenesisTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] =
    useState<GenesisTemplate | null>(null);

  const handlePageChange = (page: number) => {
    dispatch(setPagination({ ...pagination, currentPage: page }));
  };

  const handleCancel = () => {
    if (newTemplate) {
      dispatch(setTemplates(templates.filter((t) => t.id !== newTemplate.id)));
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
            id="template-name"
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
                onClick={() => {
                  if (!editingTemplate) return;

                  updateTemplate(editingTemplate);

                  setEditingTemplate(null);
                  messageHandler.handleSuccess(t("templates.updateSuccess"));
                }}
                size="small"
                testId="templates.save-template"
                title={t("button.save")}
              >
                <FaSave style={{ color: "#59DBBC" }} />
              </IconButton>
              <IconButton
                onClick={handleCancel}
                size="small"
                testId="templates.cancel-edit"
                title={t("button.cancel")}
              >
                <FaTimes style={{ color: "var(--danger)" }} />
              </IconButton>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "3vh" }}>
              <IconButton
                onClick={() =>
                  void router.push(`/app/template-detail?id=${template.id}`)
                }
                size="small"
                testId="templates.view"
                title={t("button.view")}
              >
                <FaEye style={{ color: "var(--primary)" }} />
              </IconButton>
              <IconButton
                onClick={() => setTemplateToDelete(template.id)}
                size="small"
                testId="templates.delete"
                title={t("button.delete")}
              >
                <FaTrash style={{ color: "var(--danger)" }} />
              </IconButton>
            </div>
          )}
        </>
      ),
    },
  ];

  const createtemplate = async () => {
    const numberOfTemplates = templates.length;
    const template: any = {
      name: `Template ${numberOfTemplates + 1}`,
      preview: "",
      fields: [],
    };
    createTemplate(template);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title} data-testid="templates.title">
          {t("templates.all_templates")}
        </h1>
        <Button
          onClick={() =>
            createtemplate()
          }
          variant="primary"
          className={styles.addButton}
          testId="templates.new-template"
        >
          <FaPlus /> {t("templates.create")}
        </Button>
      </div>
      <Table
        data={templates.slice(
          (pagination.currentPage - 1) * 7,
          pagination.currentPage * 7,
        )}
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
        onSubmit={(
          template: Omit<GenesisTemplate, "id" | "owner_id" | "created_at">,
        ) => {
          setIsNewTemplateModalOpen(false);
          createTemplate(template);
          messageHandler.handleSuccess(t("templates.createSuccess"));
        }}
      />
      <DeleteConfirmation
        isOpen={templateToDelete ? true : isModalOpen}
        onRequestClose={() => setTemplateToDelete(null)}
        onConfirm={() => {
          if (!templateToDelete) return;

          deleteTemplate(templateToDelete);

          messageHandler.handleSuccess(t("templates.deleteSuccess"));
          setIsModalOpen(false);
          setTemplateToDelete(null);
        }}
        testId="templates.delete-confirmation"
      />
    </div>
  );
};

GlobalCore.manager.app("templates", () => {
  return (
    <Provider store={store}>
      <Templates />
    </Provider>
  );
});
GlobalCore.manager.menu({
  label: "templates.menu",
  icon: "/templates.svg",
  url: "templates",
  order: 0,
});
