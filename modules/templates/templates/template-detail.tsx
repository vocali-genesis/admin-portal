import { GlobalCore } from "@/core/module/module.types";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import {
  GenesisTemplate,
  GenesisTemplateField,
} from "@/core/module/core.types";
import { useTranslation } from "react-i18next";
import styles from "./styles/template-detail.module.css";
import {
  FaEdit,
  FaSave,
  FaTrash,
  FaArrowLeft,
  FaPlus,
  FaCog,
} from "react-icons/fa";
import MessageHandler from "@/core/message-handler";
import DeleteConfirmation from "@/resources/containers/delete-confirmation";
import Table from "@/resources/table/table";
import UnsavedChanges from "@/resources/containers/unsaved-changes-warning";
import FieldModal from "@/resources/containers/field-modal";
import Service from "@/core/module/service.factory";
import BasicInput from "@/resources/inputs/basic-input";
import { BasicSelect } from "@/resources/inputs/basic-select.input";
import { TYPE_OPTIONS } from "@/core/constants";
import Pagination from "@/resources/table/pagination";
import Button from "@/resources/containers/button";
import IconButton from "@/resources/containers/icon-button";

const messageHandler = MessageHandler.get();
type TableDataType = GenesisTemplateField & { key: string; name: string };

const TemplateDetail = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const templateService = Service.require("templates");
  const { id } = router.query;

  const [template, setTemplate] = useState<GenesisTemplate | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<
    Record<string, GenesisTemplateField & { name: string }>
  >({});
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [unsavedChangesModalOpen, setUnsavedChangesModalOpen] = useState(false);
  const [pendingEditField, setPendingEditField] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplate = useCallback(
    async (page: number) => {
      if (typeof id !== "string") return;
      setIsLoading(true);
      try {
        const fetchedTemplate = await templateService.getTemplate(+id, page, 5);
        if (fetchedTemplate) {
          setTemplate(fetchedTemplate.data[0]);
          setPagination({
            currentPage: page,
            totalPages: fetchedTemplate.totalPages,
            totalRecords: fetchedTemplate.totalCount,
          });
        }
      } catch (error) {
        messageHandler.handleError(t("templates.fetchError"));
      } finally {
        setIsLoading(false);
      }
    },
    [id, templateService, t],
  );

  useEffect(() => {
    if (!id) router.push("/app/templates");
    else fetchTemplate(pagination.currentPage);
  }, [id, pagination.currentPage, fetchTemplate, router]);

  const handlePageChange = (page: number) =>
    setPagination((prev) => ({ ...prev, currentPage: page }));

  const handleEdit = (fieldKey: string) => {
    if (editingField && editingField !== fieldKey) {
      setPendingEditField(fieldKey);
      setUnsavedChangesModalOpen(true);
    } else {
      setEditingField(fieldKey);
      const field = template?.fields[fieldKey];
      if (field)
        setEditedValues((prev) => ({
          ...prev,
          [fieldKey]: { name: fieldKey, ...field },
        }));
    }
  };

  const handleSave = async (fieldKey: string) => {
    if (!template) return;
    const { name, ...fieldData } = editedValues[fieldKey];
    const updatedFields = { ...template.fields };

    if (name !== fieldKey) {
      delete updatedFields[fieldKey];
      updatedFields[name] = fieldData;
    } else {
      updatedFields[fieldKey] = fieldData;
    }

    try {
      const updatedTemplate = await templateService.updateTemplate(
        template.id,
        { fields: updatedFields },
      );
      if (updatedTemplate) {
        setTemplate(updatedTemplate);
        setEditingField(null);
        setEditedValues({});
        messageHandler.handleSuccess(t("templates.editSuccess"));
      }
    } catch (error) {
      messageHandler.handleError(t("templates.editError"));
    }
  };

  const handleInputChange = (
    fieldKey: string,
    property: string,
    value: string,
  ) => {
    setEditedValues((prev) => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], [property]: value },
    }));
  };

  const handleAddField = () => {
    if (!template) return;
    const newFieldKey = `newField${Object.keys(template.fields).length + 1}`;
    const newField: GenesisTemplateField = {
      type: "text",
      description: "New field description",
    };
    setTemplate((prev) => ({
      ...prev!,
      fields: { ...prev!.fields, [newFieldKey]: newField },
    }));
    setEditingField(newFieldKey);
    setEditedValues((prev) => ({
      ...prev,
      [newFieldKey]: { name: newFieldKey, ...newField },
    }));
  };

  const confirmDelete = async () => {
    if (!template || !fieldToDelete) return;
    const updatedFields = { ...template.fields };
    delete updatedFields[fieldToDelete];
    try {
      const updatedTemplate = await templateService.updateTemplate(
        template.id,
        { fields: updatedFields },
      );
      if (updatedTemplate) {
        setTemplate(updatedTemplate);
        messageHandler.handleSuccess(t("templates.fieldDeleteSuccess"));
      }
    } catch (error) {
      messageHandler.handleError(t("templates.fieldDeleteError"));
    } finally {
      setFieldToDelete(null);
    }
  };

  const columns: ColumnConfig<TableDataType>[] = [
    {
      title: t("templates.field"),
      dataIndex: "name",
      render: (record: TableDataType) =>
        editingField === record.key ? (
          <BasicInput
            value={editedValues[record.key]?.name || record.name}
            onChange={(e) =>
              handleInputChange(record.key, "name", e.target.value)
            }
            placeholder={t("templates.fieldNamePlaceholder")}
          />
        ) : (
          <span>{record.name}</span>
        ),
    },
    {
      title: t("templates.type"),
      dataIndex: "type",
      render: (record: TableDataType) =>
        editingField === record.key ? (
          <BasicSelect
            name="fieldType"
            value={editedValues[record.key]?.type || record.type}
            onChange={(newValue) =>
              handleInputChange(record.key, "type", newValue)
            }
            options={Object.values(TYPE_OPTIONS).map((option) => ({
              value: option,
              label: t(`templates.type-${option}`),
            }))}
            disabled={false}
          />
        ) : (
          <span>{record.type}</span>
        ),
    },
    {
      title: t("templates.description"),
      dataIndex: "description",
      render: (record: TableDataType) =>
        editingField === record.key ? (
          <BasicInput
            value={editedValues[record.key]?.description || record.description}
            onChange={(e) =>
              handleInputChange(record.key, "description", e.target.value)
            }
            placeholder={t("templates.descriptionPlaceholder")}
          />
        ) : (
          <span>{record.description}</span>
        ),
    },
    {
      title: t("templates.action"),
      dataIndex: "key",
      render: (record: TableDataType) => (
        <>
          {editingField === record.key ? (
            <div style={{ display: "flex", gap: "3vh" }}>
              <IconButton onClick={() => handleSave(record.key)} size="small">
                <FaSave style={{ color: "var(--primary)" }} />
              </IconButton>
              {["number", "select", "multiselect"].includes(
                editedValues[record.key]?.type,
              ) && (
                <IconButton
                  onClick={() => setIsFieldModalOpen(true)}
                  size="small"
                >
                  <FaCog style={{ color: "var(--primary)" }} />
                </IconButton>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "3vh" }}>
              <IconButton onClick={() => handleEdit(record.key)} size="small">
                <FaEdit style={{ color: "var(--primary)" }} />
              </IconButton>
              <IconButton
                onClick={() => setFieldToDelete(record.key)}
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

  const tableData: TableDataType[] = template
    ? Object.entries(template.fields).map(([key, field]) => ({
        key,
        name: key,
        ...field,
      }))
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          onClick={() => router.push("/app/templates")}
          variant="secondary"
          className={styles.backButton}
        >
          <FaArrowLeft /> {t("templates.back")}
        </Button>
        <Button
          onClick={handleAddField}
          variant="primary"
          className={styles.addFieldButton}
        >
          <FaPlus /> {t("templates.addField")}
        </Button>
      </div>
      <h1 className={styles.title}>{template?.name}</h1>
      <p className={styles.preview}>{template?.preview}</p>

      <Table data={tableData} columns={columns} isLoading={isLoading} />
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalRecords={pagination.totalRecords}
        onPageChange={handlePageChange}
      />

      <DeleteConfirmation
        isOpen={!!fieldToDelete}
        onRequestClose={() => setFieldToDelete(null)}
        onConfirm={confirmDelete}
      />

      <UnsavedChanges
        isOpen={unsavedChangesModalOpen}
        onRequestClose={() => setUnsavedChangesModalOpen(false)}
        onConfirm={() => {
          setUnsavedChangesModalOpen(false);
          if (pendingEditField) {
            setEditingField(pendingEditField);
            const field = template?.fields[pendingEditField];
            if (field) {
              setEditedValues((prev) => ({
                ...prev,
                [pendingEditField]: { name: pendingEditField, ...field },
              }));
            }
            setPendingEditField(null);
          }
        }}
      />

      <FieldModal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        onSave={(data) => {
          if (editingField) {
            handleInputChange(editingField, "config", JSON.stringify(data));
          }
          setIsFieldModalOpen(false);
        }}
        fieldType={
          (editingField &&
            (editedValues[editingField]?.type as TYPE_OPTIONS)) ||
          TYPE_OPTIONS.TEXT
        }
      />
    </div>
  );
};

GlobalCore.manager.app("template-detail", TemplateDetail);
